"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTenantWizard } from "../tenant-wizard-context"

export function BasicInfoStep() {
  const { data, updateData } = useTenantWizard()
  const { basicInfo } = data

  const handleSubdomainChange = (value: string) => {
    // Only allow alphanumeric characters and hyphens
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, "")
    updateData("basicInfo", { subdomain: sanitized })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Basic Information</h3>
        <p className="text-sm text-muted-foreground">Provide basic details about the tenant organization.</p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">
              Organization Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Acme Healthcare Ltd"
              value={basicInfo.name}
              onChange={(e) => updateData("basicInfo", { name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subdomain">
              Subdomain <span className="text-red-500">*</span>
            </Label>
            <div className="flex">
              <Input
                id="subdomain"
                placeholder="acme-healthcare"
                value={basicInfo.subdomain}
                onChange={(e) => handleSubdomainChange(e.target.value)}
                className="rounded-r-none"
              />
              <div className="flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm text-muted-foreground">
                .complexcare.uk
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Letters, numbers, and hyphens only</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="industry">
              Industry <span className="text-red-500">*</span>
            </Label>
            <Select value={basicInfo.industry} onValueChange={(value) => updateData("basicInfo", { industry: value })}>
              <SelectTrigger id="industry">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="social-care">Social Care</SelectItem>
                <SelectItem value="mental-health">Mental Health</SelectItem>
                <SelectItem value="disability-services">Disability Services</SelectItem>
                <SelectItem value="elderly-care">Elderly Care</SelectItem>
                <SelectItem value="home-care">Home Care</SelectItem>
                <SelectItem value="hospice">Hospice Care</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="size">
              Organization Size <span className="text-red-500">*</span>
            </Label>
            <Select value={basicInfo.size} onValueChange={(value) => updateData("basicInfo", { size: value })}>
              <SelectTrigger id="size">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1-10 employees</SelectItem>
                <SelectItem value="11-50">11-50 employees</SelectItem>
                <SelectItem value="51-200">51-200 employees</SelectItem>
                <SelectItem value="201-500">201-500 employees</SelectItem>
                <SelectItem value="501-1000">501-1000 employees</SelectItem>
                <SelectItem value="1000+">1000+ employees</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Brief description of the organization..."
            value={basicInfo.description}
            onChange={(e) => updateData("basicInfo", { description: e.target.value })}
            rows={3}
          />
        </div>
      </div>
    </div>
  )
}
