import { useTenant } from "@/contexts"

const ClinicalNotesPage = () => {
  const { tenantId } = useTenant()

  return (
    <div>
      <h1>Clinical Notes</h1>
      {tenantId ? <p>Tenant ID: {tenantId}</p> : <p>No tenant selected.</p>}
      {/* Add your clinical notes functionality here */}
    </div>
  )
}

export default ClinicalNotesPage
