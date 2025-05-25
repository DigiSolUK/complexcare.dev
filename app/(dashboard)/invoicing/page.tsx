import { useTenant } from "@/contexts"

const InvoicingPage = () => {
  const { tenant } = useTenant()

  return (
    <div>
      <h1>Invoicing</h1>
      {tenant ? <p>Tenant ID: {tenant.id}</p> : <p>No tenant found.</p>}
    </div>
  )
}

export default InvoicingPage
