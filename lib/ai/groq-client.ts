import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { logError } from "@/lib/services/error-logging-service"
import { sql } from "@vercel/postgres"
import { v4 as uuidv4 } from "uuid"

// AI-Powered Chatbot for Patient Support
export async function patientInquiry(query: string) {
  const startTime = Date.now()
  let success = false
  let text = ""
  let errorMessage = null
  const analyticsId = uuidv4()

  try {
    const { text: generatedText } = await generateText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      prompt: `You are a helpful AI assistant for a healthcare CRM. Answer the following patient inquiry professionally and compassionately: ${query}`,
      maxTokens: 500,
    })
    text = generatedText
    success = true
  } catch (error: any) {
    console.error("Error in patient inquiry:", error)
    errorMessage = error.message
    await logError({
      message: `Patient inquiry error: ${error.message}`,
      stack: error.stack,
      componentPath: "lib/ai/groq-client.ts:patientInquiry",
      severity: "medium",
    })
    text = "I'm sorry, I couldn't process your inquiry at the moment. Please try again later."
  } finally {
    const endTime = Date.now()
    const executionTimeMs = endTime - startTime

    await sql`
      INSERT INTO ai_tool_analytics (tenant_id, user_id, tool_name, input_text, output_text, execution_time_ms, success, error_message)
      VALUES (
        'ba367cfe-6de0-4180-9566-1002b75cf82c',
        '18c25ac5-1e96-49f8-9eac-26dc1771230f',
        'patientInquiry',
        ${query},
        ${text},
        ${executionTimeMs},
        ${success},
        ${errorMessage}
      )
    `
  }
  return { success, text }
}

// Intelligent Document Processing
export async function summarizeDocument(document: string) {
  const startTime = Date.now()
  let success = false
  let text = ""
  let errorMessage = null
  try {
    const { text: generatedText } = await generateText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      prompt: `Summarize the following medical document, extracting key information such as diagnoses, treatments, medications, and follow-up instructions: ${document}`,
      maxTokens: 800,
    })
    text = generatedText
    success = true
  } catch (error: any) {
    console.error("Error in document summarization:", error)
    errorMessage = error.message
    await logError({
      message: `Document summarization error: ${error.message}`,
      stack: error.stack,
      componentPath: "lib/ai/groq-client.ts:summarizeDocument",
      severity: "medium",
    })
    text = "I'm sorry, I couldn't summarize this document at the moment. Please try again later."
  } finally {
    const endTime = Date.now()
    const executionTimeMs = endTime - startTime
    await sql`
      INSERT INTO ai_tool_analytics (tenant_id, user_id, tool_name, input_text, output_text, execution_time_ms, success, error_message)
      VALUES (
        'ba367cfe-6de0-4180-9566-1002b75cf82c',
        '18c25ac5-1e96-49f8-9eac-26dc1771230f',
        'summarizeDocument',
        ${document},
        ${text},
        ${executionTimeMs},
        ${success},
        ${errorMessage}
      )
    `
  }
  return { success, text }
}

// Real-Time Data Analysis and Insights
export async function analyzePatientData(data: string) {
  const startTime = Date.now()
  let success = false
  let text = ""
  let errorMessage = null
  try {
    const { text: generatedText } = await generateText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      prompt: `Analyze the following patient data and identify potential health risks, trends, and recommendations for care: ${data}`,
      maxTokens: 1000,
    })
    text = generatedText
    success = true
  } catch (error: any) {
    console.error("Error in patient data analysis:", error)
    errorMessage = error.message
    await logError({
      message: `Patient data analysis error: ${error.message}`,
      stack: error.stack,
      componentPath: "lib/ai/groq-client.ts:analyzePatientData",
      severity: "medium",
    })
    return {
      success: false,
      text: "I'm sorry, I couldn't analyze this patient data at the moment. Please try again later.",
    }
  } finally {
    const endTime = Date.now()
    const executionTimeMs = endTime - startTime
    await sql`
      INSERT INTO ai_tool_analytics (tenant_id, user_id, tool_name, input_text, output_text, execution_time_ms, success, error_message)
      VALUES (
        'ba367cfe-6de0-4180-9566-1002b75cf82c',
        '18c25ac5-1e96-49f8-9eac-26dc1771230f',
        'analyzePatientData',
        ${data},
        ${text},
        ${executionTimeMs},
        ${success},
        ${errorMessage}
      )
    `
  }
  return { success, text }
}

