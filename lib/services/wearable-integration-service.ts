import { neon } from "@neondatabase/serverless"
import { logError } from "./error-logging-service"
import { DEFAULT_TENANT_ID } from "../tenant"

export interface WearableDevice {
  id: string
  tenant_id: string
  patient_id: string
  device_type: WearableDeviceType
  device_id: string
  manufacturer: string
  model: string
  status: "active" | "inactive" | "disconnected"
  last_sync: Date | null
  connection_details: WearableConnectionDetails
  created_at: Date
  updated_at: Date
}

export enum WearableDeviceType {
  FITBIT = "fitbit",
  APPLE_WATCH = "apple_watch",
  SAMSUNG_GALAXY_WATCH = "samsung_galaxy_watch",
  GARMIN = "garmin",
  WITHINGS = "withings",
  GOOGLE_FIT = "google_fit",
  CUSTOM = "custom",
}

export interface WearableConnectionDetails {
  api_key?: string
  api_secret?: string
  oauth_token?: string
  oauth_refresh_token?: string
  oauth_expires_at?: Date
  webhook_url?: string
  additional_settings?: Record<string, any>
}

export interface WearableReading {
  id: string
  tenant_id: string
  patient_id: string
  device_id: string
  reading_type: WearableReadingType
  reading_value: number
  reading_unit: string
  timestamp: Date
  metadata: Record<string, any>
  created_at: Date
}

export enum WearableReadingType {
  HEART_RATE = "heart_rate",
  STEPS = "steps",
  SLEEP = "sleep",
  BLOOD_PRESSURE = "blood_pressure",
  BLOOD_OXYGEN = "blood_oxygen",
  TEMPERATURE = "temperature",
  WEIGHT = "weight",
  ACTIVITY = "activity",
  CALORIES = "calories",
  CUSTOM = "custom",
}

export interface WearableIntegrationSettings {
  id: string
  tenant_id: string
  provider: WearableDeviceType
  is_enabled: boolean
  api_key?: string
  api_secret?: string
  oauth_client_id?: string
  oauth_client_secret?: string
  webhook_secret?: string
  additional_settings?: Record<string, any>
  created_at: Date
  updated_at: Date
}

export class WearableIntegrationService {
  /**
   * Get all wearable integration settings for a tenant
   */
  static async getIntegrationSettings(tenantId: string): Promise<WearableIntegrationSettings[]> {
    try {
      const sql = neon(process.env.DATABASE_URL || "")
      const result = await sql`
        SELECT * FROM wearable_integration_settings 
        WHERE tenant_id = ${tenantId}
        ORDER BY provider ASC
      `
      return result
    } catch (error) {
      logError({
        message: `Error fetching wearable integration settings: ${error}`,
        stack: (error as Error).stack,
        componentPath: "lib/services/wearable-integration-service.ts:getIntegrationSettings",
        severity: "medium",
      })
      return []
    }
  }

  /**
   * Get integration settings for a specific provider
   */
  static async getProviderSettings(
    tenantId: string,
    provider: WearableDeviceType,
  ): Promise<WearableIntegrationSettings | null> {
    try {
      const sql = neon(process.env.DATABASE_URL || "")
      const result = await sql`
        SELECT * FROM wearable_integration_settings 
        WHERE tenant_id = ${tenantId} AND provider = ${provider}
        LIMIT 1
      `
      return result.length > 0 ? result[0] : null
    } catch (error) {
      logError({
        message: `Error fetching provider settings: ${error}`,
        stack: (error as Error).stack,
        componentPath: "lib/services/wearable-integration-service.ts:getProviderSettings",
        severity: "medium",
      })
      return null
    }
  }

