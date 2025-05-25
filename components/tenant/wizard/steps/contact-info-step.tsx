"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTenantWizard } from "../tenant-wizard-context"

export function ContactInfoStep() {
  const { data, updateData } = useTenantWizard()
  const { contactInfo } = data

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Contact Information</h3>
        <p className="text-sm text-muted-foreground">Provide contact details for the organization.</p>
      </div>

      <div className="space-y-6">
        {/* Primary Contact */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Primary Contact</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="primaryContactName">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="primaryContactName"
                placeholder="John Smith"
                value={contactInfo.primaryContactName}
                onChange={(e) => updateData("contactInfo", { primaryContactName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryContactEmail">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="primaryContactEmail"
                type="email"
                placeholder="john.smith@example.com"
                value={contactInfo.primaryContactEmail}
                onChange={(e) => updateData("contactInfo", { primaryContactEmail: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryContactPhone">Phone</Label>
              <Input
                id="primaryContactPhone"
                type="tel"
                placeholder="+44 20 1234 5678"
                value={contactInfo.primaryContactPhone}
                onChange={(e) => updateData("contactInfo", { primaryContactPhone: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Other Contacts */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Other Contacts</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="billingEmail">
                Billing Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="billingEmail"
                type="email"
                placeholder="billing@example.com"
                value={contactInfo.billingEmail}
                onChange={(e) => updateData("contactInfo", { billingEmail: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                placeholder="support@example.com"
                value={contactInfo.supportEmail}
                onChange={(e) => updateData("contactInfo", { supportEmail: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Address</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                placeholder="123 Main Street"
                value={contactInfo.address.street}
                onChange={(e) =>
                  updateData("contactInfo", {
                    address: { ...contactInfo.address, street: e.target.value },
                  })
                }
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="London"
                  value={contactInfo.address.city}
                  onChange={(e) =>
                    updateData("contactInfo", {
                      address: { ...contactInfo.address, city: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">County/State</Label>
                <Input
                  id="state"
                  placeholder="Greater London"
                  value={contactInfo.address.state}
                  onChange={(e) =>
                    updateData("contactInfo", {
                      address: { ...contactInfo.address, state: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  placeholder="SW1A 1AA"
                  value={contactInfo.address.postalCode}
                  onChange={(e) =>
                    updateData("contactInfo", {
                      address: { ...contactInfo.address, postalCode: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={contactInfo.address.country}
                onValueChange={(value) =>
                  updateData("contactInfo", {
                    address: { ...contactInfo.address, country: value },
                  })
                }
              >
                <SelectTrigger id="country">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                  <SelectItem value="IE">Ireland</SelectItem>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="AU">Australia</SelectItem>
                  <SelectItem value="NZ">New Zealand</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
