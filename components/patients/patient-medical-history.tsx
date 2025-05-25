"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { MedicalHistoryItem } from "@/types/patient"
import { format } from "date-fns"
import { toast } from "@/components/ui/use-toast"

interface PatientMedicalHistoryProps {
  patientId: string
}

export function PatientMedicalHistory({ patientId }: PatientMedicalHistoryProps) {
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<MedicalHistoryItem | null>(null)
  const [formData, setFormData] = useState<Partial<MedicalHistoryItem>>({
    condition: "",
    diagnosedDate: new Date(),
    notes: "",
    isActive: true,
  })

  useEffect(() => {
    fetchMedicalHistory()
  }, [patientId])

  const fetchMedicalHistory = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/patients/${patientId}/medical-history`)
      if (!response.ok) {
        throw new Error("Failed to fetch medical history")
      }
      const data = await response.json()
      setMedicalHistory(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching medical history:", err)
      setError("Failed to load medical history. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value ? new Date(value) : undefined }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/patients/${patientId}/medical-history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          patientId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add medical history item")
      }

      toast({
        title: "Success",
        description: "Medical history item added successfully",
      })

      setIsAddDialogOpen(false)
      setFormData({
        condition: "",
        diagnosedDate: new Date(),
        notes: "",
        isActive: true,
      })
      fetchMedicalHistory()
    } catch (error) {
      console.error("Error adding medical history item:", error)
      toast({
        title: "Error",
        description: "Failed to add medical history item",
        variant: "destructive",
      })
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentItem) return

    try {
      const response = await fetch(`/api/patients/${patientId}/medical-history/${currentItem.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update medical history item")
      }

      toast({
        title: "Success",
        description: "Medical history item updated successfully",
      })

      setIsEditDialogOpen(false)
      setCurrentItem(null)
      fetchMedicalHistory()
    } catch (error) {
      console.error("Error updating medical history item:", error)
      toast({
        title: "Error",
        description: "Failed to update medical history item",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!currentItem) return

    try {
      const response = await fetch(`/api/patients/${patientId}/medical-history/${currentItem.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete medical history item")
      }

      toast({
        title: "Success",
        description: "Medical history item deleted successfully",
      })

      setIsDeleteDialogOpen(false)
      setCurrentItem(null)
      fetchMedicalHistory()
    } catch (error) {
      console.error("Error deleting medical history item:", error)
      toast({
        title: "Error",
        description: "Failed to delete medical history item",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (item: MedicalHistoryItem) => {
    setCurrentItem(item)
    setFormData({
      condition: item.condition,
      diagnosedDate: item.diagnosedDate,
      resolvedDate: item.resolvedDate,
      notes: item.notes,
      isActive: item.isActive,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (item: MedicalHistoryItem) => {
    setCurrentItem(item)
    setIsDeleteDialogOpen(true)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
          <CardDescription>Loading medical history...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Medical History</CardTitle>
          <CardDescription>Patient's medical conditions and diagnoses</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Condition
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Medical Condition</DialogTitle>
              <DialogDescription>Add a new medical condition to the patient's history.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Input
                  id="condition"
                  name="condition"
                  value={formData.condition || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnosedDate">Diagnosed Date</Label>
                <Input
                  id="diagnosedDate"
                  name="diagnosedDate"
                  type="date"
                  value={formData.diagnosedDate ? format(new Date(formData.diagnosedDate), "yyyy-MM-dd") : ""}
                  onChange={handleDateChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resolvedDate">Resolved Date</Label>
                <Input
                  id="resolvedDate"
                  name="resolvedDate"
                  type="date"
                  value={formData.resolvedDate ? format(new Date(formData.resolvedDate), "yyyy-MM-dd") : ""}
                  onChange={handleDateChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" value={formData.notes || ""} onChange={handleChange} rows={3} />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive || false}
                  onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
                />
                <Label htmlFor="isActive">Active Condition</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Condition</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {medicalHistory.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No medical history records found. Add a condition to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Condition</TableHead>
                <TableHead>Diagnosed</TableHead>
                <TableHead>Resolved</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicalHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.condition}</TableCell>
                  <TableCell>{format(new Date(item.diagnosedDate), "dd MMM yyyy")}</TableCell>
                  <TableCell>
                    {item.resolvedDate ? format(new Date(item.resolvedDate), "dd MMM yyyy") : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.isActive ? "default" : "outline"}>
                      {item.isActive ? "Active" : "Resolved"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{item.notes || "No notes"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(item)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Medical Condition</DialogTitle>
            <DialogDescription>Update the details of this medical condition.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-condition">Condition</Label>
              <Input
                id="edit-condition"
                name="condition"
                value={formData.condition || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-diagnosedDate">Diagnosed Date</Label>
              <Input
                id="edit-diagnosedDate"
                name="diagnosedDate"
                type="date"
                value={formData.diagnosedDate ? format(new Date(formData.diagnosedDate), "yyyy-MM-dd") : ""}
                onChange={handleDateChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-resolvedDate">Resolved Date</Label>
              <Input
                id="edit-resolvedDate"
                name="resolvedDate"
                type="date"
                value={formData.resolvedDate ? format(new Date(formData.resolvedDate), "yyyy-MM-dd") : ""}
                onChange={handleDateChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea id="edit-notes" name="notes" value={formData.notes || ""} onChange={handleChange} rows={3} />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive || false}
                onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
              />
              <Label htmlFor="edit-isActive">Active Condition</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this medical condition? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {currentItem && (
              <div className="space-y-2">
                <p>
                  <strong>Condition:</strong> {currentItem.condition}
                </p>
                <p>
                  <strong>Diagnosed:</strong> {format(new Date(currentItem.diagnosedDate), "dd MMM yyyy")}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
