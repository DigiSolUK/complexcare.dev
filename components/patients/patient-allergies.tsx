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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { PatientAllergy } from "@/types/patient"
import { format } from "date-fns"
import { toast } from "@/components/ui/use-toast"

interface PatientAllergiesProps {
  patientId: string
}

export function PatientAllergies({ patientId }: PatientAllergiesProps) {
  const [allergies, setAllergies] = useState<PatientAllergy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentAllergy, setCurrentAllergy] = useState<PatientAllergy | null>(null);
  const [formData, setFormData] = useState<Partial<PatientAllergy>>({
    allergen: '',
    reaction: '',
    severity: 'MILD',
    diagnosedDate: new Date(),
    notes: '',
    isActive: true,
  });

  useEffect(() => {
    fetchAllergies();
  }, [patientId]);

  const fetchAllergies = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/patients/${patientId}/allergies`);
      if (!response.ok) {
        throw new Error('Failed to fetch allergies');
      }
      const data = await response.json();
      setAllergies(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching allergies:', err);
      setError('Failed to load allergies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value ? new Date(value) : undefined }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/patients/${patientId}/allergies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          patientId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add allergy');
      }

      toast({
        title: 'Success',
        description: 'Allergy added successfully',
      });
      
      setIsAddDialogOpen(false);
      setFormData({
        allergen: '',
        reaction: '',
        severity: 'MILD',
        diagnosedDate: new Date(),
        notes: '',
        isActive: true,
      });
      fetchAllergies();
    } catch (error) {
      console.error('Error adding allergy:', error);
      toast({
        title: 'Error',
        description: 'Failed to add allergy',
        variant: 'destructive',
      });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAllergy) return;

    try {
      const response = await fetch(`/api/patients/${patientId}/allergies/${currentAllergy.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update allergy');
      }

      toast({
        title: 'Success',
        description: 'Allergy updated successfully',
      });
      
      setIsEditDialogOpen(false);
      setCurrentAllergy(null);
      fetchAllergies();
    } catch (error) {
      console.error('Error updating allergy:', error);
      toast({
        title: 'Error',
        description: 'Failed to update allergy',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!currentAllergy) return;

    try {
      const response = await fetch(`/api/patients/${patientId}/allergies/${currentAllergy.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete allergy');
      }

      toast({
        title: 'Success',
        description: 'Allergy deleted successfully',
      });
      
      setIsDeleteDialogOpen(false);
      setCurrentAllergy(null);
      fetchAllergies();
    } catch (error) {
      console.error('Error deleting allergy:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete allergy',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (allergy: PatientAllergy) => {
    setCurrentAllergy(allergy);
    setFormData({
      allergen: allergy.allergen,
      reaction: allergy.reaction,
      severity: allergy.severity,
      diagnosedDate: allergy.diagnosedDate,
      notes: allergy.notes,
      isActive: allergy.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (allergy: PatientAllergy) => {
    setCurrentAllergy(allergy);
    setIsDeleteDialogOpen(true);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'MILD':
        return <Badge variant="outline">Mild</Badge>;
      case 'MODERATE':
        return <Badge variant="secondary">Moderate</Badge>;
      case 'SEVERE':
        return <Badge variant="default">Severe</Badge>;
      case 'LIFE_THREATENING':
        return <Badge variant="destructive">Life Threatening</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Allergies</CardTitle>
          <CardDescription>Loading allergies...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Allergies</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Allergies</CardTitle>
          <CardDescription>Patient's allergies and reactions</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Allergy
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Allergy</DialogTitle>
              <DialogDescription>
                Add a new allergy to the patient's record.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="allergen">Allergen</Label>
                <Input
                  id="allergen"
                  name="allergen"
                  value={formData.allergen || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reaction">Reaction</Label>
                <Input
                  id="reaction"
                  name="reaction"
                  value={formData.reaction || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <Select
                  value={formData.severity || 'MILD'}
                  onValueChange={(value) => handleSelectChange('severity', value)}
                >
                  <SelectTrigger id="severity">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MILD">Mild</SelectItem>
                    <SelectItem value="MODERATE">Moderate</SelectItem>
                    <SelectItem value="SEVERE">Severe</SelectItem>
                    <SelectItem value="LIFE_THREATENING">Life Threatening</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="diagnosedDate">Diagnosed Date</Label>
                <Input
                  id="diagnosedDate"
                  name="diagnosedDate"
                  type="date"
                  value={formData.diagnosedDate ? format(new Date(formData.diagnosedDate), 'yyyy-MM-dd') : ''}
                  onChange={handleDateChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive || false}
                  onCheckedChange={(checked) => handleSwitchChange('isActive', checked)}
                />
                <Label htmlFor="isActive">Active Allergy</Label>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Allergy</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {allergies.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No allergies recorded. Add an allergy to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Allergen</TableHead>
                <TableHead>Reaction</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Diagnosed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allergies.map((allergy) => (
                <TableRow key={allergy.id}>
                  <TableCell className="font-medium">{allergy.allergen}</TableCell>
                  <TableCell>{allergy.reaction}</TableCell>
                  <TableCell>{getSeverityBadge(allergy.severity)}</TableCell>
                  <TableCell>{format(new Date(allergy.diagnosedDate), 'dd MMM yyyy')}</TableCell>
                  <TableCell>
                    <Badge variant={allergy.isActive ? "default" : "outline"}>
                      {allergy.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(allergy)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(allergy)}>
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
            <DialogTitle>Edit Allergy</DialogTitle>
            <DialogDescription>
              Update the details of this allergy.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-allergen">Allergen</Label>
              <Input
                id="edit-allergen"
                name="allergen"
                value={formData.allergen || ''}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-reaction">Reaction</Label>
              <Input
                id="edit-reaction"
                name="reaction"
                value={formData.reaction || ''}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-severity">Severity</Label>
              <Select
                value={formData.severity || 'MILD'}
                onValueChange={(value) => handleSelectChange('severity', value)}
              >
                <SelectTrigger id="edit-severity">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                \
