import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getCurrentTenant } from "@/lib/tenant-utils"

const sql = neon(process.env.DATABASE_URL || "")

export async function GET() {
  try {
    const tenantId = getCurrentTenant()

    // Check if required tables exist
    const tablesExist = await checkRequiredTables()

    if (!tablesExist) {
      // Return demo data if tables don't exist
      return NextResponse.json({
        data: generateDemoData(),
        demo: true,
      })
    }

    // Fetch real data from database
    // This would be implemented based on your actual database schema
    // For now, we'll return demo data
    return NextResponse.json({
      data: generateDemoData(),
      demo: true,
    })
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard metrics" }, { status: 500 })
  }
}

async function checkRequiredTables() {
  try {
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'patients'
      ) as patients_exist,
      EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'appointments'
      ) as appointments_exist,
      EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'care_plans'
      ) as care_plans_exist;
    `

    return result[0].patients_exist && result[0].appointments_exist && result[0].care_plans_exist
  } catch (error) {
    console.error("Error checking required tables:", error)
    return false
  }
}

function generateDemoData() {
  // This would return the demo data structure for all dashboard metrics
  // For brevity, we're not including the full structure here
  return {
    // Demo data would go here
  }
}
