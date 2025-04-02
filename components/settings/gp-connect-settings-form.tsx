/**
 * GP Connect Settings Form Component
 *
 * This component provides a form for configuring GP Connect integration settings.
 * In a production environment, this would save the settings to the database.
 */

"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

// Form schema with validation
const formSchema = z.object({
  clientId: z.string().min(1, "Client ID is required"),
  clientSecret: z.string().min(1, "Client Secret is required"),
  apiEndpoint: z.string().url("Must be a valid URL"),
  callbackUrl: z.string().url("Must be a valid URL"),
  enabled: z.boolean(),
  certificateData: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

// Mock saved settings
const mockSavedSettings = {
  clientId: "gpc-complex-care-demo",
  clientSecret: "••••••••••••••••",
  apiEndpoint: "https://api.gpc.digital.nhs.uk/gpconnect-demonstrator/v1/fhir",
  callbackUrl: "https://complexcare.dev/api/integrations/gp-connect/callback",
  enabled: true,
  certificateData: "-----BEGIN CERTIFICATE-----\nMIIFYDCCBEigAwIBAgIQQAF...",
}

export function GPConnectSettingsForm() {
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Initialize form with mock saved settings
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: mockSavedSettings,
  })

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    setIsSaving(true)

    try {
      // In a real implementation, this would save the settings to the database
      // For now, we'll simulate a network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings saved",
        description: "GP Connect integration settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Enable GP Connect Integration</FormLabel>
                <FormDescription>When enabled, patient records will be fetched from GP Connect</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client ID</FormLabel>
                <FormControl>
                  <Input placeholder="Your GP Connect client ID" {...field} />
                </FormControl>
                <FormDescription>The client ID provided by NHS Digital</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clientSecret"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Secret</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Your GP Connect client secret" {...field} />
                </FormControl>
                <FormDescription>The client secret provided by NHS Digital</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="apiEndpoint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Endpoint</FormLabel>
                <FormControl>
                  <Input placeholder="https://api.gpc.digital.nhs.uk/..." {...field} />
                </FormControl>
                <FormDescription>The GP Connect API endpoint URL</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="callbackUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Callback URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://your-domain.com/api/callback" {...field} />
                </FormControl>
                <FormDescription>Your application's callback URL for OAuth</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="certificateData"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TLS Certificate</FormLabel>
              <FormControl>
                <Textarea placeholder="Paste your TLS certificate here" className="font-mono text-xs h-32" {...field} />
              </FormControl>
              <FormDescription>The TLS client certificate for secure communication with GP Connect</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </Form>
  )
}

