import { type NextRequest, NextResponse } from "next/server"
import { getCredential, updateCredential, deleteCredential, verifyCredential } from "@/lib/services/credential-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenantId")

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const { credential, error } = await getCredential(tenantId, id)
    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    if (!credential) {
      return NextResponse.json({ error: "Credential not found" }, { status: 404 })
    }

    return NextResponse.json({ credential })
  } catch (error) {
    console.error("Error in credential API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { tenantId, ...credentialData } = body

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const { credential, error } = await updateCredential(tenantId, id, credentialData)
    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ credential })
  } catch (error) {
    console.error("Error in credential API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get("tenantId")

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    const { success, error } = await deleteCredential(tenantId, id)
    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ success })
  } catch (error) {
    console.error("Error in credential API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { tenantId, verifierId, verificationDate, verificationStatus, verificationNotes } = body

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID is required" }, { status: 400 })
    }

    if (!verifierId || !verificationDate || !verificationStatus) {
      return NextResponse.json(
        {
          error: "Verifier ID, verification date, and verification status are required",
        },
        { status: 400 },
      )
    }

    const { credential, error } = await verifyCredential(
      tenantId,
      id,
      verifierId,
      verificationDate,
      verificationStatus,
      verificationNotes || "",
    )

    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ credential })
  } catch (error) {
    console.error("Error in credential API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

