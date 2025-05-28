"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Upload, Loader2, Sparkles } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { generateOrganizationDescription } from "@/lib/ai/onboarding-ai-service"
import type { OrganizationProfile } from "@/lib/ai/onboarding-ai-service"

interface AIEnhancedOrganizationFormProps {
  initialData?: Partial<OrganizationProfile>
  onSubmit: (data: OrganizationProfile) => Promise<void>
}

export function AIEnhancedOrganizationForm({ initialData = {}, onSubmit }: AIEnhancedOrganizationFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)

  const [formData, setFormData] = useState<Partial<OrganizationProfile>>({
    name: "",
    description: "",
    industry: "",
    size: "",
    website: "",
    ...initialData,
  })

  const [logo, setLogo] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0])
    }
  }

  const generateDescription = async () => {
    if (!formData.name) {
      toast({
        title: "Organization name required",
        description: "Please enter an organization name to generate a description.",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingDescription(true)
    try {
      const description = await generateOrganizationDescription(formData)
      if (description) {
        setFormData((prev) => ({ ...prev, description }))
        toast({
          title: "Description generated",
          description: "AI has generated a description based on your organization details.",
        })
      } else {
        toast({
          title: "Could not generate description",
          description: "Please try again or enter a description manually.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error generating description",
        description: "There was a problem generating the description.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingDescription(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) {
      toast({
        title: "Organization name required",
        description: "Please enter an organization name to continue.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData as OrganizationProfile)
    } catch (error) {
      toast({
        title: "Error saving profile",
        description: "There was a problem saving your organization profile.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Organization Profile</CardTitle>
          <CardDescription>Provide details about your organization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your organization name"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateDescription}
                disabled={isGeneratingDescription}
                className="h-8"
              >
                {isGeneratingDescription ? (
                  <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5 mr-2" />
                )}
                {isGeneratingDescription ? "Generating..." : "Generate with AI"}
              </Button>
            </div>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Briefly describe your organization"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              AI can generate a description based on your organization details.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Healthcare Sector</Label>
              <Select value={formData.industry} onValueChange={(value) => handleSelectChange("industry", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hospital">Hospital</SelectItem>
                  <SelectItem value="clinic">Clinic</SelectItem>
                  <SelectItem value="care-home">Care Home</SelectItem>
                  <SelectItem value="home-care">Home Care</SelectItem>
                  <SelectItem value="mental-health">Mental Health</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Organization Size</Label>
              <Select value={formData.size} onValueChange={(value) => handleSelectChange("size", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-500">201-500 employees</SelectItem>
                  <SelectItem value="501+">501+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://www.example.com"
              type="url"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Organization Logo</Label>
            <div className="flex items-center gap-4">
              {logo ? (
                <div className="h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={URL.createObjectURL(logo) || "/placeholder.svg"}
                    alt="Logo preview"
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div className="h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <Input id="logo" type="file" accept="image/*" onChange={handleFileChange} className="cursor-pointer" />
                <p className="text-xs text-muted-foreground mt-1">Recommended size: 512x512px. Max 2MB.</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
