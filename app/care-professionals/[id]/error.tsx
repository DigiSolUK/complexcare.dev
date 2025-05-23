"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CareProfessionalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  return (
    <div className="container mx-auto py-8">
      <Card className="mx-auto max-w-4xl">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Something went wrong!</h2>
            <p className="text-gray-600 mb-6">
              We apologize for the inconvenience. Please try again or return to the care professionals list.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={() => reset()}>Try Again</Button>
              <Button variant="outline" onClick={() => router.push("/care-professionals")}>
                Return to List
              </Button>
            </div>
            {process.env.NODE_ENV === "development" && (
              <div className="mt-8 p-4 bg-gray-100 rounded-md text-left w-full">
                <p className="font-mono text-sm text-red-600">{error.message}</p>
                {error.stack && (
                  <pre className="mt-2 text-xs overflow-auto max-h-48 p-2 bg-gray-900 text-gray-200 rounded">
                    {error.stack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
