"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MedicationInteractionChecker } from "@/components/ai/medication-interaction-checker"
import { PillIcon, ShieldAlertIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function MedicationInteractionsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <PillIcon className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Medication Interactions</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <MedicationInteractionChecker />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Medication Interactions</CardTitle>
              <CardDescription>Understanding drug interactions and their importance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Medication interactions occur when a drug's effect is altered by the presence of another drug, food,
                beverage, or medical condition. These interactions can:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Decrease a drug's effectiveness</li>
                <li>Increase the risk of side effects</li>
                <li>Intensify or weaken a drug's effect</li>
                <li>Cause unexpected adverse reactions</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Understanding potential interactions is crucial for safe and effective medication management, especially
                for patients on multiple medications.
              </p>
            </CardContent>
          </Card>

          <Alert>
            <ShieldAlertIcon className="h-4 w-4" />
            <AlertTitle>Important Notice</AlertTitle>
            <AlertDescription>
              This AI-powered tool provides information about potential medication interactions but should not replace
              professional medical advice. Always consult with a healthcare provider or pharmacist about all medications
              and supplements you are taking.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}