  /**
   * Save or update integration settings for a provider
   */
  static async saveIntegrationSettings(
    settings: Partial<WearableIntegrationSettings>,
  ): Promise<WearableIntegrationSettings | null> {
    try {
      const sql = neon(process.env.DATABASE_URL || "")

      // Check if settings already exist for this provider and tenant
      const existingSettings = await this.getProviderSettings(
        settings.tenant_id || DEFAULT_TENANT_ID,
        settings.provider as WearableDeviceType,
      )

      if (existingSettings) {
        // Update existing settings
        const result = await sql`
          UPDATE wearable_integration_settings
          SET 
            is_enabled = ${settings.is_enabled ?? existingSettings.is_enabled},
            api_key = ${settings.api_key ?? existingSettings.api_key},
            api_secret = ${settings.api_secret ?? existingSettings.api_secret},
            oauth_client_id = ${settings.oauth_client_id ?? existingSettings.oauth_client_id},
            oauth_client_secret = ${settings.oauth_client_secret ?? existingSettings.oauth_client_secret},
            webhook_secret = ${settings.webhook_secret ?? existingSettings.webhook_secret},
            additional_settings = ${settings.additional_settings ? JSON.stringify(settings.additional_settings) : existingSettings.additional_settings},
            updated_at = NOW()
          WHERE id = ${existingSettings.id}
          RETURNING *
        `
        return result[0]
      } else {
        // Create new settings
        const result = await sql`
          INSERT INTO wearable_integration_settings (
            tenant_id, 
            provider, 
            is_enabled, 
            api_key, 
            api_secret, 
            oauth_client_id, 
            oauth_client_secret, 
            webhook_secret, 
            additional_settings,
            created_at,
            updated_at
          ) VALUES (
            ${settings.tenant_id || DEFAULT_TENANT_ID},
            ${settings.provider},
            ${settings.is_enabled || false},
            ${settings.api_key},
            ${settings.api_secret},
            ${settings.oauth_client_id},
            ${settings.oauth_client_secret},
            ${settings.webhook_secret},
            ${settings.additional_settings ? JSON.stringify(settings.additional_settings) : null},
            NOW(),
            NOW()
          )
          RETURNING *
        `
        return result[0]
      }
    } catch (error) {
      logError({
        message: `Error saving wearable integration settings: ${error}`,
        stack: (error as Error).stack,
        componentPath: "lib/services/wearable-integration-service.ts:saveIntegrationSettings",
        severity: "high",
      })
      return null
    }
  }

  /**
   * Register a new wearable device for a patient
   */
  static async registerDevice(device: Partial<WearableDevice>): Promise<WearableDevice | null> {
    try {
      const sql = neon(process.env.DATABASE_URL || "")

      const result = await sql`
        INSERT INTO wearable_devices (
          tenant_id,
          patient_id,
          device_type,
          device_id,
          manufacturer,
          model,
          status,
          connection_details,
          created_at,
          updated_at
        ) VALUES (
          ${device.tenant_id || DEFAULT_TENANT_ID},
          ${device.patient_id},
          ${device.device_type},
          ${device.device_id},
          ${device.manufacturer},
          ${device.model},
          ${device.status || "inactive"},
          ${device.connection_details ? JSON.stringify(device.connection_details) : {}},
          NOW(),
          NOW()
        )
        RETURNING *
      `
      return result[0]
    } catch (error) {
      logError({
        message: `Error registering wearable device: ${error}`,
        stack: (error as Error).stack,
        componentPath: "lib/services/wearable-integration-service.ts:registerDevice",
        severity: "medium",
      })
      return null
    }
  }

  /**
   * Get all devices for a patient
   */
  static async getPatientDevices(patientId: string, tenantId: string): Promise<WearableDevice[]> {
    try {
      const sql = neon(process.env.DATABASE_URL || "")
      const result = await sql`
        SELECT * FROM wearable_devices
        WHERE patient_id = ${patientId} AND tenant_id = ${tenantId}
        ORDER BY created_at DESC
      `
      return result
    } catch (error) {
      logError({
        message: `Error fetching patient devices: ${error}`,
        stack: (error as Error).stack,
        componentPath: "lib/services/wearable-integration-service.ts:getPatientDevices",
        severity: "medium",
      })
      return []
    }
  }

