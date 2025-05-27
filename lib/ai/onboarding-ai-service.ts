import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { logError } from "@/lib/services/error-logging-service"

export interface OrganizationProfile {
  name: string
  description?: string
  industry?: string
  size?: string
  website?: string
}

export interface OnboardingRecommendation {
  modules: string[]
  features: string[]
  integrations: string[]
  roles: string[]
  dataImportSuggestions: string[]
  setupPriorities: string[]
  reasoning: string
}

export interface DataImportAnalysis {
  validRows: number
  invalidRows: number
  missingFields: string[]
  duplicates: number
  suggestions: string[]
  mappedFields: Record<string, string>
}

/**
 * Generates an organization description based on minimal information
 */
export async function generateOrganizationDescription(profile: Partial<OrganizationProfile>): Promise<string> {
  try {
    const { text } = await generateText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      prompt: `Generate a professional, concise description (2-3 sentences) for a healthcare organization with the following details:
      
Name: ${profile.name || "Unknown"}
Industry: ${profile.industry || "Healthcare"}
Size: ${profile.size || "Unknown"}
      
The description should be suitable for a healthcare CRM platform and highlight the organization's focus on patient care.`,
      maxTokens: 200,
    })

    return text.trim()
  } catch (error: any) {
    console.error("Error generating organization description:", error)
    logError({
      message: `AI organization description generation error: ${error.message}`,
      stack: error.stack,
      componentPath: "lib/ai/onboarding-ai-service.ts:generateOrganizationDescription",
      severity: "low",
    })
    return ""
  }
}

/**
 * Analyzes organization details and provides tailored recommendations
 */
export async function getOnboardingRecommendations(
  profile: Partial<OrganizationProfile>,
): Promise<OnboardingRecommendation> {
  try {
    const defaultRecommendation: OnboardingRecommendation = {
      modules: ["Patients", "Care Professionals", "Appointments", "Clinical Notes"],
      features: ["Basic Reporting", "Task Management", "Document Storage"],
      integrations: ["Email Notifications"],
      roles: ["Administrator", "Clinician", "Front Desk"],
      dataImportSuggestions: ["Import patient records from CSV"],
      setupPriorities: ["Set up organization profile", "Add key team members", "Import existing patients"],
      reasoning: "Basic recommendation based on limited information.",
    }

    if (!profile.name && !profile.industry) {
      return defaultRecommendation
    }

    const { text } = await generateText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      prompt: `Analyze the following healthcare organization profile and provide tailored recommendations for their CRM setup:
      
Organization: ${profile.name || "Unknown"}
Industry: ${profile.industry || "Healthcare"}
Size: ${profile.size || "Unknown"}
Website: ${profile.website || "None provided"}
Description: ${profile.description || "None provided"}

Provide recommendations in the following JSON format:
{
  "modules": ["list of recommended modules to enable"],
  "features": ["list of recommended features to set up"],
  "integrations": ["list of recommended integrations"],
  "roles": ["list of recommended user roles to create"],
  "dataImportSuggestions": ["suggestions for data to import"],
  "setupPriorities": ["ordered list of setup priorities"],
  "reasoning": "brief explanation of recommendations"
}

Tailor your recommendations specifically for a complex care CRM system in the UK healthcare sector.`,
      maxTokens: 1000,
    })

    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const recommendations = JSON.parse(jsonMatch[0])
        return {
          ...defaultRecommendation,
          ...recommendations,
        }
      }
    } catch (parseError) {
      console.error("Error parsing AI recommendations:", parseError)
    }

    return defaultRecommendation
  } catch (error: any) {
    console.error("Error getting onboarding recommendations:", error)
    logError({
      message: `AI onboarding recommendations error: ${error.message}`,
      stack: error.stack,
      componentPath: "lib/ai/onboarding-ai-service.ts:getOnboardingRecommendations",
      severity: "medium",
    })

    return {
      modules: ["Patients", "Care Professionals", "Appointments", "Clinical Notes"],
      features: ["Basic Reporting", "Task Management", "Document Storage"],
      integrations: ["Email Notifications"],
      roles: ["Administrator", "Clinician", "Front Desk"],
      dataImportSuggestions: ["Import patient records from CSV"],
      setupPriorities: ["Set up organization profile", "Add key team members", "Import existing patients"],
      reasoning: "Fallback recommendation due to error processing request.",
    }
  }
}

/**
 * Analyzes a CSV file for data import and provides mapping suggestions
 */
export async function analyzeImportFile(fileContent: string, fileType: string): Promise<DataImportAnalysis> {
  try {
    // Get the first few rows to analyze (limit to avoid token limits)
    const rows = fileContent.split("\n").slice(0, 10).join("\n")

    const { text } = await generateText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      prompt: `Analyze the following ${fileType} file sample for importing into a healthcare CRM system:
      
${rows}

Provide analysis in the following JSON format:
{
  "validRows": estimated number of valid rows,
  "invalidRows": estimated number of invalid rows,
  "missingFields": ["list of important fields that appear to be missing"],
  "duplicates": estimated number of potential duplicates,
  "suggestions": ["list of suggestions to improve data quality"],
  "mappedFields": {
    "original field name": "suggested CRM field name",
    ...
  }
}

For the mappedFields, map the original column names to these possible CRM fields if appropriate:
- first_name
- last_name
- email
- phone
- date_of_birth
- nhs_number
- address
- gender
- medical_conditions
- medications
- allergies
- notes`,
      maxTokens: 1000,
    })

    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (parseError) {
      console.error("Error parsing AI import analysis:", parseError)
    }

    return {
      validRows: 0,
      invalidRows: 0,
      missingFields: [],
      duplicates: 0,
      suggestions: ["Unable to analyze file format"],
      mappedFields: {},
    }
  } catch (error: any) {
    console.error("Error analyzing import file:", error)
    logError({
      message: `AI import file analysis error: ${error.message}`,
      stack: error.stack,
      componentPath: "lib/ai/onboarding-ai-service.ts:analyzeImportFile",
      severity: "medium",
    })

    return {
      validRows: 0,
      invalidRows: 0,
      missingFields: [],
      duplicates: 0,
      suggestions: ["Error analyzing file"],
      mappedFields: {},
    }
  }
}

/**
 * Generates role descriptions based on organization type
 */
export async function generateRoleDescriptions(industry: string, roles: string[]): Promise<Record<string, string>> {
  try {
    const { text } = await generateText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      prompt: `Generate brief role descriptions (1-2 sentences each) for the following roles in a ${industry} organization:
      
${roles.join("\n")}

Provide descriptions in the following JSON format:
{
  "Role Name": "Role description",
  ...
}

The descriptions should focus on responsibilities and permissions relevant to a healthcare CRM system.`,
      maxTokens: 500,
    })

    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (parseError) {
      console.error("Error parsing AI role descriptions:", parseError)
    }

    return roles.reduce(
      (acc, role) => {
        acc[role] = `Standard ${role} responsibilities.`
        return acc
      },
      {} as Record<string, string>,
    )
  } catch (error: any) {
    console.error("Error generating role descriptions:", error)
    logError({
      message: `AI role description generation error: ${error.message}`,
      stack: error.stack,
      componentPath: "lib/ai/onboarding-ai-service.ts:generateRoleDescriptions",
      severity: "low",
    })

    return roles.reduce(
      (acc, role) => {
        acc[role] = `Standard ${role} responsibilities.`
        return acc
      },
      {} as Record<string, string>,
    )
  }
}
