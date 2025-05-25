"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Shield, Settings, TestTube, CheckCircle2, XCircle, AlertCircle, RefreshCw, Eye, EyeOff } from "lucide-react"

interface GPConnectConfigurationProps {
  tenantId: string
}

export function GPConnectConfiguration({ tenantId }: GPConnectConfigurationProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [showSecrets, setShowSecrets] = useState(false)
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)

  const [config, setConfig] = useState({
    apiEndpoint: "",
    clientId: "",
    clientSecret: "",
    jwtPrivateKey: "",
    jwtKeyId: "",
    spineAsid: "",
    spinePartyKey: "",
    enabled: false,
  })

  const [lastTest, setLastTest] = useState<{
    testedAt?: Date
    status?: string
    message?: string
  }>({})

  useEffect(() => {
    fetchConfiguration()
  }, [tenantId])

  const fetchConfiguration = async () => {
    try {
      const response = await fetch(`/api/tenants/${tenantId}/gp-connect-config`)

      if (response.ok) {
        const data = await response.json()
        setConfig({
          apiEndpoint: data.apiEndpoint || "",
          clientId: data.clientId || "",
          clientSecret: data.clientSecret || "",
          jwtPrivateKey: data.jwtPrivateKey || "",
          jwtKeyId: data.jwtKeyId || "",
          spineAsid: data.spineAsid || "",
          spinePartyKey: data.spinePartyKey || "",
          enabled: data.enabled || false,
        })

        setLastTest({
          testedAt: data.lastTestedAt ? new Date(data.lastTestedAt) : undefined,
          status: data.lastTestStatus,
          message: data.lastTestMessage,
        })
      }
    } catch (error) {
      console.error("Error fetching GP Connect configuration:", error)
      toast({
        title: "Error",
        description: "Failed to load GP Connect configuration",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setConfig((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setConfig((prev) => ({ ...prev, enabled: checked }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/tenants/${tenantId}/gp-connect-config`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      })

      if (!response.ok) {
        throw new Error("Failed to save configuration")
      }

      toast({
        title: "Success",
        description: "GP Connect configuration saved successfully",
      })
    } catch (error) {
      console.error("Error saving GP Connect configuration:", error)
      toast({
        title: "Error",
        description: "Failed to save GP Connect configuration",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async () => {
    setTesting(true)
    setTestResults(null)

    try {
      const response = await fetch(`/api/tenants/${tenantId}/gp-connect-config/test`, {
        method: "POST",
      })

      const result = await response.json()

      setTestResults(result)
      setIsTestDialogOpen(true)

      if (result.success) {
        setLastTest({
          testedAt: new Date(),
          status: "success",
          message: result.message,
        })

        toast({
          title: "Success",
          description: "GP Connect connection test successful",
        })
      } else {
        setLastTest({
          testedAt: new Date(),
          status: "failed",
          message: result.message,
        })

        toast({
          title: "Connection Test Failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error testing GP Connect connection:", error)
      toast({
        title: "Error",
        description: "Failed to test GP Connect connection",
        variant: "destructive",
      })
    } finally {
      setTesting(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>GP Connect Configuration</CardTitle>
          <CardDescription>Loading configuration...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              GP Connect Configuration
            </CardTitle>
            <CardDescription>Configure your GP Connect API integration for accessing patient records</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => setShowSecrets(!showSecrets)}>
              {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {lastTest.testedAt && (
          <Alert
            className="mb-6"
            variant={
              lastTest.status === "success" ? "default" : lastTest.status === "failed" ? "destructive" : "default"
            }
          >
            {lastTest.status === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : lastTest.status === "failed" ? (
              <XCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>Last Connection Test</AlertTitle>
            <AlertDescription>
              <div>
                <span className="font-medium">Tested:</span>{" "}
                {lastTest.testedAt ? new Date(lastTest.testedAt).toLocaleString() : "Never"}
              </div>
              <div>
                <span className="font-medium">Status:</span> {lastTest.status || "Not tested"}
              </div>
              {lastTest.message && (
                <div>
                  <span className="font-medium">Message:</span> {lastTest.message}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="connection" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="spine">Spine Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="connection" className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enabled">Enable GP Connect Integration</Label>
                  <p className="text-sm text-muted-foreground">
                    When enabled, the system will sync patient data from GP Connect
                  </p>
                </div>
                <Switch id="enabled" checked={config.enabled} onCheckedChange={handleSwitchChange} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="apiEndpoint">API Endpoint URL</Label>
                <Input
                  id="apiEndpoint"
                  name="apiEndpoint"
                  value={config.apiEndpoint}
                  onChange={handleChange}
                  placeholder="https://api.gpconnect.nhs.uk/fhir"
                />
                <p className="text-sm text-muted-foreground">The base URL for the GP Connect FHIR API</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="authentication" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="clientId">Client ID</Label>
                <Input
                  id="clientId"
                  name="clientId"
                  type={showSecrets ? "text" : "password"}
                  value={config.clientId}
                  onChange={handleChange}
                  placeholder="Enter your GP Connect client ID"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="clientSecret">Client Secret</Label>
                <Input
                  id="clientSecret"
                  name="clientSecret"
                  type={showSecrets ? "text" : "password"}
                  value={config.clientSecret}
                  onChange={handleChange}
                  placeholder="Enter your GP Connect client secret"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="jwtKeyId">JWT Key ID</Label>
                <Input
                  id="jwtKeyId"
                  name="jwtKeyId"
                  value={config.jwtKeyId}
                  onChange={handleChange}
                  placeholder="Enter your JWT key ID"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="jwtPrivateKey">JWT Private Key (PEM format)</Label>
                <Textarea
                  id="jwtPrivateKey"
                  name="jwtPrivateKey"
                  value={config.jwtPrivateKey}
                  onChange={handleChange}
                  rows={10}
                  className="font-mono text-sm"
                  placeholder="-----BEGIN RSA PRIVATE KEY-----&#10;...&#10;-----END RSA PRIVATE KEY-----"
                />
                <p className="text-sm text-muted-foreground">
                  Paste your RSA private key in PEM format for JWT signing
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="spine" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="spineAsid">Spine ASID</Label>
                <Input
                  id="spineAsid"
                  name="spineAsid"
                  value={config.spineAsid}
                  onChange={handleChange}
                  placeholder="Enter your Spine ASID"
                />
                <p className="text-sm text-muted-foreground">Your organisation's Application Service ID for Spine</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="spinePartyKey">Spine Party Key (ODS Code)</Label>
                <Input
                  id="spinePartyKey"
                  name="spinePartyKey"
                  value={config.spinePartyKey}
                  onChange={handleChange}
                  placeholder="Enter your organisation's ODS code"
                />
                <p className="text-sm text-muted-foreground">Your organisation's ODS code for Spine identification</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleTest} disabled={testing || !config.enabled}>
            {testing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <TestTube className="mr-2 h-4 w-4" />
                Test Connection
              </>
            )}
          </Button>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Settings className="mr-2 h-4 w-4" />
                Save Configuration
              </>
            )}
          </Button>
        </div>
      </CardContent>

      {/* Test Results Dialog */}
      <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connection Test Results</DialogTitle>
            <DialogDescription>Results of the GP Connect API connection test</DialogDescription>
          </DialogHeader>

          {testResults && (
            <div className="space-y-4">
              <div className={`flex items-center space-x-2 ${testResults.success ? "text-green-600" : "text-red-600"}`}>
                {testResults.success ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                <span className="font-medium">{testResults.success ? "Success" : "Failed"}</span>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Message:</p>
                <p className="text-sm text-muted-foreground">{testResults.message}</p>
              </div>

              {testResults.details && (
                <div>
                  <p className="text-sm font-medium mb-1">Details:</p>
                  <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(testResults.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTestDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
