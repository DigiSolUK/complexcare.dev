/**
 * GP Connect Service
 *
 * This service provides mock data based on NHS GP Connect Demonstrator standards.
 * It simulates the data structure that would be returned by the actual GP Connect API.
 *
 * References:
 * - GP Connect Demonstrator: https://gpconnect.github.io/gpconnect-demonstrator/
 * - GP Connect Specifications: https://developer.nhs.uk/apis/gpconnect-1-6-0/
 * - GP Connect Test Data: https://github.com/nhsconnect/gpconnect-demonstrator/tree/develop/gpconnect-demonstrator-api/src/main/resources/json
 */

import { v4 as uuidv4 } from "uuid"

// Types based on GP Connect FHIR resources
export interface PatientDemographics {
  id: string
  nhsNumber: string
  name: {
    family: string
    given: string[]
    prefix?: string[]
  }
  gender: string
  birthDate: string
  address: {
    line: string[]
    city: string
    district?: string
    postalCode: string
  }
  telecom: {
    system: string
    value: string
    use: string
  }[]
  gpDetails: {
    name: string
    organization: string
    address: string
    phone: string
  }
  registrationDetails: {
    registrationDate: string
    registrationType: string
  }
}

export interface ClinicalItem {
  id: string
  effectiveDate: string
  status: string
  category?: string
  code: {
    coding: {
      system: string
      code: string
      display: string
    }[]
  }
  note?: string
}

export interface Medication extends ClinicalItem {
  medicationReference: {
    display: string
  }
  dosageInstructions?: string
  prescriptionType?: string
  prescribingAgency?: string
  prescriptionDate?: string
  prescribedBy?: string
  quantity?: string
}

export interface Allergy extends ClinicalItem {
  clinicalStatus: string
  verificationStatus: string
  type: string
  criticality?: string
  reaction?: {
    manifestation: {
      coding: {
        system: string
        code: string
        display: string
      }[]
    }[]
    severity?: string
    onset?: string
  }[]
}

export interface Immunization extends ClinicalItem {
  vaccineCode: {
    coding: {
      system: string
      code: string
      display: string
    }[]
  }
  primarySource: boolean
  site?: string
  route?: string
  doseQuantity?: {
    value: number
    unit: string
  }
}

export interface Condition extends ClinicalItem {
  clinicalStatus: string
  verificationStatus: string
  severity?: {
    coding: {
      system: string
      code: string
      display: string
    }[]
  }
  bodySite?: string[]
  onsetDateTime?: string
  abatementDateTime?: string
}

export interface Appointment {
  id: string
  status: string
  type: {
    coding: {
      system: string
      code: string
      display: string
    }[]
  }
  reason?: string
  description?: string
  start: string
  end: string
  minutesDuration: number
  created: string
  comment?: string
  participant: {
    actor: {
      reference: string
      display: string
    }
    status: string
    type?: string[]
  }[]
  location?: {
    reference: string
    display: string
  }[]
}

export interface GPConnectPatientRecord {
  demographics: PatientDemographics
  medications: Medication[]
  allergies: Allergy[]
  immunizations: Immunization[]
  conditions: Condition[]
  appointments: Appointment[]
}

/**
 * Mock GP Connect data based on NHS GP Connect Demonstrator standards
 * This data structure closely resembles the FHIR resources returned by GP Connect
 */
