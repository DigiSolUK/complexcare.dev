import { notFound } from "next/navigation"
import { ArrowLeft, PlusCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Demo data for patients
const demoPatients = [
  {
    id: "P001",
    name: "John Smith",
    nhsNumber: "123 456 7890",
    dateOfBirth: "15/05/1975",
  },
  {
    id: "P002",
    name: "Sarah Johnson",
    nhsNumber: "234 567 8901",
    dateOfBirth: "22/11/1982",
  },
  // ... other patients
]

// Demo care plans for patients
const demoCarePlans = {
  P001: [
    {
      id: "CP001",
      title: "Diabetes Management Plan",
      description:
        "Comprehensive plan for managing Type 2 Diabetes including blood sugar monitoring, medication management, dietary guidelines, and exercise recommendations.",
      status: "Active",
      startDate: "15/01/2023",
      endDate: "15/07/2023",
      reviewDate: "15/04/2023",
      assignedTo: "Dr. Johnson",
      goals: [
        "Maintain HbA1c below 7.0%",
        "Daily blood glucose monitoring",
        "Follow diabetic diet plan",
        "30 minutes of exercise 5 days per week",
      ],
      interventions: [
        "Metformin 500mg twice daily",
        "Blood glucose monitoring before meals and at bedtime",
        "Referral to dietitian for meal planning",
        "Diabetes education program",
      ],
    },
    {
      id: "CP002",
      title: "Hypertension Management",
      description: "Blood pressure monitoring and medication management plan.",
      status: "Active",
      startDate: "01/02/2023",
      endDate: "01/08/2023",
      reviewDate: "01/05/2023",
      assignedTo: "Dr. Williams",
      goals: ["Maintain blood pressure below 140/90 mmHg", "Reduce sodium intake", "Regular exercise"],
      interventions: [
        "Lisinopril 10mg daily",
        "Blood pressure monitoring twice weekly",
        "Low sodium diet education",
        "Weight management program",
      ],
    },
  ],
  P002: [
    {
      id: "CP003",
      title: "Multiple Sclerosis Care Plan",
      description: "Comprehensive management plan for MS symptoms and disease progression.",
      status: "Active",
      startDate: "10/03/2023",
      endDate: "10/09/2023",
      reviewDate: "10/06/2023",
      assignedTo: "Dr. Williams",
      goals: ["Manage fatigue levels", "Maintain mobility", "Prevent complications"],
      interventions: [
        "Interferon beta-1a injections",
        "Physical therapy twice weekly",
        "Fatigue management strategies",
        "Heat sensitivity precautions",
      ],
    },
  ],
  // ... other care plans
}

export default function PatientCarePlansPage({ params }: { params: { id: string } }) {
  const patient = demoPatients.find((p) => p.id === params.id)

  if (!patient) {
    notFound()
  }

  const carePlans = demoCarePlans[patient.id as keyof typeof demoCarePlans] || []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/patients/${patient.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{patient.name} - Care Plans</h1>
            <p className="text-muted-foreground">
              NHS Number: {patient.nhsNumber} | DOB: {patient.dateOfBirth}
            </p>
          </div>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Care Plan
        </Button>
      </div>

      <div className="space-y-4">
        {carePlans.length > 0 ? (
          carePlans.map((carePlan) => (
            <Card key={carePlan.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{carePlan.title}</CardTitle>
                  <Badge
                    variant={
                      carePlan.status === "Active"
                        ? "default"
                        : carePlan.status === "Inactive"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {carePlan.status}
                  </Badge>
                </div>
                <CardDescription>
                  {carePlan.startDate} to {carePlan.endDate} | Review: {carePlan.reviewDate} | Assigned to:{" "}
                  {carePlan.assignedTo}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-medium">Description</div>
                  <div className="text-sm text-muted-foreground">{carePlan.description}</div>
                </div>

                <div>
                  <div className="font-medium">Goals</div>
                  <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground">
                    {carePlan.goals.map((goal, index) => (
                      <li key={index}>{goal}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="font-medium">Interventions</div>
                  <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground">
                    {carePlan.interventions.map((intervention, index) => (
                      <li key={index}>{intervention}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline">Edit</Button>
                  <Button variant="outline">Print</Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No care plans found for this patient.</p>
            <Button className="mt-4">Create Care Plan</Button>
          </div>
        )}
      </div>
    </div>
  )
}

