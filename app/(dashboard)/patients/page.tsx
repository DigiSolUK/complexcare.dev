import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Patients | ComplexCare CRM",
  description: "Manage patient records",
}

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Patients</h1>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Patient List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-b pb-2">
              <p className="font-medium">John Doe</p>
              <p className="text-sm text-muted-foreground">Male, 65 - Diabetes Type 2</p>
            </div>
            <div className="border-b pb-2">
              <p className="font-medium">Jane Smith</p>
              <p className="text-sm text-muted-foreground">Female, 58 - Hypertension</p>
            </div>
            <div className="border-b pb-2">
              <p className="font-medium">Robert Johnson</p>
              <p className="text-sm text-muted-foreground">Male, 42 - Asthma</p>
            </div>
            <div className="border-b pb-2">
              <p className="font-medium">Sarah Williams</p>
              <p className="text-sm text-muted-foreground">Female, 73 - Arthritis</p>
            </div>
            <div className="border-b pb-2">
              <p className="font-medium">Michael Brown</p>
              <p className="text-sm text-muted-foreground">Male, 51 - COPD</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