export const getMockPatientRecord = (nhsNumber: string): GPConnectPatientRecord => {
  // In a real implementation, this would fetch data from the GP Connect API
  // For now, we return mock data that matches the expected structure

  // For demo purposes, we'll return different data based on the NHS number
  // This allows testing different scenarios
  const patientIndex = Number.parseInt(nhsNumber.slice(-1)) % 3

  const mockPatients: GPConnectPatientRecord[] = [
    // Patient 1
    {
      demographics: {
        id: uuidv4(),
        nhsNumber: "9000000009",
        name: {
          family: "Smith",
          given: ["John", "William"],
          prefix: ["Mr"],
        },
        gender: "male",
        birthDate: "1970-03-15",
        address: {
          line: ["1 High Street", "Apartment 3B"],
          city: "Leeds",
          district: "West Yorkshire",
          postalCode: "LS1 4HR",
        },
        telecom: [
          {
            system: "phone",
            value: "07700900123",
            use: "mobile",
          },
          {
            system: "email",
            value: "john.smith@example.com",
            use: "home",
          },
        ],
        gpDetails: {
          name: "Dr. Sarah Johnson",
          organization: "Leeds Medical Practice",
          address: "15 Park Lane, Leeds, LS2 9JT",
          phone: "0113 123 4567",
        },
        registrationDetails: {
          registrationDate: "2018-01-15",
          registrationType: "Regular",
        },
      },
      medications: [
        {
          id: uuidv4(),
          effectiveDate: "2023-01-15",
          status: "active",
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "108537001",
                display: "Atorvastatin 20mg tablets",
              },
            ],
          },
          medicationReference: {
            display: "Atorvastatin 20mg tablets",
          },
          dosageInstructions: "1 tablet once daily",
          prescriptionType: "Repeat",
          prescriptionDate: "2023-01-15",
          prescribedBy: "Dr. Sarah Johnson",
          quantity: "28 tablet",
        },
        {
          id: uuidv4(),
          effectiveDate: "2023-02-10",
          status: "active",
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "319773006",
                display: "Ramipril 5mg capsules",
              },
            ],
          },
          medicationReference: {
            display: "Ramipril 5mg capsules",
          },
          dosageInstructions: "1 capsule once daily",
          prescriptionType: "Repeat",
          prescriptionDate: "2023-02-10",
          prescribedBy: "Dr. Sarah Johnson",
          quantity: "28 capsule",
        },
      ],
      allergies: [
        {
          id: uuidv4(),
          effectiveDate: "2015-07-23",
          status: "active",
          clinicalStatus: "active",
          verificationStatus: "confirmed",
          type: "allergy",
          criticality: "high",
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "372687004",
                display: "Penicillin",
              },
            ],
          },
          reaction: [
            {
              manifestation: [
                {
                  coding: [
                    {
                      system: "http://snomed.info/sct",
                      code: "247472004",
                      display: "Hives",
                    },
                  ],
                },
              ],
              severity: "moderate",
              onset: "2015-07-23",
            },
          ],
        },
      ],
      immunizations: [
        {
          id: uuidv4(),
          effectiveDate: "2022-09-15",
          status: "completed",
          vaccineCode: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "871764008",
                display: "COVID-19 vaccine",
              },
            ],
          },
          primarySource: true,
          site: "Left arm",
          route: "Intramuscular",
          doseQuantity: {
            value: 0.3,
            unit: "mL",
          },
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "871764008",
                display: "COVID-19 vaccine",
              },
            ],
          },
        },
        {
          id: uuidv4(),
          effectiveDate: "2022-10-20",
          status: "completed",
          vaccineCode: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "871764008",
                display: "COVID-19 vaccine",
              },
            ],
          },
          primarySource: true,
          site: "Right arm",
          route: "Intramuscular",
          doseQuantity: {
            value: 0.3,
            unit: "mL",
          },
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "871764008",
                display: "COVID-19 vaccine",
              },
            ],
          },
        },
      ],
      conditions: [
        {
          id: uuidv4(),
          effectiveDate: "2018-03-12",
          status: "active",
          clinicalStatus: "active",
          verificationStatus: "confirmed",
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "73211009",
                display: "Diabetes mellitus type 2",
              },
            ],
          },
          severity: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "24484000",
                display: "Severe",
              },
            ],
          },
          onsetDateTime: "2018-03-12",
        },
        {
          id: uuidv4(),
          effectiveDate: "2019-05-23",
          status: "active",
          clinicalStatus: "active",
          verificationStatus: "confirmed",
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "38341003",
                display: "Hypertension",
              },
            ],
          },
          severity: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "6736007",
                display: "Moderate",
              },
            ],
          },
          onsetDateTime: "2019-05-23",
        },
      ],
      appointments: [
        {
          id: uuidv4(),
          status: "booked",
          type: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "394802001",
                display: "General medicine clinic",
              },
            ],
          },
          reason: "Diabetes review",
          description: "Routine diabetes check-up",
          start: "2023-04-15T09:30:00Z",
          end: "2023-04-15T10:00:00Z",
          minutesDuration: 30,
          created: "2023-03-20T14:15:00Z",
          participant: [
            {
              actor: {
                reference: "Practitioner/1",
                display: "Dr. Sarah Johnson",
              },
              status: "accepted",
            },
            {
              actor: {
                reference: "Patient/1",
                display: "John Smith",
              },
              status: "accepted",
            },
          ],
          location: [
            {
              reference: "Location/1",
              display: "Leeds Medical Practice, Consultation Room 3",
            },
          ],
        },
        {
          id: uuidv4(),
          status: "booked",
          type: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "394814009",
                display: "General practice",
              },
            ],
          },
          reason: "Blood pressure check",
          description: "Follow-up for hypertension",
          start: "2023-05-10T14:00:00Z",
          end: "2023-05-10T14:15:00Z",
          minutesDuration: 15,
          created: "2023-04-01T10:30:00Z",
          participant: [
            {
              actor: {
                reference: "Practitioner/2",
                display: "Nurse Emma Wilson",
              },
              status: "accepted",
            },
            {
              actor: {
                reference: "Patient/1",
                display: "John Smith",
              },
              status: "accepted",
            },
          ],
          location: [
            {
              reference: "Location/2",
              display: "Leeds Medical Practice, Treatment Room 1",
            },
          ],
        },
      ],
    },

    // Patient 2
    {
      demographics: {
        id: uuidv4(),
        nhsNumber: "9000000017",
        name: {
          family: "Johnson",
          given: ["Emily", "Rose"],
          prefix: ["Mrs"],
        },
        gender: "female",
        birthDate: "1985-11-22",
        address: {
          line: ["42 Oak Avenue"],
          city: "Manchester",
          district: "Greater Manchester",
          postalCode: "M1 5QT",
        },
        telecom: [
          {
            system: "phone",
            value: "07700900456",
            use: "mobile",
          },
          {
            system: "email",
            value: "emily.johnson@example.com",
            use: "home",
          },
        ],
        gpDetails: {
          name: "Dr. Michael Brown",
          organization: "Manchester Health Centre",
          address: "123 Main Road, Manchester, M2 3AB",
          phone: "0161 987 6543",
        },
        registrationDetails: {
          registrationDate: "2019-03-10",
          registrationType: "Regular",
        },
      },
      medications: [
        {
          id: uuidv4(),
          effectiveDate: "2022-12-05",
          status: "active",
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "320141001",
                display: "Fluoxetine 20mg capsules",
              },
            ],
          },
          medicationReference: {
            display: "Fluoxetine 20mg capsules",
          },
          dosageInstructions: "1 capsule once daily",
          prescriptionType: "Repeat",
          prescriptionDate: "2022-12-05",
          prescribedBy: "Dr. Michael Brown",
          quantity: "28 capsule",
        },
        {
          id: uuidv4(),
          effectiveDate: "2023-01-20",
          status: "active",
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "320139009",
                display: "Salbutamol 100micrograms/dose inhaler",
              },
            ],
          },
          medicationReference: {
            display: "Salbutamol 100micrograms/dose inhaler",
          },
          dosageInstructions: "2 puffs as required for breathlessness",
          prescriptionType: "Repeat",
          prescriptionDate: "2023-01-20",
          prescribedBy: "Dr. Michael Brown",
          quantity: "1 inhaler",
        },
      ],
      allergies: [
        {
          id: uuidv4(),
          effectiveDate: "2010-04-12",
          status: "active",
          clinicalStatus: "active",
          verificationStatus: "confirmed",
          type: "allergy",
          criticality: "high",
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "91934008",
                display: "Peanut",
              },
            ],
          },
          reaction: [
            {
              manifestation: [
                {
                  coding: [
                    {
                      system: "http://snomed.info/sct",
                      code: "39579001",
                      display: "Anaphylaxis",
                    },
                  ],
                },
              ],
              severity: "severe",
              onset: "2010-04-12",
            },
          ],
        },
        {
          id: uuidv4(),
          effectiveDate: "2018-09-30",
          status: "active",
          clinicalStatus: "active",
          verificationStatus: "confirmed",
          type: "allergy",
          criticality: "moderate",
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "764146007",
                display: "Ibuprofen",
              },
            ],
          },
          reaction: [
            {
              manifestation: [
                {
                  coding: [
                    {
                      system: "http://snomed.info/sct",
                      code: "126485001",
                      display: "Urticaria",
                    },
                  ],
                },
              ],
              severity: "moderate",
              onset: "2018-09-30",
            },
          ],
        },
      ],
      immunizations: [
        {
          id: uuidv4(),
          effectiveDate: "2022-09-01",
          status: "completed",
          vaccineCode: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "871764008",
                display: "COVID-19 vaccine",
              },
            ],
          },
          primarySource: true,
          site: "Left arm",
          route: "Intramuscular",
          doseQuantity: {
            value: 0.3,
            unit: "mL",
          },
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "871764008",
                display: "COVID-19 vaccine",
              },
            ],
          },
        },
        {
          id: uuidv4(),
          effectiveDate: "2022-10-05",
          status: "completed",
          vaccineCode: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "871764008",
                display: "COVID-19 vaccine",
              },
            ],
          },
          primarySource: true,
          site: "Right arm",
          route: "Intramuscular",
          doseQuantity: {
            value: 0.3,
            unit: "mL",
          },
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "871764008",
                display: "COVID-19 vaccine",
              },
            ],
          },
        },
        {
          id: uuidv4(),
          effectiveDate: "2022-11-15",
          status: "completed",
          vaccineCode: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "871871006",
                display: "Seasonal influenza vaccine",
              },
            ],
          },
          primarySource: true,
          site: "Left arm",
          route: "Intramuscular",
          doseQuantity: {
            value: 0.5,
            unit: "mL",
          },
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "871871006",
                display: "Seasonal influenza vaccine",
              },
            ],
          },
        },
      ],
      conditions: [
        {
          id: uuidv4(),
          effectiveDate: "2020-02-15",
          status: "active",
          clinicalStatus: "active",
          verificationStatus: "confirmed",
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "195967001",
                display: "Asthma",
              },
            ],
          },
          severity: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "6736007",
                display: "Moderate",
              },
            ],
          },
          onsetDateTime: "2020-02-15",
        },
        {
          id: uuidv4(),
          effectiveDate: "2021-07-10",
          status: "active",
          clinicalStatus: "active",
          verificationStatus: "confirmed",
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "35489007",
                display: "Depression",
              },
            ],
          },
          severity: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "6736007",
                display: "Moderate",
              },
            ],
          },
          onsetDateTime: "2021-07-10",
        },
      ],
      appointments: [
        {
          id: uuidv4(),
          status: "booked",
          type: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "394814009",
                display: "General practice",
              },
            ],
          },
          reason: "Asthma review",
          description: "Annual asthma check-up",
          start: "2023-04-20T11:00:00Z",
          end: "2023-04-20T11:30:00Z",
          minutesDuration: 30,
          created: "2023-03-25T09:45:00Z",
          participant: [
            {
              actor: {
                reference: "Practitioner/3",
                display: "Nurse David Thompson",
              },
              status: "accepted",
            },
            {
              actor: {
                reference: "Patient/2",
                display: "Emily Johnson",
              },
              status: "accepted",
            },
          ],
          location: [
            {
              reference: "Location/3",
              display: "Manchester Health Centre, Consultation Room 2",
            },
          ],
        },
        {
          id: uuidv4(),
          status: "booked",
          type: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "394802001",
                display: "General medicine clinic",
              },
            ],
          },
          reason: "Medication review",
          description: "Review of current medications",
          start: "2023-05-15T14:30:00Z",
          end: "2023-05-15T15:00:00Z",
          minutesDuration: 30,
          created: "2023-04-10T13:20:00Z",
          participant: [
            {
              actor: {
                reference: "Practitioner/4",
                display: "Dr. Michael Brown",
              },
              status: "accepted",
            },
            {
              actor: {
                reference: "Patient/2",
                display: "Emily Johnson",
              },
              status: "accepted",
            },
          ],
          location: [
            {
              reference: "Location/4",
              display: "Manchester Health Centre, Consultation Room 5",
            },
          ],
        },
      ],
    },

    // Patient 3
    {
      demographics: {
        id: uuidv4(),
        nhsNumber: "9000000025",
        name: {
          family: "Taylor",
          given: ["David", "James"],
          prefix: ["Mr"],
        },
        gender: "male",
        birthDate: "1950-06-30",
        address: {
          line: ["15 Elm Grove", "Flat 7"],
          city: "Birmingham",
          district: "West Midlands",
          postalCode: "B1 2CD",
        },
        telecom: [
          {
            system: "phone",
            value: "07700900789",
            use: "mobile",
          },
          {
            system: "phone",
            value: "0121 234 5678",
            use: "home",
          },
        ],
        gpDetails: {
          name: "Dr. Jessica Lee",
          organization: "Birmingham Community Health Centre",
          address: "45 High Street, Birmingham, B2 5TY",
          phone: "0121 876 5432",
        },
        registrationDetails: {
          registrationDate: "2015-08-05",
          registrationType: "Regular",
        },
      },
      medications: [
        {
          id: uuidv4(),
          effectiveDate: "2022-11-10",
          status: "active",
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "318475005",
                display: "Bisoprolol 5mg tablets",
              },
            ],
          },
          medicationReference: {
            display: "Bisoprolol 5mg tablets",
          },
          dosageInstructions: "1 tablet once daily",
          prescriptionType: "Repeat",
          prescriptionDate: "2022-11-10",
          prescribedBy: "Dr. Jessica Lee",
          quantity: "28 tablet",
        },
        {
          id: uuidv4(),
          effectiveDate: "2022-11-10",
          status: "active",
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "318418001",
                display: "Aspirin 75mg dispersible tablets",
              },
            ],
          },
          medicationReference: {
            display: "Aspirin 75mg dispersible tablets",
          },
          dosageInstructions: "1 tablet once daily",
          prescriptionType: "Repeat",
          prescriptionDate: "2022-11-10",
          prescribedBy: "Dr. Jessica Lee",
          quantity: "28 tablet",
        },
        {
          id: uuidv4(),
          effectiveDate: "2023-01-05",
          status: "active",
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "320141001",
                display: "Atorvastatin 40mg tablets",
              },
            ],
          },
          medicationReference: {
            display: "Atorvastatin 40mg tablets",
          },
          dosageInstructions: "1 tablet once daily at night",
          prescriptionType: "Repeat",
          prescriptionDate: "2023-01-05",
          prescribedBy: "Dr. Jessica Lee",
          quantity: "28 tablet",
        },
      ],
      allergies: [
        {
          id: uuidv4(),
          effectiveDate: "2005-03-15",
          status: "active",
          clinicalStatus: "active",
          verificationStatus: "confirmed",
          type: "allergy",
          criticality: "moderate",
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "294505008",
                display: "Erythromycin",
              },
            ],
          },
          reaction: [
            {
              manifestation: [
                {
                  coding: [
                    {
                      system: "http://snomed.info/sct",
                      code: "422587007",
                      display: "Nausea",
                    },
                  ],
                },
              ],
              severity: "moderate",
              onset: "2005-03-15",
            },
          ],
        },
      ],
      immunizations: [
        {
          id: uuidv4(),
          effectiveDate: "2022-09-10",
          status: "completed",
          vaccineCode: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "871764008",
                display: "COVID-19 vaccine",
              },
            ],
          },
          primarySource: true,
          site: "Left arm",
          route: "Intramuscular",
          doseQuantity: {
            value: 0.3,
            unit: "mL",
          },
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "871764008",
                display: "COVID-19 vaccine",
              },
            ],
          },
        },
        {
          id: uuidv4(),
          effectiveDate: "2022-10-15",
          status: "completed",
          vaccineCode: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "871764008",
                display: "COVID-19 vaccine",
              },
            ],
          },
          primarySource: true,
          site: "Right arm",
          route: "Intramuscular",
          doseQuantity: {
            value: 0.3,
            unit: "mL",
          },
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "871764008",
                display: "COVID-19 vaccine",
              },
            ],
          },
        },
        {
          id: uuidv4(),
          effectiveDate: "2022-11-01",
          status: "completed",
          vaccineCode: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "871871006",
                display: "Seasonal influenza vaccine",
              },
            ],
          },
          primarySource: true,
          site: "Left arm",
          route: "Intramuscular",
          doseQuantity: {
            value: 0.5,
            unit: "mL",
          },
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "871871006",
                display: "Seasonal influenza vaccine",
              },
            ],
          },
        },
      ],
      conditions: [
        {
          id: uuidv4(),
          effectiveDate: "2010-11-20",
          status: "active",
          clinicalStatus: "active",
          verificationStatus: "confirmed",
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "22298006",
                display: "Myocardial infarction",
              },
            ],
          },
          severity: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "24484000",
                display: "Severe",
              },
            ],
          },
          onsetDateTime: "2010-11-20",
        },
        {
          id: uuidv4(),
          effectiveDate: "2015-03-05",
          status: "active",
          clinicalStatus: "active",
          verificationStatus: "confirmed",
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "38341003",
                display: "Hypertension",
              },
            ],
          },
          severity: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "6736007",
                display: "Moderate",
              },
            ],
          },
          onsetDateTime: "2015-03-05",
        },
        {
          id: uuidv4(),
          effectiveDate: "2018-07-12",
          status: "active",
          clinicalStatus: "active",
          verificationStatus: "confirmed",
          code: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "84114007",
                display: "Heart failure",
              },
            ],
          },
          severity: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "255604002",
                display: "Mild",
              },
            ],
          },
          onsetDateTime: "2018-07-12",
        },
      ],
      appointments: [
        {
          id: uuidv4(),
          status: "booked",
          type: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "394802001",
                display: "General medicine clinic",
              },
            ],
          },
          reason: "Cardiac review",
          description: "Regular cardiac check-up",
          start: "2023-04-25T10:15:00Z",
          end: "2023-04-25T10:45:00Z",
          minutesDuration: 30,
          created: "2023-03-30T11:20:00Z",
          participant: [
            {
              actor: {
                reference: "Practitioner/5",
                display: "Dr. Jessica Lee",
              },
              status: "accepted",
            },
            {
              actor: {
                reference: "Patient/3",
                display: "David Taylor",
              },
              status: "accepted",
            },
          ],
          location: [
            {
              reference: "Location/5",
              display: "Birmingham Community Health Centre, Consultation Room 1",
            },
          ],
        },
        {
          id: uuidv4(),
          status: "booked",
          type: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "394814009",
                display: "General practice",
              },
            ],
          },
          reason: "Blood test",
          description: "Routine blood test for medication monitoring",
          start: "2023-05-05T09:00:00Z",
          end: "2023-05-05T09:15:00Z",
          minutesDuration: 15,
          created: "2023-04-15T14:30:00Z",
          participant: [
            {
              actor: {
                reference: "Practitioner/6",
                display: "Nurse Robert Martin",
              },
              status: "accepted",
            },
            {
              actor: {
                reference: "Patient/3",
                display: "David Taylor",
              },
              status: "accepted",
            },
          ],
          location: [
            {
              reference: "Location/6",
              display: "Birmingham Community Health Centre, Treatment Room 2",
            },
          ],
        },
      ],
    },
  ]

  // Return the appropriate patient record based on the NHS number
  // If the NHS number doesn't match any of our mock patients, return the first one
  const matchedPatient = mockPatients.find((p) => p.demographics.nhsNumber === nhsNumber) || mockPatients[patientIndex]

  return matchedPatient
}

