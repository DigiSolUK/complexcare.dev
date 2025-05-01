import { type NextRequest, NextResponse } from "next/server"
import { getCredentials, createCredential } from "@/lib/services/credential-service"
import { getCurrentUser } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId") || undefined
    const status = searchParams.get("status") || undefined
    const type = searchParams.get("type") || undefined

    const credentials = await getCredentials(user.tenant_id, {
      userId: userId as string | undefined,
      status: status as string | undefined,
      type: type as string | undefined,
    })

    return NextResponse.json(credentials)
  } catch (error) {
    console.error("Error in GET /api/credentials:", error)
    return NextResponse.json({ error: "Failed to fetch credentials" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const credential = await createCredential(
      user.tenant_id,
      data.userId || user.id,
      data.credentialType,
      data.credentialNumber,
      data.issueDate,
      data.expiryDate,
      data.documentUrl,
    )

    return NextResponse.json(credential, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/credentials:", error)
    return NextResponse.json({ error: "Failed to create credential" }, { status: 500 })
  }
}
