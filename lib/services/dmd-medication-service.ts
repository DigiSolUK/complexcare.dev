import { sql } from "@/lib/db"

export interface DMDMedicationOption {
  value: string
  label: string
  type: "VMP" | "AMP"
  supplier?: string
  code?: string
  snomedCode?: string
}

export interface DMDMedicationDetails {
  code: string
  name: string
  type: string
  supplier?: string
  form?: string
  strength?: string
  unitDose?: string
  snomedCode?: string
  bnfCode?: string
  url?: string
}

export class DMDMedicationService {
  private static readonly BASE_URL = "https://dmd-browser.nhsbsa.nhs.uk"
  private static readonly AMP_SEARCH_URL =
    `${DMDMedicationService.BASE_URL}/search/results?searchType=AMP&showInvalidItems=false&hideParallelImport=false&hideSpecialOrder=false&hideDiscontinuedItems=true&sortOrder=alpha&size=100`
  private static readonly VMP_SEARCH_URL =
    `${DMDMedicationService.BASE_URL}/search/results?searchType=VMP&showInvalidItems=false&hideParallelImport=false&hideSpecialOrder=false&hideDiscontinuedItems=false&size=100`

  /**
   * Search for medications in dm+d
   */
  static async searchMedications(searchTerm: string): Promise<DMDMedicationOption[]> {
    try {
      // Check cache first
      const cached = await this.searchCache(searchTerm)
      if (cached.length > 0) {
        return cached
      }

      // Search both VMP and AMP
      const [vmpResults, ampResults] = await Promise.all([
        this.fetchMedicationData(this.VMP_SEARCH_URL, searchTerm, true),
        this.fetchMedicationData(this.AMP_SEARCH_URL, searchTerm, false),
      ])

      // Combine results, prioritizing VMP
      const results = [...vmpResults, ...ampResults]

      // Cache results
      await this.cacheResults(results)

      return results
    } catch (error) {
      console.error("Error searching medications:", error)
      throw new Error("Failed to search medications")
    }
  }

