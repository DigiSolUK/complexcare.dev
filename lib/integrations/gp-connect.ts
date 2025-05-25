/**
 * GP Connect Integration Service
 *
 * This service handles integration with the GP Connect API to retrieve
 * patient data from GP systems.
 *
 * For more information on GP Connect, see:
 * https://digital.nhs.uk/services/gp-connect
 */

import { db } from "@/lib/db"

export interface GPConnectPatient {
  nhsNumber: string
  name: string
  dateOfBirth: string
  gender: string
  address: string
  telephone: string
  gpPractice: string
}

interface Medication {
  name: string
  dosage: string
  startDate: string
  endDate?: string
  prescribedBy: string
  dmdCode?: string
  medicationId?: string
  medicationType?: "VMP" | "AMP"
}

interface Allergy {
  substance: string
  severity: string
  recordedDate: string
  recordedBy: string
  reaction?: string
  status?: string
}

interface Condition {
  name: string
  onsetDate: string
  status: string
  recordedBy: string
  snomedCode?: string
  notes?: string
}

interface Immunization {
  name: string
  date: string
  administeredBy: string
  batchNumber?: string
  site?: string
  route?: string
}

export class GPConnectService {
  private accessToken: string | null = null
  private tokenExpiry: Date | null = null
  private clientId: string
  private clientSecret: string
  private baseUrl: string

  constructor(private readonly tenantId: string) {
    this.clientId = "demo-client-id"
    this.clientSecret = "demo-client-secret"
    this.baseUrl = "https://api.gp-connect.nhs.uk/v1"
  }

  /**
   * Initialize the service by fetching API credentials
   */
  async initialize(): Promise<void> {
    try {
      const result = await db.query(
        `SELECT api_key, api_secret, api_url 
         FROM tenant_api_keys 
         WHERE tenant_id = $1 AND service_name = 'GP_CONNECT' AND is_active = true`,
        [this.tenantId],
      )

      if (result.rows.length > 0) {
        this.clientId = result.rows[0].api_key
        this.clientSecret = result.rows[0].api_secret
        if (result.rows[0].api_url) {
          this.baseUrl = result.rows[0].api_url
        }
      }
    } catch (error) {
      console.error("Error initializing GP Connect service:", error)
      // Continue with default credentials
    }
  }

  /**
   * Authenticate with the GP Connect API
   */
  private async authenticate(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken
    }

    // In a real implementation, this would make an actual API call
    // For demo purposes, we'll simulate a successful authentication
    this.accessToken = "demo-access-token"

    // Set token expiry to 1 hour from now
    const expiry = new Date()
    expiry.setHours(expiry.getHours() + 1)
    this.tokenExpiry = expiry

