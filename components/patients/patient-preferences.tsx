"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Languages, Bell, Eye, Save } from "lucide-react"

interface PatientPreferencesProps {
  patientId: string
}

export function PatientPreferences({ patientId }: PatientPreferencesProps) {
  const [preferences, setPreferences] = useState({
    language: "en",
    contactMethod: "phone",
    appointmentReminders: true,
    medicationReminders: true,
    shareDataWithFamily: false,
    allowResearch: false,
  })

  const handleSave = () => {
    // Save preferences
    console.log("Saving preferences:", preferences)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Preferences</CardTitle>
        <CardDescription>Communication and privacy settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language" className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              Preferred Language
            </Label>
            <Select
              value={preferences.language}
              onValueChange={(value) => setPreferences({ ...preferences, language: value })}
            >
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="ar">Arabic</SelectItem>
                <SelectItem value="pl">Polish</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Preferred Contact Method
            </Label>
            <Select
              value={preferences.contactMethod}
              onValueChange={(value) => setPreferences({ ...preferences, contactMethod: value })}
            >
              <SelectTrigger id="contact">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">Phone Call</SelectItem>
                <SelectItem value="sms">Text Message</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="letter">Letter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notification Preferences
            </h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="appt-reminders" className="text-sm font-normal">
                  Appointment Reminders
                </Label>
                <Switch
                  id="appt-reminders"
                  checked={preferences.appointmentReminders}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, appointmentReminders: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="med-reminders" className="text-sm font-normal">
                  Medication Reminders
                </Label>
                <Switch
                  id="med-reminders"
                  checked={preferences.medicationReminders}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, medicationReminders: checked })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Privacy Settings
            </h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="share-family" className="text-sm font-normal">
                  Share data with authorized family members
                </Label>
                <Switch
                  id="share-family"
                  checked={preferences.shareDataWithFamily}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, shareDataWithFamily: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="research" className="text-sm font-normal">
                  Allow anonymized data for research
                </Label>
                <Switch
                  id="research"
                  checked={preferences.allowResearch}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, allowResearch: checked })}
                />
              </div>
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  )
}
