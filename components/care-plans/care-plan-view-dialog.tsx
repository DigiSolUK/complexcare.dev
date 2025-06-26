"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Calendar, CheckCircle2, Clock, FileText, User, AlertCircle, Target, ListChecks, Trash2 } from "lucide-react"
import type { CarePlan } from "@/types"
import { format } from "date-fns"

interface CarePlanViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  carePlan: CarePlan | null
}

export function CarePlanViewDialog({ open, onOpenChange, carePlan }: CarePlanViewDialogProps) {
  if (!carePlan) return null

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
      case "cancelled":
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            <Trash2 className="mr-1 h-3 w-3" /> Cancelled
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Placeholder for progress calculation (if not stored directly in DB)
  const calculateProgress = (plan: CarePlan) => {
    // This is a simplified placeholder. In a real app, progress would be based on completed tasks/interventions.
    if (plan.status === "completed") return 100
    if (plan.status === "cancelled") return 0
    const startDate = new Date(plan.start_date)
    const endDate = plan.end_date ? new Date(plan.end_date) : null
    if (!endDate || new Date() < startDate) return 0
    if (new Date() > endDate) return 99 // Almost complete if past end date but not marked completed

    const totalDuration = endDate.getTime() - startDate.getTime()
    const elapsedDuration = new Date().getTime() - startDate.getTime()
    return Math.min(100, Math.round((elapsedDuration / totalDuration) * 100))
  }

  const progress = calculateProgress(carePlan)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{carePlan.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 mt-1">
            <span>
              Patient: <strong>{carePlan.patient_name}</strong> ({carePlan.patient_id.substring(0, 8)})
            </span>
            <span className="mx-2">•</span>
            {getStatusBadge(carePlan.status)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Progress section */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Overall Progress</h3>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <FileText className="mr-2 h-4 w-4" /> Description
            </h3>
            <p className="text-sm text-muted-foreground">{carePlan.description || "No description provided."}</p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="font-medium flex items-center">
                <Calendar className="mr-2 h-4 w-4" /> Start Date
              </h3>
              <p className="text-sm">{format(new Date(carePlan.start_date), "PPP")}</p>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-medium flex items-center">
                <Calendar className="mr-2 h-4 w-4" /> End Date
              </h3>
              <p className="text-sm">{carePlan.end_date ? format(new Date(carePlan.end_date), "PPP") : "N/A"}</p>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-medium flex items-center">
                <Calendar className="mr-2 h-4 w-4" /> Next Review
              </h3>
              <p className="text-sm">{carePlan.review_date ? format(new Date(carePlan.review_date), "PPP") : "N/A"}</p>
            </div>
          </div>

          <Separator />

          {/* Goals */}
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <Target className="mr-2 h-4 w-4" /> Goals
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              {carePlan.goals && carePlan.goals.split(",").filter(Boolean).length > 0 ? (
                carePlan.goals.split(",").map((goal: string, index: number) => (
                  <li key={index} className="text-sm">
                    {goal.trim()}
                  </li>
                ))
              ) : (
                <li className="text-sm text-muted-foreground">No goals defined.</li>
              )}
            </ul>
          </div>

          {/* Interventions */}
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <ListChecks className="mr-2 h-4 w-4" /> Interventions
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              {carePlan.interventions && carePlan.interventions.split(",").filter(Boolean).length > 0 ? (
                carePlan.interventions.split(",").map((intervention: string, index: number) => (
                  <li key={index} className="text-sm">
                    {intervention.trim()}
                  </li>
                ))
              ) : (
                <li className="text-sm text-muted-foreground">No interventions defined.</li>
              )}
            </ul>
          </div>

          <Separator />

          {/* Assigned To */}
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <User className="mr-2 h-4 w-4" /> Assigned To
            </h3>
            <p className="text-sm">{carePlan.assigned_to_name || "Not assigned"}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {/* <Button>Edit Care Plan</Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
