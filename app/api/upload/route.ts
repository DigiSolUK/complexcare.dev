import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { v4 as uuidv4 } from "uuid"

export const runtime = "nodejs"

/**
 * Handles file uploads to Vercel Blob storage
 *
 * @param request The incoming request with file data
 * @returns Response with the URL of the uploaded file or error
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get form data with file
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are supported." },
        { status: 400 },
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 })
    }

    // Generate a unique filename with original extension
    const fileExtension = file.name.split(".").pop() || "jpg"
    const fileName = `${uuidv4()}.${fileExtension}`

    // Get folder path from form data or default to 'avatars'
    const folder = (formData.get("folder") as string) || "avatars"
    const path = `${folder}/${fileName}`

    // Upload to Vercel Blob
    const blob = await put(path, file, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: false,
    })

    // Log the upload for audit purposes
    console.log(`File uploaded: ${blob.url} by user ${session.user?.email}`)

    // Return the URL of the uploaded file
    return NextResponse.json({
      success: true,
      url: blob.url,
      path: path,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}

/**
 * Handles OPTIONS requests for CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  })
}
