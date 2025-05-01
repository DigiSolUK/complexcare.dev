"use client"

import { useState } from "react"
import {
  CheckCircle2,
  Clock,
  FileText,
  MoreHorizontal,
  PencilLine,
  Trash2,
  User,
  AlertCircle,
  Calendar,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { CarePlanViewDialog } from "./care-plan-view-dialog"

// Demo data for care plans
const demoCarePlans = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    patientName: "Emma Thompson",
    patientId: "PT78923",
    title: "Diabetes Management Plan",
    description:
      "Comprehensive plan for managing Type 2 Diabetes including blood sugar monitoring, diet, exercise, and medication management.",
    status: "active",
    progress: 65,
    startDate: "2023-12-15",
    endDate: "2024-06-15",
    reviewDate: "2024-03-15",
    assignedTo: "Dr. Sarah Johnson",
    goals: "Maintain HbA1c below 7.0%, Reduce weight by 5kg, Establish regular exercise routine",
    interventions: "Daily glucose monitoring, Weekly dietitian consultation, Monthly endocrinologist review",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    patientName: "James Wilson",
    patientId: "PT45678",
    title: "Post-Surgery Recovery Plan",
    description:
      "Recovery plan following hip replacement surgery focusing on mobility, pain management, and rehabilitation.",
    status: "active",
    progress: 40,
    startDate: "2024-01-10",
    endDate: "2024-04-10",
    reviewDate: "2024-02-10",
    assignedTo: "Dr. Michael Chen",
    goals: "Achieve independent mobility, Manage post-operative pain, Prevent complications",
    interventions: "Physical therapy 3x weekly, Pain management protocol, Wound care and monitoring",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    patientName: "Olivia Parker",
    patientId: "PT12345",
    title: "Chronic Pain Management",
    description:
      "Multidisciplinary approach to managing chronic lower back pain with focus on non-pharmacological interventions.",
    status: "review",
    progress: 75,
    startDate: "2024-01-05",
    endDate: "2024-07-05",
    reviewDate: "2024-02-05",
    assignedTo: "Dr. Emily Rodriguez",
    goals: "Reduce pain intensity by 30%, Improve functional capacity, Reduce reliance on pain medication",
    interventions: "Physical therapy, Cognitive behavioral therapy, Acupuncture, Mindfulness training",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    patientName: "Robert Davis",
    patientId: "PT34567",
    title: "Cardiac Rehabilitation Plan",
    description:
      "Comprehensive cardiac rehabilitation following myocardial infarction focusing on exercise, diet, and lifestyle modifications.",
    status: "active",
    progress: 50,
    startDate: "2023-12-20",
    endDate: "2024-06-20",
    reviewDate: "2024-03-20",
    assignedTo: "Dr. James Wilson",
    goals: "Improve cardiovascular fitness, Implement heart-healthy diet, Manage stress effectively",
    interventions: "Supervised exercise program, Nutritional counseling, Stress management techniques",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    patientName: "Sophia Martinez",
    patientId: "PT56789",
    title: "Mental Health Support Plan",
    description:
      "Comprehensive mental health support plan for managing anxiety and depression with therapy and lifestyle interventions.",
    status: "pending",
    progress: 10,
    startDate: "2024-01-15",
    endDate: "2024-07-15",
    reviewDate: "2024-02-15",
    assignedTo: "Dr. Lisa Thompson",
    goals: "Reduce anxiety symptoms, Improve sleep quality, Develop healthy coping mechanisms",
    interventions: "Weekly therapy sessions, Daily mindfulness practice, Sleep hygiene protocol",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    patientName: "William Johnson",
    patientId: "PT90123",
    title: "Physical Therapy Plan",
    description:
      "Rehabilitation plan for recovery from sports injury focusing on strength, flexibility, and gradual return to activity.",
    status: "active",
    progress: 80,
    startDate: "2023-12-10",
    endDate: "2024-03-10",
    reviewDate: "2024-02-10",
    assignedTo: "Dr. Robert Brown",
    goals: "Restore full range of motion, Rebuild muscle strength, Return to pre-injury activity level",
    interventions: "Targeted exercise program, Manual therapy, Gradual activity progression",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    patientName: "Ava Robinson",
    patientId: "PT23456",
    title: "Nutritional Support Plan",
    description:
      "Nutritional intervention plan for malnutrition following extended hospitalization with focus on weight gain and nutrient repletion.",
    status: "active",
    progress: 30,
    startDate: "2024-01-02",
    endDate: "2024-04-02",
    reviewDate: "2024-02-02",
    assignedTo: "Dr. Sarah Johnson",
    goals: "Achieve healthy weight gain, Correct nutritional deficiencies, Establish sustainable eating patterns",
    interventions: "High-calorie, nutrient-dense diet plan, Nutritional supplements, Weekly dietitian follow-up",
  },
]

export function CarePlanTable() {
  const [carePlans, setCarePlans] = useState(demoCarePlans)
  const [selectedPlan, setSelectedPlan] = useState<(typeof demoCarePlans)[0] | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  // Function to get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Active
          </Badge>
        )
      case "review":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">
            <AlertCircle className="mr-1 h-3 w-3" /> Under Review
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const handleViewPlan = (plan: (typeof demoCarePlans)[0]) => {
    setSelectedPlan(plan)
    setViewDialogOpen(true)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Care Plan</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Review Date</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carePlans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.id.substring(0, 8)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10">
                        {plan.patientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{plan.patientName}</span>
                      <span className="text-xs text-muted-foreground">{plan.patientId}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{plan.title}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={plan.progress} className="h-2 w-[100px]" />
                    <span className="text-xs text-muted-foreground">{plan.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(plan.status)}</TableCell>
                <TableCell>{new Date(plan.reviewDate).toLocaleDateString()}</TableCell>
                <TableCell>{plan.assignedTo}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleViewPlan(plan)}>
                        <FileText className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <PencilLine className="mr-2 h-4 w-4" />
                        Edit plan
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule review
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        Change assigned staff
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete plan
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CarePlanViewDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} carePlan={selectedPlan} />
    </>
  )
}
