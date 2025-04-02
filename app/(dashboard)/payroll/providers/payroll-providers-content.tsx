import { getPayrollProviders } from "@/lib/services/payroll-provider-service"
import { PayrollProvidersClient } from "./payroll-providers-client"

export async function PayrollProvidersContent() {
  // Fetch providers on the server
  const providers = await getPayrollProviders()

  return <PayrollProvidersClient initialProviders={providers} />
}

