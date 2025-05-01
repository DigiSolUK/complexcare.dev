import { NextResponse } from "next/server"
import {
  validatePatientsTable,
  countAllPatients,
  getTenantsWithPatients,
  createTestPatient,
} from "@/lib/services/patient-service"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const createTest = url.searchParams.get("createTest") === "true"
  const tenantId = url.searchParams.get("tenantId") || process.env.DEFAULT_TENANT_ID || "demo-tenant"

  const results = {
    tableValidation: await validatePatientsTable(),
    patientCount: await countAllPatients(),
    tenantsWithPatients: await getTenantsWithPatients(),
    testPatient: null as any,
    currentTenantId: tenantId,
  }

  if (createTest) {
    results.testPatient = await createTestPatient(tenantId)
  }

  return NextResponse.json(results)
}
