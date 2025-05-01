import { type NextRequest, NextResponse } from "next/server"
import { getApiKeys, createApiKey } from "@/lib/services/api-key-service"
import { getCurrentUser } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const apiKeys = await getApiKeys(user.tenant_id)

    // Mask the key values for security
    const maskedApiKeys = apiKeys.map((key) => ({
      ...key,
      key: `${key.key.substring(0, 10)}...${key.key.substring(key.key.length - 4)}`,
    }))

    return NextResponse.json(maskedApiKeys)
  } catch (error) {
    console.error("Error in GET /api/api-keys:", error)
    return NextResponse.json({ error: "Failed to fetch API keys" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Calculate expiry date if provided in days
    let expiresAt: Date | undefined = undefined
    if (data.expiryDays) {
      expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + Number.parseInt(data.expiryDays, 10))
    }

    const apiKey = await createApiKey(user.tenant_id, data.name, data.scopes || [], user.id, expiresAt)

    // Return the full key only on creation
    return NextResponse.json(apiKey, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/api-keys:", error)
    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 })
  }
}
