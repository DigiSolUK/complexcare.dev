"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertCircle, Edit, Save, User } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

interface PatientDemographicsProps {
  patientId: string
  initialData?: any
  onUpdate?: () => void
}

export function PatientDemographics({ patientId, initialData, onUpdate }: PatientDemographicsProps) {
  const [patient, setPatient] = useState<any>(initialData || {})
  const [loading, setLoading] = useState<boolean>(!initialData)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<boolean>(false)
  const [formData, setFormData] = useState<any>({})
  const [showContactDialog, setShowContactDialog] = useState<boolean>(false)
  const [contactFormData, setContactFormData] = useState<any>({})
  const [contacts, setContacts] = useState<any[]>([])
  const [loadingContacts, setLoadingContacts] = useState<boolean>(true)
  const { toast } = useToast()

  useEffect(() => {
    if (!initialData) {
      fetchPatientData()
    } else {
      setPatient(initialData)
    }
    fetchPatientContacts()
  }, [initialData, patientId])

  const fetchPatientData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/patients/${patientId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch patient data")
      }
      const data = await response.json()
      setPatient(data)
      setFormData(data)
    } catch (err: any) {
      setError(err.message)
      console.error("Error fetching patient data:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchPatientContacts = async () => {
    try {
      setLoadingContacts(true)
      // This endpoint would need to be implemented
      const response = await fetch(`/api/patients/${patientId}/contacts`)
      if (!response.ok) {
        // If the endpoint doesn't exist yet, we'll just use empty array
        setContacts([])
        return
      }
      const data = await response.json()
      setContacts(data)
    } catch (err) {
      console.error("Error fetching patient contacts:", err)
      setContacts([])
    } finally {
      setLoadingContacts(false)
    }
  }

  const handleEditClick = () => {
    setFormData(patient)
    setEditing(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSaveClick = async () => {
    try {
      const response = await fetch(`/api/patients/${patientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update patient")
      }

      setPatient(formData)
      setEditing(false)
      toast({
        title: "Success",
        description: "Patient information updated successfully",
      })
      if (onUpdate) onUpdate()
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update patient",
        variant: "destructive",
      })
    }
  }

  const handleContactInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setContactFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleContactSelectChange = (name: string, value: string) => {
    setContactFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleAddContact = async () => {
    try {
      // This endpoint would need to be implemented
      const response = await fetch(`/api/patients/${patientId}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactFormData),
      })

      if (!response.ok) {
        throw new Error("Failed to add contact")
      }

      fetchPatientContacts()
      setShowContactDialog(false)
      setContactFormData({})
      toast({
        title: "Success",
        description: "Contact added successfully",
      })
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to add contact",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Patient Demographics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Patient Demographics</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Patient Demographics</CardTitle>
        {!editing ? (
          <Button variant="outline" size="sm" onClick={handleEditClick}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        ) : (
          <Button variant="default" size="sm" onClick={handleSaveClick}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="contact">Contact Info</TabsTrigger>
            <TabsTrigger value="medical">Medical Info</TabsTrigger>
            <TabsTrigger value="social">Social Info</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {editing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={formData.first_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={formData.last_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender || ""}
                      onValueChange={(value) => handleSelectChange("gender", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nhs_number">NHS Number</Label>
                    <Input
                      id="nhs_number"
                      name="nhs_number"
                      value={formData.nhs_number || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marital_status">Marital Status</Label>
                    <Select
                      value={formData.marital_status || ""}
                      onValueChange={(value) => handleSelectChange("marital_status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select marital status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                        <SelectItem value="separated">Separated</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-500">First Name</p>
                    <p>{patient.first_name || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Name</p>
                    <p>{patient.last_name || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                    <p>
                      {patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Gender</p>
                    <p>
                      {patient.gender
                        ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)
                        : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">NHS Number</p>
                    <p>{patient.nhs_number || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Marital Status</p>
                    <p>
                      {patient.marital_status
                        ? patient.marital_status.charAt(0).toUpperCase() + patient.marital_status.slice(1)
                        : "Not provided"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {editing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" value={formData.phone || ""} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address || ""}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" value={formData.city || ""} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postcode">Postcode</Label>
                    <Input id="postcode" name="postcode" value={formData.postcode || ""} onChange={handleInputChange} />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p>{patient.email || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p>{patient.phone || "Not provided"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p>{patient.address || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">City</p>
                    <p>{patient.city || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Postcode</p>
                    <p>{patient.postcode || "Not provided"}</p>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Emergency Contacts</h3>
                <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Add Contact
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Emergency Contact</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact_name">Name</Label>
                        <Input
                          id="contact_name"
                          name="name"
                          value={contactFormData.name || ""}
                          onChange={handleContactInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact_type">Contact Type</Label>
                        <Select
                          value={contactFormData.contact_type || ""}
                          onValueChange={(value) => handleContactSelectChange("contact_type", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select contact type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="emergency">Emergency</SelectItem>
                            <SelectItem value="next_of_kin">Next of Kin</SelectItem>
                            <SelectItem value="gp">GP</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact_relationship">Relationship</Label>
                        <Input
                          id="contact_relationship"
                          name="relationship"
                          value={contactFormData.relationship || ""}
                          onChange={handleContactInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact_phone">Phone</Label>
                        <Input
                          id="contact_phone"
                          name="phone"
                          value={contactFormData.phone || ""}
                          onChange={handleContactInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact_email">Email</Label>
                        <Input
                          id="contact_email"
                          name="email"
                          type="email"
                          value={contactFormData.email || ""}
                          onChange={handleContactInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact_notes">Notes</Label>
                        <Textarea
                          id="contact_notes"
                          name="notes"
                          value={contactFormData.notes || ""}
                          onChange={handleContactInputChange}
                          rows={2}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleAddContact}>Add Contact</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {loadingContacts ? (
                <div className="flex items-center justify-center h-20">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                </div>
              ) : contacts.length > 0 ? (
                <div className="space-y-4">
                  {contacts.map((contact: any) => (
                    <div key={contact.id} className="border rounded-md p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{contact.name}</h4>
                          <p className="text-sm text-gray-500">
                            {contact.relationship} • {contact.contact_type}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Phone</p>
                          <p>{contact.phone || "Not provided"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Email</p>
                          <p>{contact.email || "Not provided"}</p>
                        </div>
                        {contact.notes && (
                          <div className="md:col-span-2">
                            <p className="text-sm font-medium text-gray-500">Notes</p>
                            <p>{contact.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border rounded-md p-6 flex flex-col items-center justify-center text-center">
                  <User className="h-10 w-10 text-gray-400 mb-2" />
                  <h3 className="text-lg font-medium">No contacts added</h3>
                  <p className="text-sm text-gray-500 mt-1">Add emergency contacts for this patient</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="medical">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {editing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="blood_type">Blood Type</Label>
                    <Select
                      value={formData.blood_type || ""}
                      onValueChange={(value) => handleSelectChange("blood_type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      name="height"
                      type="number"
                      value={formData.height || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      value={formData.weight || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primary_gp">Primary GP</Label>
                    <Input
                      id="primary_gp"
                      name="primary_gp"
                      value={formData.primary_gp || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="medical_notes">Medical Notes</Label>
                    <Textarea
                      id="medical_notes"
                      name="medical_notes"
                      value={formData.medical_notes || ""}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Blood Type</p>
                    <p>{patient.blood_type || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Height</p>
                    <p>{patient.height ? `${patient.height} cm` : "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Weight</p>
                    <p>{patient.weight ? `${patient.weight} kg` : "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Primary GP</p>
                    <p>{patient.primary_gp || "Not provided"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500">Medical Notes</p>
                    <p>{patient.medical_notes || "Not provided"}</p>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="social">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {editing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      name="occupation"
                      value={formData.occupation || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    <Input id="language" name="language" value={formData.language || ""} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="religion">Religion</Label>
                    <Input id="religion" name="religion" value={formData.religion || ""} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ethnicity">Ethnicity</Label>
                    <Input
                      id="ethnicity"
                      name="ethnicity"
                      value={formData.ethnicity || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="social_notes">Social Notes</Label>
                    <Textarea
                      id="social_notes"
                      name="social_notes"
                      value={formData.social_notes || ""}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Occupation</p>
                    <p>{patient.occupation || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Preferred Language</p>
                    <p>{patient.language || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Religion</p>
                    <p>{patient.religion || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Ethnicity</p>
                    <p>{patient.ethnicity || "Not provided"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500">Social Notes</p>
                    <p>{patient.social_notes || "Not provided"}</p>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