/**
 * Function to fetch patient record from GP Connect API
 *
 * In a real implementation, this would make an authenticated request to the GP Connect API
 * For now, it returns mock data
 *
 * @param nhsNumber - The NHS number of the patient
 * @returns Promise<GPConnectPatientRecord> - The patient record
 */
export const fetchPatientRecord = async (nhsNumber: string): Promise<GPConnectPatientRecord> => {
  // In a real implementation, this would:
  // 1. Authenticate with the GP Connect API using OAuth2
  // 2. Make a request to the FHIR endpoints to fetch patient data
  // 3. Transform the response into our GPConnectPatientRecord format

  // For now, we'll simulate a network delay and return mock data
  await new Promise((resolve) => setTimeout(resolve, 500))

  return getMockPatientRecord(nhsNumber)
}

/**
 * Instructions for replacing mock data with real GP Connect API:
 *
 * 1. Register for NHS Digital API access and obtain credentials
 * 2. Implement OAuth2 authentication flow as per GP Connect specifications
 * 3. Replace the fetchPatientRecord function with actual API calls to GP Connect endpoints:
 *    - Patient Demographics: GET [base]/Patient/[id]
 *    - Medications: GET [base]/Patient/[id]/MedicationStatement
 *    - Allergies: GET [base]/Patient/[id]/AllergyIntolerance
 *    - Immunizations: GET [base]/Patient/[id]/Immunization
 *    - Conditions: GET [base]/Patient/[id]/Condition
 *    - Appointments: GET [base]/Patient/[id]/Appointment
 * 4. Transform the FHIR resources returned by GP Connect into the structures used by this application
 * 5. Implement proper error handling for API failures
 * 6. Add caching mechanisms to reduce API calls and improve performance
 *
 * For detailed implementation guidance, refer to:
 * - GP Connect Implementation Guide: https://developer.nhs.uk/apis/gpconnect-1-6-0/
 * - FHIR API Documentation: https://www.hl7.org/fhir/
 */

