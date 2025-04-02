import { type NextRequest, NextResponse } from "next/server"
import { getCredentials, createCredential } from "@/lib/services/credential-service"
import { getCurrentUser } from "@/lib/auth-utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = user.tenant_id
    const credentials = await getCredentials(tenantId, { userId: params.id })

    return NextResponse.json(credentials)
  } catch (error) {
    console.error(`Error in GET /api/care-professionals/${params.id}/credentials:`, error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = user.tenant_id
    const data = await request.json()

    const credential = await createCredential(
      tenantId,
      params.id,
      data.credentialType,
      data.credentialNumber,
      data.issueDate,
      data.expiryDate,
      data.documentUrl,
    )

    if (!credential) {
      return NextResponse.json({ error: "Failed to create credential" }, { status: 400 })
    }

    return NextResponse.json(credential, { status: 201 })
  } catch (error) {
    console.error(`Error in POST /api/care-professionals/${params.id}/credentials:`, error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

