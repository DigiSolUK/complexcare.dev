import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Check if the activity_logs table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'activity_logs'
      );
    `

    if (!tableExists[0].exists) {
      // Return demo data if table doesn't exist
      return NextResponse.json({
        data: generateDemoData(),
        demo: true,
      })
    }

    // Get the last 7 days of activity data
    const result = await sql`
      WITH dates AS (
        SELECT generate_series(
          current_date - interval '6 days',
          current_date,
          interval '1 day'
        )::date AS date
      ),
      activity_counts AS (
        SELECT 
          date_trunc('day', created_at)::date AS activity_date,
          COUNT(CASE WHEN activity_type = 'visit' THEN 1 END) AS visits,
          COUNT(CASE WHEN activity_type = 'clinical_note_created' THEN 1 END) AS notes,
          COUNT(CASE WHEN activity_type = 'medication' THEN 1 END) AS medications,
          COUNT(CASE WHEN activity_type = 'assessment' THEN 1 END) AS assessments
        FROM activity_logs
        WHERE created_at >= current_date - interval '6 days'
        GROUP BY activity_date
      )
      SELECT 
        dates.date::text,
        COALESCE(visits, 0) AS visits,
        COALESCE(notes, 0) AS notes,
        COALESCE(medications, 0) AS medications,
        COALESCE(assessments, 0) AS assessments
      FROM dates
      LEFT JOIN activity_counts ON dates.date = activity_counts.activity_date
      ORDER BY dates.date;
    `

    return NextResponse.json({
      data: result,
      demo: false,
    })
  } catch (error) {
    console.error("Error fetching patient activity data:", error)
    return NextResponse.json({
      data: generateDemoData(),
      demo: true,
      error: "Failed to fetch activity data",
    })
  }
}

function generateDemoData() {
  const days = 7
  const result = []

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - i - 1))

    result.push({
      date: date.toISOString().split("T")[0],
      visits: Math.floor(Math.random() * 8) + 1,
      notes: Math.floor(Math.random() * 6) + 2,
      medications: Math.floor(Math.random() * 5) + 1,
      assessments: Math.floor(Math.random() * 4) + 1,
    })
  }

  return result
}
