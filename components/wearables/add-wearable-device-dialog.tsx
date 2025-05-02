"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { WearableDeviceType, WearableProvider } from "@/types/wearables"

const wearableDeviceTypes: { value: WearableDeviceType; label: string }[] = [
  { value: "fitness_tracker", label: "Fitness Tracker" },
  { value: "smart_watch", label: "Smart Watch" },
  { value: "blood_pressure_monitor", label: "Blood Pressure Monitor" },
  { value: "glucose_monitor", label: "Glucose Monitor" },
  { value: "heart_rate_monitor", label: "Heart Rate Monitor" },
  { value: "pulse_oximeter", label: "Pulse Oximeter" },
  { value: "temperature_sensor", label: "Temperature Sensor" },
  { value: "sleep_tracker", label: "Sleep Tracker" },
  { value: "ecg_monitor", label: "ECG Monitor" },
  { value: "fall_detector", label: "Fall Detector" },
  { value: "medication_reminder", label: "Medication Reminder" },
  { value: "other", label: "Other" },
]

const wearableProviders: { value: WearableProvider; label: string }[] = [
  { value: "fitbit", label: "Fitbit" },
  { value: "apple_health", label: "Apple Health" },
  { value: "google_fit", label: "Google Fit" },
  { value: "samsung_health", label: "Samsung Health" },
  { value: "garmin", label: "Garmin" },
  { value: "withings", label: "Withings" },
  { value: "dexcom", label: "Dexcom" },
  { value: "omron", label: "Omron" },
  { value: "medtronic", label: "Medtronic" },
  { value: "abbott", label: "Abbott" },
  { value: "other", label: "Other" },
]

const formSchema = z.object({
  deviceType: z.string(),
  provider: z.string(),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  model: z.string().min(1, "Model is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  deviceId: z.string().min(1, "Device ID is required"),
  apiKey: z.string().optional(),
  apiEndpoint: z.string().optional(),
})

interface AddWearableDeviceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId?: string
  onDeviceAdded: () => void
}

export function AddWearableDeviceDialog({
  open,
  onOpenChange,
  patientId,
  onDeviceAdded,
}: AddWearableDeviceDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deviceType: "fitness_tracker",
      provider: "fitbit",
      manufacturer: "",
      model: "",
      serialNumber: "",
      deviceId: "",
      apiKey: "",
      apiEndpoint: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!patientId) {
      toast({
        title: "Error",
        description: "Patient ID is required to add a wearable device",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/wearables/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          patientId,
          status: "active",
          connectionDetails: {
            apiKey: values.apiKey,
            apiEndpoint: values.apiEndpoint,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add wearable device")
      }

      toast({
        title: "Device added",
        description: "The wearable device has been successfully added.",
      })

      form.reset()
      onOpenChange(false)
      onDeviceAdded()
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add the wearable device. Please try again.",
        variant: "destructive",
      })
      console.error("Error adding wearable device:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Wearable Device</DialogTitle>
          <DialogDescription>Connect a new wearable device to monitor patient health metrics.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="deviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select device type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {wearableDeviceTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provider</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {wearableProviders.map((provider) => (
                          <SelectItem key={provider.value} value={provider.value}>
                            {provider.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Fitbit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Charge 5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Device serial number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deviceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Unique device identifier" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="API key for device integration" {...field} />
                  </FormControl>
                  <FormDescription>Required for some device types to access their APIs</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apiEndpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Endpoint (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://api.example.com/v1" {...field} />
                  </FormControl>
                  <FormDescription>Custom API endpoint if different from the default</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Device"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
