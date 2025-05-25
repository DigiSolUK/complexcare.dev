import { sql } from "@/lib/db"
import { createSign } from "crypto"
import { v4 as uuidv4 } from "uuid"

export interface GPConnectConfig {
  id: string
  tenantId: string
  apiEndpoint: string
  clientId: string
  clientSecret: string
  jwtPrivateKey?: string
  jwtKeyId?: string
  spineAsid?: string
  spinePartyKey?: string
  enabled: boolean
  lastTestedAt?: Date
  lastTestStatus?: string
  lastTestMessage?: string
}

export interface GPConnectMedication {
  medicationStatementId: string
  medicationName: string
  dmDCode?: string
  snomedCode?: string
  dosageInstruction?: string
  status: string
  startDate?: Date
  endDate?: Date
  prescriberName?: string
  prescriberOrganization?: string
  lastIssueDate?: Date
  quantityValue?: number
  quantityUnit?: string
  daysSupply?: number
  repeatAllowed?: boolean
  repeatNumber?: number
  maxRepeats?: number
  notes?: string
  metadata?: any
}

export interface GPConnectCondition {
  conditionId: string
  code: string
  snomedCode?: string
  description: string
  clinicalStatus: string
  verificationStatus: string
  severity?: string
  onsetDate?: Date
  abatementDate?: Date
  recordedDate: Date
  recorder?: string
  notes?: string
  metadata?: any
}

export class EnhancedGPConnectService {
  private config: GPConnectConfig | null = null

  constructor(private tenantId: string) {}

  /**
   * Initialize the service by loading tenant-specific configuration
   */
  async initialize(): Promise<void> {
    const result = await sql`
      SELECT * FROM tenant_gp_connect_config 
      WHERE tenant_id = ${this.tenantId} AND enabled = true
    `

    if (result.length === 0) {
      throw new Error("GP Connect is not configured for this tenant")
    }

    const configRow = result[0]
    this.config = {
      id: configRow.id,
      tenantId: configRow.tenant_id,
      apiEndpoint: configRow.api_endpoint,
      clientId: configRow.client_id,
      clientSecret: configRow.client_secret,
      jwtPrivateKey: configRow.jwt_private_key,
      jwtKeyId: configRow.jwt_key_id,
      spineAsid: configRow.spine_asid,
      spinePartyKey: configRow.spine_party_key,
      enabled: configRow.enabled,
      lastTestedAt: configRow.last_tested_at ? new Date(configRow.last_tested_at) : undefined,
      lastTestStatus: configRow.last_test_status,
      lastTestMessage: configRow.last_test_message,
    }
  }

  /**
   * Generate JWT for GP Connect authentication
   */
  private generateJWT(): string {
    if (!this.config || !this.config.jwtPrivateKey) {
      throw new Error("JWT configuration is missing")
    }

    const header = {
      alg: "RS512",
      typ: "JWT",
      kid: this.config.jwtKeyId,
    }

    const payload = {
      iss: this.config.clientId,
      sub: this.config.clientId,
      aud: this.config.apiEndpoint,
      exp: Math.floor(Date.now() / 1000) + 300, // 5 minutes
      iat: Math.floor(Date.now() / 1000),
      reason_for_request: "directcare",
      requested_scope: "patient/*.read",
      requesting_device: {
        resourceType: "Device",
        identifier: [
          {
            system: "https://fhir.nhs.uk/Id/spine-device-asid",
            value: this.config.spineAsid,
          },
        ],
      },
      requesting_organization: {
        resourceType: "Organization",
        identifier: [
          {
            system: "https://fhir.nhs.uk/Id/ods-organization-code",
            value: this.config.spinePartyKey,
          },
        ],
      },
      requesting_practitioner: {
        resourceType: "Practitioner",
        id: uuidv4(),
        identifier: [
          {
            system: "https://fhir.nhs.uk/Id/sds-user-id",
            value: "G13579135",
          },
        ],
      },
    }

    const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url")
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url")

    const signatureInput = `${encodedHeader}.${encodedPayload}`
    const sign = createSign("RSA-SHA512")
    sign.update(signatureInput)
    const signature = sign.sign(this.config.jwtPrivateKey, "base64url")

    return `${signatureInput}.${signature}`
  }

  /**
   * Make authenticated request to GP Connect
   */
  private async makeRequest(path: string, nhsNumber: string): Promise<any> {
    if (!this.config) {
      throw new Error("GP Connect service not initialized")
    }

    const jwt = this.generateJWT()
    const url = `${this.config.apiEndpoint}${path}`

    const headers = {
      Authorization: `Bearer ${jwt}`,
      "Ssp-TraceID": uuidv4(),
      "Ssp-From": this.config.spineAsid!,
      "Ssp-To": this.config.spineAsid!,
      "Ssp-InteractionID": "urn:nhs:names:services:gpconnect:fhir:rest:read:patient-1",
      Accept: "application/fhir+json",
      "Content-Type": "application/fhir+json",
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers,
      })

