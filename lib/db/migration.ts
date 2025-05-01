import { neon } from "@neondatabase/serverless"

export async function seedTenantData(
  tenantId: string,
  tenantName: string,
  userId: string,
  subscriptionTier = "professional",
) {
  const sql = neon(process.env.DATABASE_URL!)

  try {
    // Create some initial data for the tenant

    // 1. Create sample patients (number based on tier)
    const patientCount = subscriptionTier === "basic" ? 2 : subscriptionTier === "professional" ? 5 : 10

    for (let i = 0; i < patientCount; i++) {
      await sql`
        INSERT INTO patients (
          tenant_id,
          first_name,
          last_name,
          date_of_birth,
          gender,
          email,
          phone,
          address,
          created_by
        ) VALUES (
          ${tenantId},
          ${`Sample${i + 1}`},
          ${`Patient${i + 1}`},
          ${new Date(1960 + i * 2, i % 12, (i % 28) + 1).toISOString().split("T")[0]},
          ${i % 2 === 0 ? "Male" : "Female"},
          ${`patient${i + 1}@example.com`},
          ${`07700${900000 + i}`},
          ${JSON.stringify({
            line1: `${123 + i} Sample Street`,
            city: "London",
            postcode: `SW1A ${i + 1}AA`,
            country: "United Kingdom",
          })},
          ${userId}
        )
      `
    }

    // 2. Create sample care professionals (number based on tier)
    const cpCount = subscriptionTier === "basic" ? 2 : subscriptionTier === "professional" ? 3 : 5
    const roles = ["Nurse", "Doctor", "Physiotherapist", "Occupational Therapist", "Care Assistant"]

    for (let i = 0; i < cpCount; i++) {
      await sql`
        INSERT INTO care_professionals (
          tenant_id,
          first_name,
          last_name,
          email,
          phone,
          role,
          status,
          created_by
        ) VALUES (
          ${tenantId},
          ${`Sample${i + 1}`},
          ${roles[i % roles.length]},
          ${`${roles[i % roles.length].toLowerCase()}${i + 1}@example.com`},
          ${`07700${910000 + i}`},
          ${roles[i % roles.length]},
          ${"active"},
          ${userId}
        )
      `
    }

    // 3. Create sample tasks
    const tasks = [
      {
        title: "Complete tenant setup",
        description: "Complete your tenant setup by adding real patients and care professionals",
        priority: "high",
        daysFromNow: 7,
      },
      {
        title: "Review subscription features",
        description: "Explore all features available in your subscription tier",
        priority: "medium",
        daysFromNow: 3,
      },
      {
        title: "Set up team members",
        description: "Invite your team members to join the platform",
        priority: "high",
        daysFromNow: 5,
      },
    ]

    for (const task of tasks) {
      await sql`
        INSERT INTO tasks (
          tenant_id,
          title,
          description,
          status,
          priority,
          due_date,
          assigned_to,
          created_by
        ) VALUES (
          ${tenantId},
          ${task.title},
          ${task.description},
          ${"pending"},
          ${task.priority},
          ${new Date(Date.now() + task.daysFromNow * 24 * 60 * 60 * 1000)},
          ${userId},
          ${userId}
        )
      `
    }

    // 4. Add tier-specific sample data
    if (subscriptionTier === "professional" || subscriptionTier === "enterprise") {
      // Add sample medications for professional and enterprise tiers
      await sql`
        INSERT INTO medications (
          tenant_id,
          patient_id,
          name,
          dosage,
          frequency,
          start_date,
          end_date,
          status,
          created_by
        ) SELECT 
          ${tenantId},
          id,
          'Sample Medication',
          '10mg',
          'Once daily',
          CURRENT_DATE,
          CURRENT_DATE + INTERVAL '30 days',
          'active',
          ${userId}
        FROM patients 
        WHERE tenant_id = ${tenantId}
        LIMIT 3
      `
    }

    if (subscriptionTier === "enterprise") {
      // Add sample documents for enterprise tier
      await sql`
        INSERT INTO documents (
          tenant_id,
          title,
          document_type,
          content,
          status,
          created_by
        ) VALUES (
          ${tenantId},
          'Welcome to Enterprise Tier',
          'guide',
          'This document provides an overview of all enterprise features available to you.',
          'published',
          ${userId}
        )
      `
    }

    console.log(`Successfully seeded data for tenant ${tenantName} (ID: ${tenantId}) with ${subscriptionTier} tier`)
    return true
  } catch (error) {
    console.error(`Error seeding data for tenant ${tenantName} (ID: ${tenantId}):`, error)
    throw error
  }
}