  /**
   * Store a wearable reading
   */
  static async storeReading(reading: Partial<WearableReading>): Promise<WearableReading | null> {
    try {
      const sql = neon(process.env.DATABASE_URL || "")

      const result = await sql`
        INSERT INTO wearable_readings (
          tenant_id,
          patient_id,
          device_id,
          reading_type,
          reading_value,
          reading_unit,
          timestamp,
          metadata,
          created_at
        ) VALUES (
          ${reading.tenant_id || DEFAULT_TENANT_ID},
          ${reading.patient_id},
          ${reading.device_id},
          ${reading.reading_type},
          ${reading.reading_value},
          ${reading.reading_unit},
          ${reading.timestamp || new Date()},
          ${reading.metadata ? JSON.stringify(reading.metadata) : {}},
          NOW()
        )
        RETURNING *
      `
      return result[0]
    } catch (error) {
      logError({
        message: `Error storing wearable reading: ${error}`,
        stack: (error as Error).stack,
        componentPath: "lib/services/wearable-integration-service.ts:storeReading",
        severity: "medium",
      })
      return null
    }
  }

  /**
   * Get readings for a patient
   */
  static async getPatientReadings(
    patientId: string,
    tenantId: string,
    options: {
      readingType?: WearableReadingType
      startDate?: Date
      endDate?: Date
      limit?: number
    } = {},
  ): Promise<WearableReading[]> {
    try {
      const sql = neon(process.env.DATABASE_URL || "")

      let query = `
        SELECT * FROM wearable_readings
        WHERE patient_id = $1 AND tenant_id = $2
      `

      const params: any[] = [patientId, tenantId]
      let paramIndex = 3

      if (options.readingType) {
        query += ` AND reading_type = $${paramIndex++}`
        params.push(options.readingType)
      }

      if (options.startDate) {
        query += ` AND timestamp >= $${paramIndex++}`
        params.push(options.startDate)
      }

      if (options.endDate) {
        query += ` AND timestamp <= $${paramIndex++}`
        params.push(options.endDate)
      }

      query += ` ORDER BY timestamp DESC`

      if (options.limit) {
        query += ` LIMIT $${paramIndex++}`
        params.push(options.limit)
      }

      const result = await sql.query(query, params)
      return result.rows
    } catch (error) {
      logError({
        message: `Error fetching patient readings: ${error}`,
        stack: (error as Error).stack,
        componentPath: "lib/services/wearable-integration-service.ts:getPatientReadings",
        severity: "medium",
      })
      return []
    }
  }

  /**
   * Get the latest reading of a specific type for a patient
   */
  static async getLatestReading(
    patientId: string,
    tenantId: string,
    readingType: WearableReadingType,
  ): Promise<WearableReading | null> {
    try {
      const sql = neon(process.env.DATABASE_URL || "")

      const result = await sql`
        SELECT * FROM wearable_readings
        WHERE 
          patient_id = ${patientId} AND 
          tenant_id = ${tenantId} AND
          reading_type = ${readingType}
        ORDER BY timestamp DESC
        LIMIT 1
      `

      return result.length > 0 ? result[0] : null
    } catch (error) {
      logError({
        message: `Error fetching latest reading: ${error}`,
        stack: (error as Error).stack,
        componentPath: "lib/services/wearable-integration-service.ts:getLatestReading",
        severity: "medium",
      })
      return null
    }
  }
}

// Export functions for use in API routes
export async function getWearableIntegrationSettings(tenantId: string) {
  return WearableIntegrationService.getIntegrationSettings(tenantId)
}

export async function getWearableProviderSettings(tenantId: string, provider: WearableDeviceType) {
  return WearableIntegrationService.getProviderSettings(tenantId, provider)
}

export async function saveWearableIntegrationSettings(settings: Partial<WearableIntegrationSettings>) {
  return WearableIntegrationService.saveIntegrationSettings(settings)
}

export async function registerWearableDevice(device: Partial<WearableDevice>) {
  return WearableIntegrationService.registerDevice(device)
}

export async function getPatientWearableDevices(patientId: string, tenantId: string) {
  return WearableIntegrationService.getPatientDevices(patientId, tenantId)
}

export async function storeWearableReading(reading: Partial<WearableReading>) {
  return WearableIntegrationService.storeReading(reading)
}

export async function getPatientWearableReadings(
  patientId: string,
  tenantId: string,
  options?: {
    readingType?: WearableReadingType
    startDate?: Date
    endDate?: Date
    limit?: number
  },
) {
  return WearableIntegrationService.getPatientReadings(patientId, tenantId, options)
}

export async function getLatestWearableReading(patientId: string, tenantId: string, readingType: WearableReadingType) {
  return WearableIntegrationService.getLatestReading(patientId, tenantId, readingType)
}
