import { useTenant } from "@/contexts"

const AppointmentsPage = () => {
  const { tenant } = useTenant()

  return (
    <div>
      <h1>Appointments</h1>
      {tenant ? <p>Tenant ID: {tenant.id}</p> : <p>No tenant found.</p>}
    </div>
  )
}

export default AppointmentsPage
