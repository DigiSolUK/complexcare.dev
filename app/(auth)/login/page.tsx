import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Welcome to ComplexCare CRM</h2>
        <p className="mt-2 text-center text-sm text-gray-600">Demo Mode - No Login Required</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <div className="flex flex-col space-y-4">
            <Link href="/dashboard" className="w-full">
              <Button className="w-full">Enter Demo Mode</Button>
            </Link>
            <p className="text-center text-sm text-gray-500">No authentication required in demo mode</p>
          </div>
        </div>
      </div>
    </div>
  )
}

