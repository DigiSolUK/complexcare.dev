"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Mail, Phone, MapPin, FileText, Edit, Save, X, AlertCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScheduleManager } from "./schedule-manager"
import type { CareProfessional } from "@/types"

interface CareProfessionalDetailsProps {
  professional: CareProfessional | null
  isLoading?: boolean
  error?: string
}

export function CareProfessionalDetails({ professional, isLoading = false, error }: CareProfessionalDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<CareProfessional | null>(professional)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (professional) {
      setFormData(professional)
    }
  }, [professional])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!formData) return

    const { name, value } = e.target
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSave = async () => {
    if (!formData) return

    try {
      setSaveError(null)
      setIsSaving(true)

      const response = await fetch(`/api/care-professionals/${professional?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to update professional")

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // For demo purposes, just toggle editing mode
      setIsEditing(false)

      // In a real app, you would refresh the data
      // const updatedProfessional = await response.json()
      // setFormData(updatedProfessional)
    } catch (error) {
      console.error("Error updating professional:", error)
      setSaveError(error instanceof Error ? error.message : "Failed to update professional")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(professional)
    setIsEditing(false)
    setSaveError(null)
  }

  // Loading state
  if (isLoading) {
    return <CareProfessionalDetailsSkeleton />
  }

  // Error state
  if (error || !professional) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error || "Failed to load care professional details. Please try again later."}
        </AlertDescription>
        <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Alert>
    )
  }

  // Safe access to professional data with fallbacks
  const {
    id,
    first_name = "Unknown",
    last_name = "Unknown",
    title = "",
    role = "Care Professional",
    specialization = "",
    employment_status = "",
    start_date = "",
    email = "",
    phone = "",
    address = "",
    emergency_contact_name = "",
    emergency_contact_phone = "",
    qualification = "",
    license_number = "",
    notes = "",
    avatar_url = "",
  } = professional

  // Format date safely
  const formattedStartDate = start_date
    ? (() => {
        try {
          const date = new Date(start_date)
          return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString()
        } catch (e) {
          return "Invalid date"
        }
      })()
    : "Not specified"

  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="personal">Personal Info</TabsTrigger>
        <TabsTrigger value="professional">Professional</TabsTrigger>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
      </TabsList>

      <TabsContent value="personal" className="space-y-6">
        {saveError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{saveError}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={avatar_url || "/placeholder.svg"}
                alt={`${first_name} ${last_name}`}
                onError={(e) => {
                  // Handle image load error
                  ;(e.target as HTMLImageElement).style.display = "none"
                }}
              />
              <AvatarFallback className="text-lg">{`${first_name.charAt(0)}${last_name.charAt(0)}`}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold">Personal Information</h2>
          </div>
          {isEditing ? (
            <div className="flex space-x-2">
              <Button onClick={handleSave} size="sm" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm" disabled={isSaving}>
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
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" name="title" value={formData?.title || ""} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" name="role" value={formData?.role || ""} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        value={formData?.first_name || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        name="last_name"
                        value={formData?.last_name || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      name="specialization"
                      value={formData?.specialization || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employment_status">Employment Status</Label>
                    <Input
                      id="employment_status"
                      name="employment_status"
                      value={formData?.employment_status || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="date"
                      value={formData?.start_date || ""}
                      onChange={handleChange}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Role:</span>
                    <Badge variant="outline">{role || "Not specified"}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Specialization:</span>
                    <span>{specialization || "Not specified"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Employment Status:</span>
                    <Badge variant={employment_status === "Full-time" ? "default" : "outline"}>
                      {employment_status || "Not specified"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Start Date:</span>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{formattedStartDate}</span>
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
                    <Input id="email" name="email" type="email" value={formData?.email || ""} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" value={formData?.phone || ""} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" name="address" value={formData?.address || ""} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                    <Input
                      id="emergency_contact_name"
                      name="emergency_contact_name"
                      value={formData?.emergency_contact_name || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                    <Input
                      id="emergency_contact_phone"
                      name="emergency_contact_phone"
                      value={formData?.emergency_contact_phone || ""}
                      onChange={handleChange}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{email || "No email provided"}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{phone || "No phone provided"}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-1" />
                    <span>{address || "No address provided"}</span>
                  </div>
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Emergency Contact</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Name:</span>
                        <span>{emergency_contact_name || "Not provided"}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Phone:</span>
                        <span>{emergency_contact_phone || "Not provided"}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="professional" className="space-y-6">
        <Card>
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
                    value={formData?.qualification || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license_number">License Number</Label>
                  <Input
                    id="license_number"
                    name="license_number"
                    value={formData?.license_number || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" name="notes" value={formData?.notes || ""} onChange={handleChange} />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Qualifications:</span>
                  <span>{qualification || "Not specified"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">License Number:</span>
                  <span>{license_number || "Not specified"}</span>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Notes</h4>
                  <div className="flex items-start">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground mt-1" />
                    <span>{notes || "No notes available"}</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="schedule" className="space-y-6">
        <ScheduleManager careProfessionalId={id} />
      </TabsContent>
    </Tabs>
  )
}

function CareProfessionalDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-10 w-20" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="h-4 w-4 mr-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
            <div className="pt-4 border-t">
              <Skeleton className="h-5 w-36 mb-2" />
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="h-4 w-16 mr-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
