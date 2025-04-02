"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Clipboard, RefreshCw, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function ApiKeysSection() {
  const { toast } = useToast()
  const [showApiKey, setShowApiKey] = useState(false)
  const [apiKey, setApiKey] = useState("••••••••••••••••••••••••••••••")
  const [isRegenerating, setIsRegenerating] = useState(false)

  const toggleApiKeyVisibility = () => {
    if (showApiKey) {
      setShowApiKey(false)
    } else {
      // In a real app, this would fetch the actual API key from the server
      setApiKey("sk_live_51NxT8rJKmJHYUZ9qLmVbT7dKs")
      setShowApiKey(true)
    }
  }

  const copyApiKey = () => {
    // In a real app, this would fetch the actual API key from the server before copying
    navigator.clipboard.writeText("sk_live_51NxT8rJKmJHYUZ9qLmVbT7dKs")
    toast({
      title: "API Key copied",
      description: "The API key has been copied to your clipboard.",
    })
  }

  const regenerateApiKey = () => {
    setIsRegenerating(true)

    // Simulate API call
    setTimeout(() => {
      setApiKey("••••••••••••••••••••••••••••••")
      setShowApiKey(false)
      setIsRegenerating(false)
      toast({
        title: "API Key regenerated",
        description: "Your new API key has been generated. The old key is no longer valid.",
      })
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage your API keys for accessing the ComplexCare API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="api-key">Primary API Key</Label>
              <Badge variant="outline" className="text-green-600 bg-green-50">
                Active
              </Badge>
            </div>
            <div className="flex gap-2">
              <Input
                id="api-key"
                value={apiKey}
                type={showApiKey ? "text" : "password"}
                readOnly
                className="font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={toggleApiKeyVisibility}
                title={showApiKey ? "Hide API key" : "Show API key"}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon" onClick={copyApiKey} title="Copy API key">
                <Clipboard className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              This key grants full access to the ComplexCare API. Keep it secure and do not share it publicly.
            </p>
          </div>

          <div className="pt-4">
            <Button variant="destructive" onClick={regenerateApiKey} disabled={isRegenerating} className="gap-2">
              {isRegenerating && <RefreshCw className="h-4 w-4 animate-spin" />}
              Regenerate API Key
            </Button>
            <p className="mt-2 text-sm text-muted-foreground">
              Warning: Regenerating your API key will invalidate your existing key and any applications using it will
              stop working.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Usage</CardTitle>
          <CardDescription>Monitor your API usage and limits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Requests (30 days)</p>
                <p className="text-2xl font-bold">12,543</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Rate Limit</p>
                <p className="text-2xl font-bold">100/min</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Plan</p>
                <p className="text-2xl font-bold">Professional</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span>Monthly quota usage</span>
                <span className="font-medium">42%</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "42%" }}></div>
              </div>
              <p className="text-xs text-muted-foreground">12,543 of 30,000 requests used this month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Access Control</CardTitle>
          <CardDescription>Manage access restrictions for your API keys</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="allowed-origins">Allowed Origins</Label>
            <Input
              id="allowed-origins"
              placeholder="https://example.com, https://app.example.com"
              defaultValue="https://complexcare.uk, https://app.complexcare.uk"
            />
            <p className="text-sm text-muted-foreground">
              Comma-separated list of domains that are allowed to use your API key
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ip-restrictions">IP Restrictions</Label>
            <Input
              id="ip-restrictions"
              placeholder="192.168.1.1, 10.0.0.0/24"
              defaultValue="86.45.213.182, 212.58.244.0/24"
            />
            <p className="text-sm text-muted-foreground">
              Comma-separated list of IP addresses or CIDR ranges that are allowed to use your API key
            </p>
          </div>

          <div className="pt-2">
            <Button>Save Access Control Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

