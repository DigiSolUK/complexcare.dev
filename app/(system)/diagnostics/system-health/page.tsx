import SystemHealthClient from "./system-health-client"

export const metadata = {
  title: "System Health Dashboard",
}

export default function SystemHealthPage() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">System Health Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Overview of system status and diagnostic checks.
        </p>
      </header>
      <SystemHealthClient />
    </div>
  )
}
