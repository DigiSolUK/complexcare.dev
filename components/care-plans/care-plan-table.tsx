"use client"

import { useState, useEffect, useCallback } from "react"
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
import { format } from "date-fns"
import { useSession } from "next-auth/react"

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
import { CarePlanViewDialog } from "./care-plan-view-dialog"
import type { CarePlan } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { EditCarePlanDialog } from "./edit-care-plan-dialog"

interface CarePlanTableProps {
  initialCarePlans?: CarePlan[]
}

export function CarePlanTable({ initialCarePlans }: CarePlanTableProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [carePlans, setCarePlans] = useState<CarePlan[]>(initialCarePlans || [])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<CarePlan | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  const fetchCarePlans = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/care-plans")
      if (!response.ok) {
        throw new Error("Failed to fetch care plans")
      }
      const data: CarePlan[] = await response.json()
      setCarePlans(data)
    } catch (err: any) {
      setError(err.message || "An unknown error occurred")
      toast({
        title: "Error",
        description: `Failed to load care plans: ${err.message}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    if (!initialCarePlans) {
      fetchCarePlans()
    } else {
      setLoading(false)
    }
  }, [fetchCarePlans, initialCarePlans])

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

  const handleViewPlan = (plan: CarePlan) => {
    setSelectedPlan(plan)
    setViewDialogOpen(true)
  }

  const handleEditPlan = (plan: CarePlan) => {
    setSelectedPlan(plan)
    setEditDialogOpen(true)
  }

  const handleDeletePlan = (plan: CarePlan) => {
    setSelectedPlan(plan)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedPlan?.id) return

    try {
      const response = await fetch(`/api/care-plans/${selectedPlan.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete care plan")
      }

      toast({
        title: "Success",
        description: "Care plan deleted successfully.",
      })
      fetchCarePlans() // Refresh the list
    } catch (err: any) {
      toast({
        title: "Error",
        description: `Failed to delete care plan: ${err.message}`,
        variant: "destructive",
      })
    } finally {
      setDeleteConfirmOpen(false)
      setSelectedPlan(null)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading care plans...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  if (carePlans.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No care plans found.</div>
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
                        {plan.patient_name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{plan.patient_name}</span>
                      <span className="text-xs text-muted-foreground">{plan.patient_id.substring(0, 8)}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{plan.title}</TableCell>
                <TableCell>{getStatusBadge(plan.status)}</TableCell>
                <TableCell>{plan.review_date ? format(new Date(plan.review_date), "PPP") : "N/A"}</TableCell>
                <TableCell>{plan.assigned_to_name || "N/A"}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleEditPlan(plan)}>
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
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeletePlan(plan)}>
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
      <EditCarePlanDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        carePlan={selectedPlan}
        onSuccess={fetchCarePlans}
      />
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Confirm Deletion"
        description={`Are you sure you want to delete the care plan "${selectedPlan?.title}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        confirmText="Delete"
        variant="destructive"
      />
    </>
  )
}
