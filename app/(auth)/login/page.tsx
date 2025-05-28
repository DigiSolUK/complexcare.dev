import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PublicModeBanner } from "@/components/public-mode-banner"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Welcome to ComplexCare CRM</h2>
        <p className="mt-2 text-center text-sm text-gray-600">Public Mode - No Login Required</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Public Access Mode</CardTitle>
            <CardDescription>
              The system is running in public mode. All features are accessible without authentication.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PublicModeBanner />
            <div className="flex flex-col space-y-4 mt-4">
              <Link href="/dashboard" className="w-full">
                <Button className="w-full">Enter Dashboard</Button>
              </Link>
              <Link href="/patients" className="w-full">
                <Button className="w-full" variant="outline">
                  View Patients
                </Button>
              </Link>
              <Link href="/care-professionals" className="w-full">
                <Button className="w-full" variant="outline">
                  View Care Professionals
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