  /**
   * Fetch medication data from dm+d API
   */
  private static async fetchMedicationData(
    searchUrl: string,
    searchTerm: string,
    isVmp: boolean,
  ): Promise<DMDMedicationOption[]> {
    const medications: DMDMedicationOption[] = []
    const endpointUrl = `${searchUrl}&ampName=${encodeURIComponent(searchTerm)}`

    try {
      const response = await fetch(endpointUrl, {
        method: "GET",
        headers: {
          Accept: "text/html",
          "User-Agent": "ComplexCareCRM/1.0",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const html = await response.text()

      // Parse HTML response
      const namePrefix = isVmp ? "vmp-name" : "amp-name"
      const supplierPrefix = isVmp ? "vmp-supplier" : "amp-supplier"

      // Extract medication names
      const nameRegex = new RegExp(`id="${namePrefix}-(\\d+)"[^>]*>([^<]*)`, "g")
      const supplierRegex = new RegExp(`id="${supplierPrefix}-(\\d+)"[^>]*>([^<]*)`, "g")

      const names: Map<string, string> = new Map()
      const suppliers: Map<string, string> = new Map()

      let match
      while ((match = nameRegex.exec(html)) !== null) {
        const id = match[1]
        const name = this.decodeHtmlEntities(match[2])
        names.set(id, name)
      }

      while ((match = supplierRegex.exec(html)) !== null) {
        const id = match[1]
        const supplier = this.decodeHtmlEntities(match[2])
        suppliers.set(id, supplier)
      }

      // Combine names and suppliers
      for (const [id, name] of names.entries()) {
        const supplier = suppliers.get(id)
        const code = isVmp ? `vmp${id}` : `amp-${id}`

        const label = isVmp ? name : supplier ? `${name} (${supplier})` : name

        medications.push({
          value: code,
          label,
          type: isVmp ? "VMP" : "AMP",
          supplier,
          code,
        })
      }

      return medications
    } catch (error) {
      console.error(`Error fetching ${isVmp ? "VMP" : "AMP"} data:`, error)
      return []
    }
  }

  /**
   * Get medication details including URL
   */
  static async getMedicationDetails(code: string, searchTerm: string): Promise<DMDMedicationDetails | null> {
    try {
      // Check if it's cached
      const cached = await sql`
        SELECT * FROM dmd_medication_cache WHERE code = ${code}
      `

      if (cached.length > 0) {
        const row = cached[0]
        return {
          code: row.code,
          name: row.name,
          type: row.code_type,
          supplier: row.supplier,
          form: row.form,
          strength: row.strength,
          unitDose: row.unit_dose,
          snomedCode: row.snomed_code,
          bnfCode: row.bnf_code,
          url: `${this.BASE_URL}/product/${row.code}`,
        }
      }

      // Fetch from dm+d
      const isVmp = code.startsWith("vmp")
      const searchUrl = isVmp ? this.VMP_SEARCH_URL : this.AMP_SEARCH_URL
      const endpointUrl = `${searchUrl}&ampName=${encodeURIComponent(searchTerm)}`

      const response = await fetch(endpointUrl)
      const html = await response.text()

      // Find the URL for this medication
      const urlRegex = new RegExp(`id="${code}"[^>]*href="([^"]*)"`)
      const urlMatch = urlRegex.exec(html)

      if (urlMatch) {
        const url = `${this.BASE_URL}${urlMatch[1]}`

        // Fetch detailed information from the product page
        const detailsResponse = await fetch(url)
        const detailsHtml = await detailsResponse.text()

        // Extract additional details (simplified - would need more sophisticated parsing)
        const details: DMDMedicationDetails = {
          code,
          name: searchTerm,
          type: isVmp ? "VMP" : "AMP",
          url,
        }

        // Cache the details
        await sql`
          INSERT INTO dmd_medication_cache (
            code, code_type, name, supplier, url, metadata
          ) VALUES (
            ${code}, ${details.type}, ${details.name}, ${details.supplier},
            ${url}, ${JSON.stringify({ url })}
          )
          ON CONFLICT (code) DO UPDATE SET
            updated_at = NOW()
        `

        return details
      }

      return null
    } catch (error) {
      console.error("Error getting medication details:", error)
      return null
    }
  }

  /**
   * Search cache for medications
   */
  private static async searchCache(searchTerm: string): Promise<DMDMedicationOption[]> {
    const results = await sql`
      SELECT * FROM dmd_medication_cache
      WHERE name ILIKE ${`%${searchTerm}%`}
      AND active = true
      ORDER BY 
        CASE WHEN code_type = 'VMP' THEN 0 ELSE 1 END,
        name
      LIMIT 50
    `

    return results.map((row) => ({
      value: row.code,
      label: row.code_type === "VMP" ? row.name : row.supplier ? `${row.name} (${row.supplier})` : row.name,
      type: row.code_type as "VMP" | "AMP",
      supplier: row.supplier,
      code: row.code,
      snomedCode: row.snomed_code,
    }))
  }

  /**
   * Cache medication results
   */
  private static async cacheResults(medications: DMDMedicationOption[]): Promise<void> {
    for (const med of medications) {
      if (!med.code) continue

      try {
        await sql`
          INSERT INTO dmd_medication_cache (
            code, code_type, name, supplier
          ) VALUES (
            ${med.code}, ${med.type}, ${med.label}, ${med.supplier}
          )
          ON CONFLICT (code) DO UPDATE SET
            name = EXCLUDED.name,
            supplier = EXCLUDED.supplier,
            updated_at = NOW()
        `
      } catch (error) {
        console.error(`Failed to cache medication ${med.code}:`, error)
      }
    }
  }

  /**
   * Decode HTML entities
   */
  private static decodeHtmlEntities(text: string): string {
    return text
      .replace(/&amp;/g, "&")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
  }

  /**
   * Link medication to SNOMED CT
   */
  static async linkToSNOMED(dmDCode: string): Promise<string | null> {
    // This would typically call an API to map dm+d to SNOMED
    // For now, we'll check our cache
    const result = await sql`
      SELECT snomed_code FROM dmd_medication_cache
      WHERE code = ${dmDCode}
    `

    return result.length > 0 ? result[0].snomed_code : null
  }
}
