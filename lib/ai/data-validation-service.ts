import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { logError } from "@/lib/services/error-logging-service"

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
  suggestions: ValidationSuggestion[]
  score: number // 0-100 quality score
}

export interface ValidationError {
  field: string
  row?: number
  value: string
  message: string
  severity: "critical" | "high" | "medium" | "low"
}

export interface ValidationWarning {
  field: string
  row?: number
  value: string
  message: string
  type: string
}

export interface ValidationSuggestion {
  field: string
  row?: number
  originalValue: string
  suggestedValue: string
  confidence: number // 0-1
  reason: string
}

export interface DuplicateDetection {
  groups: DuplicateGroup[]
  totalDuplicates: number
}

export interface DuplicateGroup {
  rows: number[]
  matchFields: string[]
  confidence: number
}

// UK-specific validation patterns
const UK_PATTERNS = {
  nhsNumber: /^\d{3}\s?\d{3}\s?\d{4}$/,
  postcode: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
  phoneNumber: /^(\+44|0)[\d\s()-]{10,}$/,
  niNumber: /^[A-Z]{2}\d{6}[A-Z]$/,
}

// Common date formats
const DATE_FORMATS = [
  /^\d{4}-\d{2}-\d{2}$/, // ISO format
  /^\d{2}\/\d{2}\/\d{4}$/, // UK format
  /^\d{2}-\d{2}-\d{4}$/, // Alternative format
  /^\d{1,2}\s\w+\s\d{4}$/, // Text format (e.g., "1 January 2024")
]

/**
 * Validates patient data with AI-enhanced checks
 */
export async function validatePatientData(data: any[]): Promise<ValidationResult> {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []
  const suggestions: ValidationSuggestion[] = []

  // Basic validation for each row
  data.forEach((row, index) => {
    // Required fields check
    if (!row.first_name || !row.last_name) {
      errors.push({
        field: "name",
        row: index + 1,
        value: `${row.first_name || ""} ${row.last_name || ""}`.trim(),
        message: "Patient name is required",
        severity: "critical",
      })
    }

    // Email validation
    if (row.email && !isValidEmail(row.email)) {
      errors.push({
        field: "email",
        row: index + 1,
        value: row.email,
        message: "Invalid email format",
        severity: "medium",
      })
    }

    // Phone number validation (UK)
    if (row.phone && !isValidUKPhone(row.phone)) {
      const suggestion = formatUKPhone(row.phone)
      if (suggestion !== row.phone) {
        suggestions.push({
          field: "phone",
          row: index + 1,
          originalValue: row.phone,
          suggestedValue: suggestion,
          confidence: 0.8,
          reason: "Standardized UK phone format",
        })
      }
    }

    // NHS number validation
    if (row.nhs_number && !isValidNHSNumber(row.nhs_number)) {
      warnings.push({
        field: "nhs_number",
        row: index + 1,
        value: row.nhs_number,
        message: "NHS number format appears incorrect",
        type: "format",
      })
    }

    // Date of birth validation
    if (row.date_of_birth) {
      const dobValidation = validateDateOfBirth(row.date_of_birth)
      if (!dobValidation.isValid) {
        errors.push({
          field: "date_of_birth",
          row: index + 1,
          value: row.date_of_birth,
          message: dobValidation.message,
          severity: "high",
        })
      }
    }

    // Postcode validation (UK)
    if (row.postcode && !isValidUKPostcode(row.postcode)) {
      const suggestion = formatUKPostcode(row.postcode)
      if (suggestion && suggestion !== row.postcode) {
        suggestions.push({
          field: "postcode",
          row: index + 1,
          originalValue: row.postcode,
          suggestedValue: suggestion,
          confidence: 0.9,
          reason: "Standardized UK postcode format",
        })
      }
    }
  })

  // Calculate quality score
  const totalFields = data.length * 7 // Assuming 7 key fields per patient
  const errorCount = errors.filter((e) => e.severity === "critical" || e.severity === "high").length
  const score = Math.max(0, Math.round(((totalFields - errorCount) / totalFields) * 100))

  return {
    isValid: errors.filter((e) => e.severity === "critical").length === 0,
    errors,
    warnings,
    suggestions,
    score,
  }
}

/**
 * Uses AI to detect potential duplicates with fuzzy matching
 */
export async function detectDuplicates(data: any[]): Promise<DuplicateDetection> {
  try {
    // Prepare data for AI analysis (limit to prevent token overflow)
    const sampleData = data.slice(0, 50).map((row, index) => ({
      index,
      name: `${row.first_name || ""} ${row.last_name || ""}`.trim(),
      dob: row.date_of_birth || "",
      nhs: row.nhs_number || "",
      email: row.email || "",
      phone: row.phone || "",
    }))

    const { text } = await generateText({
      model: groq("llama3-8b-8192"),
      prompt: `Analyze the following patient records for potential duplicates. Consider fuzzy matching for names, similar dates of birth, and matching identifiers.

${JSON.stringify(sampleData, null, 2)}

Identify groups of potential duplicate records. Return the result in this JSON format:
{
  "groups": [
    {
      "rows": [array of row indices that are potential duplicates],
      "matchFields": ["fields that match"],
      "confidence": 0.0-1.0
    }
  ]
}

Consider typos, abbreviations, and formatting differences when matching.`,
      maxTokens: 1000,
    })

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0])
        return {
          groups: result.groups || [],
          totalDuplicates: result.groups?.reduce((sum: number, g: any) => sum + g.rows.length - 1, 0) || 0,
        }
      }
    } catch (parseError) {
      console.error("Error parsing AI duplicate detection:", parseError)
    }

    // Fallback to simple duplicate detection
    return simpleDuplicateDetection(data)
  } catch (error: any) {
    console.error("Error detecting duplicates:", error)
    logError({
      message: `AI duplicate detection error: ${error.message}`,
      stack: error.stack,
      componentPath: "lib/ai/data-validation-service.ts:detectDuplicates",
      severity: "medium",
    })

    return simpleDuplicateDetection(data)
  }
}

