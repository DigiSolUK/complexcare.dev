import { useTenant } from "@/contexts"

const SettingsPage = () => {
  const { tenant } = useTenant()

  return (
    <div>
      <h1>Settings</h1>
      <p>Tenant ID: {tenant?.id}</p>
      {/* Add your settings components here */}
    </div>
  )
}

export default SettingsPage
