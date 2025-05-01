"use client"

import { useWizardContext } from "../wizard-context"
import { WizardStep } from "../wizard-step"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function AdminUserStep() {
  const { state, updateAdminUser } = useWizardContext()

  const passwordsMatch = state.adminUser.password === state.adminUser.confirmPassword
  const passwordLongEnough = state.adminUser.password.length >= 8
  const showPasswordError = state.adminUser.password && (!passwordLongEnough || !passwordsMatch)

  return (
    <WizardStep title="Admin User" description="Set up the primary administrator for this tenant">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              placeholder="First name"
              value={state.adminUser.firstName}
              onChange={(e) => updateAdminUser({ firstName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lastName"
              placeholder="Last name"
              value={state.adminUser.lastName}
              onChange={(e) => updateAdminUser({ lastName: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@organization.com"
            value={state.adminUser.email}
            onChange={(e) => updateAdminUser({ email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">
            Password <span className="text-red-500">*</span>
          </Label>
          <Input
            id="password"
            type="password"
            value={state.adminUser.password}
            onChange={(e) => updateAdminUser({ password: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">
            Confirm Password <span className="text-red-500">*</span>
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            value={state.adminUser.confirmPassword}
            onChange={(e) => updateAdminUser({ confirmPassword: e.target.value })}
          />
        </div>

        {showPasswordError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {!passwordLongEnough && "Password must be at least 8 characters long. "}
              {!passwordsMatch && "Passwords do not match."}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </WizardStep>
  )
}
