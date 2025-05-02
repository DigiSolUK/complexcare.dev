export interface WearableDevice {
  id: string
  patientId: string
  deviceType: WearableDeviceType
  deviceId: string
  manufacturer: string
  model: string
  serialNumber: string
  lastSyncDate: Date
  batteryLevel?: number
  status: "active" | "inactive" | "disconnected" | "low_battery"
  connectionDetails: {
    apiKey?: string
    apiEndpoint?: string
    authToken?: string
    refreshToken?: string
    expiresAt?: Date
    settings?: Record<string, any>
  }
  createdAt: Date
  updatedAt: Date
}

export type WearableDeviceType =
  | "fitness_tracker"
  | "smart_watch"
  | "blood_pressure_monitor"
  | "glucose_monitor"
  | "heart_rate_monitor"
  | "pulse_oximeter"
  | "temperature_sensor"
  | "sleep_tracker"
  | "ecg_monitor"
  | "fall_detector"
  | "medication_reminder"
  | "other"

export interface WearableReading {
  id: string
  deviceId: string
  patientId: string
  readingType: WearableReadingType
  value: number | string | object
  unit?: string
  timestamp: Date
  metadata?: Record<string, any>
  createdAt: Date
}

export type WearableReadingType =
  | "heart_rate"
  | "blood_pressure"
  | "blood_glucose"
  | "steps"
  | "sleep"
  | "temperature"
  | "oxygen_saturation"
  | "ecg"
  | "activity"
  | "calories"
  | "fall_detection"
  | "location"
  | "other"

export interface WearableIntegrationSettings {
  id: string
  tenantId: string
  provider: WearableProvider
  isEnabled: boolean
  apiKey?: string
  apiSecret?: string
  apiEndpoint?: string
  webhookUrl?: string
  additionalSettings?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export type WearableProvider =
  | "fitbit"
  | "apple_health"
  | "google_fit"
  | "samsung_health"
  | "garmin"
  | "withings"
  | "dexcom"
  | "omron"
  | "medtronic"
  | "abbott"
  | "other"