    return this.accessToken
  }

  /**
   * Get patient information from GP Connect
   */
  async getPatient(nhsNumber: string): Promise<GPConnectPatient> {
    const token = await this.authenticate()

    // In a real implementation, this would make an actual API call
    // For demo purposes, we'll return mock data
    return {
      nhsNumber,
      name: nhsNumber === "1234567890" ? "John Smith" : "Sarah Johnson",
      dateOfBirth: nhsNumber === "1234567890" ? "15/05/1975" : "22/11/1982",
      gender: nhsNumber === "1234567890" ? "Male" : "Female",
      address: nhsNumber === "1234567890" ? "123 Main St, London, UK" : "456 Oak Ave, Manchester, UK",
      telephone: nhsNumber === "1234567890" ? "020 1234 5678" : "0161 234 5678",
      gpPractice: nhsNumber === "1234567890" ? "London Medical Centre" : "Manchester Health Group",
    }
  }

  /**
   * Get patient medications from GP Connect
   */
  async getMedications(nhsNumber: string): Promise<Medication[]> {
    const token = await this.authenticate()

    // In a real implementation, this would make an actual API call
    // For demo purposes, we'll return mock data
    return nhsNumber === "1234567890"
      ? [
          {
            name: "Metformin",
            dosage: "500mg twice daily",
            startDate: "10/01/2022",
            prescribedBy: "Dr. Johnson",
            dmdCode: "vmp123456",
            medicationId: "vmp123456",
            medicationType: "VMP",
          },
          {
            name: "Lisinopril",
            dosage: "10mg once daily",
            startDate: "15/03/2022",
            prescribedBy: "Dr. Johnson",
            dmdCode: "vmp234567",
            medicationId: "vmp234567",
            medicationType: "VMP",
          },
          {
            name: "Atorvastatin",
            dosage: "20mg once daily",
            startDate: "05/02/2022",
            prescribedBy: "Dr. Williams",
            dmdCode: "vmp345678",
            medicationId: "vmp345678",
            medicationType: "VMP",
          },
        ]
      : [
          {
            name: "Interferon beta-1a",
            dosage: "44mcg three times weekly",
            startDate: "20/05/2021",
            prescribedBy: "Dr. Williams",
            dmdCode: "amp123456",
            medicationId: "amp123456",
            medicationType: "AMP",
          },
          {
            name: "Sertraline",
            dosage: "50mg once daily",
            startDate: "12/11/2021",
            prescribedBy: "Dr. Williams",
            dmdCode: "vmp456789",
            medicationId: "vmp456789",
            medicationType: "VMP",
          },
        ]
  }

  /**
   * Get patient allergies from GP Connect
   */
  async getAllergies(nhsNumber: string): Promise<Allergy[]> {
    const token = await this.authenticate()

    // In a real implementation, this would make an actual API call
    // For demo purposes, we'll return mock data
    return nhsNumber === "1234567890"
      ? [
          {
            substance: "Penicillin",
            severity: "Severe",
            recordedDate: "03/06/2015",
            recordedBy: "Dr. Thompson",
            reaction: "Anaphylaxis",
            status: "Active",
          },
          {
            substance: "Shellfish",
            severity: "Moderate",
            recordedDate: "15/08/2018",
            recordedBy: "Dr. Johnson",
            reaction: "Rash and swelling",
            status: "Active",
          },
        ]
      : [
          {
            substance: "Sulfa drugs",
            severity: "Moderate",
            recordedDate: "22/04/2019",
            recordedBy: "Dr. Williams",
            reaction: "Skin rash",
            status: "Active",
          },
        ]
  }

  /**
   * Get patient conditions from GP Connect
   */
  async getConditions(nhsNumber: string): Promise<Condition[]> {
    const token = await this.authenticate()

    // In a real implementation, this would make an actual API call
    // For demo purposes, we'll return mock data
    return nhsNumber === "1234567890"
      ? [
          {
            name: "Type 2 Diabetes",
            onsetDate: "15/12/2020",
            status: "Active",
            recordedBy: "Dr. Johnson",
            snomedCode: "44054006",
            notes: "Well controlled with medication and diet",
          },
          {
            name: "Hypertension",
            onsetDate: "10/03/2021",
            status: "Active",
            recordedBy: "Dr. Johnson",
            snomedCode: "38341003",
            notes: "Monitoring regularly",
          },
          {
            name: "Osteoarthritis",
            onsetDate: "05/06/2019",
            status: "Active",
            recordedBy: "Dr. Thompson",
            snomedCode: "396275006",
            notes: "Affecting both knees",
          },
        ]
      : [
          {
            name: "Multiple Sclerosis",
            onsetDate: "18/02/2020",
            status: "Active",
            recordedBy: "Dr. Williams",
            snomedCode: "24700007",
            notes: "Relapsing-remitting type",
          },
          {
            name: "Depression",
            onsetDate: "30/09/2021",
            status: "Active",
            recordedBy: "Dr. Williams",
            snomedCode: "35489007",
            notes: "Responding well to treatment",
          },
        ]
  }

  /**
   * Get patient immunizations from GP Connect
   */
  async getImmunizations(nhsNumber: string): Promise<Immunization[]> {
    const token = await this.authenticate()

    // In a real implementation, this would make an actual API call
    // For demo purposes, we'll return mock data
    return nhsNumber === "1234567890"
      ? [
          {
            name: "Influenza vaccine",
            date: "15/10/2022",
            administeredBy: "Nurse Smith",
            batchNumber: "FL2022-001",
            site: "Left deltoid",
            route: "Intramuscular",
          },
          {
            name: "COVID-19 vaccine (Pfizer)",
            date: "20/03/2021",
            administeredBy: "Dr. Johnson",
            batchNumber: "PF2021-123",
            site: "Right deltoid",
            route: "Intramuscular",
          },
          {
            name: "COVID-19 vaccine (Pfizer) - Dose 2",
            date: "10/06/2021",
            administeredBy: "Nurse Williams",
            batchNumber: "PF2021-456",
            site: "Left deltoid",
            route: "Intramuscular",
          },
          {
            name: "COVID-19 vaccine (Pfizer) - Booster",
            date: "05/01/2022",
            administeredBy: "Nurse Williams",
            batchNumber: "PF2022-001",
            site: "Right deltoid",
            route: "Intramuscular",
          },
          {
            name: "Pneumococcal polysaccharide vaccine",
            date: "12/05/2021",
            administeredBy: "Dr. Thompson",
            batchNumber: "PN2021-078",
            site: "Left deltoid",
            route: "Intramuscular",
          },
        ]
      : [
          {
            name: "Influenza vaccine",
            date: "22/10/2022",
            administeredBy: "Nurse Johnson",
            batchNumber: "FL2022-002",
            site: "Right deltoid",
            route: "Intramuscular",
          },
          {
            name: "COVID-19 vaccine (AstraZeneca)",
            date: "15/04/2021",
            administeredBy: "Dr. Williams",
            batchNumber: "AZ2021-789",
            site: "Left deltoid",
            route: "Intramuscular",
          },
          {
            name: "COVID-19 vaccine (AstraZeneca) - Dose 2",
            date: "08/07/2021",
            administeredBy: "Nurse Brown",
            batchNumber: "AZ2021-012",
            site: "Right deltoid",
            route: "Intramuscular",
          },
          {
            name: "COVID-19 vaccine (Moderna) - Booster",
            date: "12/01/2022",
            administeredBy: "Nurse Brown",
            batchNumber: "MD2022-034",
            site: "Left deltoid",
            route: "Intramuscular",
          },
        ]
  }

  /**
   * Get all patient data from GP Connect
   */
  async getAllPatientData(nhsNumber: string) {
    const [patient, medications, allergies, conditions, immunizations] = await Promise.all([
      this.getPatient(nhsNumber),
      this.getMedications(nhsNumber),
      this.getAllergies(nhsNumber),
      this.getConditions(nhsNumber),
      this.getImmunizations(nhsNumber),
    ])

    return {
      patient,
      medications,
      allergies,
      conditions,
      immunizations,
    }
  }
}

// Export a singleton instance
export const gpConnectService = new GPConnectService("demo-tenant")
