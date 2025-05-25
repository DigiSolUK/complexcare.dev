"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { InfoIcon, Plus, Edit, Trash2, Eye, EyeOff, RefreshCw } from "lucide-react"

interface ApiKey {
  id: string
  serviceName: string
  apiKey: string
  apiSecret?: string
  apiUrl?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy?: string
}

export function ApiKeysManagement() {
  const [activeTab, setActiveTab] = useState("GP_CONNECT")
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentApiKey, setCurrentApiKey] = useState<ApiKey | null>(null)
  const [showSecret, setShowSecret] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    serviceName: "GP_CONNECT",
    apiKey: "",
    apiSecret: "",
    apiUrl: "",
    isActive: true,
  })

  // Fetch API keys on component mount
  useEffect(() => {
    fetchApiKeys()
  }, [])

  // Fetch API keys
  const fetchApiKeys = async () => {
    setLoading(true)
    try {
      // In a real implementation, this would fetch from an API
      // For demo purposes, we'll use mock data
      const mockApiKeys: ApiKey[] = [
        {
          id: "1",
          serviceName: "GP_CONNECT",
          apiKey: "demo-gp-connect-key",
          apiSecret: "demo-gp-connect-secret",
          apiUrl: "https://api.gp-connect.nhs.uk/v1",
          isActive: true,
          createdAt: "2023-01-15T10:30:00Z",
          updatedAt: "2023-01-15T10:30:00Z",
          createdBy: "admin",
        },
        {
          id: "2",
          serviceName: "DM_AND_D",
          apiKey: "demo-dmd-key",
          apiSecret: "demo-dmd-secret",
          apiUrl: "https://dmd-browser.nhsbsa.nhs.uk",
          isActive: true,
          createdAt: "2023-01-15T10:35:00Z",
          updatedAt: "2023-01-15T10:35:00Z",
          createdBy: "admin",
        },
      ]

      setApiKeys(mockApiKeys)
      setError(null)
    } catch (err) {
      console.error("Error fetching API keys:", err)
      setError("Failed to load API keys. Please try again.")
      toast({
        title: "Error",
        description: "Failed to load API keys",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle switch changes
  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }))
  }

  // Handle add form submission
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // In a real implementation, this would call an API
      // For demo purposes, we'll simulate adding a new API key
      const newApiKey: ApiKey = {
        id: Math.random().toString(36).substring(2, 9),
        serviceName: formData.serviceName,
        apiKey: formData.apiKey,
        apiSecret: formData.apiSecret,
        apiUrl: formData.apiUrl,
        isActive: formData.isActive,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "current-user",
      }

      setApiKeys((prev) => [...prev, newApiKey])
      setIsAddDialogOpen(false)
      setFormData({
        serviceName: "GP_CONNECT",
        apiKey: "",
        apiSecret: "",
        apiUrl: "",
        isActive: true,
      })

      toast({
        title: "Success",
        description: "API key added successfully",
      })
    } catch (error) {
      console.error("Error adding API key:", error)
      toast({
        title: "Error",
        description: "Failed to add API key",
        variant: "destructive",
      })
    }
  }

  // Handle edit form submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentApiKey) return

    try {
      // In a real implementation, this would call an API
      // For demo purposes, we'll simulate updating the API key
      const updatedApiKeys = apiKeys.map((key) =>
        key.id === currentApiKey.id
          ? {
              ...key,
              apiKey: formData.apiKey,
              apiSecret: formData.apiSecret,
              apiUrl: formData.apiUrl,
              isActive: formData.isActive,
              updatedAt: new Date().toISOString(),
              updatedBy: "current-user",
            }
          : key,
      )

      setApiKeys(updatedApiKeys)
      setIsEditDialogOpen(false)
      setCurrentApiKey(null)

      toast({
        title: "Success",
        description: "API key updated successfully",
      })
    } catch (error) {
      console.error("Error updating API key:", error)
      toast({
        title: "Error",
        description: "Failed to update API key",
        variant: "destructive",
      })
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!currentApiKey) return

    try {
      // In a real implementation, this would call an API
      // For demo purposes, we'll simulate deleting the API key
      const updatedApiKeys = apiKeys.filter((key) => key.id !== currentApiKey.id)

      setApiKeys(updatedApiKeys)
      setIsDeleteDialogOpen(false)
      setCurrentApiKey(null)

      toast({
        title: "Success",
        description: "API key deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting API key:", error)
      toast({
        title: "Error",
        description: "Failed to delete API key",
        variant: "destructive",
      })
    }
  }

  // Open edit dialog
  const openEditDialog = (apiKey: ApiKey) => {
    setCurrentApiKey(apiKey)
    setFormData({
      serviceName: apiKey.serviceName,
      apiKey: apiKey.apiKey,
      apiSecret: apiKey.apiSecret || "",
      apiUrl: apiKey.apiUrl || "",
      isActive: apiKey.isActive,
    })
    setIsEditDialogOpen(true)
  }

  // Open delete dialog
  const openDeleteDialog = (apiKey: ApiKey) => {
    setCurrentApiKey(apiKey)
    setIsDeleteDialogOpen(true)
  }

  // Render API keys table
  const renderApiKeysTable = () => {
    const filteredKeys = apiKeys.filter((key) => key.serviceName === activeTab)

    if (filteredKeys.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p>No API keys found for this service.</p>
          <Button variant="outline" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add API Key
          </Button>
        </div>
      )
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>API Key</TableHead>
            <TableHead>API URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredKeys.map((apiKey) => (
            <TableRow key={apiKey.id}>
              <TableCell className="font-medium">{apiKey.apiKey}</TableCell>
              <TableCell>{apiKey.apiUrl || "Default URL"}</TableCell>
              <TableCell>
                {apiKey.isActive ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Inactive
                  </span>
                )}
              </TableCell>
              <TableCell>{new Date(apiKey.updatedAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(apiKey)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(apiKey)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>API Keys Management</CardTitle>
            <CardDescription>Manage API keys for external services</CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add API Key
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <Button variant="outline" size="sm" className="mt-2" onClick={fetchApiKeys}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </Alert>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="GP_CONNECT">GP Connect</TabsTrigger>
              <TabsTrigger value="DM_AND_D">dm+d</TabsTrigger>
              <TabsTrigger value="OTHER">Other Services</TabsTrigger>
            </TabsList>

            <TabsContent value="GP_CONNECT">
              <div className="space-y-4">
                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>GP Connect Integration</AlertTitle>
                  <AlertDescription>
                    GP Connect provides access to patient data from GP systems. You will need to register with NHS
                    Digital to obtain API credentials.
                  </AlertDescription>
                </Alert>
                {renderApiKeysTable()}
              </div>
            </TabsContent>

            <TabsContent value="DM_AND_D">
              <div className="space-y-4">
                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>Dictionary of Medicines and Devices (dm+d)</AlertTitle>
                  <AlertDescription>
                    The dm+d provides a standardized dictionary of medicines and devices used across the NHS. API access
                    allows you to search and retrieve medication information.
                  </AlertDescription>
                </Alert>
                {renderApiKeysTable()}
              </div>
            </TabsContent>

            <TabsContent value="OTHER">
              <div className="space-y-4">
                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>Other Healthcare Services</AlertTitle>
                  <AlertDescription>
                    Manage API keys for additional healthcare services and integrations.
                  </AlertDescription>
                </Alert>
                {renderApiKeysTable()}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Add API Key Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add API Key</DialogTitle>
              <DialogDescription>Add a new API key for external service integration.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="serviceName">Service</Label>
                <select
                  id="serviceName"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, serviceName: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="GP_CONNECT">GP Connect</option>
                  <option value="DM_AND_D">dm+d</option>
                  <option value="OTHER">Other Service</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input id="apiKey" name="apiKey" value={formData.apiKey} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiSecret">API Secret</Label>
                <div className="relative">
                  <Input
                    id="apiSecret"
                    name="apiSecret"
                    type={showSecret ? "text" : "password"}
                    value={formData.apiSecret}
                    onChange={handleChange}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowSecret(!showSecret)}
                  >
                    {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiUrl">API URL (Optional)</Label>
                <Input
                  id="apiUrl"
                  name="apiUrl"
                  value={formData.apiUrl}
                  onChange={handleChange}
                  placeholder="Leave blank to use default URL"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add API Key</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit API Key Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit API Key</DialogTitle>
              <DialogDescription>Update API key details for {currentApiKey?.serviceName}.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-apiKey">API Key</Label>
                <Input id="edit-apiKey" name="apiKey" value={formData.apiKey} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-apiSecret">API Secret</Label>
                <div className="relative">
                  <Input
                    id="edit-apiSecret"
                    name="apiSecret"
                    type={showSecret ? "text" : "password"}
                    value={formData.apiSecret}
                    onChange={handleChange}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowSecret(!showSecret)}
                  >
                    {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-apiUrl">API URL (Optional)</Label>
                <Input
                  id="edit-apiUrl"
                  name="apiUrl"
                  value={formData.apiUrl}
                  onChange={handleChange}
                  placeholder="Leave blank to use default URL"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="edit-isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="edit-isActive">Active</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete API Key</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this API key? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {currentApiKey && (
                <div className="space-y-2">
                  <p>
                    <strong>Service:</strong> {currentApiKey.serviceName}
                  </p>
                  <p>
                    <strong>API Key:</strong> {currentApiKey.apiKey}
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
