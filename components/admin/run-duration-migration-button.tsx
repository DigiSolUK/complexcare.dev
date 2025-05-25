"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function RunDurationMigrationButton() {
  const [isLoading, setIsLoading] = useState(false)

  const runMigration = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/migrations/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dryRun: false }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to run migration")
      }

      const result = await response.json()

      toast({
        title: "Migration Successful",
        description: "The duration column has been added to the appointments table.",
      })

      // Refresh the page to see the changes
      window.location.reload()
    } catch (error) {
      console.error("Migration failed:", error)
      toast({
        variant: "destructive",
        title: "Migration Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={runMigration} disabled={isLoading}>
      <Clock className="mr-2 h-4 w-4" />
      {isLoading ? "Adding Duration Column..." : "Add Duration Column to Appointments"}
    </Button>
  )
}
