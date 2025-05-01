import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface RecentPatientsProps {
  showAll?: boolean
}

export function RecentPatients({ showAll = false }: RecentPatientsProps) {
  const patients = [
    {
      id: "P001",
      initials: "JD",
      name: "John Doe",
      nhsNumber: "123-456-7890",
      status: "Diabetes Review",
      statusColor: "bg-yellow-500",
    },
    {
      id: "P002",
      initials: "JL",
      name: "Jane Lewis",
      nhsNumber: "234-567-8901",
      status: "Blood Pressure",
      statusColor: "bg-blue-500",
    },
    {
      id: "P003",
      initials: "RB",
      name: "Robert Brown",
      nhsNumber: "345-678-9012",
      status: "Medication Review",
      statusColor: "bg-purple-500",
    },
    {
      id: "P004",
      initials: "ST",
      name: "Sarah Thompson",
      nhsNumber: "456-789-0123",
      status: "Annual Check-up",
      statusColor: "bg-green-500",
    },
    {
      id: "P005",
      initials: "MP",
      name: "Michael Parker",
      nhsNumber: "567-890-1234",
      status: "Physiotherapy",
      statusColor: "bg-red-500",
    },
    {
      id: "P006",
      initials: "EJ",
      name: "Emma Johnson",
      nhsNumber: "678-901-2345",
      status: "Mental Health",
      statusColor: "bg-indigo-500",
    },
    {
      id: "P007",
      initials: "DW",
      name: "David Wilson",
      nhsNumber: "789-012-3456",
      status: "Respiratory",
      statusColor: "bg-teal-500",
    },
    {
      id: "P008",
      initials: "LM",
      name: "Laura Miller",
      nhsNumber: "890-123-4567",
      status: "Cardiology",
      statusColor: "bg-pink-500",
    },
  ]

  const displayPatients = showAll ? patients : patients.slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Patients</CardTitle>
          <CardDescription>You have seen 12 patients this week</CardDescription>
        </div>
        {!showAll && (
          <Button variant="ghost" size="sm" asChild>
            <Link href="/patients">View all</Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayPatients.map((patient) => (
            <div key={patient.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-muted">{patient.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{patient.name}</p>
                  <p className="text-xs text-muted-foreground">NHS #: {patient.nhsNumber}</p>
                </div>
              </div>
              <Badge variant="outline" className="ml-auto">
                <div className={`mr-1.5 h-2 w-2 rounded-full ${patient.statusColor}`} />
                {patient.status}
              </Badge>
            </div>
          ))}
        </div>
        {showAll && (
          <div className="mt-4 flex justify-center">
            <Button variant="outline" size="sm">
              Load More
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
