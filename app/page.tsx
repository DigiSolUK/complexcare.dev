"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Use a timeout to ensure the component is mounted before navigation
    const timer = setTimeout(() => {
      router.push("/dashboard")
    }, 100)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <h1 className="text-2xl font-bold">ComplexCare CRM</h1>
            <p className="text-center text-muted-foreground">Loading the dashboard...</p>
            <Button onClick={() => router.push("/dashboard")} className="mt-4">
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
