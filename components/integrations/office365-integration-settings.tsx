"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Mail, Calendar, XCircle, RefreshCw } from "lucide-react"
import { AnimatedContainer } from "@/components/ui/animated-container"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface Office365Settings {
  id?: string
  tenant_id?: string
  is_enabled: boolean
  client_id: string
  client_secret: string
  tenant_name: string
  redirect_uri: string
  scopes: string[]
}

interface ConnectedUser {
  id: string
  user_id: string
  email: string
  name: string
  last_sync: string
  status: "connected" | "disconnected" | "error"
}

export function Office365IntegrationSettings() {
  const [settings, setSettings] = useState<Office365Settings>({
    is_enabled: false,
    client_id: "",
    client_secret: "",
    tenant_name: "",
    redirect_uri: "https://complexcare.dev/api/integrations/office365/callback",
    scopes: ["Mail.Read", "Mail.Send", "Calendars.ReadWrite"],
  })
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Fetch Office 365 integration settings from the API
    const fetchSettings = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/integrations/office365/settings")

        if (!response.ok) {
          throw new Error("Failed to fetch Office 365 integration settings")
        }

        const data = await response.json()

        if (data) {
          setSettings({
            id: data.id,
            tenant_id: data.tenant_id,
            is_enabled: data.is_enabled,
            client_id: data.client_id || "",
            client_secret: data.client_secret || "",
            tenant_name: data.tenant_name || "",
            redirect_uri: data.redirect_uri || "https://complexcare.dev/api/integrations/office365/callback",
            scopes: data.scopes || ["Mail.Read", "Mail.Send", "Calendars.ReadWrite"],
          })
        }

        // Also fetch connected users
        const usersResponse = await fetch("/api/integrations/office365/users")

        if (usersResponse.ok) {
          const usersData = await usersResponse.json()
          setConnectedUsers(usersData || [])
        }
      } catch (error) {
        console.error("Error fetching Office 365 integration settings:", error)
        toast({
          title: "Error",
          description: "Failed to load Office 365 integration settings. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [toast])

  const handleToggleIntegration = async (enabled: boolean) => {
    try {
      // If enabling and not configured, don't allow
      if (enabled && (!settings.client_id || !settings.client_secret || !settings.tenant_name)) {
        toast({
          title: "Configuration Required",
          description: "Please configure the Office 365 integration before enabling it.",
          variant: "destructive",
        })
        return
      }

      setIsSaving(true)

      const response = await fetch("/api/integrations/office365/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...settings,
          is_enabled: enabled,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update Office 365 integration status")
      }

      // Update local state
      setSettings({
        ...settings,
        is_enabled: enabled,
      })

      toast({
        title: "Integration Updated",
        description: `Office 365 integration has been ${enabled ? "enabled" : "disabled"}.`,
      })
    } catch (error) {
      console.error("Error updating Office 365 integration status:", error)
      toast({
        title: "Error",
        description: "Failed to update Office 365 integration status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true)

      const response = await fetch("/api/integrations/office365/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error("Failed to save Office 365 integration settings")
      }

      const data = await response.json()

      // Update local state with returned data
      setSettings({
        ...settings,
        id: data.id,
        tenant_id: data.tenant_id,
      })

      toast({
        title: "Settings Saved",
        description: "Office 365 integration settings have been saved successfully.",
      })
    } catch (error) {
      console.error("Error saving Office 365 integration settings:", error)
      toast({
        title: "Error",
        description: "Failed to save Office 365 integration settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings({
      ...settings,
      [name]: value,
    })
  }

  const handleDisconnectUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/integrations/office365/users/${userId}/disconnect`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to disconnect user")
      }

      // Update the local state
      setConnectedUsers(
        connectedUsers.map((user) => (user.user_id === userId ? { ...user, status: "disconnected" } : user)),
      )

      toast({
        title: "User Disconnected",
        description: "User has been disconnected from Office 365 integration.",
      })
    } catch (error) {
      console.error("Error disconnecting user:", error)
      toast({
        title: "Error",
        description: "Failed to disconnect user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRefreshConnections = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/integrations/office365/users/refresh", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to refresh connections")
      }

      const data = await response.json()
      setConnectedUsers(data || [])

      toast({
        title: "Connections Refreshed",
        description: "Office 365 connections have been refreshed.",
      })
    } catch (error) {
      console.error("Error refreshing connections:", error)
      toast({
        title: "Error",
        description: "Failed to refresh connections. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "disconnected":
        return <XCircle className="h-4 w-4 text-gray-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <AnimatedContainer>
      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="users">Connected Users</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Office 365 Integration</CardTitle>
                  <CardDescription>
                    Configure Microsoft Office 365 integration for email and calendar synchronization.
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch checked={settings.is_enabled} onCheckedChange={handleToggleIntegration} disabled={isSaving} />
                  <span>{settings.is_enabled ? "Enabled" : "Disabled"}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tenant_name">Microsoft 365 Tenant Name</Label>
                    <Input
                      id="tenant_name"
                      name="tenant_name"
                      value={settings.tenant_name}
                      onChange={handleInputChange}
                      placeholder="yourtenant.onmicrosoft.com"
                      disabled={settings.is_enabled}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="redirect_uri">Redirect URI</Label>
                    <Input
                      id="redirect_uri"
                      name="redirect_uri"
                      value={settings.redirect_uri}
                      onChange={handleInputChange}
                      disabled={true}
                    />
                    <p className="text-xs text-muted-foreground">
                      Add this URL to your Azure AD app registration's redirect URIs.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_id">Client ID</Label>
                  <Input
                    id="client_id"
                    name="client_id"
                    value={settings.client_id}
                    onChange={handleInputChange}
                    placeholder="Enter your Azure AD application client ID"
                    disabled={settings.is_enabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_secret">Client Secret</Label>
                  <Input
                    id="client_secret"
                    name="client_secret"
                    type="password"
                    value={settings.client_secret}
                    onChange={handleInputChange}
                    placeholder="Enter your Azure AD application client secret"
                    disabled={settings.is_enabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Required Permissions</Label>
                  <div className="flex flex-wrap gap-2">
                    {settings.scopes.map((scope) => (
                      <Badge key={scope} variant="outline">
                        {scope}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ensure these permissions are granted to your Azure AD application.
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() =>
                  window.open(
                    "https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade",
                    "_blank",
                  )
                }
              >
                Azure Portal
              </Button>
              <Button onClick={handleSaveSettings} disabled={isSaving || settings.is_enabled}>
                {isSaving ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Connected Users</CardTitle>
                  <CardDescription>Manage users connected to Office 365.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleRefreshConnections} disabled={isLoading}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {connectedUsers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No users are currently connected to Office 365.</p>
                  <p className="text-sm mt-2">Users can connect their accounts from their profile settings.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {connectedUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col">
                          <span className="font-medium">{user.name}</span>
                          <span className="text-sm text-muted-foreground">{user.email}</span>
                          <div className="flex items-center mt-1 space-x-2">
                            <span className="flex items-center text-xs">
                              {getStatusIcon(user.status)}
                              <span className="ml-1 capitalize">{user.status}</span>
                            </span>
                            <Separator orientation="vertical" className="h-3" />
                            <span className="flex items-center text-xs">
                              <Mail className="h-3 w-3 mr-1" />
                              <span>Email</span>
                            </span>
                            <Separator orientation="vertical" className="h-3" />
                            <span className="flex items-center text-xs">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>Calendar</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDisconnectUser(user.user_id)}
                          disabled={user.status === "disconnected"}
                        >
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AnimatedContainer>
  )
}
