import { useTenant } from "@/contexts"

const DashboardHeader = () => {
  const tenant = useTenant()

  return (
    <header>
      <h1>Dashboard Header</h1>
      {tenant && <p>Tenant: {tenant.name}</p>}
    </header>
  )
}

export default DashboardHeader
