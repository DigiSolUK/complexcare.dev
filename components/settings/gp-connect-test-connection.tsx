/**
 * GP Connect Test Connection Component
 *
 * This component provides a form for testing the GP Connect integration.
 * It allows users to enter an NHS number and test the connection to GP Connect.
 */

"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

// Form schema with validation
const formSchema = z.object({
  nhsNumber: z.string().regex(/^\d{10}$/, "NHS number must be 10 digits"),
})

type FormValues = z.infer<typeof formSchema>

export function GPConnectTestConnection() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nhsNumber: "9000000009", // Default to a test NHS number
    },
  })

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    setTestResult(null)
    setErrorMessage(null)

    try {
      // In a real implementation, this would test the connection to GP Connect
      // For now, we'll simulate a network delay and success
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Fetch from our API endpoint
      const response = await fetch(`/api/gp-connect/${data.nhsNumber}`)

      if (!response.ok) {
        throw new Error(`Failed to connect to GP Connect: ${response.statusText}`)
      }

      // If we get here, the test was successful
      setTestResult("success")
    } catch (error) {
      console.error("Error testing GP Connect:", error)
      setTestResult("error")
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="nhsNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NHS Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 9000000009" {...field} />
                </FormControl>
                <FormDescription>Enter a valid NHS number to test the GP Connect integration</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Connection...
              </>
            ) : (
              "Test Connection"
            )}
          </Button>
        </form>
      </Form>

      {testResult === "success" && (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950 dark:border-green-900">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-600 dark:text-green-400">Connection Successful</AlertTitle>
          <AlertDescription>Successfully connected to GP Connect and retrieved patient data.</AlertDescription>
        </Alert>
      )}

      {testResult === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Failed</AlertTitle>
          <AlertDescription>
            {errorMessage || "Failed to connect to GP Connect. Please check your settings and try again."}
          </AlertDescription>
        </Alert>
      )}

      <div className="text-sm text-muted-foreground">
        <p className="font-medium">Test NHS Numbers:</p>
        <ul className="list-disc list-inside mt-1">
          <li>9000000009 - Test patient with multiple conditions</li>
          <li>9000000017 - Test patient with allergies</li>
          <li>9000000025 - Test patient with complex medication history</li>
        </ul>
      </div>
    </div>
  )
}

