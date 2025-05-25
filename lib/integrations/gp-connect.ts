/**
 * GP Connect Integration Service
 *
 * This service handles integration with the GP Connect API to retrieve
 * patient data from GP systems.
 *
 * For more information on GP Connect, see:
 * https://digital.nhs.uk/services/gp-connect
 */

// In a real implementation, these would be environment variables
const GP_CONNECT_BASE_URL = "https://api.gp-connect.nhs.uk/v1"
const GP_CONNECT_CLIENT_ID = "demo-client-id"
const GP_CONNECT_CLIENT_SECRET = "demo-client-secret"

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
}

interface Allergy {
  substance: string
  severity: string
  recordedDate: string
  recordedBy: string
}

interface Condition {
  name: string
  onsetDate: string
  status: string
  recordedBy: string
}

export class GPConnectService {
  private accessToken: string | null = null
  private tokenExpiry: Date | null = null

  constructor(
    private readonly clientId: string = GP_CONNECT_CLIENT_ID,
    private readonly clientSecret: string = GP_CONNECT_CLIENT_SECRET,
    private readonly baseUrl: string = GP_CONNECT_BASE_URL,
  ) {}

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
          },
          {
            name: "Lisinopril",
            dosage: "10mg once daily",
            startDate: "15/03/2022",
            prescribedBy: "Dr. Johnson",
          },
          {
            name: "Atorvastatin",
            dosage: "20mg once daily",
            startDate: "05/02/2022",
            prescribedBy: "Dr. Williams",
          },
        ]
      : [
          {
            name: "Interferon beta-1a",
            dosage: "44mcg three times weekly",
            startDate: "20/05/2021",
            prescribedBy: "Dr. Williams",
          },
          {
            name: "Sertraline",
            dosage: "50mg once daily",
            startDate: "12/11/2021",
            prescribedBy: "Dr. Williams",
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
          },
          {
            substance: "Shellfish",
            severity: "Moderate",
            recordedDate: "15/08/2018",
            recordedBy: "Dr. Johnson",
          },
        ]
      : [
          {
            substance: "Sulfa drugs",
            severity: "Moderate",
            recordedDate: "22/04/2019",
            recordedBy: "Dr. Williams",
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
          },
          {
            name: "Hypertension",
            onsetDate: "10/03/2021",
            status: "Active",
            recordedBy: "Dr. Johnson",
          },
          {
            name: "Osteoarthritis",
            onsetDate: "05/06/2019",
            status: "Active",
            recordedBy: "Dr. Thompson",
          },
        ]
      : [
          {
            name: "Multiple Sclerosis",
            onsetDate: "18/02/2020",
            status: "Active",
            recordedBy: "Dr. Williams",
          },
          {
            name: "Depression",
            onsetDate: "30/09/2021",
            status: "Active",
            recordedBy: "Dr. Williams",
          },
        ]
  }

  /**
   * Get all patient data from GP Connect
   */
  async getAllPatientData(nhsNumber: string) {
    const [patient, medications, allergies, conditions] = await Promise.all([
      this.getPatient(nhsNumber),
      this.getMedications(nhsNumber),
      this.getAllergies(nhsNumber),
      this.getConditions(nhsNumber),
    ])

    return {
      patient,
      medications,
      allergies,
      conditions,
    }
  }

  async initialize() {
    // Authentication logic here if needed
  }
}

// Export a singleton instance
export const gpConnectService = new GPConnectService()

export async function getPatient(nhsNumber: string) {
  // Placeholder implementation
  console.log(`Fetching patient data from GP Connect for NHS number: ${nhsNumber}`)
  return {
    name: "Demo Patient",
    dateOfBirth: "01/01/1970",
    gender: "Unknown",
    address: "Unknown",
    telephone: "Unknown",
  }
}

export async function getMedications(nhsNumber: string) {
  // Placeholder implementation
  console.log(`Fetching medications from GP Connect for NHS number: ${nhsNumber}`)
  return []
}

export async function getAllergies(nhsNumber: string) {
  // Placeholder implementation
  console.log(`Fetching allergies from GP Connect for NHS number: ${nhsNumber}`)
  return []
}

export async function getConditions(nhsNumber: string) {
  // Placeholder implementation
  console.log(`Fetching conditions from GP Connect for NHS number: ${nhsNumber}`)
  return []
}
