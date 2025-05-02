import { type NextRequest, NextResponse } from "next/server"
import { redis } from "@/lib/redis/client"
import { getCurrentTenant } from "@/lib/tenant"
import { PatientService } from "@/lib/services/patient-service"

export async function GET(request: NextRequest) {
  try {
    const tenantId = getCurrentTenant()

    // Get cache info
    const patientKeysCount = await redis.keys("patient:*").then((keys) => keys.length)

    // Get database count for comparison
    const dbCount = await PatientService.getPatientCount(tenantId)

    // Get cache memory usage
    const memoryInfo = await redis.info("memory")

    return NextResponse.json({
      cacheStats: {
        patientKeysInCache: patientKeysCount,
        patientsInDatabase: dbCount,
        cacheHitRatio: patientKeysCount > 0 ? patientKeysCount / dbCount : 0,
        memoryInfo,
      },
    })
  } catch (error) {
    console.error("Error fetching cache stats:", error)
    return NextResponse.json({ error: "Failed to fetch cache statistics" }, { status: 500 })
  }
}

// Endpoint to manually warm up the cache
export async function POST(request: NextRequest) {
  try {
    const tenantId = getCurrentTenant()

    // Warm up the cache
    const cachedCount = await PatientService.warmupPatientCache(tenantId)

    return NextResponse.json({
      success: true,
      message: `Cache warmed up with ${cachedCount} patients`,
    })
  } catch (error) {
    console.error("Error warming up cache:", error)
    return NextResponse.json({ error: "Failed to warm up cache" }, { status: 500 })
  }
}

// Endpoint to clear the cache
export async function DELETE(request: NextRequest) {
  try {
    await PatientService.clearAllPatientCaches()

    return NextResponse.json({
      success: true,
      message: "Patient cache cleared successfully",
    })
  } catch (error) {
    console.error("Error clearing cache:", error)
    return NextResponse.json({ error: "Failed to clear cache" }, { status: 500 })
  }
}
