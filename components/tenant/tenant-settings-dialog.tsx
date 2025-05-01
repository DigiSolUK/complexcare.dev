"use client"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Tenant = {
  id: string
  name: string
  domain: string
  status: "active" | "inactive" | "suspended"
  plan: "basic" | "professional" | "enterprise"
  usersCount: number
  createdAt: string
}

interface TenantSettingsDialogProps {
  tenant: Tenant
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (tenant: Tenant) => void
}

export function TenantSettingsDialog({ tenant, open, onOpenChange, onSave }: TenantSettingsDialogProps) {
  const [editedTenant, setEditedTenant] = useState<Tenant>({ ...tenant })
  const [activeTab, setActiveTab] = useState("general")

  const handleSave = () => {
    onSave(editedTenant)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tenant Settings</DialogTitle>
          <DialogDescription>Configure settings for {tenant.name}</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="limits">Limits & Features</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={editedTenant.name}
                onChange={(e) => setEditedTenant({ ...editedTenant, name: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="domain" className="text-right">
                Domain
              </Label>
              <Input
                id="domain"
                value={editedTenant.domain}
                onChange={(e) => setEditedTenant({ ...editedTenant, domain: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={editedTenant.status}
                onValueChange={(value: "active" | "inactive" | "suspended") =>
                  setEditedTenant({ ...editedTenant, status: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plan" className="text-right">
                Plan
              </Label>
              <Select
                value={editedTenant.plan}
                onValueChange={(value: "basic" | "professional" | "enterprise") =>
                  setEditedTenant({ ...editedTenant, plan: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="branding" className="space-y-4 mt-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="logo" className="text-right">
                Logo URL
              </Label>
              <Input id="logo" placeholder="https://example.com/logo.png" className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="primary-color" className="text-right">
                Primary Color
              </Label>
              <div className="flex col-span-3 gap-2">
                <Input id="primary-color" placeholder="#007bff" />
                <Input type="color" className="w-12 p-1 h-10" defaultValue="#007bff" />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="favicon" className="text-right">
                Favicon URL
              </Label>
              <Input id="favicon" placeholder="https://example.com/favicon.ico" className="col-span-3" />
            </div>
          </TabsContent>

          <TabsContent value="limits" className="space-y-4 mt-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="user-limit" className="text-right">
                User Limit
              </Label>
              <Input id="user-limit" type="number" placeholder="50" className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="storage-limit" className="text-right">
                Storage Limit (GB)
              </Label>
              <Input id="storage-limit" type="number" placeholder="100" className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Features</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="feature-ai" defaultChecked />
                  <label htmlFor="feature-ai">AI Tools</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="feature-reports" defaultChecked />
                  <label htmlFor="feature-reports">Advanced Reports</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="feature-api" defaultChecked />
                  <label htmlFor="feature-api">API Access</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="feature-integrations" />
                  <label htmlFor="feature-integrations">Third-party Integrations</label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
