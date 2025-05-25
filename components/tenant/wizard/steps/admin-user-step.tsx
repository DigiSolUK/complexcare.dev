"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useTenantWizard } from "../tenant-wizard-context"

export function AdminUserStep() {
  const { data, updateData } = useTenantWizard()
  const { adminUser } = data

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Administrator Account</h3>
        <p className="text-sm text-muted-foreground">Set up the primary administrator account for this tenant.</p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              placeholder="Jane"
              value={adminUser.firstName}
              onChange={(e) => updateData("adminUser", { firstName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lastName"
              placeholder="Doe"
              value={adminUser.lastName}
              onChange={(e) => updateData("adminUser", { lastName: e.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="jane.doe@example.com"
              value={adminUser.email}
              onChange={(e) => updateData("adminUser", { email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+44 20 1234 5678"
              value={adminUser.phone}
              onChange={(e) => updateData("adminUser", { phone: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={adminUser.role} onValueChange={(value) => updateData("adminUser", { role: value })}>
            <SelectTrigger id="role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrator</SelectItem>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="sendWelcomeEmail"
            checked={adminUser.sendWelcomeEmail}
            onCheckedChange={(checked) => updateData("adminUser", { sendWelcomeEmail: !!checked })}
          />
          <Label htmlFor="sendWelcomeEmail" className="cursor-pointer">
            Send welcome email with login instructions
          </Label>
        </div>
      </div>
    </div>
  )
}
