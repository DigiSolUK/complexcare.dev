"use server"

import { neon } from "@neondatabase/serverless"
import { hash } from "bcryptjs"
import { seedTenantData } from "@/lib/db/migration"

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