// Automated Report Generation
export async function generateReport(data: string, reportType: string) {
  const startTime = Date.now()
  let success = false
  let text = ""
  let errorMessage = null
  try {
    const { text: generatedText } = await generateText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      prompt: `Generate a ${reportType} report based on the following data. Format it professionally with clear sections, bullet points where appropriate, and a summary: ${data}`,
      maxTokens: 1500,
    })
    text = generatedText
    success = true
  } catch (error: any) {
    console.error("Error in report generation:", error)
    errorMessage = error.message
    await logError({
      message: `Report generation error: ${error.message}`,
      stack: error.stack,
      componentPath: "lib/ai/groq-client.ts:generateReport",
      severity: "high",
    })
    return {
      success: false,
      text: "I'm sorry, I couldn't generate this report at the moment. Please try again later.",
    }
  } finally {
    const endTime = Date.now()
    const executionTimeMs = endTime - startTime
    await sql`
      INSERT INTO ai_tool_analytics (tenant_id, user_id, tool_name, input_text, output_text, execution_time_ms, success, error_message)
      VALUES (
        'ba367cfe-6de0-4180-9566-1002b75cf82c',
        '18c25ac5-1e96-49f8-9eac-26dc1771230f',
        'generateReport',
        ${data},
        ${text},
        ${executionTimeMs},
        ${success},
        ${errorMessage}
      )
    `
  }
  return { success, text }
}

// Personalized Recommendations
export async function getPersonalizedRecommendations(profile: string) {
  const startTime = Date.now()
  let success = false
  let text = ""
  let errorMessage = null
  try {
    const { text: generatedText } = await generateText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      prompt: `Based on the following patient profile, provide personalized recommendations for treatment plans, medications, and lifestyle interventions. Format your response with clear sections and actionable advice: ${profile}`,
      maxTokens: 1000,
    })
    text = generatedText
    success = true
  } catch (error: any) {
    console.error("Error in personalized recommendations:", error)
    errorMessage = error.message
    await logError({
      message: `Personalized recommendations error: ${error.message}`,
      stack: error.stack,
      componentPath: "lib/ai/groq-client.ts:getPersonalizedRecommendations",
      severity: "medium",
    })
    return {
      success: false,
      text: "I'm sorry, I couldn't generate personalized recommendations at the moment. Please try again later.",
    }
  } finally {
    const endTime = Date.now()
    const executionTimeMs = endTime - startTime
    await sql`
      INSERT INTO ai_tool_analytics (tenant_id, user_id, tool_name, input_text, output_text, execution_time_ms, success, error_message)
      VALUES (
        'ba367cfe-6de0-4180-9566-1002b75cf82c',
        '18c25ac5-1e96-49f8-9eac-26dc1771230f',
        'getPersonalizedRecommendations',
        ${profile},
        ${text},
        ${executionTimeMs},
        ${success},
        ${errorMessage}
      )
    `
  }
  return { success, text }
}

