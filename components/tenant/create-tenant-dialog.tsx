"use client"

import type React from "react"

import { useState } from "react"
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
import { useToast } from "@/hooks/use-toast"

interface CreateTenantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateTenantDialog({ open, onOpenChange, onSuccess }: CreateTenantDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    subdomain: "",
    plan: "professional",
    adminEmail: "",
    adminFirstName: "",
    adminLastName: "",
  })
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // In a real implementation, this would call your API
      // For now, we'll simulate success after a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate admin credentials
      const adminPassword = generatePassword()

      toast({
        title: "Tenant Created Successfully",
        description: (
          <div className="mt-2 space-y-2">
            <p>New tenant has been created with the following admin credentials:</p>
            <div className="p-2 bg-muted rounded-md">
              <p>
                <strong>Email:</strong> {formData.adminEmail}
              </p>
              <p>
                <strong>Password:</strong> {adminPassword}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">Make sure to save these credentials securely.</p>
          </div>
        ),
      })

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating tenant:", error)
      toast({
        title: "Error",
        description: "Failed to create tenant. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Tenant</DialogTitle>
          <DialogDescription>Create a new tenant organization with admin access</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter organization name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subdomain">Subdomain</Label>
              <div className="flex items-center">
                <Input
                  id="subdomain"
                  name="subdomain"
                  placeholder="organization"
                  value={formData.subdomain}
                  onChange={handleChange}
                  required
                />
                <span className="ml-2 text-muted-foreground">.complexcare.co.uk</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan">Subscription Plan</Label>
              <Select value={formData.plan} onValueChange={(value) => handleSelectChange("plan", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium mb-2">Admin Account</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminFirstName">First Name</Label>
                  <Input
                    id="adminFirstName"
                    name="adminFirstName"
                    placeholder="First name"
                    value={formData.adminFirstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminLastName">Last Name</Label>
                  <Input
                    id="adminLastName"
                    name="adminLastName"
                    placeholder="Last name"
                    value={formData.adminLastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="adminEmail">Email Address</Label>
                <Input
                  id="adminEmail"
                  name="adminEmail"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Tenant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
