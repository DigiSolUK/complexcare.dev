import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserId } from "@/lib/auth/auth-utils"
import { getRiskAssessments, createRiskAssessment } from "@/lib/services/compliance-service"
import { requirePermission } from "@/lib/auth/require-permission"
import { PERMISSIONS } from "@/lib/auth/permissions"

export async function GET(request: NextRequest) {
  try {
    // Get tenant ID from header
    const tenantId = request.headers.get("x-tenant-id")

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    // Get current user ID
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to view compliance risk assessments
    await requirePermission(PERMISSIONS.COMPLIANCE_VIEW, tenantId)

    // Get compliance risk assessments
    const riskAssessments = await getRiskAssessments(tenantId)

    return NextResponse.json(riskAssessments)
  } catch (error) {
    console.error("Error fetching compliance risk assessments:", error)
    return NextResponse.json({ error: "Failed to fetch compliance risk assessments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get tenant ID from header
    const tenantId = request.headers.get("x-tenant-id")

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    // Get current user ID
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to create compliance risk assessments
    await requirePermission(PERMISSIONS.COMPLIANCE_CREATE, tenantId)

    // Get request body
    const riskAssessmentData = await request.json()

    // Create compliance risk assessment
    const riskAssessment = await createRiskAssessment(tenantId, riskAssessmentData, userId)

    return NextResponse.json(riskAssessment, { status: 201 })
  } catch (error) {
    console.error("Error creating compliance risk assessment:", error)
    return NextResponse.json({ error: "Failed to create compliance risk assessment" }, { status: 500 })
  }
}