// Clinical Decision Support
export async function getClinicalDecisionSupport(patientData: any) {
  const startTime = Date.now()
  let success = false
  let text = ""
  let errorMessage = null
  try {
    const patientInfo = JSON.stringify({
      demographics: {
        age: patientData.date_of_birth ? calculateAge(patientData.date_of_birth) : "Unknown",
        gender: patientData.gender || "Unknown",
      },
      medicalHistory: patientData.medical_history || "None documented",
      medications: patientData.medications || "None documented",
      allergies: patientData.allergies || "None documented",
      careNeeds: patientData.care_needs || "None documented",
    })

    const { text: generatedText } = await generateText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      prompt: `You are an AI clinical decision support system for healthcare professionals. 
     
     Analyze the following patient information and provide:
     1. Key clinical insights
     2. Potential risks or concerns
     3. Evidence-based recommendations
     4. Suggested monitoring parameters
     5. Considerations for care planning
     
     Format your response in clear sections with bullet points where appropriate.
     
     Patient information: ${patientInfo}`,
      maxTokens: 1500,
    })
    text = generatedText
    success = true
  } catch (error: any) {
    console.error("Error in clinical decision support:", error)
    errorMessage = error.message
    await logError({
      message: `Clinical decision support error: ${error.message}`,
      stack: error.stack,
      componentPath: "lib/ai/groq-client.ts:getClinicalDecisionSupport",
      severity: "high",
    })
    return {
      success: false,
      text: "I'm sorry, I couldn't generate clinical decision support at the moment. Please try again later.",
    }
  } finally {
    const endTime = Date.now()
    const executionTimeMs = endTime - startTime
    await sql`
      INSERT INTO ai_tool_analytics (tenant_id, user_id, tool_name, input_text, output_text, execution_time_ms, success, error_message)
      VALUES (
        'ba367cfe-6de0-4180-9566-1002b75cf82c',
        '18c25ac5-1e96-49f8-9eac-26dc1771230f',
        'getClinicalDecisionSupport',
        ${patientInfo},
        ${text},
        ${executionTimeMs},
        ${success},
        ${errorMessage}
      )
    `
  }
  return { success, text }
}

// Medication Interaction Checker
export async function checkMedicationInteractions(medications: string[]) {
  const startTime = Date.now()
  let success = false
  let text = ""
  let errorMessage = null
  try {
    const medicationList = medications.join(", ")

    const { text: generatedText } = await generateText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      prompt: `You are a medication interaction checker for healthcare professionals.
     
     Analyze the following list of medications and identify:
     1. Potential drug-drug interactions
     2. Severity of each interaction (mild, moderate, severe)
     3. Brief explanation of the mechanism of interaction
     4. Recommendations for managing the interaction
     
     Format your response in clear sections with a table-like structure for the interactions.
     
     Medications: ${medicationList}`,
      maxTokens: 1500,
    })
    text = generatedText
    success = true
  } catch (error: any) {
    console.error("Error in medication interaction check:", error)
    errorMessage = error.message
    await logError({
      message: `Medication interaction check error: ${error.message}`,
      stack: error.stack,
      componentPath: "lib/ai/groq-client.ts:checkMedicationInteractions",
      severity: "high",
    })
    return {
      success: false,
      text: "I'm sorry, I couldn't check medication interactions at the moment. Please try again later.",
    }
  } finally {
    const endTime = Date.now()
    const executionTimeMs = endTime - startTime
    await sql`
      INSERT INTO ai_tool_analytics (tenant_id, user_id, tool_name, input_text, output_text, execution_time_ms, success, error_message)
      VALUES (
        'ba367cfe-6de0-4180-9566-1002b75cf82c',
        '18c25ac5-1e96-49f8-9eac-26dc1771230f',
        'checkMedicationInteractions',
        ${medications.join(",")},
        ${text},
        ${executionTimeMs},
        ${success},
        ${errorMessage}
      )
    `
  }
  return { success, text }
}

