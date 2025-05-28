import { sql } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

export interface TelemedicineSession {
  id: string
  tenant_id: string
  appointment_id?: string
  patient_id: string
  care_professional_id: string
  session_token: string
  status: string
  scheduled_start_time: Date
  actual_start_time?: Date
  end_time?: Date
  duration_minutes?: number
  notes?: string
  recording_url?: string
  created_at: Date
  updated_at: Date
}

export interface SessionParticipant {
  id: string
  tenant_id: string
  session_id: string
  user_id: string
  user_type: string
  join_time?: Date
  leave_time?: Date
  connection_quality?: string
  device_info?: any
  created_at: Date
}

export const telemedicineService = {
  // Create a new telemedicine session
  async createSession(
    sessionData: Omit<TelemedicineSession, "id" | "session_token" | "created_at" | "updated_at">,
    tenantId: string = DEFAULT_TENANT_ID,
  ): Promise<TelemedicineSession> {
    const sessionId = uuidv4()
    const sessionToken = uuidv4() // In a real implementation, this would be a secure token

    const result = await sql`
      INSERT INTO telemedicine_sessions (
        id, tenant_id, appointment_id, patient_id, care_professional_id,
        session_token, status, scheduled_start_time, created_at, updated_at
      ) VALUES (
        ${sessionId}, ${tenantId}, ${sessionData.appointment_id || null}, 
        ${sessionData.patient_id}, ${sessionData.care_professional_id},
        ${sessionToken}, ${sessionData.status || "scheduled"}, 
        ${sessionData.scheduled_start_time}, NOW(), NOW()
      )
      RETURNING *
    `

    return result[0]
  },

  // Get session by ID
  async getSessionById(sessionId: string, tenantId: string = DEFAULT_TENANT_ID): Promise<TelemedicineSession | null> {
    const result = await sql`
      SELECT * FROM telemedicine_sessions
      WHERE id = ${sessionId} AND tenant_id = ${tenantId}
    `

    return result[0] || null
  },

  // Get session by token (for joining a session)
  async getSessionByToken(token: string): Promise<TelemedicineSession | null> {
    const result = await sql`
      SELECT * FROM telemedicine_sessions
      WHERE session_token = ${token}
    `

    return result[0] || null
  },

  // Get upcoming sessions for a patient
  async getPatientUpcomingSessions(
    patientId: string,
    tenantId: string = DEFAULT_TENANT_ID,
  ): Promise<TelemedicineSession[]> {
    return await sql`
      SELECT ts.*, cp.name as care_professional_name, cp.specialty
      FROM telemedicine_sessions ts
      JOIN care_professionals cp ON ts.care_professional_id = cp.id
      WHERE ts.tenant_id = ${tenantId}
      AND ts.patient_id = ${patientId}
      AND ts.status IN ('scheduled', 'ready')
      AND ts.scheduled_start_time > NOW()
      ORDER BY ts.scheduled_start_time ASC
    `
  },

  // Get upcoming sessions for a care professional
  async getCareProUpcomingSessions(
    careProId: string,
    tenantId: string = DEFAULT_TENANT_ID,
  ): Promise<TelemedicineSession[]> {
    return await sql`
      SELECT ts.*, p.first_name, p.last_name, p.date_of_birth
      FROM telemedicine_sessions ts
      JOIN patients p ON ts.patient_id = p.id
      WHERE ts.tenant_id = ${tenantId}
      AND ts.care_professional_id = ${careProId}
      AND ts.status IN ('scheduled', 'ready')
      AND ts.scheduled_start_time > NOW()
      ORDER BY ts.scheduled_start_time ASC
    `
  },

  // Update session status
  async updateSessionStatus(
    sessionId: string,
    status: string,
    tenantId: string = DEFAULT_TENANT_ID,
  ): Promise<TelemedicineSession | null> {
    const result = await sql`
      UPDATE telemedicine_sessions
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${sessionId} AND tenant_id = ${tenantId}
      RETURNING *
    `

    return result[0] || null
  },

  // Start a session
  async startSession(sessionId: string, tenantId: string = DEFAULT_TENANT_ID): Promise<TelemedicineSession | null> {
    const result = await sql`
      UPDATE telemedicine_sessions
      SET status = 'in_progress', actual_start_time = NOW(), updated_at = NOW()
      WHERE id = ${sessionId} AND tenant_id = ${tenantId}
      RETURNING *
    `

    return result[0] || null
  },

  // End a session
  async endSession(
    sessionId: string,
    notes?: string,
    tenantId: string = DEFAULT_TENANT_ID,
  ): Promise<TelemedicineSession | null> {
    const now = new Date()

    const session = await this.getSessionById(sessionId, tenantId)
    if (!session || !session.actual_start_time) {
      return null
    }

    // Calculate duration in minutes
    const durationMinutes = Math.round((now.getTime() - session.actual_start_time.getTime()) / 60000)

    const result = await sql`
      UPDATE telemedicine_sessions
      SET 
        status = 'completed', 
        end_time = ${now}, 
        duration_minutes = ${durationMinutes},
        notes = COALESCE(${notes}, notes),
        updated_at = NOW()
      WHERE id = ${sessionId} AND tenant_id = ${tenantId}
      RETURNING *
    `

    return result[0] || null
  },

  // Record participant joining
  async recordParticipantJoin(
    sessionId: string,
    userId: string,
    userType: string,
    deviceInfo: any,
    tenantId: string = DEFAULT_TENANT_ID,
  ): Promise<SessionParticipant> {
    const participantId = uuidv4()

    const result = await sql`
      INSERT INTO telemedicine_session_participants (
        id, tenant_id, session_id, user_id, user_type,
        join_time, device_info, created_at
      ) VALUES (
        ${participantId}, ${tenantId}, ${sessionId}, ${userId}, ${userType},
        NOW(), ${JSON.stringify(deviceInfo)}, NOW()
      )
      RETURNING *
    `

    return result[0]
  },

  // Record participant leaving
  async recordParticipantLeave(
    participantId: string,
    connectionQuality: string,
    tenantId: string = DEFAULT_TENANT_ID,
  ): Promise<void> {
    await sql`
      UPDATE telemedicine_session_participants
      SET leave_time = NOW(), connection_quality = ${connectionQuality}
      WHERE id = ${participantId} AND tenant_id = ${tenantId}
    `
  },

  // Get session participants
  async getSessionParticipants(sessionId: string, tenantId: string = DEFAULT_TENANT_ID): Promise<SessionParticipant[]> {
    return await sql`
      SELECT * FROM telemedicine_session_participants
      WHERE session_id = ${sessionId} AND tenant_id = ${tenantId}
      ORDER BY created_at ASC
    `
  },
}
