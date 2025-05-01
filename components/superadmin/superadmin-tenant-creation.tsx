"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle } from "lucide-react"

export function SuperadminTenantCreation() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    subdomain: "",
    adminEmail: "",
    adminFirstName: "",
    adminLastName: "",
    adminPassword: "",
    plan: "professional",
    userCount: "10",
    billingCycle: "monthly",
  })
  const [createdTenant, setCreatedTenant] = useState<any>(null)
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
    setIsLoading(true)

    try {
      const response = await fetch("/api/superadmin/tenants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          subdomain: formData.subdomain,
          adminEmail: formData.adminEmail,
          adminFirstName: formData.adminFirstName,
          adminLastName: formData.adminLastName,
          adminPassword: formData.adminPassword || generatePassword(),
          plan: formData.plan,
          userCount: Number.parseInt(formData.userCount),
          billingCycle: formData.billingCycle,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create tenant")
      }

      setCreatedTenant(data)
      toast({
        title: "Tenant Created Successfully",
        description: `Tenant ${data.tenant.name} has been created.`,
      })
    } catch (error) {
      console.error("Error creating tenant:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create tenant",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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

  const handleGeneratePassword = () => {
    setFormData((prev) => ({ ...prev, adminPassword: generatePassword() }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      subdomain: "",
      adminEmail: "",
      adminFirstName: "",
      adminLastName: "",
      adminPassword: "",
      plan: "professional",
      userCount: "10",
      billingCycle: "monthly",
    })
    setCreatedTenant(null)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Create New Tenant</CardTitle>
          <CardDescription>
            Create a new tenant organization with admin access. This will set up a new environment for the tenant.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {createdTenant ? (
            <div className="space-y-4">
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Tenant Created Successfully</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>The tenant has been created with the following details:</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-md bg-gray-50 p-4">
                <h4 className="text-sm font-medium text-gray-900">Tenant Details</h4>
                <div className="mt-2 text-sm text-gray-700 space-y-1">
                  <p>
                    <span className="font-semibold">Name:</span> {createdTenant.tenant.name}
                  </p>
                  <p>
                    <span className="font-semibold">Subdomain:</span> {createdTenant.tenant.slug}.complexcare.co.uk
                  </p>
                  <p>
                    <span className="font-semibold">Subscription:</span> {createdTenant.subscription.tier} (
                    {createdTenant.subscription.billingCycle})
                  </p>
                </div>
              </div>

              <div className="rounded-md bg-blue-50 p-4">
                <h4 className="text-sm font-medium text-blue-900">Admin Credentials</h4>
                <div className="mt-2 text-sm text-blue-700 space-y-1">
                  <p>
                    <span className="font-semibold">Email:</span> {createdTenant.admin.email}
                  </p>
                  <p>
                    <span className="font-semibold">Password:</span> {formData.adminPassword}
                  </p>
                  <p className="text-xs mt-2 italic">Please save these credentials securely.</p>
                </div>
              </div>

              <Button onClick={resetForm} className="mt-4">
                Create Another Tenant
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminFirstName">Admin First Name</Label>
                    <Input
                      id="adminFirstName"
                      name="adminFirstName"
                      placeholder="Enter admin first name"
                      value={formData.adminFirstName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminLastName">Admin Last Name</Label>
                    <Input
                      id="adminLastName"
                      name="adminLastName"
                      placeholder="Enter admin last name"
                      value={formData.adminLastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input
                      type="email"
                      id="adminEmail"
                      name="adminEmail"
                      placeholder="Enter admin email"
                      value={formData.adminEmail}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminPassword">Admin Password</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="password"
                        id="adminPassword"
                        name="adminPassword"
                        placeholder="Enter admin password"
                        value={formData.adminPassword}
                        onChange={handleChange}
                      />
                      <Button type="button" size="sm" onClick={handleGeneratePassword}>
                        Generate
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plan">Plan</Label>
                    <Select onValueChange={(value) => handleSelectChange("plan", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userCount">User Count</Label>
                    <Select onValueChange={(value) => handleSelectChange("userCount", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user count" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 User</SelectItem>
                        <SelectItem value="10">10 Users</SelectItem>
                        <SelectItem value="20">20 Users</SelectItem>
                        <SelectItem value="50">50 Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billingCycle">Billing Cycle</Label>
                  <Select onValueChange={(value) => handleSelectChange("billingCycle", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select billing cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Tenant
                </Button>
              </CardFooter>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
