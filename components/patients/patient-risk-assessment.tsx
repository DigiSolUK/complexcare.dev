"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { format, parseISO } from "date-fns"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { AlertTriangle, ShieldAlert, ShieldCheck, ShieldQuestion, Edit } from "lucide-react"

interface RiskAssessment {
  id: string
  patient_id: string
  risk_level: string
  risk_score: number
  assessment_date: string
  assessed_by: string
  assessed_by_name?: string
  factors: string[]
  notes?: string
  created_at: string
  updated_at: string
}

interface PatientRiskAssessmentProps {
  patientId: string
}

const riskAssessmentFormSchema = z.object({
  mobility: z.string(),
  falls_history: z.string(),
  medication: z.string(),
  cognitive: z.string(),
  nutrition: z.string(),
  notes: z.string().optional(),
})

export function PatientRiskAssessment({ patientId }: PatientRiskAssessmentProps) {
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAssessDialogOpen, setIsAssessDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof riskAssessmentFormSchema>>({
    resolver: zodResolver(riskAssessmentFormSchema),
    defaultValues: {
      mobility: "1",
      falls_history: "1",
      medication: "1",
      cognitive: "1",
      nutrition: "1",
    },
  })

  useEffect(() => {
    const fetchRiskAssessment = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/patients/${patientId}/risk-assessment`)

        if (response.ok) {
          const data = await response.json()
          setRiskAssessment(data)
        } else {
          console.error("Failed to fetch risk assessment")
          // For demo purposes, set some sample data
          setRiskAssessment({
            id: "1",
            patient_id: patientId,
            risk_level: "medium",
            risk_score: 12,
            assessment_date: "2023-04-15",
            assessed_by: "user123",
            assessed_by_name: "Dr. Sarah Thompson",
            factors: ["Mobility issues", "Multiple medications", "History of falls"],
            notes:
              "Patient has reduced mobility and is on multiple medications that may increase fall risk. Recommend home assessment and medication review.",
            created_at: "2023-04-15T10:30:00Z",
            updated_at: "2023-04-15T10:30:00Z",
          })
        }
      } catch (error) {
        console.error("Error fetching risk assessment:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRiskAssessment()
  }, [patientId])

  const onSubmit = async (values: z.infer<typeof riskAssessmentFormSchema>) => {
    try {
      // In a real implementation, you would send this to your API
      console.log("Submitting risk assessment:", values)

      // Calculate risk score based on form values
      const riskScore =
        Number.parseInt(values.mobility) +
        Number.parseInt(values.falls_history) +
        Number.parseInt(values.medication) +
        Number.parseInt(values.cognitive) +
        Number.parseInt(values.nutrition)

      // Determine risk level based on score
      let riskLevel = "low"
      if (riskScore >= 15) {
        riskLevel = "high"
      } else if (riskScore >= 10) {
        riskLevel = "medium"
      }

      // Create factors array based on high-risk answers
      const factors = []
      if (Number.parseInt(values.mobility) >= 3) factors.push("Mobility issues")
      if (Number.parseInt(values.falls_history) >= 3) factors.push("History of falls")
      if (Number.parseInt(values.medication) >= 3) factors.push("Multiple medications")
      if (Number.parseInt(values.cognitive) >= 3) factors.push("Cognitive impairment")
      if (Number.parseInt(values.nutrition) >= 3) factors.push("Nutritional concerns")

      // Create new risk assessment
      const newAssessment: RiskAssessment = {
        id: riskAssessment ? riskAssessment.id : `temp-${Date.now()}`,
        patient_id: patientId,
        risk_level: riskLevel,
        risk_score: riskScore,
        assessment_date: new Date().toISOString().split("T")[0],
        assessed_by: "current_user",
        assessed_by_name: "Current User",
        factors: factors,
        notes: values.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      setRiskAssessment(newAssessment)
      setIsAssessDialogOpen(false)
      form.reset()
    } catch (error) {
      console.error("Error saving risk assessment:", error)
    }
  }

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return <ShieldAlert className="h-8 w-8 text-red-500" />
      case "medium":
        return <AlertTriangle className="h-8 w-8 text-amber-500" />
      case "low":
        return <ShieldCheck className="h-8 w-8 text-green-500" />
      default:
        return <ShieldQuestion className="h-8 w-8 text-gray-500" />
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-amber-100 text-amber-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRiskProgressColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-amber-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
          <CardDescription>Patient's risk level and factors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Risk Assessment</CardTitle>
          <CardDescription>Patient's risk level and factors</CardDescription>
        </div>
        <Dialog open={isAssessDialogOpen} onOpenChange={setIsAssessDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              {riskAssessment ? "Update" : "Assess"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Risk Assessment</DialogTitle>
              <DialogDescription>
                Assess the patient's risk factors to determine their overall risk level.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="mobility"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Mobility</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="1" />
                            </FormControl>
                            <FormLabel className="font-normal">Independent, no mobility issues</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="2" />
                            </FormControl>
                            <FormLabel className="font-normal">Needs occasional assistance</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="3" />
                            </FormControl>
                            <FormLabel className="font-normal">Regularly needs assistance with mobility</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="4" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Severely limited mobility, dependent on others
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="falls_history"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Falls History</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="1" />
                            </FormControl>
                            <FormLabel className="font-normal">No history of falls</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="2" />
                            </FormControl>
                            <FormLabel className="font-normal">One fall in the past year</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="3" />
                            </FormControl>
                            <FormLabel className="font-normal">Two falls in the past year</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="4" />
                            </FormControl>
                            <FormLabel className="font-normal">Three or more falls in the past year</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="medication"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Medication</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="1" />
                            </FormControl>
                            <FormLabel className="font-normal">No medications or low-risk medications only</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="2" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              1-3 medications, including some that may increase risk
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="3" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              4-6 medications, including several that may increase risk
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="4" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              7+ medications or high-risk medication regimen
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cognitive"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Cognitive Status</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="1" />
                            </FormControl>
                            <FormLabel className="font-normal">No cognitive impairment</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="2" />
                            </FormControl>
                            <FormLabel className="font-normal">Mild cognitive impairment</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="3" />
                            </FormControl>
                            <FormLabel className="font-normal">Moderate cognitive impairment</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="4" />
                            </FormControl>
                            <FormLabel className="font-normal">Severe cognitive impairment</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nutrition"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Nutritional Status</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="1" />
                            </FormControl>
                            <FormLabel className="font-normal">Good nutritional status</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="2" />
                            </FormControl>
                            <FormLabel className="font-normal">At risk of malnutrition</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="3" />
                            </FormControl>
                            <FormLabel className="font-normal">Moderate malnutrition</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="4" />
                            </FormControl>
                            <FormLabel className="font-normal">Severe malnutrition</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional notes about risk factors or recommendations"
                          className="resize-none"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">Save Assessment</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {!riskAssessment ? (
          <div className="text-center py-4">
            <ShieldQuestion className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Risk Assessment</h3>
            <p className="text-muted-foreground mb-4">This patient has not been assessed for risks yet.</p>
            <Button onClick={() => setIsAssessDialogOpen(true)}>Perform Assessment</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getRiskIcon(riskAssessment.risk_level)}
                <div>
                  <h3 className="text-lg font-medium">
                    {riskAssessment.risk_level.charAt(0).toUpperCase() + riskAssessment.risk_level.slice(1)} Risk
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Assessed on {format(parseISO(riskAssessment.assessment_date), "PPP")}
                  </p>
                </div>
              </div>
              <Badge className={getRiskColor(riskAssessment.risk_level)}>Score: {riskAssessment.risk_score}/20</Badge>
            </div>

            <div>
              <div className="flex justify-between mb-1 text-xs">
                <span>Low Risk</span>
                <span>High Risk</span>
              </div>
              <Progress
                value={(riskAssessment.risk_score / 20) * 100}
                className="h-2"
                indicatorClassName={getRiskProgressColor(riskAssessment.risk_level)}
              />
            </div>

            {riskAssessment.factors.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Risk Factors:</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {riskAssessment.factors.map((factor, index) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              </div>
            )}

            {riskAssessment.notes && (
              <div>
                <h4 className="text-sm font-medium mb-2">Notes:</h4>
                <p className="text-sm">{riskAssessment.notes}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
