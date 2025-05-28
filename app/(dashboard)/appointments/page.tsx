import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Appointments | ComplexCare CRM",
  description: "Manage patient appointments",
}

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Appointments</h1>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Today's Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-b pb-2">
              <p className="font-medium">John Doe</p>
              <p className="text-sm text-muted-foreground">10:00 AM - Dr. Wilson - Diabetes Follow-up</p>
            </div>
            <div className="border-b pb-2">
              <p className="font-medium">Sarah Williams</p>
              <p className="text-sm text-muted-foreground">11:30 AM - Nurse Johnson - Blood Pressure Check</p>
            </div>
            <div className="border-b pb-2">
              <p className="font-medium">Michael Brown</p>
              <p className="text-sm text-muted-foreground">2:15 PM - Dr. Wilson - COPD Assessment</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-b pb-2">
              <p className="font-medium">Jane Smith</p>
              <p className="text-sm text-muted-foreground">Tomorrow, 9:15 AM - Dr. Wilson - Hypertension Follow-up</p>
            </div>
            <div className="border-b pb-2">
              <p className="font-medium">Robert Johnson</p>
              <p className="text-sm text-muted-foreground">Tomorrow, 3:30 PM - Nurse Johnson - Asthma Review</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
