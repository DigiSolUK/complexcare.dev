import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Unauthorized Access</h2>
        <p className="mt-2 text-center text-sm text-gray-600">You do not have permission to access this resource.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <div className="flex flex-col space-y-4">
            <p className="text-center text-sm text-gray-500">
              Please contact your administrator if you believe this is an error.
            </p>
            <Link href="/dashboard" className="w-full">
              <Button className="w-full">Return to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
