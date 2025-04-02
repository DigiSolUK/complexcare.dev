"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

interface EditPayrollProviderDialogProps {
  tenantId: string
  provider: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: () => void
}

export function EditPayrollProviderDialog({
  tenantId,
  provider,
  open,
  onOpenChange,
  onSave,
}: EditPayrollProviderDialogProps) {
  const [name, setName] = useState(provider.name || "")
  const [providerType, setProviderType] = useState(provider.provider_type || "")
  const [apiEndpoint, setApiEndpoint] = useState(provider.api_endpoint || "")
  const [apiKeyId, setApiKeyId] = useState(provider.api_key_id || "")
  const [isActive, setIsActive] = useState(provider.is_active)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (provider) {
      setName(provider.name || "")
      setProviderType(provider.provider_type || "")
      setApiEndpoint(provider.api_endpoint || "")
      setApiKeyId(provider.api_key_id || "")
      setIsActive(provider.is_active)
    }
  }, [provider])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !providerType) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch(`/api/payroll-providers/${provider.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenantId,
          name,
          provider_type: providerType,
          api_endpoint: apiEndpoint || undefined,
          api_key_id: apiKeyId || undefined,
          is_active: isActive,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update payroll provider")
      }

      toast({
        title: "Provider updated",
        description: "The payroll provider has been successfully updated.",
      })

      onOpenChange(false)

      if (onSave) {
        onSave()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payroll provider. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Payroll Provider</DialogTitle>
          <DialogDescription>Update the payroll provider details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Provider Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Sage Payroll"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="providerType">Provider Type</Label>
              <Select value={providerType} onValueChange={setProviderType}>
                <SelectTrigger id="providerType">
                  <SelectValue placeholder="Select provider type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sage">Sage</SelectItem>
                  <SelectItem value="xero">Xero</SelectItem>
                  <SelectItem value="quickbooks">QuickBooks</SelectItem>
                  <SelectItem value="csv">CSV Export</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="apiEndpoint">API Endpoint (optional)</Label>
              <Input
                id="apiEndpoint"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                placeholder="https://api.example.com/payroll"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="apiKeyId">API Key ID (optional)</Label>
              <Input
                id="apiKeyId"
                value={apiKeyId}
                onChange={(e) => setApiKeyId(e.target.value)}
                placeholder="Select an API key"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isActive" className="cursor-pointer">
                Active
              </Label>
              <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

