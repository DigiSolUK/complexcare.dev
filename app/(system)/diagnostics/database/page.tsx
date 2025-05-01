"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DatabaseDiagnostics() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [tenantId, setTenantId] = useState("")

  async function fetchDiagnostics() {
    setLoading(true)
    try {
      const res = await fetch("/api/diagnostics/database")
      if (!res.ok) throw new Error(`HTTP error ${res.status}`)
      const data = await res.json()
      setData(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  async function fetchPatientDiagnostics() {
    setLoading(true)
    try {
      const res = await fetch("/api/diagnostics/patients")
      if (!res.ok) throw new Error(`HTTP error ${res.status}`)
      const data = await res.json()
      setData(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  async function createTestPatient() {
    if (!tenantId) {
      setError("Please enter a tenant ID")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/diagnostics/patients?createTest=true&tenantId=${tenantId}`)
      if (!res.ok) throw new Error(`HTTP error ${res.status}`)
      const data = await res.json()
      setData(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDiagnostics()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Database Diagnostics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Database Connection</CardTitle>
            <CardDescription>Check database connection and schema</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={fetchDiagnostics} disabled={loading}>
              {loading ? "Loading..." : "Check Database"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patient Diagnostics</CardTitle>
            <CardDescription>Check patient table and data</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={fetchPatientDiagnostics} disabled={loading}>
              {loading ? "Loading..." : "Check Patients"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create Test Patient</CardTitle>
          <CardDescription>Create a test patient for a specific tenant</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="tenantId">Tenant ID</Label>
              <Input
                id="tenantId"
                placeholder="Enter tenant ID"
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={createTestPatient} disabled={loading}>
            {loading ? "Creating..." : "Create Test Patient"}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {data && (
        <Card>
          <CardHeader>
            <CardTitle>Diagnostic Results</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">{JSON.stringify(data, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
