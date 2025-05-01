"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, ClipboardCheck, Printer, Download } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DischargePlanningAssistant() {
  const [patientId, setPatientId] = useState("")
  const [admissionReason, setAdmissionReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<null | {
    summary: string
    medications: Array<{
      name: string
      dosage: string
      frequency: string
      duration: string
      notes: string
    }>
    followUp: Array<{
      provider: string
      timeframe: string
      purpose: string
      contact: string
    }>
    homecare: Array<{
      service: string
      frequency: string
      duration: string
      provider: string
    }>
    warningSignsAndActions: Array<{
      sign: string
      action: string
      urgency: "Routine" | "Urgent" | "Emergency"
    }>
    additionalInstructions: string[]
  }>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      // This would be replaced with actual AI model results
      const mockResults = {
        summary:
          "Patient is being discharged following stabilization of COPD exacerbation. Treatment included bronchodilators, corticosteroids, and antibiotics. Patient's oxygen saturation has improved to 94% on room air. Patient is stable for discharge home with follow-up care.",
        medications: [
          {
            name: "Salbutamol",
            dosage: "100mcg",
            frequency: "2 puffs QID",
            duration: "As needed",
            notes: "Use spacer device",
          },
          {
            name: "Prednisolone",
            dosage: "30mg",
            frequency: "Once daily",
            duration: "5 days",
            notes: "Take with food in the morning",
          },
          {
            name: "Amoxicillin",
            dosage: "500mg",
            frequency: "Three times daily",
            duration: "7 days",
            notes: "Complete full course",
          },
        ],
        followUp: [
          {
            provider: "Respiratory Consultant",
            timeframe: "Within 2 weeks",
            purpose: "Follow-up assessment",
            contact: "01234 567890",
          },
          {
            provider: "GP",
            timeframe: "Within 1 week",
            purpose: "Medication review",
            contact: "01234 123456",
          },
          {
            provider: "Respiratory Nurse Specialist",
            timeframe: "Within 3 days",
            purpose: "Home assessment",
            contact: "01234 234567",
          },
        ],
        homecare: [
          {
            service: "Oxygen therapy assessment",
            frequency: "Once",
            duration: "Initial assessment",
            provider: "Home Oxygen Service",
          },
          {
            service: "Physiotherapy",
            frequency: "Twice weekly",
            duration: "4 weeks",
            provider: "Community Rehabilitation Team",
          },
        ],
        warningSignsAndActions: [
          {
            sign: "Increased shortness of breath",
            action: "Use rescue inhaler, if no improvement within 24 hours contact GP",
            urgency: "Routine",
          },
          {
            sign: "Chest pain or severe breathlessness",
            action: "Call 999 immediately",
            urgency: "Emergency",
          },
          {
            sign: "Fever or increased sputum production",
            action: "Contact GP within 24 hours",
            urgency: "Urgent",
          },
        ],
        additionalInstructions: [
          "Continue breathing exercises as demonstrated",
          "Avoid exposure to respiratory irritants including smoke",
          "Maintain adequate hydration",
          "Resume normal activities gradually as tolerated",
        ],
      }

      setResults(mockResults)
      setLoading(false)

      // Log usage to analytics
      try {
        fetch("/api/log-ai-tool-usage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            toolName: "discharge-planning-assistant",
            patientId,
          }),
        })
      } catch (error) {
        console.error("Failed to log tool usage:", error)
      }
    }, 2000)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Discharge Planning Assistant</CardTitle>
          <CardDescription>
            Generate comprehensive discharge plans with follow-up care, medication instructions, and warning signs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patient-id">Patient ID or NHS Number</Label>
              <Input
                id="patient-id"
                placeholder="Enter patient identifier"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admission-reason">Reason for Admission</Label>
              <Textarea
                id="admission-reason"
                placeholder="Briefly describe the reason for admission"
                value={admissionReason}
                onChange={(e) => setAdmissionReason(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Discharge Type</Label>
              <Select defaultValue="home">
                <SelectTrigger>
                  <SelectValue placeholder="Select discharge type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="care-home">Care Home</SelectItem>
                  <SelectItem value="rehabilitation">Rehabilitation Facility</SelectItem>
                  <SelectItem value="other-hospital">Transfer to Other Hospital</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Include in Discharge Plan</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-meds" defaultChecked />
                  <label htmlFor="include-meds" className="text-sm">
                    Medications
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-followup" defaultChecked />
                  <label htmlFor="include-followup" className="text-sm">
                    Follow-up Appointments
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-homecare" defaultChecked />
                  <label htmlFor="include-homecare" className="text-sm">
                    Home Care Services
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-warnings" defaultChecked />
                  <label htmlFor="include-warnings" className="text-sm">
                    Warning Signs
                  </label>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={loading || !patientId} className="w-full">
            {loading ? "Generating..." : "Generate Discharge Plan"}
            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Discharge Plan</CardTitle>
            <CardDescription>AI-generated comprehensive discharge plan</CardDescription>
          </div>
          {results && (
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Printer className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {!results && !loading && (
            <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
              <ClipboardCheck className="h-12 w-12 mb-4" />
              <p>Complete the form to generate a discharge plan</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Progress value={45} className="w-full mb-4" />
              <p className="text-muted-foreground">Analyzing patient data and generating discharge plan...</p>
            </div>
          )}

          {results && (
            <Tabs defaultValue="summary" className="space-y-4">
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="followup">Follow-up</TabsTrigger>
                <TabsTrigger value="homecare">Home Care</TabsTrigger>
                <TabsTrigger value="warnings">Warnings</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <div className="space-y-2">
                  <Label>Discharge Summary</Label>
                  <div className="bg-muted p-3 rounded-md">
                    <p>{results.summary}</p>
                  </div>

                  <Label className="mt-4">Additional Instructions</Label>
                  <div className="bg-muted p-3 rounded-md">
                    <ul className="list-disc pl-5 space-y-1">
                      {results.additionalInstructions.map((instruction, i) => (
                        <li key={i}>{instruction}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="medications">
                <div className="space-y-2">
                  <Label>Medication Instructions</Label>
                  <div className="space-y-4">
                    {results.medications.map((med, i) => (
                      <div key={i} className="bg-muted p-3 rounded-md">
                        <div className="font-medium">{med.name}</div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Dosage:</span> {med.dosage}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Frequency:</span> {med.frequency}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Duration:</span> {med.duration}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Notes:</span> {med.notes}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="followup">
                <div className="space-y-2">
                  <Label>Follow-up Appointments</Label>
                  <div className="space-y-4">
                    {results.followUp.map((appt, i) => (
                      <div key={i} className="bg-muted p-3 rounded-md">
                        <div className="font-medium">{appt.provider}</div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">When:</span> {appt.timeframe}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Purpose:</span> {appt.purpose}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Contact:</span> {appt.contact}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="homecare">
                <div className="space-y-2">
                  <Label>Home Care Services</Label>
                  <div className="space-y-4">
                    {results.homecare.map((service, i) => (
                      <div key={i} className="bg-muted p-3 rounded-md">
                        <div className="font-medium">{service.service}</div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Frequency:</span> {service.frequency}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Duration:</span> {service.duration}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Provider:</span> {service.provider}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="warnings">
                <div className="space-y-2">
                  <Label>Warning Signs and Actions</Label>
                  <div className="space-y-4">
                    {results.warningSignsAndActions.map((warning, i) => (
                      <div key={i} className="bg-muted p-3 rounded-md">
                        <div className="font-medium">{warning.sign}</div>
                        <div className="mt-1 text-sm">
                          <div>
                            <span className="text-muted-foreground">Action:</span> {warning.action}
                          </div>
                          <div className="mt-1">
                            <span className="text-muted-foreground">Urgency:</span>{" "}
                            <span
                              className={
                                warning.urgency === "Emergency"
                                  ? "text-red-600 font-medium"
                                  : warning.urgency === "Urgent"
                                    ? "text-orange-600 font-medium"
                                    : "text-green-600 font-medium"
                              }
                            >
                              {warning.urgency}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
