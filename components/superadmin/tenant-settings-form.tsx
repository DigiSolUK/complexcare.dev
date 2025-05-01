"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Save, Plus, Trash } from "lucide-react"

interface TenantSettingsFormProps {
  tenantId: string
}

interface TenantSetting {
  id?: string
  tenant_id: string
  setting_key: string
  setting_value: string
}

export function TenantSettingsForm({ tenantId }: TenantSettingsFormProps) {
  const [settings, setSettings] = useState<TenantSetting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`/api/superadmin/tenants/${tenantId}/settings`)

        if (!response.ok) {
          throw new Error("Failed to fetch tenant settings")
        }

        const data = await response.json()
        setSettings(data)
      } catch (error) {
        console.error("Error fetching tenant settings:", error)
        toast({
          title: "Error",
          description: "Failed to load tenant settings. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [tenantId])

  const handleAddSetting = () => {
    setSettings([...settings, { tenant_id: tenantId, setting_key: "", setting_value: "" }])
  }

  const handleRemoveSetting = (index: number) => {
    const newSettings = [...settings]
    newSettings.splice(index, 1)
    setSettings(newSettings)
  }

  const handleSettingChange = (index: number, field: "setting_key" | "setting_value", value: string) => {
    const newSettings = [...settings]
    newSettings[index][field] = value
    setSettings(newSettings)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch(`/api/superadmin/tenants/${tenantId}/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings }),
      })

      if (!response.ok) {
        throw new Error("Failed to update tenant settings")
      }

      const updatedSettings = await response.json()
      setSettings(updatedSettings)

      toast({
        title: "Success",
        description: "Tenant settings updated successfully.",
      })
    } catch (error) {
      console.error("Error updating tenant settings:", error)
      toast({
        title: "Error",
        description: "Failed to update tenant settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenant Settings</CardTitle>
        <CardDescription>Configure custom settings for this tenant.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {settings.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No settings configured yet. Add your first setting below.
            </div>
          ) : (
            settings.map((setting, index) => (
              <div key={setting.id || index} className="flex items-center space-x-2">
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <div>
                    <Input
                      placeholder="Setting Key"
                      value={setting.setting_key}
                      onChange={(e) => handleSettingChange(index, "setting_key", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Setting Value"
                      value={setting.setting_value}
                      onChange={(e) => handleSettingChange(index, "setting_value", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveSetting(index)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}

          <Button type="button" variant="outline" size="sm" onClick={handleAddSetting} className="mt-2">
            <Plus className="mr-2 h-4 w-4" />
            Add Setting
          </Button>
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
