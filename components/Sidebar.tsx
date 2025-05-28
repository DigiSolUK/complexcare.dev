import type React from "react"
import { useTenant } from "@/contexts"

const Sidebar: React.FC = () => {
  // Example usage of the tenant context
  const { tenant } = useTenant()

  return (
    <aside className="bg-gray-100 w-64 p-4">
      <h2 className="text-lg font-semibold mb-4">Sidebar</h2>
      {tenant && <p>Current Tenant: {tenant.name}</p>}
      <ul>
        <li>
          <a href="#" className="block py-2 hover:bg-gray-200">
            Dashboard
          </a>
        </li>
        <li>
          <a href="#" className="block py-2 hover:bg-gray-200">
            Products
          </a>
        </li>
        <li>
          <a href="#" className="block py-2 hover:bg-gray-200">
            Customers
          </a>
        </li>
        <li>
          <a href="#" className="block py-2 hover:bg-gray-200">
            Settings
          </a>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar
