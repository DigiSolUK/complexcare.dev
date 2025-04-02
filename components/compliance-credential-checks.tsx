"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, AlertCircle, Search, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Credential {
  id: string
  careProfessionalId: string
  careProfessionalName: string
  type: "NMC PIN" | "DBS" | "Qualification" | "Training"
  identifier: string
  issueDate: string
  expiryDate: string
  status: "verified" | "unverified" | "expired" | "pending"
  lastChecked: string
}

export function ComplianceCredentialChecks() {
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  useEffect(() => {
    // In a real app, this would fetch from an API
    fetchCredentials()
  }, [])

  const fetchCredentials = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data
      const mockCredentials: Credential[] = [
        {
          id: "1",
          careProfessionalId: "cp1",
          careProfessionalName: "Jane Smith",
          type: "NMC PIN",
          identifier: "AB123456",
          issueDate: "2022-01-15",
          expiryDate: "2025-01-15",
          status: "verified",
          lastChecked: "2023-06-10",
        },
        {
          id: "2",
          careProfessionalId: "cp1",
          careProfessionalName: "Jane Smith",
          type: "DBS",
          identifier: "123456789012",
          issueDate: "2022-03-20",
          expiryDate: "2025-03-20",
          status: "verified",
          lastChecked: "2023-05-15",
        },
        {
          id: "3",
          careProfessionalId: "cp2",
          careProfessionalName: "John Doe",
          type: "NMC PIN",
          identifier: "CD789012",
          issueDate: "2020-11-05",
          expiryDate: "2023-11-05",
          status: "expired",
          lastChecked: "2023-04-22",
        },
        {
          id: "4",
          careProfessionalId: "cp2",
          careProfessionalName: "John Doe",
          type: "DBS",
          identifier: "987654321098",
          issueDate: "2021-07-12",
          expiryDate: "2024-07-12",
          status: "verified",
          lastChecked: "2023-03-30",
        },
        {
          id: "5",
          careProfessionalId: "cp3",
          careProfessionalName: "Sarah Johnson",
          type: "Qualification",
          identifier: "BSN12345",
          issueDate: "2019-05-18",
          expiryDate: "N/A",
          status: "verified",
          lastChecked: "2023-02-15",
        },
        {
          id: "6",
          careProfessionalId: "cp3",
          careProfessionalName: "Sarah Johnson",
          type: "Training",
          identifier: "CPR-2023",
          issueDate: "2023-01-10",
          expiryDate: "2024-01-10",
          status: "verified",
          lastChecked: "2023-01-15",
        },
        {
          id: "7",
          careProfessionalId: "cp4",
          careProfessionalName: "Michael Brown",
          type: "NMC PIN",
          identifier: "EF456789",
          issueDate: "2021-09-30",
          expiryDate: "2024-09-30",
          status: "unverified",
          lastChecked: "2023-07-01",
        },
        {
          id: "8",
          careProfessionalId: "cp4",
          careProfessionalName: "Michael Brown",
          type: "DBS",
          identifier: "456789123456",
          issueDate: "2020-12-05",
          expiryDate: "2023-12-05",
          status: "pending",
          lastChecked: "2023-07-02",
        },
      ]

      setCredentials(mockCredentials)
    } catch (error) {
      console.error("Error fetching credentials:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            Verified
          </Badge>
        )
      case "unverified":
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <XCircle className="h-4 w-4" />
            Unverified
          </Badge>
        )
      case "expired":
        return (
          <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            Expired
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            Pending
          </Badge>
        )
      default:
        return null
    }
  }

  const filteredCredentials = credentials.filter((credential) => {
    const matchesSearch =
      credential.careProfessionalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credential.identifier.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || credential.status === statusFilter
    const matchesType = typeFilter === "all" || credential.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getExpiryStatus = (expiryDate: string) => {
    if (expiryDate === "N/A") return "N/A"

    const today = new Date()
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) return "Expired"
    if (daysUntilExpiry <= 30) return `Expires in ${daysUntilExpiry} days`
    return expiryDate
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credential Verification Status</CardTitle>
        <CardDescription>Monitor and manage verification status for all care professional credentials</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or identifier..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="NMC PIN">NMC PIN</SelectItem>
                  <SelectItem value="DBS">DBS</SelectItem>
                  <SelectItem value="Qualification">Qualification</SelectItem>
                  <SelectItem value="Training">Training</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={fetchCredentials}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Credentials</TabsTrigger>
              <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Care Professional</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Identifier</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Checked</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        Loading credentials...
                      </TableCell>
                    </TableRow>
                  ) : filteredCredentials.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No credentials found matching your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCredentials.map((credential) => (
                      <TableRow key={credential.id}>
                        <TableCell>{credential.careProfessionalName}</TableCell>
                        <TableCell>{credential.type}</TableCell>
                        <TableCell>{credential.identifier}</TableCell>
                        <TableCell>{new Date(credential.issueDate).toLocaleDateString()}</TableCell>
                        <TableCell>{getExpiryStatus(credential.expiryDate)}</TableCell>
                        <TableCell>{getStatusBadge(credential.status)}</TableCell>
                        <TableCell>{new Date(credential.lastChecked).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="expiring">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Care Professional</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Identifier</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Checked</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Loading credentials...
                      </TableCell>
                    </TableRow>
                  ) : (
                    credentials
                      .filter((cred) => {
                        if (cred.expiryDate === "N/A") return false
                        const today = new Date()
                        const expiry = new Date(cred.expiryDate)
                        const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                        return daysUntilExpiry <= 90 && daysUntilExpiry >= 0
                      })
                      .map((credential) => (
                        <TableRow key={credential.id}>
                          <TableCell>{credential.careProfessionalName}</TableCell>
                          <TableCell>{credential.type}</TableCell>
                          <TableCell>{credential.identifier}</TableCell>
                          <TableCell>{getExpiryStatus(credential.expiryDate)}</TableCell>
                          <TableCell>{getStatusBadge(credential.status)}</TableCell>
                          <TableCell>{new Date(credential.lastChecked).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="issues">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Care Professional</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Identifier</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Checked</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Loading credentials...
                      </TableCell>
                    </TableRow>
                  ) : (
                    credentials
                      .filter((cred) => cred.status === "expired" || cred.status === "unverified")
                      .map((credential) => (
                        <TableRow key={credential.id}>
                          <TableCell>{credential.careProfessionalName}</TableCell>
                          <TableCell>{credential.type}</TableCell>
                          <TableCell>{credential.identifier}</TableCell>
                          <TableCell>
                            {credential.status === "expired" ? "Credential has expired" : "Verification failed"}
                          </TableCell>
                          <TableCell>{getStatusBadge(credential.status)}</TableCell>
                          <TableCell>{new Date(credential.lastChecked).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}

