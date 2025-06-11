"use server"

import { neon } from "@neondatabase/serverless"
import { hash } from "bcryptjs"
import { seedTenantData } from "@/lib/db/migration"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth-utils"
import { AppError } from "@/lib/error-handler"
import { createTenantInvitation, getTenantInvitationByToken, updateTenantInvitationAcceptedAt } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import { TenantService } from "@/lib/services/tenant-service"
import { UserService } from "@/lib/services/user-service"
import type { UserRole } from "@/types"

type CreateTenantParams = {
  name: string
  adminEmail: string
  adminName: string
  adminPassword: string
  domain?: string
  subscriptionTier: "basic" | "professional" | "enterprise"
  userCount: number
  billingCycle: "monthly" | "annually"
}

export async function createTenant(params: CreateTenantParams) {
  const { name, adminEmail, adminName, adminPassword, domain, subscriptionTier, userCount, billingCycle } = params

  // Create a database connection
  const sql = neon(process.env.DATABASE_URL!)

  try {
    // Start a transaction
    await sql.query("BEGIN")

    // Generate a slug from the tenant name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Check if tenant with this name or slug already exists
    const existingTenant = await sql`
      SELECT id FROM tenants 
      WHERE name = ${name} OR slug = ${slug}
      AND deleted_at IS NULL
    `

    if (existingTenant.length > 0) {
      await sql.query("ROLLBACK")
      return { error: "A tenant with this name already exists." }
    }

    // Check if admin email already exists in Neon Auth
    const existingUser = await sql`
      SELECT id FROM neon_auth.users_sync 
      WHERE email = ${adminEmail}
    `

    if (existingUser.length > 0) {
      await sql.query("ROLLBACK")
      return { error: "A user with this email already exists." }
    }

    // Define settings based on subscription tier
    const tierSettings = getTierSettings(subscriptionTier, userCount, billingCycle)

    // Create the tenant
    const [tenant] = await sql`
      INSERT INTO tenants (
        name, 
        slug, 
        domain, 
        status, 
        subscription_tier, 
        settings, 
        branding
      ) VALUES (
        ${name}, 
        ${slug}, 
        ${domain || null}, 
        'active', 
        ${subscriptionTier}, 
        ${JSON.stringify(tierSettings)}, 
        '{}'
      ) RETURNING id, name, slug
    `

    // Hash the password
    const hashedPassword = await hash(adminPassword, 10)

    // Create the admin user in Neon Auth
    const [user] = await sql`
      INSERT INTO neon_auth.users_sync (
        email,
        name,
        password,
        email_verified
      ) VALUES (
        ${adminEmail},
        ${adminName},
        ${hashedPassword},
        true
      ) RETURNING id, email, name
    `

    // Add the user to the tenant with admin role
    await sql`
      INSERT INTO tenant_users (
        tenant_id,
        user_id,
        role,
        is_primary
      ) VALUES (
        ${tenant.id},
        ${user.id},
        'admin',
        true
      )
    `

    // Add admin role to the user in Neon Auth
    await sql`
      INSERT INTO neon_auth.user_roles (
        user_id,
        role
      ) VALUES (
        ${user.id},
        'tenant_admin'
      )
    `

    // Create tenant features based on subscription tier
    await createTenantFeatures(sql, tenant.id, subscriptionTier)

    // Create subscription record
    await createSubscriptionRecord(sql, tenant.id, subscriptionTier, userCount, billingCycle)

    // Seed initial data for the tenant
    await seedTenantData(tenant.id, tenant.name, user.id, subscriptionTier)

    // Commit the transaction
    await sql.query("COMMIT")

    return {
      success: true,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        subscriptionTier,
      },
      admin: {
        id: user.id,
        email: user.email,
      },
      subscription: {
        tier: subscriptionTier,
        userCount,
        billingCycle,
      },
    }
  } catch (error) {
    // Rollback the transaction in case of error
    await sql.query("ROLLBACK")
    console.error("Error creating tenant:", error)
    return { error: "Failed to create tenant. Please try again." }
  }
}

export async function createTenantInvitationAction(tenantId: string, email: string, role: UserRole) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || !currentUser.tenantId) {
      throw new AppError("Unauthorized", 401)
    }

    // Basic validation
    if (!tenantId || !email || !role) {
      throw new AppError("Email and role are required for invitation.", 400)
    }

    // Check if the current user has permission to invite users in this tenant
    // For superadmin, they can invite to any tenant. For tenant admin, only their own.
    if (currentUser.role !== "superadmin" && currentUser.tenantId !== tenantId) {
      throw new AppError("Forbidden: Not authorized to invite users to this tenant.", 403)
    }

    // Check if user already exists in this tenant
    const userService = await UserService.create()
    const existingUser = await userService.getUserByEmail(email)
    if (existingUser) {
      const tenantService = await TenantService.create()
      const isMember = await tenantService.isUserMemberOfTenant(existingUser.id, tenantId)
      if (isMember) {
        throw new AppError("User is already a member of this tenant.", 409)
      }
    }

    // Generate a unique token
    const token = uuidv4()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now

    const invitation = await createTenantInvitation({
      tenant_id: tenantId,
      email,
      role,
      token,
      expires_at: expiresAt,
    })

    // In a real application, you would send an email here.
    // For this demo, we'll log the invitation URL.
    const invitationUrl = `${process.env.NEXTAUTH_URL}/accept-invite?token=${token}`
    console.log(`Invitation created for ${email}: ${invitationUrl}`)

    revalidatePath(`/superadmin/tenants/${tenantId}/users`)
    return { success: true, data: invitation, invitationUrl }
  } catch (error) {
    const appError = AppError.fromError(error)
    return { success: false, error: appError.message }
  }
}

