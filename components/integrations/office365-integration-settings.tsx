"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

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
          is_enabled: enabled
        }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to update Office 365 integration status")
      }
      
      // Update local state
      setSettings({
        ...settings,
        is_enabled: enabled
      })
      
      toast({
        title: "Integration Updated",
        description: `Office 365 integration has been ${enabled ? "enabled" : "disabled"}.`,
      })
    } catch (error) {\
      console.error("Error
