import { db } from "@/lib/db"
import { checkMedicationInteractions } from "@/lib/ai/groq-client"

export interface DrugInteraction {
  drug1: string
  drug2: string
  severity: "mild" | "moderate" | "severe" | "contraindicated"
  description: string
  mechanism: string
  management: string
}

export interface MedicationInteractionCheck {
  id: string
  patient_id: string
  medications: string[]
  interactions: DrugInteraction[]
  checked_at: string
  checked_by: string
  ai_analysis?: string
}

export class MedicationInteractionService {
  /**
   * Check for interactions between medications
   */
  static async checkInteractions(medications: string[], patientId?: string, userId?: string) {
    try {
      // Get AI analysis of interactions
      const aiResult = await checkMedicationInteractions(medications)

      // Parse AI response to extract structured interactions
      const interactions = this.parseAIInteractions(aiResult.text)

      // If patient ID is provided, save the check to database
      if (patientId && userId) {
        const result = await db.query(
          `INSERT INTO medication_interaction_checks 
           (patient_id, medications, interactions, checked_by, ai_analysis)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
          [patientId, medications, JSON.stringify(interactions), userId, aiResult.text],
        )

        return {
          success: true,
          data: result.rows[0],
          interactions,
          aiAnalysis: aiResult.text,
        }
      }

      return {
        success: true,
        interactions,
        aiAnalysis: aiResult.text,
      }
    } catch (error) {
      console.error("Error checking medication interactions:", error)
      throw error
    }
  }

  /**
   * Get interaction history for a patient
   */
  static async getInteractionHistory(patientId: string) {
    try {
      const result = await db.query(
        `SELECT mic.*, u.first_name || ' ' || u.last_name as checked_by_name
         FROM medication_interaction_checks mic
         LEFT JOIN users u ON mic.checked_by = u.id
         WHERE mic.patient_id = $1
         ORDER BY mic.checked_at DESC`,
        [patientId],
      )

      return result.rows
    } catch (error) {
      console.error("Error fetching interaction history:", error)
      return []
    }
  }

  /**
   * Parse AI response to extract structured interactions
   */
  private static parseAIInteractions(aiText: string): DrugInteraction[] {
    // This is a simplified parser - in production, you'd want more robust parsing
    const interactions: DrugInteraction[] = []

    // Look for severity patterns in the text
    const severityPatterns = {
      contraindicated: /contraindicated|dangerous|life-threatening/i,
      severe: /severe|serious|major/i,
      moderate: /moderate|significant/i,
      mild: /mild|minor|low/i,
    }

    // Extract interactions based on patterns
    // This is a placeholder - real implementation would be more sophisticated
    const lines = aiText.split("\n")
    let currentInteraction: Partial<DrugInteraction> | null = null

    for (const line of lines) {
      // Check for drug pair mentions
      const drugPairMatch = line.match(/(\w+)\s+(?:and|with)\s+(\w+)/i)
      if (drugPairMatch) {
        if (currentInteraction) {
          interactions.push(currentInteraction as DrugInteraction)
        }

        currentInteraction = {
          drug1: drugPairMatch[1],
          drug2: drugPairMatch[2],
          severity: "moderate", // default
          description: line,
          mechanism: "",
          management: "",
        }

        // Determine severity
        for (const [severity, pattern] of Object.entries(severityPatterns)) {
          if (pattern.test(line)) {
            currentInteraction.severity = severity as any
            break
          }
        }
      }

      // Look for mechanism descriptions
      if (line.toLowerCase().includes("mechanism") && currentInteraction) {
        currentInteraction.mechanism = line
      }

      // Look for management recommendations
      if ((line.toLowerCase().includes("monitor") || line.toLowerCase().includes("avoid")) && currentInteraction) {
        currentInteraction.management = line
      }
    }

    if (currentInteraction) {
      interactions.push(currentInteraction as DrugInteraction)
    }

    return interactions
  }

  /**
   * Get common drug interactions database
   */
  static async getCommonInteractions() {
    try {
      const result = await db.query(
        `SELECT * FROM common_drug_interactions
         ORDER BY severity DESC, drug1 ASC`,
      )

      return result.rows
    } catch (error) {
      console.error("Error fetching common interactions:", error)
      return []
    }
  }
}
