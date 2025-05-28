import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Clinical Notes | ComplexCare CRM",
  description: "Manage clinical documentation",
}

export default function ClinicalNotesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Clinical Notes</h1>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Recent Clinical Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-b pb-2">
              <p className="font-medium">Initial Assessment - John Doe</p>
              <p className="text-sm mt-1">
                Patient presents with elevated blood glucose levels. Recommended dietary changes and increased physical
                activity.
              </p>
              <p className="text-xs text-muted-foreground mt-1">Dr. Wilson - 2 days ago</p>
            </div>
            <div className="border-b pb-2">
              <p className="font-medium">Blood Pressure Check - Jane Smith</p>
              <p className="text-sm mt-1">
                Blood pressure reading: 140/90 mmHg. Slightly elevated. Recommended stress reduction techniques and
                follow-up in 2 weeks.
              </p>
              <p className="text-xs text-muted-foreground mt-1">Nurse Johnson - 3 days ago</p>
            </div>
            <div className="border-b pb-2">
              <p className="font-medium">Respiratory Assessment - Robert Johnson</p>
              <p className="text-sm mt-1">
                Patient reports improved breathing with current medication regimen. Lung sounds clear. Continue current
                treatment plan.
              </p>
              <p className="text-xs text-muted-foreground mt-1">Dr. Wilson - 5 days ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
