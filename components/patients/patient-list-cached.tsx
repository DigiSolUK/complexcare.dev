"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, RefreshCw, Search, Trash } from "lucide-react"

export default function PatientListCached() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [cacheStats, setCacheStats] = useState(null)
  const [responseTime, setResponseTime] = useState(null)
  const [dataSource, setDataSource] = useState("")

  const fetchPatients = async () => {
    setLoading(true)
    const startTime = performance.now()

    try {
      const response = await fetch(`/api/patients${searchTerm ? `?search=${searchTerm}` : ""}`)
      const data = await response.json()

      setPatients(data)
      setResponseTime(Math.round(performance.now() - startTime))

      // Check response headers for cache info
      const source = response.headers.get("X-Data-Source") || "unknown"
      setDataSource(source)
    } catch (error) {
      console.error("Error fetching patients:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCacheStats = async () => {
    try {
      const response = await fetch("/api/patients/cache-stats")
      const data = await response.json()
      setCacheStats(data.cacheStats)
    } catch (error) {
      console.error("Error fetching cache stats:", error)
    }
  }

  const warmupCache = async () => {
    try {
      await fetch("/api/patients/cache-stats", { method: "POST" })
      await fetchCacheStats()
      await fetchPatients()
    } catch (error) {
      console.error("Error warming up cache:", error)
    }
  }

  const clearCache = async () => {
    try {
      await fetch("/api/patients/cache-stats", { method: "DELETE" })
      await fetchCacheStats()
      setDataSource("")
    } catch (error) {
      console.error("Error clearing cache:", error)
    }
  }

  useEffect(() => {
    fetchPatients()
    fetchCacheStats()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchPatients()
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Patients (with Redis Caching)</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={warmupCache}
              title="Warm up cache with frequently accessed patients"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Warm Cache
            </Button>
            <Button variant="outline" size="sm" onClick={clearCache} title="Clear all patient data from cache">
              <Trash className="h-4 w-4 mr-2" />
              Clear Cache
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <form onSubmit={handleSearch} className="flex-1 flex space-x-2">
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Button type="submit" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
          </div>

          {responseTime && (
            <div className="mb-4 flex items-center space-x-2">
              <Badge variant={dataSource === "cache" ? "success" : "default"}>
                {dataSource === "cache" ? "From Cache" : "From Database"}
              </Badge>
              <span className="text-sm text-muted-foreground">Response time: {responseTime}ms</span>
            </div>
          )}

          {cacheStats && (
            <div className="mb-4 grid grid-cols-3 gap-4 text-sm">
              <div className="bg-muted p-2 rounded">
                <div className="font-medium">Cache Hit Ratio</div>
                <div>{Math.round(cacheStats.cacheHitRatio * 100)}%</div>
              </div>
              <div className="bg-muted p-2 rounded">
                <div className="font-medium">Patients in Cache</div>
                <div>{cacheStats.patientKeysInCache}</div>
              </div>
              <div className="bg-muted p-2 rounded">
                <div className="font-medium">Total Patients</div>
                <div>{cacheStats.patientsInDatabase}</div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Contact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.length > 0 ? (
                  patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">
                        {patient.first_name} {patient.last_name}
                      </TableCell>
                      <TableCell>{new Date(patient.date_of_birth).toLocaleDateString()}</TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>{patient.phone || patient.email}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No patients found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
