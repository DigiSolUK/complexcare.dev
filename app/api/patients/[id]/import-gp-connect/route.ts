import { type NextRequest, NextResponse } from "next/server"
import { GPConnectService } from "@/lib/integrations/gp-connect"
import { MedicalHistoryService } from "@/lib/services/medical-history-service"
import { getCurrentUser } from "@/lib/auth-utils"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patientId = params.id
    const { nhsNumber } = await request.json()

    if (!nhsNumber) {
      return NextResponse.json({ error: "NHS number is required" }, { status: 400 })
    }

    // Get the current user and tenant ID
    let tenantId = "demo-tenant"
    let userId = "system"
    try {
      const user = await getCurrentUser()
      if (user) {
        tenantId = user.tenant_id
        userId = user.id
      }
    } catch (authError) {
      console.error("Authentication error:", authError)
      // Continue without user - we'll use demo tenant
    }

    // Initialize the GP Connect service
    const gpConnectService = new GPConnectService(tenantId)
    await gpConnectService.initialize()

    // Get all patient data from GP Connect
    const gpData = await gpConnectService.getAllPatientData(nhsNumber)

    // Import conditions as medical history entries
    const importedEntries = []

    if (gpData.conditions && gpData.conditions.length > 0) {
      for (const condition of gpData.conditions) {
        try {
          const entry = await MedicalHistoryService.createMedicalHistoryEntry(
            {
              category: "CONDITION",
              title: condition.name,
              description: condition.notes || `Imported from GP Connect: ${condition.name}`,
              onsetDate: new Date(condition.onsetDate.split("/").reverse().join("-")),
              status: condition.status === "Active" ? "ACTIVE" : "RESOLVED",
              notes: `Imported from GP Connect. SNOMED CT: ${condition.snomedCode || "Not available"}`,
            },
            patientId,
            tenantId,
            userId,
          )

          importedEntries.push(entry)
        } catch (error) {
          console.error(`Error importing condition ${condition.name}:`, error)
        }
      }
    }

    // Import allergies as medical history entries
    if (gpData.allergies && gpData.allergies.length > 0) {
      for (const allergy of gpData.allergies) {
        try {
          const entry = await MedicalHistoryService.createMedicalHistoryEntry(
            {
              category: "CONDITION",
              title: `Allergy: ${allergy.substance}`,
              description: allergy.reaction ? `Reaction: ${allergy.reaction}` : `Allergy to ${allergy.substance}`,
              onsetDate: new Date(allergy.recordedDate.split("/").reverse().join("-")),
              status: allergy.status === "Active" ? "ACTIVE" : "RESOLVED",
              severity:
                allergy.severity === "Severe" ? "SEVERE" : allergy.severity === "Moderate" ? "MODERATE" : "MILD",
              notes: `Imported from GP Connect. Recorded by: ${allergy.recordedBy}`,
            },
            patientId,
            tenantId,
            userId,
          )

          importedEntries.push(entry)
        } catch (error) {
          console.error(`Error importing allergy ${allergy.substance}:`, error)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${importedEntries.length} entries from GP Connect`,
      importedEntries,
    })
  } catch (error) {
    console.error("Error importing GP Connect data:", error)
    return NextResponse.json({ error: "Failed to import GP Connect data" }, { status: 500 })
  }
}
