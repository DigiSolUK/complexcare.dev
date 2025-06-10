import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    console.log("Starting database analysis...")

    // Get all tables in the database
    const tablesQuery = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `

    const tables = tablesQuery.map((row) => row.table_name)
    console.log("Found tables:", tables)

    // Analyze each table structure
    const tableAnalysis: any = {}

    for (const tableName of tables) {
      // Get column information
      const columnsQuery = await sql`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' 
        AND table_name = ${tableName}
        ORDER BY ordinal_position;
      `

      // Get row count
      const countQuery = await sql`
        SELECT COUNT(*) as count FROM ${sql.identifier([tableName])}
      `

      // Get sample data (first 5 rows)
      const sampleQuery = await sql`
        SELECT * FROM ${sql.identifier([tableName])} LIMIT 5
      `

      tableAnalysis[tableName] = {
        columns: columnsQuery,
        rowCount: countQuery[0]?.count || 0,
        sampleData: sampleQuery,
      }
    }

    // Check for specific features in the database
    const featureChecks = {
      hasWearableData: false,
      hasIntegrationSettings: false,
      hasAuditLogs: false,
      hasNotifications: false,
      hasDocumentManagement: false,
      hasFinancialData: false,
      hasRecruitmentData: false,
      hasContentManagement: false,
      hasComplianceData: false,
      hasPayrollData: false,
      hasTimesheets: false,
      hasClinicalNotes: false,
      hasCarePlans: false,
      hasMedications: false,
      hasAppointments: false,
      hasTasks: false,
      hasCredentials: false,
      hasApiKeys: false,
      hasInvoicing: false,
    }

    // Check for specific tables
    if (tables.includes("wearable_devices") || tables.includes("wearable_readings")) {
      featureChecks.hasWearableData = true
    }
    if (tables.includes("integration_settings")) {
      featureChecks.hasIntegrationSettings = true
    }
    if (tables.includes("audit_logs")) {
      featureChecks.hasAuditLogs = true
    }
    if (tables.includes("notifications")) {
      featureChecks.hasNotifications = true
    }
    if (tables.includes("documents")) {
      featureChecks.hasDocumentManagement = true
    }
    if (tables.includes("invoices") || tables.includes("payments")) {
      featureChecks.hasFinancialData = true
    }
    if (tables.includes("job_postings") || tables.includes("applications")) {
      featureChecks.hasRecruitmentData = true
    }
    if (tables.includes("blog_posts") || tables.includes("page_content")) {
      featureChecks.hasContentManagement = true
    }
    if (tables.includes("compliance_policies") || tables.includes("risk_assessments")) {
      featureChecks.hasComplianceData = true
    }
    if (tables.includes("payroll") || tables.includes("payroll_providers")) {
      featureChecks.hasPayrollData = true
    }
    if (tables.includes("timesheets")) {
      featureChecks.hasTimesheets = true
    }
    if (tables.includes("clinical_notes") || tables.includes("clinical_note_categories")) {
      featureChecks.hasClinicalNotes = true
    }
    if (tables.includes("care_plans")) {
      featureChecks.hasCarePlans = true
    }
    if (tables.includes("medications")) {
      featureChecks.hasMedications = true
    }
    if (tables.includes("appointments")) {
      featureChecks.hasAppointments = true
    }
    if (tables.includes("tasks") || tables.includes("todos")) {
      featureChecks.hasTasks = true
    }
    if (tables.includes("credentials")) {
      featureChecks.hasCredentials = true
    }
    if (tables.includes("api_keys")) {
      featureChecks.hasApiKeys = true
    }
    if (tables.includes("invoices")) {
      featureChecks.hasInvoicing = true
    }

    // Get patient table details if it exists
    let patientTableDetails = null
    if (tables.includes("patients")) {
      const patientColumns = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'patients' 
        ORDER BY ordinal_position
      `

      const patientCount = await sql`
        SELECT COUNT(*) as count FROM patients
      `

      const samplePatient = await sql`
        SELECT * FROM patients LIMIT 1
      `

      patientTableDetails = {
        columns: patientColumns,
        totalCount: patientCount[0]?.count || 0,
        sampleData: samplePatient[0] || null,
      }
    }

    return NextResponse.json({
      success: true,
      analysis: {
        totalTables: tables.length,
        tables: tables,
        tableDetails: tableAnalysis,
        features: featureChecks,
        patientTableDetails,
        recommendations: generateRecommendations(featureChecks, tables, tableAnalysis),
      },
    })
  } catch (error) {
    console.error("Database analysis error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

function generateRecommendations(features: any, tables: string[], tableAnalysis: any) {
  const recommendations = []

  // Check for missing core features
  if (!features.hasCarePlans) {
    recommendations.push({
      priority: "high",
      feature: "Care Plans",
      description: "Implement care plan management for patients",
      tables: ["care_plans", "care_plan_goals", "care_plan_interventions"],
    })
  }

  if (!features.hasMedications) {
    recommendations.push({
      priority: "high",
      feature: "Medication Management",
      description: "Add medication tracking and management",
      tables: ["medications", "medication_schedules", "medication_administrations"],
    })
  }

  if (!features.hasAppointments) {
    recommendations.push({
      priority: "high",
      feature: "Appointment System",
      description: "Implement appointment scheduling and tracking",
      tables: ["appointments", "appointment_types", "appointment_reminders"],
    })
  }

  if (!features.hasClinicalNotes) {
    recommendations.push({
      priority: "high",
      feature: "Clinical Notes",
      description: "Add clinical notes and documentation system",
      tables: ["clinical_notes", "clinical_note_categories", "clinical_note_templates"],
    })
  }

  if (!features.hasWearableData) {
    recommendations.push({
      priority: "medium",
      feature: "Wearable Integration",
      description: "Integrate wearable devices for patient monitoring",
      tables: ["wearable_devices", "wearable_readings", "wearable_alerts"],
    })
  }

  if (!features.hasNotifications) {
    recommendations.push({
      priority: "medium",
      feature: "Notification System",
      description: "Implement notification system for alerts and reminders",
      tables: ["notifications", "notification_preferences", "notification_templates"],
    })
  }

  if (!features.hasAuditLogs) {
    recommendations.push({
      priority: "medium",
      feature: "Audit Logging",
      description: "Add comprehensive audit logging for compliance",
      tables: ["audit_logs", "audit_events", "audit_categories"],
    })
  }

  // Check for data quality issues
  for (const [tableName, details] of Object.entries(tableAnalysis)) {
    if ((details as any).rowCount === 0) {
      recommendations.push({
        priority: "low",
        feature: `Populate ${tableName}`,
        description: `The ${tableName} table exists but has no data`,
        tables: [tableName],
      })
    }
  }

  return recommendations
}
