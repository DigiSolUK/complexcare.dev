"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, RefreshCcw, Home } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PatientDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Patient detail error:", error)
  }, [error])

  return (
    <div className="container mx-auto py-6 px-4">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Something went wrong!</h2>
            <p className="text-red-500 mb-4">
              {error.message || "An error occurred while loading the patient details."}
            </p>
            <div className="flex flex-col space-y-2">
              <Button onClick={() => reset()} className="w-full">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Try again
              </Button>
              <Button variant="outline" onClick={() => router.push("/patients")} className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Return to Patients
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
