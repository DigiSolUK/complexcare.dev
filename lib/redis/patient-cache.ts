import { redis, safeRedisOperation } from "./client"

const PATIENT_CACHE_PREFIX = "patient:"
const PATIENT_LIST_KEY = "patients:list"
const PATIENT_COUNT_KEY = "patients:count"
const DEFAULT_TTL = 60 * 60 // 1 hour in seconds

export class PatientCache {
  /**
   * Get a patient by ID from cache
   */
  static async getPatient(id: string) {
    return safeRedisOperation(async () => {
      const cacheKey = `${PATIENT_CACHE_PREFIX}${id}`
      return await redis.get(cacheKey)
    }, null)
  }

  /**
   * Set a patient in cache
   */
  static async setPatient(id: string, patient: any) {
    return safeRedisOperation(async () => {
      const cacheKey = `${PATIENT_CACHE_PREFIX}${id}`
      return await redis.set(cacheKey, patient, { ex: DEFAULT_TTL })
    }, null)
  }

  /**
   * Delete a patient from cache
   */
  static async deletePatient(id: string) {
    return safeRedisOperation(async () => {
      const cacheKey = `${PATIENT_CACHE_PREFIX}${id}`
      await redis.del(cacheKey)
      // Also invalidate the list cache when a patient is deleted
      await this.invalidatePatientList()
      return true
    }, false)
  }

  /**
   * Get all patients from cache
   */
  static async getAllPatients() {
    return safeRedisOperation(async () => {
      return await redis.get(PATIENT_LIST_KEY)
    }, null)
  }

  /**
   * Set all patients in cache
   */
  static async setAllPatients(patients: any[]) {
    return safeRedisOperation(async () => {
      await redis.set(PATIENT_LIST_KEY, patients, { ex: DEFAULT_TTL })
      // Also update the count cache
      await redis.set(PATIENT_COUNT_KEY, patients.length, { ex: DEFAULT_TTL })
      return true
    }, false)
  }

  /**
   * Invalidate the patient list cache
   */
  static async invalidatePatientList() {
    return safeRedisOperation(async () => {
      await redis.del(PATIENT_LIST_KEY)
      await redis.del(PATIENT_COUNT_KEY)
      return true
    }, false)
  }

  /**
   * Get patient count from cache
   */
  static async getPatientCount() {
    return safeRedisOperation(async () => {
      return await redis.get(PATIENT_COUNT_KEY)
    }, null)
  }

  /**
   * Set patient count in cache
   */
  static async setPatientCount(count: number) {
    return safeRedisOperation(async () => {
      await redis.set(PATIENT_COUNT_KEY, count, { ex: DEFAULT_TTL })
      return true
    }, false)
  }
}