      if (!response.ok) {
        throw new Error(`GP Connect request failed: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("GP Connect request error:", error)
      throw error
    }
  }

  /**
   * Get patient data from GP Connect
   */
  async getPatient(nhsNumber: string): Promise<any> {
    const response = await this.makeRequest(`/Patient?identifier=${nhsNumber}`, nhsNumber)

    if (response.entry && response.entry.length > 0) {
      return response.entry[0].resource
    }

    return null
  }

  /**
   * Get patient medications from GP Connect and save to database
   */
  async syncMedications(patientId: string, nhsNumber: string): Promise<GPConnectMedication[]> {
    const syncId = uuidv4()

    // Record sync start
    await sql`
      INSERT INTO gp_connect_sync_history (
        id, tenant_id, patient_id, sync_type, sync_status, 
        started_at, created_by
      ) VALUES (
        ${syncId}, ${this.tenantId}, ${patientId}, 'medications', 
        'in_progress', NOW(), 'system'
      )
    `

    try {
      const response = await this.makeRequest(
        `/MedicationStatement?patient.identifier=${nhsNumber}&_include=MedicationStatement:medication`,
        nhsNumber,
      )

      const medications: GPConnectMedication[] = []
      let recordsCreated = 0
      let recordsUpdated = 0

      if (response.entry) {
        for (const entry of response.entry) {
          if (entry.resource.resourceType === "MedicationStatement") {
            const medStatement = entry.resource
            const medication = await this.processMedicationStatement(medStatement, patientId)

            if (medication) {
              medications.push(medication)

              // Save to database
              const saved = await this.saveMedication(medication, patientId)
              if (saved.isNew) {
                recordsCreated++
              } else {
                recordsUpdated++
              }
            }
          }
        }
      }

      // Update sync history
      await sql`
        UPDATE gp_connect_sync_history 
        SET sync_status = 'success',
            completed_at = NOW(),
            records_fetched = ${medications.length},
            records_created = ${recordsCreated},
            records_updated = ${recordsUpdated}
        WHERE id = ${syncId}
      `

      return medications
    } catch (error) {
      // Update sync history with error
      await sql`
        UPDATE gp_connect_sync_history 
        SET sync_status = 'failed',
            completed_at = NOW(),
            error_message = ${error instanceof Error ? error.message : String(error)}
        WHERE id = ${syncId}
      `

      throw error
    }
  }

  /**
   * Process a FHIR MedicationStatement into our format
   */
  private async processMedicationStatement(medStatement: any, patientId: string): Promise<GPConnectMedication | null> {
    try {
      // Extract medication details
      let medicationName = "Unknown Medication"
      let snomedCode: string | undefined
      let dmDCode: string | undefined

      if (medStatement.medicationCodeableConcept) {
        medicationName = medStatement.medicationCodeableConcept.text || medicationName

        // Look for SNOMED code
        const snomedCoding = medStatement.medicationCodeableConcept.coding?.find(
          (c: any) => c.system === "http://snomed.info/sct",
        )
        if (snomedCoding) {
          snomedCode = snomedCoding.code
        }

        // Look for dm+d code
        const dmdCoding = medStatement.medicationCodeableConcept.coding?.find(
          (c: any) => c.system === "https://dmd.nhs.uk",
        )
        if (dmdCoding) {
          dmDCode = dmdCoding.code
        }
      }

      // Extract dosage instruction
      let dosageInstruction: string | undefined
      if (medStatement.dosage && medStatement.dosage.length > 0) {
        dosageInstruction = medStatement.dosage[0].text
      }

      // Extract dates
      const startDate = medStatement.effectivePeriod?.start ? new Date(medStatement.effectivePeriod.start) : undefined
      const endDate = medStatement.effectivePeriod?.end ? new Date(medStatement.effectivePeriod.end) : undefined

      // Extract prescriber info
      let prescriberName: string | undefined
      let prescriberOrganization: string | undefined
      if (medStatement.informationSource) {
        if (medStatement.informationSource.display) {
          prescriberName = medStatement.informationSource.display
        }
      }

      return {
        medicationStatementId: medStatement.id,
        medicationName,
        dmDCode,
        snomedCode,
        dosageInstruction,
        status: medStatement.status || "unknown",
        startDate,
        endDate,
        prescriberName,
        prescriberOrganization,
        metadata: medStatement,
      }
    } catch (error) {
      console.error("Error processing medication statement:", error)
      return null
    }
  }

  /**
   * Save medication to database
   */
  private async saveMedication(medication: GPConnectMedication, patientId: string): Promise<{ isNew: boolean }> {
    const existing = await sql`
      SELECT id FROM patient_gp_connect_medications
      WHERE tenant_id = ${this.tenantId} 
        AND patient_id = ${patientId}
        AND medication_statement_id = ${medication.medicationStatementId}
    `

    if (existing.length > 0) {
      // Update existing
      await sql`
        UPDATE patient_gp_connect_medications
        SET medication_name = ${medication.medicationName},
            dm_d_code = ${medication.dmDCode},
            snomed_code = ${medication.snomedCode},
            dosage_instruction = ${medication.dosageInstruction},
            status = ${medication.status},
            start_date = ${medication.startDate},
            end_date = ${medication.endDate},
            prescriber_name = ${medication.prescriberName},
            prescriber_organization = ${medication.prescriberOrganization},
            gp_connect_metadata = ${JSON.stringify(medication.metadata)},
            updated_at = NOW(),
            gp_connect_last_synced = NOW()
        WHERE id = ${existing[0].id}
      `

      return { isNew: false }
    } else {
      // Insert new
      await sql`
        INSERT INTO patient_gp_connect_medications (
          patient_id, tenant_id, medication_statement_id, medication_name,
          dm_d_code, snomed_code, dosage_instruction, status,
          start_date, end_date, prescriber_name, prescriber_organization,
          gp_connect_metadata, gp_connect_last_synced
        ) VALUES (
          ${patientId}, ${this.tenantId}, ${medication.medicationStatementId},
          ${medication.medicationName}, ${medication.dmDCode}, ${medication.snomedCode},
          ${medication.dosageInstruction}, ${medication.status}, ${medication.startDate},
          ${medication.endDate}, ${medication.prescriberName}, ${medication.prescriberOrganization},
          ${JSON.stringify(medication.metadata)}, NOW()
        )
      `

      // Also create a medical history entry
      await sql`
        INSERT INTO patient_medical_history (
          patient_id, tenant_id, category, title, description,
          onset_date, end_date, status, gp_connect_id,
          gp_connect_source, is_from_gp_connect, snomed_code,
          dm_d_code, dm_d_name, created_by
        ) VALUES (
          ${patientId}, ${this.tenantId}, 'MEDICATION', ${medication.medicationName},
          ${medication.dosageInstruction}, ${medication.startDate || new Date()},
          ${medication.endDate}, ${medication.status === "active" ? "ACTIVE" : "RESOLVED"},
          ${medication.medicationStatementId}, 'gp_connect', true,
          ${medication.snomedCode}, ${medication.dmDCode}, ${medication.medicationName},
          'gp_connect_sync'
        )
      `

      return { isNew: true }
    }
  }

  /**
   * Get conditions from GP Connect
   */
  async syncConditions(patientId: string, nhsNumber: string): Promise<GPConnectCondition[]> {
    const syncId = uuidv4()

    // Record sync start
    await sql`
      INSERT INTO gp_connect_sync_history (
        id, tenant_id, patient_id, sync_type, sync_status, 
        started_at, created_by
      ) VALUES (
        ${syncId}, ${this.tenantId}, ${patientId}, 'conditions', 
        'in_progress', NOW(), 'system'
      )
    `

    try {
      const response = await this.makeRequest(`/Condition?patient.identifier=${nhsNumber}`, nhsNumber)

      const conditions: GPConnectCondition[] = []
      let recordsCreated = 0

      if (response.entry) {
        for (const entry of response.entry) {
          if (entry.resource.resourceType === "Condition") {
            const condition = await this.processCondition(entry.resource, patientId)

            if (condition) {
              conditions.push(condition)

              // Create medical history entry
              await this.saveConditionAsMedicalHistory(condition, patientId)
              recordsCreated++
            }
          }
        }
      }

      // Update sync history
      await sql`
        UPDATE gp_connect_sync_history 
        SET sync_status = 'success',
            completed_at = NOW(),
            records_fetched = ${conditions.length},
            records_created = ${recordsCreated}
        WHERE id = ${syncId}
      `

      return conditions
    } catch (error) {
      // Update sync history with error
      await sql`
        UPDATE gp_connect_sync_history 
        SET sync_status = 'failed',
            completed_at = NOW(),
            error_message = ${error instanceof Error ? error.message : String(error)}
        WHERE id = ${syncId}
      `

      throw error
    }
  }

  /**
   * Process a FHIR Condition into our format
   */
  private async processCondition(fhirCondition: any, patientId: string): Promise<GPConnectCondition | null> {
    try {
      let description = "Unknown Condition"
      let snomedCode: string | undefined

      if (fhirCondition.code?.coding) {
        const coding = fhirCondition.code.coding[0]
        description = coding.display || description
        if (coding.system === "http://snomed.info/sct") {
          snomedCode = coding.code
        }
      }

      const onsetDate = fhirCondition.onsetDateTime ? new Date(fhirCondition.onsetDateTime) : undefined

      const abatementDate = fhirCondition.abatementDateTime ? new Date(fhirCondition.abatementDateTime) : undefined

      const recordedDate = fhirCondition.recordedDate ? new Date(fhirCondition.recordedDate) : onsetDate || new Date()

      return {
        conditionId: fhirCondition.id,
        code: fhirCondition.code?.coding?.[0]?.code || "unknown",
        snomedCode,
        description,
        clinicalStatus: fhirCondition.clinicalStatus?.coding?.[0]?.code || "unknown",
        verificationStatus: fhirCondition.verificationStatus?.coding?.[0]?.code || "unknown",
        severity: fhirCondition.severity?.coding?.[0]?.display,
        onsetDate,
        abatementDate,
        recordedDate,
        recorder: fhirCondition.recorder?.display,
        notes: fhirCondition.note?.[0]?.text,
        metadata: fhirCondition,
      }
    } catch (error) {
      console.error("Error processing condition:", error)
      return null
    }
  }

  /**
   * Save condition as medical history entry
   */
  private async saveConditionAsMedicalHistory(condition: GPConnectCondition, patientId: string): Promise<void> {
    // Check if already exists
    const existing = await sql`
      SELECT id FROM patient_medical_history
      WHERE tenant_id = ${this.tenantId}
        AND patient_id = ${patientId}
        AND gp_connect_id = ${condition.conditionId}
        AND is_from_gp_connect = true
    `

    if (existing.length === 0) {
      // Map clinical status to our status
      let status = "ACTIVE"
      if (condition.clinicalStatus === "resolved" || condition.clinicalStatus === "inactive") {
        status = "RESOLVED"
      } else if (condition.clinicalStatus === "remission") {
        status = "IN_REMISSION"
      } else if (condition.clinicalStatus === "recurrence") {
        status = "RECURRING"
      }

      // Map severity
      let severity: string | null = null
      if (condition.severity) {
        if (condition.severity.toLowerCase().includes("mild")) {
          severity = "MILD"
        } else if (condition.severity.toLowerCase().includes("moderate")) {
          severity = "MODERATE"
        } else if (condition.severity.toLowerCase().includes("severe")) {
          severity = "SEVERE"
        }
      }

      await sql`
        INSERT INTO patient_medical_history (
          patient_id, tenant_id, category, title, description,
          onset_date, end_date, status, severity, gp_connect_id,
          gp_connect_source, is_from_gp_connect, snomed_code,
          notes, created_by, gp_connect_metadata, gp_connect_last_updated
        ) VALUES (
          ${patientId}, ${this.tenantId}, 'CONDITION', ${condition.description},
          ${condition.notes || condition.description}, ${condition.onsetDate || condition.recordedDate},
          ${condition.abatementDate}, ${status}, ${severity}, ${condition.conditionId},
          'gp_connect', true, ${condition.snomedCode}, ${condition.notes},
          'gp_connect_sync', ${JSON.stringify(condition.metadata)}, NOW()
        )
      `
    }
  }

  /**
   * Test GP Connect configuration
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      await this.initialize()

      // Try to make a simple request
      const response = await this.makeRequest("/metadata", "test")

      // Update test status
      await sql`
        UPDATE tenant_gp_connect_config
        SET last_tested_at = NOW(),
            last_test_status = 'success',
            last_test_message = 'Connection successful'
        WHERE tenant_id = ${this.tenantId}
      `

      return { success: true, message: "Connection successful" }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"

      // Update test status
      await sql`
        UPDATE tenant_gp_connect_config
        SET last_tested_at = NOW(),
            last_test_status = 'failed',
            last_test_message = ${message}
        WHERE tenant_id = ${this.tenantId}
      `

      return { success: false, message }
    }
  }
}

/**
 * Get or create GP Connect service instance
 */
export async function getGPConnectService(tenantId: string): Promise<EnhancedGPConnectService | null> {
  try {
    const service = new EnhancedGPConnectService(tenantId)
    await service.initialize()
    return service
  } catch (error) {
    console.error("Failed to initialize GP Connect service:", error)
    return null
  }
}
