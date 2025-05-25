import { NextResponse } from "next/server"
import { getClinicalNoteCategories } from "@/lib/services/clinical-notes-service"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

export async function GET() {
  try {
    const categories = await getClinicalNoteCategories(DEFAULT_TENANT_ID)
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching clinical note categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
