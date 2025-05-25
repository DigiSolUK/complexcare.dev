"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { AlertTriangle } from "lucide-react"

export function RunMigrationButton() {
  const [isRunning, setIsRunning] = useState(false)

  const runMigration = async () => {
    try {
      setIsRunning(true)
      const response = await fetch("/api/admin/migrations/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Migration successful",
          description: data.message,
          variant: "default",
          duration: 5000,
        })
      } else {
        toast({
          title: "Migration failed",
          description: data.message || "An error occurred while running the migration",
          variant: "destructive",
          duration: 5000,
        })
      }
    } catch (error) {
      toast({
        title: "Migration failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <Button onClick={runMigration} disabled={isRunning} variant="outline" className="flex items-center gap-2">
      {isRunning ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Running Migration...
        </>
      ) : (
        <>
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          Run Database Migration
        </>
      )}
    </Button>
  )
}