/**
 * AI-powered data correction suggestions
 */
export async function suggestDataCorrections(data: any[]): Promise<ValidationSuggestion[]> {
  try {
    // Prepare problematic data for AI analysis
    const problemData = data
      .slice(0, 20)
      .map((row, index) => ({
        index,
        data: row,
      }))
      .filter((item) => {
        // Find rows with potential issues
        return (
          !isValidEmail(item.data.email) ||
          !isValidUKPhone(item.data.phone) ||
          !isValidDateFormat(item.data.date_of_birth)
        )
      })

    if (problemData.length === 0) {
      return []
    }

    const { text } = await generateText({
      model: groq("llama3-8b-8192"),
      prompt: `Analyze the following patient records and suggest corrections for any data quality issues:

${JSON.stringify(problemData, null, 2)}

Provide corrections in this JSON format:
{
  "corrections": [
    {
      "row": row index,
      "field": "field name",
      "originalValue": "original value",
      "suggestedValue": "corrected value",
      "confidence": 0.0-1.0,
      "reason": "explanation"
    }
  ]
}

Focus on:
- Fixing date formats to YYYY-MM-DD
- Standardizing phone numbers to UK format
- Correcting obvious typos in emails
- Standardizing name capitalization`,
      maxTokens: 1000,
    })

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0])
        return result.corrections || []
      }
    } catch (parseError) {
      console.error("Error parsing AI corrections:", parseError)
    }

    return []
  } catch (error: any) {
    console.error("Error suggesting corrections:", error)
    logError({
      message: `AI data correction error: ${error.message}`,
      stack: error.stack,
      componentPath: "lib/ai/data-validation-service.ts:suggestDataCorrections",
      severity: "low",
    })

    return []
  }
}

// Helper functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidUKPhone(phone: string): boolean {
  return UK_PATTERNS.phoneNumber.test(phone.replace(/\s/g, ""))
}

function formatUKPhone(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, "")

  // Format based on length
  if (digits.startsWith("44")) {
    // International format
    return `+${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`
  } else if (digits.startsWith("0") && digits.length === 11) {
    // UK national format
    return `${digits.slice(0, 5)} ${digits.slice(5)}`
  }

  return phone // Return original if can't format
}

function isValidNHSNumber(nhsNumber: string): boolean {
  const cleaned = nhsNumber.replace(/\s/g, "")
  if (!/^\d{10}$/.test(cleaned)) return false

  // NHS number checksum validation
  const digits = cleaned.split("").map(Number)
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i)
  }
  const checkDigit = 11 - (sum % 11)
  const expectedCheckDigit = checkDigit === 11 ? 0 : checkDigit

  return digits[9] === expectedCheckDigit
}

function isValidUKPostcode(postcode: string): boolean {
  return UK_PATTERNS.postcode.test(postcode)
}

function formatUKPostcode(postcode: string): string | null {
  const cleaned = postcode.toUpperCase().replace(/\s/g, "")
  const match = cleaned.match(/^([A-Z]{1,2}\d[A-Z\d]?)(\d[A-Z]{2})$/)
  if (match) {
    return `${match[1]} ${match[2]}`
  }
  return null
}

function isValidDateFormat(date: string): boolean {
  return DATE_FORMATS.some((pattern) => pattern.test(date))
}

function validateDateOfBirth(dob: string): { isValid: boolean; message: string } {
  if (!isValidDateFormat(dob)) {
    return { isValid: false, message: "Invalid date format" }
  }

  const date = new Date(dob)
  const now = new Date()

  if (isNaN(date.getTime())) {
    return { isValid: false, message: "Invalid date" }
  }

  if (date > now) {
    return { isValid: false, message: "Date of birth cannot be in the future" }
  }

  const age = Math.floor((now.getTime() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
  if (age > 150) {
    return { isValid: false, message: "Date of birth seems incorrect (age > 150)" }
  }

  return { isValid: true, message: "" }
}

function simpleDuplicateDetection(data: any[]): DuplicateDetection {
  const groups: DuplicateGroup[] = []
  const seen = new Map<string, number[]>()

  data.forEach((row, index) => {
    const key = `${row.first_name?.toLowerCase()}_${row.last_name?.toLowerCase()}_${row.date_of_birth}`
    if (seen.has(key)) {
      seen.get(key)!.push(index)
    } else {
      seen.set(key, [index])
    }
  })

  seen.forEach((indices, key) => {
    if (indices.length > 1) {
      groups.push({
        rows: indices,
        matchFields: ["first_name", "last_name", "date_of_birth"],
        confidence: 0.9,
      })
    }
  })

  return {
    groups,
    totalDuplicates: groups.reduce((sum, g) => sum + g.rows.length - 1, 0),
  }
}
