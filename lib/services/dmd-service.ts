/**
 * Dictionary of Medicines and Devices (dm+d) Service
 *
 * This service provides functionality to search for medications in the NHS dm+d database.
 */

import { db } from "@/lib/db"

// Base URLs for the dm+d API
const BASE_URL = "https://dmd-browser.nhsbsa.nhs.uk"
const AMP_SEARCH_URL = `${BASE_URL}/search/results?searchType=AMP&showInvalidItems=false&hideParallelImport=false&hideSpecialOrder=false&hideDiscontinuedItems=true&sortOrder=alpha&size=100`
const VMP_SEARCH_URL = `${BASE_URL}/search/results?searchType=VMP&showInvalidItems=false&hideParallelImport=false&hideSpecialOrder=false&hideDiscontinuedItems=false&size=100`

export interface MedicationOption {
  value: string
  label: string
  type: "VMP" | "AMP"
  supplier?: string
}

export interface MedicationDetail {
  id: string
  name: string
  type: "VMP" | "AMP"
  supplier?: string
  form?: string
  strength?: string
  unit?: string
  ingredients?: string[]
  url?: string
  snomed?: string
  bnf?: string
  controlledDrugCategory?: string
  blackTriangle?: boolean
  sugarFree?: boolean
  glutenFree?: boolean
  preservativeFree?: boolean
  cautionaryAndAdvisoryLabels?: string[]
}

export class DmdService {
  /**
   * Get the API key for the dm+d service for a specific tenant
   */
  private static async getApiKey(tenantId: string): Promise<{ apiKey: string; apiSecret: string; apiUrl: string }> {
    try {
      const result = await db.query(
        `SELECT api_key, api_secret, api_url 
         FROM tenant_api_keys 
         WHERE tenant_id = $1 AND service_name = 'DM_AND_D' AND is_active = true`,
        [tenantId],
      )

      if (result.rows.length === 0) {
        return {
          apiKey: "demo-dmd-key",
          apiSecret: "demo-dmd-secret",
          apiUrl: BASE_URL,
        }
      }

      return {
        apiKey: result.rows[0].api_key,
        apiSecret: result.rows[0].api_secret,
        apiUrl: result.rows[0].api_url || BASE_URL,
      }
    } catch (error) {
      console.error("Error getting dm+d API key:", error)
      return {
        apiKey: "demo-dmd-key",
        apiSecret: "demo-dmd-secret",
        apiUrl: BASE_URL,
      }
    }
  }

  /**
   * Search for medications by name
   */
  static async searchMedications(searchTerm: string, tenantId: string): Promise<MedicationOption[]> {
    try {
      // In a real implementation, we would use the API key to authenticate
      // For demo purposes, we'll simulate the API response

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // For demo purposes, return mock data
      const mockResults: MedicationOption[] = []

      // Add VMP results (Virtual Medicinal Products - generic)
      if (searchTerm.toLowerCase().includes("para")) {
        mockResults.push(
          { value: "vmp123456", label: "Paracetamol 500mg tablets", type: "VMP" },
          { value: "vmp123457", label: "Paracetamol 250mg/5ml oral suspension", type: "VMP" },
          { value: "vmp123458", label: "Paracetamol 120mg/5ml oral suspension", type: "VMP" },
          { value: "vmp123459", label: "Paracetamol 500mg capsules", type: "VMP" },
        )
      }

      if (searchTerm.toLowerCase().includes("ibu")) {
        mockResults.push(
          { value: "vmp234561", label: "Ibuprofen 200mg tablets", type: "VMP" },
          { value: "vmp234562", label: "Ibuprofen 400mg tablets", type: "VMP" },
          { value: "vmp234563", label: "Ibuprofen 100mg/5ml oral suspension", type: "VMP" },
        )
      }

      if (searchTerm.toLowerCase().includes("amox")) {
        mockResults.push(
          { value: "vmp345671", label: "Amoxicillin 250mg capsules", type: "VMP" },
          { value: "vmp345672", label: "Amoxicillin 500mg capsules", type: "VMP" },
          { value: "vmp345673", label: "Amoxicillin 125mg/5ml oral suspension", type: "VMP" },
        )
      }

      // Add AMP results (Actual Medicinal Products - branded)
      if (searchTerm.toLowerCase().includes("para")) {
        mockResults.push(
          { value: "amp123456", label: "Panadol 500mg tablets (GSK)", type: "AMP", supplier: "GSK" },
          { value: "amp123457", label: "Calpol 250mg/5ml oral suspension (McNeil)", type: "AMP", supplier: "McNeil" },
          { value: "amp123458", label: "Panadol Extra 500mg tablets (GSK)", type: "AMP", supplier: "GSK" },
        )
      }

      if (searchTerm.toLowerCase().includes("ibu")) {
        mockResults.push(
          {
            value: "amp234561",
            label: "Nurofen 200mg tablets (Reckitt Benckiser)",
            type: "AMP",
            supplier: "Reckitt Benckiser",
          },
          {
            value: "amp234562",
            label: "Nurofen Plus 200mg tablets (Reckitt Benckiser)",
            type: "AMP",
            supplier: "Reckitt Benckiser",
          },
          {
            value: "amp234563",
            label: "Calprofen 100mg/5ml oral suspension (McNeil)",
            type: "AMP",
            supplier: "McNeil",
          },
        )
      }

      if (searchTerm.toLowerCase().includes("amox")) {
        mockResults.push(
          { value: "amp345671", label: "Amoxil 250mg capsules (GSK)", type: "AMP", supplier: "GSK" },
          { value: "amp345672", label: "Amoxil 500mg capsules (GSK)", type: "AMP", supplier: "GSK" },
        )
      }

      // If no specific matches, return some common medications
      if (mockResults.length === 0) {
        mockResults.push(
          { value: "vmp123456", label: "Paracetamol 500mg tablets", type: "VMP" },
          { value: "vmp234561", label: "Ibuprofen 200mg tablets", type: "VMP" },
          { value: "vmp345671", label: "Amoxicillin 250mg capsules", type: "VMP" },
          { value: "vmp456781", label: "Simvastatin 20mg tablets", type: "VMP" },
          { value: "vmp567891", label: "Omeprazole 20mg gastro-resistant capsules", type: "VMP" },
        )
      }

      return mockResults
    } catch (error) {
      console.error("Error searching medications:", error)
      return []
    }
  }

