import { useTenant } from "@/contexts"

const ClinicalNotesList = () => {
  const { tenantId } = useTenant()

  return (
    <div>
      <h2>Clinical Notes</h2>
      {tenantId ? <p>Tenant ID: {tenantId}</p> : <p>No tenant ID available.</p>}
      {/* Add your clinical notes list implementation here */}
    </div>
  )
}

export default ClinicalNotesList
