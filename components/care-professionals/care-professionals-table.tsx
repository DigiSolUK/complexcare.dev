import { useTenant } from "@/contexts"

const CareProfessionalsTable = () => {
  // Placeholder for table logic and data fetching
  const { tenantId } = useTenant()

  return (
    <div>
      <h2>Care Professionals Table</h2>
      <p>Tenant ID: {tenantId}</p>
      {/* Table content will go here */}
    </div>
  )
}

export default CareProfessionalsTable