  /**
   * Get detailed information about a specific medication
   */
  static async getMedicationDetails(medicationId: string, tenantId: string): Promise<MedicationDetail | null> {
    try {
      // In a real implementation, we would fetch the details from the dm+d API
      // For demo purposes, we'll return mock data based on the medication ID

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 700))

      // Extract the type and ID from the medication ID
      const type = medicationId.startsWith("vmp") ? "VMP" : "AMP"
      const id = medicationId.substring(3)

      // Mock data for common medications
      if (medicationId === "vmp123456") {
        return {
          id: medicationId,
          name: "Paracetamol 500mg tablets",
          type: "VMP",
          form: "tablet",
          strength: "500",
          unit: "mg",
          ingredients: ["Paracetamol"],
          url: `${BASE_URL}/vmp/${id}`,
          snomed: "322236009",
          bnf: "0407010T0AAABAB",
          cautionaryAndAdvisoryLabels: ["Do not exceed the stated dose"],
        }
      }

      if (medicationId === "vmp234561") {
        return {
          id: medicationId,
          name: "Ibuprofen 200mg tablets",
          type: "VMP",
          form: "tablet",
          strength: "200",
          unit: "mg",
          ingredients: ["Ibuprofen"],
          url: `${BASE_URL}/vmp/${id}`,
          snomed: "322237004",
          bnf: "1001010I0AAABAB",
          cautionaryAndAdvisoryLabels: ["Take with or after food", "Not to be taken during pregnancy"],
        }
      }

      if (medicationId === "vmp345671") {
        return {
          id: medicationId,
          name: "Amoxicillin 250mg capsules",
          type: "VMP",
          form: "capsule",
          strength: "250",
          unit: "mg",
          ingredients: ["Amoxicillin"],
          url: `${BASE_URL}/vmp/${id}`,
          snomed: "323509004",
          bnf: "0501010K0AAABAB",
          cautionaryAndAdvisoryLabels: ["Complete the prescribed course", "Take at regular intervals"],
        }
      }

      if (medicationId === "amp123456") {
        return {
          id: medicationId,
          name: "Panadol 500mg tablets",
          type: "AMP",
          supplier: "GSK",
          form: "tablet",
          strength: "500",
          unit: "mg",
          ingredients: ["Paracetamol"],
          url: `${BASE_URL}/amp/${id}`,
          snomed: "322236009",
          bnf: "0407010T0AAABAB",
          cautionaryAndAdvisoryLabels: ["Do not exceed the stated dose"],
        }
      }

      // Default response for unknown medications
      return {
        id: medicationId,
        name: type === "VMP" ? "Generic Medication" : "Branded Medication",
        type: type as "VMP" | "AMP",
        supplier: type === "AMP" ? "Unknown Supplier" : undefined,
        form: "unknown",
        strength: "unknown",
        unit: "unknown",
        ingredients: ["Unknown"],
        url: `${BASE_URL}/${type.toLowerCase()}/${id}`,
      }
    } catch (error) {
      console.error("Error getting medication details:", error)
      return null
    }
  }
}
