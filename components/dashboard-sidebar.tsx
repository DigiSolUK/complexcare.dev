import type React from "react"
import { useTenant } from "@/contexts"

const DashboardSidebar: React.FC = () => {
  // Example usage of the tenant context
  const { tenant } = useTenant()

  return (
    <aside className="bg-gray-100 w-64 p-4">
      <h2 className="text-lg font-semibold mb-4">Dashboard Sidebar</h2>
      {tenant && <p>Current Tenant: {tenant.name}</p>}
      <ul>
        <li>
          <a href="#" className="block py-2 px-4 hover:bg-gray-200">
            Overview
          </a>
        </li>
        <li>
          <a href="#" className="block py-2 px-4 hover:bg-gray-200">
            Analytics
          </a>
        </li>
        <li>
          <a href="#" className="block py-2 px-4 hover:bg-gray-200">
            Settings
          </a>
        </li>
      </ul>
    </aside>
  )
}

export default DashboardSidebar