// Care Plan Generator
export async function generateCarePlan(patientData: any) {
  const startTime = Date.now()
  let success = false
  let text = ""
  let errorMessage = null
  try {
    const patientInfo = JSON.stringify({
      demographics: {
        age: patientData.date_of_birth ? calculateAge(patientData.date_of_birth) : "Unknown",
        gender: patientData.gender || "Unknown",
      },
      medicalHistory: patientData.medical_history || "None documented",
      medications: patientData.medications || "None documented",
      allergies: patientData.allergies || "None documented",
      careNeeds: patientData.care_needs || "None documented",
      currentConditions: patientData.conditions || "None documented",
    })

    const { text: generatedText } = await generateText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      prompt: `You are an AI care plan generator for healthcare professionals.
     
     Based on the following patient information, generate a comprehensive care plan that includes:
     1. Primary care goals
     2. Specific interventions and treatments
     3. Monitoring requirements
     4. Education needs
     5. Expected outcomes
     6. Timeline for review
     
     Format your response in clear sections with actionable items.
     
     Patient information: ${patientInfo}`,
      maxTokens: 2000,
    })
    text = generatedText
    success = true
  } catch (error: any) {
    console.error("Error in care plan generation:", error)
    errorMessage = error.message
    await logError({
      message: `Care plan generation error: ${error.message}`,
      stack: error.stack,
      componentPath: "lib/ai/groq-client.ts:generateCarePlan",
      severity: "high",
    })
    return {
      success: false,
      text: "I'm sorry, I couldn't generate a care plan at the moment. Please try again later.",
    }
  } finally {
    const endTime = Date.now()
    const executionTimeMs = endTime - startTime
    await sql`
      INSERT INTO ai_tool_analytics (tenant_id, user_id, tool_name, input_text, output_text, execution_time_ms, success, error_message)
      VALUES (
        'ba367cfe-6de0-4180-9566-1002b75cf82c',
        '18c25ac5-1e96-49f8-9eac-26dc1771230f',
        'generateCarePlan',
        ${patientInfo},
        ${text},
        ${executionTimeMs},
        ${success},
        ${errorMessage}
      )
    `
  }
  return { success, text }
}

// NEW: Treatment Protocol Generator
export async function generateTreatmentProtocol(params: {
  condition: string
  patientDetails?: string
  protocolType?: string
  patientId?: string
}) {
  const startTime = Date.now()
  let success = false
  let text = ""
  let errorMessage = null
  try {
    const { condition, patientDetails, protocolType = "standard", patientId } = params

    let promptTemplate = `You are an AI treatment protocol generator for healthcare professionals.
   
   Generate a detailed ${protocolType} treatment protocol for ${condition}.`

    if (patientDetails) {
      promptTemplate += `

Consider these patient-specific details: ${patientDetails}`
    }

    promptTemplate += `

Your protocol should include:
   1. Initial assessment and diagnostics
   2. First-line treatments and interventions
   3. Monitoring parameters and frequency
   4. Criteria for treatment adjustment
   5. Follow-up schedule
   6. Potential complications and management
   7. Patient education points
   
   Format your response in clear sections with numbered steps where appropriate.`

    const { text: generatedText } = await generateText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      prompt: promptTemplate,
      maxTokens: 2000,
    })
    text = generatedText
    success = true
  } catch (error: any) {
    console.error("Error in treatment protocol generation:", error)
    errorMessage = error.message
    await logError({
      message: `Treatment protocol generation error: ${error.message}`,
      stack: error.stack,
      componentPath: "lib/ai/groq-client.ts:generateTreatmentProtocol",
      severity: "high",
    })
    return {
      success: false,
      text: "I'm sorry, I couldn't generate a treatment protocol at the moment. Please try again later.",
    }
  } finally {
    const endTime = Date.now()
    const executionTimeMs = endTime - startTime
    await sql`
      INSERT INTO ai_tool_analytics (tenant_id, user_id, tool_name, input_text, output_text, execution_time_ms, success, error_message)
      VALUES (
        'ba367cfe-6de0-4180-9566-1002b75cf82c',
        '18c25ac5-1e96-49f8-9eac-26dc1771230f',
        'generateTreatmentProtocol',
        ${condition},
        ${text},
        ${executionTimeMs},
        ${success},
        ${errorMessage}
      )
    `
  }
  return { success, text }
}

// Helper function to calculate age from date of birth
function calculateAge(dateOfBirth: string | Date): number {
  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const month = today.getMonth() - birthDate.getMonth()
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}
