"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Mail, Phone, MapPin, FileText, Edit, Save, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { CareProfessional } from "@/types"

interface CareProfessionalDetailsProps {
  professional: CareProfessional
}

export function CareProfessionalDetails({ professional }: CareProfessionalDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(professional)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      // In a real app, you would save the data to the server here
      // const response = await fetch(`/api/care-professionals/${professional.id}`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // })

      // if (!response.ok) throw new Error("Failed to update professional")

      // For demo purposes, just toggle editing mode
      setIsEditing(false)

      // In a real app, you would refresh the data
      // const updatedProfessional = await response.json()
      // setFormData(updatedProfessional)
    } catch (error) {
      console.error("Error updating professional:", error)
      // Handle error (show toast, etc.)
    }
  }

  const handleCancel = () => {
    setFormData(professional)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={professional.avatar_url} alt={`${professional.first_name} ${professional.last_name}`} />
            <AvatarFallback className="text-lg">{`${professional.first_name.charAt(0)}${professional.last_name.charAt(0)}`}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-semibold">Professional Details</h2>
        </div>
        {isEditing ? (
          <div className="flex space-x-2">
            <Button onClick={handleSave} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" value={formData.title || ""} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" name="role" value={formData.role || ""} onChange={handleChange} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={formData.first_name || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input id="last_name" name="last_name" value={formData.last_name || ""} onChange={handleChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    name="specialization"
                    value={formData.specialization || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employment_status">Employment Status</Label>
                  <Input
                    id="employment_status"
                    name="employment_status"
                    value={formData.employment_status || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={formData.start_date || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatar_url">Avatar URL</Label>
                  <Input id="avatar_url" name="avatar_url" value={formData.avatar_url || ""} onChange={handleChange} />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Role:</span>
                  <Badge variant="outline">{professional.role || "Not specified"}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Specialization:</span>
                  <span>{professional.specialization || "Not specified"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Employment Status:</span>
                  <Badge variant={professional.employment_status === "Full-time" ? "default" : "outline"}>
                    {professional.employment_status || "Not specified"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Start Date:</span>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{professional.start_date || "Not specified"}</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email || ""} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" value={formData.phone || ""} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" name="address" value={formData.address || ""} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                  <Input
                    id="emergency_contact_name"
                    name="emergency_contact_name"
                    value={formData.emergency_contact_name || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                  <Input
                    id="emergency_contact_phone"
                    name="emergency_contact_phone"
                    value={formData.emergency_contact_phone || ""}
                    onChange={handleChange}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{professional.email || "No email provided"}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{professional.phone || "No phone provided"}</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-1" />
                  <span>{professional.address || "No address provided"}</span>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Emergency Contact</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Name:</span>
                      <span>{professional.emergency_contact_name || "Not provided"}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Phone:</span>
                      <span>{professional.emergency_contact_phone || "Not provided"}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Professional Qualifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="qualification">Qualifications</Label>
                  <Textarea
                    id="qualification"
                    name="qualification"
                    value={formData.qualification || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license_number">License Number</Label>
                  <Input
                    id="license_number"
                    name="license_number"
                    value={formData.license_number || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" name="notes" value={formData.notes || ""} onChange={handleChange} />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Qualifications:</span>
                  <span>{professional.qualification || "Not specified"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">License Number:</span>
                  <span>{professional.license_number || "Not specified"}</span>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Notes</h4>
                  <div className="flex items-start">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground mt-1" />
                    <span>{professional.notes || "No notes available"}</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

