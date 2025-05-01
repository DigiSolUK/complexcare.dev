"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Trash2, RefreshCw, CheckCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import type { ApiKey } from "@/types"

export function ApiKeyTable() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/api-keys")
        if (!response.ok) {
          throw new Error("Failed to fetch API keys")
        }
        const data = await response.json()
        setApiKeys(data)
      } catch (err) {
        setError("Error loading API keys. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchApiKeys()
  }, [])

  const handleCopyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(id)
    toast({
      title: "API key copied",
      description: "The API key has been copied to your clipboard.",
    })

    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopiedKey(null)
    }, 2000)
  }

  const handleDeleteKey = async (id: string) => {
    if (!confirm("Are you sure you want to delete this API key? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/api-keys/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete API key")
      }

      // Remove the key from the list
      setApiKeys(apiKeys.filter((key) => key.id !== id))

      toast({
        title: "API key deleted",
        description: "The API key has been permanently deleted.",
      })
    } catch (err) {
      console.error(err)
      toast({
        title: "Error",
        description: "Failed to delete API key. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="flex justify-center p-4">Loading API keys...</div>
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>
  }

  if (apiKeys.length === 0) {
    return <div className="text-center p-8 text-gray-500">No API keys found. Create a new API key to get started.</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Key</TableHead>
          <TableHead>Scopes</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead>Last Used</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {apiKeys.map((apiKey) => (
          <TableRow key={apiKey.id}>
            <TableCell className="font-medium">{apiKey.name}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <code className="rounded bg-muted px-2 py-1 text-sm">{apiKey.key}</code>
                <Button variant="ghost" size="icon" onClick={() => handleCopyKey(apiKey.key, apiKey.id)}>
                  {copiedKey === apiKey.id ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {apiKey.scopes.map((scope) => (
                  <Badge key={scope} variant="outline" className="bg-primary/10 text-primary">
                    {scope}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>{new Date(apiKey.created_at).toLocaleDateString()}</TableCell>
            <TableCell>{apiKey.expires_at ? new Date(apiKey.expires_at).toLocaleDateString() : "Never"}</TableCell>
            <TableCell>
              {apiKey.last_used_at ? new Date(apiKey.last_used_at).toLocaleDateString() : "Never used"}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    /* Implement refresh functionality */
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-destructive"
                  onClick={() => handleDeleteKey(apiKey.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
