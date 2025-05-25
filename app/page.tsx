import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold mb-4">ComplexCare CRM</h1>
        <p className="mb-8">A comprehensive care management system for complex care providers.</p>
        <div className="flex flex-col gap-4">
          <Link href="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Go to Dashboard
          </Link>
          <Link href="/api/health" className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Check API Health
          </Link>
        </div>
      </div>
    </div>
  )
}
