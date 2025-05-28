import { useTenant } from "@/contexts"

const CareProfessionalsPage = () => {
  const { tenant } = useTenant()

  return (
    <div>
      <h1>Care Professionals</h1>
      {tenant ? <p>Tenant ID: {tenant.id}</p> : <p>No tenant found.</p>}
    </div>
  )
}

export default CareProfessionalsPage
