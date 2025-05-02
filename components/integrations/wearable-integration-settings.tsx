"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle2, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface WearableProvider {
  id: string
  name: string
  logo: string
  description: string
  isConfigured: boolean
  isEnabled: boolean
  apiKey?: string
  apiSecret?: string
  additionalSettings?: Record<string, any>
}

export function WearableIntegrationSettings() {
  const [providers, setProviders] = useState<WearableProvider[]>([
    {
      id: "fitbit",
      name: "Fitbit",
      logo: "/logos/fitbit.svg",
      description: "Connect to Fitbit devices to track activity, sleep, and more",
      isConfigured: false,
      isEnabled: false,
    },
    {
      id: "apple_health",
      name: "Apple Health",
      logo: "/logos/apple-health.svg",
      description: "Integrate with Apple Health to access health and fitness data",
      isConfigured: false,
      isEnabled: false,
    },
    {
      id: "google_fit",
      name: "Google Fit",
      logo: "/logos/google-fit.svg",
      description: "Connect to Google Fit to track fitness and health metrics",
      isConfigured: false,
      isEnabled: false,
    },
    {
      id: "withings",
      name: "Withings",
      logo: "/logos/withings.svg",
      description: "Integrate with Withings devices for health monitoring",
      isConfigured: false,
      isEnabled: false,
    },
    {
      id: "dexcom",
      name: "Dexcom",
      logo: "/logos/dexcom.svg",
      description: "Connect to Dexcom continuous glucose monitoring systems",
      isConfigured: false,
      isEnabled: false,
    },
  ])
  const [activeProvider, setActiveProvider] = useState<string>("fitbit")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Fetch wearable integration settings from the API
    const fetchSettings = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/wearables/settings")

        if (!response.ok) {
          throw new Error("Failed to fetch wearable integration settings")
        }

        const data = await response.json()

        // Update providers with fetched settings
        if (Array.isArray(data) && data.length > 0) {
          const updatedProviders = [...providers]

          data.forEach((setting) => {
            const providerIndex = updatedProviders.findIndex((p) => p.id === setting.provider)
            if (providerIndex !== -1) {
              updatedProviders[providerIndex] = {
                ...updatedProviders[providerIndex],
                isConfigured: true,
                isEnabled: setting.is_enabled,
                apiKey: setting.api_key,
                apiSecret: setting.api_secret,
                additionalSettings: setting.additional_settings,
              }
            }
          })

          setProviders(updatedProviders)
        }
      } catch (error) {
        console.error("Error fetching wearable integration settings:", error)
        toast({
          title: "Error",
          description: "Failed to load integration settings. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [toast])

  const handleToggleProvider = async (providerId: string, enabled: boolean) => {
    try {
      const providerIndex = providers.findIndex((p) => p.id === providerId)
      if (providerIndex === -1) return

      const provider = providers[providerIndex]

      // If enabling and not configured, don't allow
      if (enabled && !provider.isConfigured && !provider.apiKey) {
        toast({
          title: "Configuration Required",
          description: `Please configure the ${provider.name} integration before enabling it.`,
          variant: "destructive",
        })
        return
      }

      setIsSaving(true)

      const response = await fetch("/api/wearables/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: providerId,
          is_enabled: enabled,
          api_key: provider.apiKey,
          api_secret: provider.apiSecret,
          additional_settings: provider.additionalSettings,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update ${provider.name} integration status`)
      }

      // Update local state
      const updatedProviders = [...providers]
      updatedProviders[providerIndex] = {
        ...updatedProviders[providerIndex],
        isEnabled: enabled,
      }
      setProviders(updatedProviders)

      toast({
        title: "Integration Updated",
        description: `${provider.name} integration has been ${enabled ? "enabled" : "disabled"}.`,
      })
    } catch (error) {
      console.error("Error updating wearable integration:", error)
      toast({
        title: "Error",
        description: "Failed to update integration status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveProviderSettings = async (providerId: string) => {
    try {
      const providerIndex = providers.findIndex((p) => p.id === providerId)
      if (providerIndex === -1) return

      const provider = providers[providerIndex]

      // Validate required fields
      if (!provider.apiKey) {
        toast({
          title: "Missing Information",
          description: "API Key is required.",
          variant: "destructive",
        })
        return
      }

      setIsSaving(true)

      const response = await fetch("/api/wearables/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: providerId,
          is_enabled: provider.isEnabled,
          api_key: provider.apiKey,
          api_secret: provider.apiSecret,
          additional_settings: provider.additionalSettings,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to save ${provider.name} integration settings`)
      }

      // Update local state
      const updatedProviders = [...providers]
      updatedProviders[providerIndex] = {
        ...updatedProviders[providerIndex],
        isConfigured: true,
      }
      setProviders(updatedProviders)

      toast({
        title: "Settings Saved",
        description: `${provider.name} integration settings have been saved successfully.`,
      })
    } catch (error) {
      console.error("Error saving wearable integration settings:", error)
      toast({
        title: "Error",
        description: "Failed to save integration settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (providerId: string, field: string, value: string) => {
    const providerIndex = providers.findIndex((p) => p.id === providerId)
    if (providerIndex === -1) return

    const updatedProviders = [...providers]
    updatedProviders[providerIndex] = {
      ...updatedProviders[providerIndex],
      [field]: value,
    }
    setProviders(updatedProviders)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const activeProviderData = providers.find((p) => p.id === activeProvider)

  return (
    <div className="space-y-6">
      <Tabs defaultValue={activeProvider} value={activeProvider} onValueChange={setActiveProvider}>
        <TabsList className="grid grid-cols-5 mb-4">
          {providers.map((provider) => (
            <TabsTrigger key={provider.id} value={provider.id} className="relative">
              {provider.name}
              {provider.isConfigured && (
                <span className="absolute -top-1 -right-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {providers.map((provider) => (
          <TabsContent key={provider.id} value={provider.id}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{provider.name} Integration</CardTitle>
                    <CardDescription>{provider.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`${provider.id}-toggle`}>{provider.isEnabled ? "Enabled" : "Disabled"}</Label>
                    <Switch
                      id={`${provider.id}-toggle`}
                      checked={provider.isEnabled}
                      onCheckedChange={(checked) => handleToggleProvider(provider.id, checked)}
                      disabled={isSaving}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {provider.isConfigured && provider.isEnabled && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <AlertTitle>Integration Active</AlertTitle>
                    <AlertDescription>
                      This integration is properly configured and active. Patient devices can be connected.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor={`${provider.id}-api-key`}>API Key</Label>
                    <Input
                      id={`${provider.id}-api-key`}
                      type="text"
                      value={provider.apiKey || ""}
                      onChange={(e) => handleInputChange(provider.id, "apiKey", e.target.value)}
                      placeholder="Enter API key"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor={`${provider.id}-api-secret`}>API Secret</Label>
                    <Input
                      id={`${provider.id}-api-secret`}
                      type="password"
                      value={provider.apiSecret || ""}
                      onChange={(e) => handleInputChange(provider.id, "apiSecret", e.target.value)}
                      placeholder="Enter API secret"
                    />
                  </div>

                  {provider.id === "fitbit" && (
                    <div className="grid gap-2">
                      <Label htmlFor="fitbit-oauth-redirect">OAuth Redirect URI</Label>
                      <Input
                        id="fitbit-oauth-redirect"
                        type="text"
                        value="https://complexcare.dev/api/integrations/fitbit/callback"
                        readOnly
                      />
                      <p className="text-sm text-muted-foreground">
                        Use this URL in your Fitbit Developer Console as the OAuth Redirect URI
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  {provider.isConfigured
                    ? "Integration is configured. You can update settings at any time."
                    : "Configure this integration to connect patient wearable devices."}
                </p>
                <Button onClick={() => handleSaveProviderSettings(provider.id)} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Settings"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