export async function acceptTenantInvitationAction(token: string) {
  try {
    if (!token) {
      throw new AppError("Invitation token is missing", 400)
    }

    const invitation = await getTenantInvitationByToken(token)

    if (!invitation) {
      throw new AppError("Invalid or expired invitation token", 404)
    }

    if (invitation.accepted_at) {
      throw new AppError("This invitation has already been accepted", 409)
    }

    if (new Date() > invitation.expires_at) {
      throw new AppError("Invitation has expired", 403)
    }

    const currentUser = await getCurrentUser()
    if (!currentUser) {
      throw new AppError("User not authenticated. Please log in to accept the invitation.", 401)
    }

    // Ensure the current user's email matches the invitation email
    if (currentUser.email !== invitation.email) {
      throw new AppError("This invitation is not for your account. Please log in with the correct email.", 403)
    }

    // Add the current user to the tenant with the specified role
    const tenantService = await TenantService.create()
    await tenantService.addTenantMembership(currentUser.id, invitation.tenant_id, invitation.role)

    // Mark the invitation as accepted
    const updatedInvitation = await updateTenantInvitationAcceptedAt(invitation.id, new Date())

    revalidatePath(`/dashboard`) // Revalidate dashboard to reflect new tenant membership
    revalidatePath(`/superadmin/tenants/${invitation.tenant_id}/users`) // Revalidate superadmin view
    return { success: true, data: updatedInvitation, message: "Invitation accepted successfully!" }
  } catch (error) {
    const appError = AppError.fromError(error)
    return { success: false, error: appError.message }
  }
}

function getTierSettings(tier: string, userCount: number, billingCycle: string) {
  const baseSettings = {
    theme: "system",
    dateFormat: "dd/MM/yyyy",
    timeFormat: "24h",
    timezone: "Europe/London",
    language: "en-GB",
    currency: "GBP",
    userCount,
    billingCycle,
  }

  switch (tier) {
    case "basic":
      return {
        ...baseSettings,
        maxPatients: 25,
        maxCareProfessionals: 5,
        maxDocumentStorage: 5, // GB
        enabledFeatures: ["appointments", "documents", "basic_care_plans"],
      }
    case "professional":
      return {
        ...baseSettings,
        maxPatients: 100,
        maxCareProfessionals: 25,
        maxDocumentStorage: 20, // GB
        enabledFeatures: [
          "appointments",
          "documents",
          "advanced_care_plans",
          "medications",
          "tasks",
          "basic_reporting",
        ],
      }
    case "enterprise":
      return {
        ...baseSettings,
        maxPatients: -1, // unlimited
        maxCareProfessionals: -1, // unlimited
        maxDocumentStorage: 100, // GB
        enabledFeatures: [
          "appointments",
          "documents",
          "advanced_care_plans",
          "medications",
          "tasks",
          "advanced_reporting",
          "ai_insights",
          "custom_integrations",
          "api_access",
        ],
      }
    default:
      return baseSettings
  }
}

async function createTenantFeatures(sql: any, tenantId: string, tier: string) {
  const features = []

  // Basic features for all tiers
  features.push(
    { key: "appointments", enabled: true },
    { key: "documents", enabled: true },
    { key: "patients", enabled: true },
  )

  // Professional and Enterprise features
  if (tier === "professional" || tier === "enterprise") {
    features.push(
      { key: "medications", enabled: true },
      { key: "tasks", enabled: true },
      { key: "reporting", enabled: true },
    )
  }

  // Enterprise-only features
  if (tier === "enterprise") {
    features.push(
      { key: "ai_insights", enabled: true },
      { key: "api_access", enabled: true },
      { key: "custom_integrations", enabled: true },
      { key: "advanced_analytics", enabled: true },
    )
  }

  // Insert all features
  for (const feature of features) {
    await sql`
      INSERT INTO tenant_features (
        tenant_id,
        feature_key,
        is_enabled,
        config
      ) VALUES (
        ${tenantId},
        ${feature.key},
        ${feature.enabled},
        '{}'
      )
    `
  }
}

async function createSubscriptionRecord(
  sql: any,
  tenantId: string,
  tier: string,
  userCount: number,
  billingCycle: string,
) {
  // Calculate pricing based on tier and billing cycle
  const pricing = {
    basic: { monthly: 15, annually: 12 },
    professional: { monthly: 25, annually: 20 },
    enterprise: { monthly: 40, annually: 32 },
  }

  const pricePerUser = pricing[tier][billingCycle]
  const totalPrice = pricePerUser * userCount * (billingCycle === "annually" ? 12 : 1)

  // Set billing dates
  const startDate = new Date()
  const endDate = new Date()
  if (billingCycle === "annually") {
    endDate.setFullYear(endDate.getFullYear() + 1)
  } else {
    endDate.setMonth(endDate.getMonth() + 1)
  }

  // Create subscription record
  await sql`
    INSERT INTO subscriptions (
      tenant_id,
      tier,
      user_count,
      billing_cycle,
      price_per_user,
      total_price,
      start_date,
      end_date,
      status,
      payment_status
    ) VALUES (
      ${tenantId},
      ${tier},
      ${userCount},
      ${billingCycle},
      ${pricePerUser},
      ${totalPrice},
      ${startDate},
      ${endDate},
      'active',
      'pending'
    )
  `
}
