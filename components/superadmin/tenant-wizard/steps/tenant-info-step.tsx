"use client"

import { useWizardContext } from "../wizard-context"
import { WizardStep } from "../wizard-step"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TenantInfoStep() {
  const { state, updateTenantInfo } = useWizardContext()

  const handleSubdomainChange = (value: string) => {
    // Only allow alphanumeric characters and hyphens
    const sanitized = value.replace(/[^a-zA-Z0-9-]/g, "").toLowerCase()
    updateTenantInfo({ subdomain: sanitized })
  }

  return (
    <WizardStep title="Tenant Information" description="Enter the basic details about the tenant organization">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Tenant Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter tenant name"
              value={state.tenantInfo.name}
              onChange={(e) => updateTenantInfo({ name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subdomain">
              Subdomain <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center">
              <Input
                id="subdomain"
                placeholder="tenant-name"
                value={state.tenantInfo.subdomain}
                onChange={(e) => handleSubdomainChange(e.target.value)}
                className="rounded-r-none"
              />
              <div className="bg-muted px-3 py-2 border border-l-0 border-input rounded-r-md">.complexcare.com</div>
            </div>
            <p className="text-xs text-muted-foreground">Only lowercase letters, numbers, and hyphens are allowed</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select value={state.tenantInfo.industry} onValueChange={(value) => updateTenantInfo({ industry: value })}>
              <SelectTrigger id="industry">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="social-care">Social Care</SelectItem>
                <SelectItem value="mental-health">Mental Health</SelectItem>
                <SelectItem value="disability-services">Disability Services</SelectItem>
                <SelectItem value="elderly-care">Elderly Care</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="size">Organization Size</Label>
            <Select value={state.tenantInfo.size} onValueChange={(value) => updateTenantInfo({ size: value })}>
              <SelectTrigger id="size">
                <SelectValue placeholder="Select organization size" />
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

          <div className="space-y-2">
            <Label htmlFor="contactEmail">
              Contact Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contactEmail"
              type="email"
              placeholder="contact@organization.com"
              value={state.tenantInfo.contactEmail}
              onChange={(e) => updateTenantInfo({ contactEmail: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input
              id="contactPhone"
              type="tel"
              placeholder="+44 123 456 7890"
              value={state.tenantInfo.contactPhone}
              onChange={(e) => updateTenantInfo({ contactPhone: e.target.value })}
            />
          </div>
        </div>
      </div>
    </WizardStep>
  )
}
