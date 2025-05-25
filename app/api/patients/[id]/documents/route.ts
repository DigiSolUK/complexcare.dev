import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getTenantId } from "@/lib/tenant-utils"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = await getTenantId()
    const patientId = params.id

    // Get documents for the patient
    const documents = await sql`
      SELECT 
        id, 
        document_name, 
        document_type, 
        file_path, 
        file_size, 
        mime_type, 
        upload_date, 
        description, 
        is_confidential,
        created_at,
        updated_at
      FROM patient_documents
      WHERE patient_id = ${Number.parseInt(patientId)}
      AND tenant_id = ${tenantId}
      ORDER BY upload_date DESC
    `

    return NextResponse.json(documents)
  } catch (error) {
    console.error("Error fetching patient documents:", error)
    return NextResponse.json({ error: "Failed to fetch patient documents" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = await getTenantId()
    const patientId = params.id
    const data = await request.json()
    const userId = session.user.id

    // Validate required fields
    if (!data.document_name || !data.document_type || !data.file_path) {
      return NextResponse.json({ error: "Document name, type, and file path are required" }, { status: 400 })
    }

    // Insert new document record
    const result = await sql`
      INSERT INTO patient_documents (
        patient_id, 
        document_name, 
        document_type, 
        file_path, 
        file_size, 
        mime_type, 
        description, 
        is_confidential,
        tenant_id,
        created_by,
        updated_by
      ) VALUES (
        ${Number.parseInt(patientId)}, 
        ${data.document_name}, 
        ${data.document_type}, 
        ${data.file_path}, 
        ${data.file_size || null}, 
        ${data.mime_type || null}, 
        ${data.description || null}, 
        ${data.is_confidential || false},
        ${tenantId},
        ${userId},
        ${userId}
      )
      RETURNING id
    `

    return NextResponse.json(
      {
        id: result[0].id,
        message: "Document record created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating patient document:", error)
    return NextResponse.json({ error: "Failed to create patient document" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = await getTenantId()
    const patientId = params.id
    const url = new URL(request.url)
    const recordId = url.searchParams.get("recordId")

    if (!recordId) {
      return NextResponse.json({ error: "Document record ID is required" }, { status: 400 })
    }

    // Delete document record
    await sql`
      DELETE FROM patient_documents
      WHERE id = ${Number.parseInt(recordId)}
      AND patient_id = ${Number.parseInt(patientId)}
      AND tenant_id = ${tenantId}
    `

    return NextResponse.json({
      message: "Document record deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting patient document:", error)
    return NextResponse.json({ error: "Failed to delete patient document" }, { status: 500 })
  }
}
