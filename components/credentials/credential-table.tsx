"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, FileText, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import type { ProfessionalCredential } from "@/types"

interface CredentialTableProps {
  filter?: string
  userId?: string
}

export function CredentialTable({ filter = "all", userId }: CredentialTableProps) {
  const [credentials, setCredentials] = useState<ProfessionalCredential[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        setLoading(true)
        let url = "/api/credentials"
        const params = new URLSearchParams()

        if (userId) {
          params.append("userId", userId)
        }

        if (filter !== "all") {
          params.append("status", filter)
        }

        if (params.toString()) {
          url += `?${params.toString()}`
        }

        const response = await fetch(url)
        if (!response.ok) {
          throw new Error("Failed to fetch credentials")
        }
        const data = await response.json()
        // Ensure data is an array and filter out any null/undefined entries
        setCredentials(Array.isArray(data) ? data.filter(Boolean) : [])
      } catch (err) {
        setError("Error loading credentials. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCredentials()
  }, [filter, userId])

  const getStatusBadge = (status: string | null | undefined) => {
    if (!status) return <Badge variant="secondary">Unknown</Badge> // Use a default variant
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "expired":
        return <Badge className="bg-gray-100 text-gray-800">Expired</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getCredentialTypeName = (type: string | null | undefined) => {
    if (!type) return "Unknown Type"
    switch (type) {
      case "nmc_pin":
        return "NMC PIN"
      case "dbs_check":
        return "DBS Check"
      case "qualification":
        return "Qualification"
      case "training":
        return "Training Certificate"
      default:
        return type
    }
  }

  const isExpiringSoon = (expiryDate: string | null) => {
    if (!expiryDate) return false

    const expiry = new Date(expiryDate)
    const today = new Date()
    const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0
  }

  const handleVerify = async (id: string) => {
    try {
      const response = await fetch(`/api/credentials/${id}/verify`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to verify credential")
      }

      // Update the credential in the list
      setCredentials(
        credentials.map((credential) =>
          credential.id === id
            ? { ...credential, verification_status: "verified", verification_date: new Date().toISOString() }
            : credential,
        ),
      )
    } catch (err) {
      console.error(err)
      alert("Failed to verify credential. Please try again.")
    }
  }

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`/api/credentials/${id}/reject`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to reject credential")
      }

      // Update the credential in the list
      setCredentials(
        credentials.map((credential) =>
          credential.id === id
            ? { ...credential, verification_status: "rejected", verification_date: new Date().toISOString() }
            : credential,
        ),
      )
    } catch (err) {
      console.error(err)
      alert("Failed to reject credential. Please try again.")
    }
  }

  if (loading) {
    return <div className="flex justify-center p-4">Loading credentials...</div>
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>
  }

  if (credentials.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        No credentials found. {filter !== "all" && "Try changing the filter or "}
        Add a new credential to get started.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Staff Member</TableHead>
          <TableHead>Number</TableHead>
          <TableHead>Issue Date</TableHead>
          <TableHead>Expiry Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {credentials.map((credential) => (
          <TableRow key={credential.id}>
            <TableCell>{getCredentialTypeName(credential.credential_type)}</TableCell>
            <TableCell>{credential.user_name}</TableCell>
            <TableCell>{credential.credential_number}</TableCell>
            <TableCell>{new Date(credential.issue_date).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex items-center">
                {credential.expiry_date ? new Date(credential.expiry_date).toLocaleDateString() : "No expiry"}
                {isExpiringSoon(credential.expiry_date) && (
                  <AlertTriangle className="ml-2 h-4 w-4 text-yellow-500" title="Expiring soon" />
                )}
              </div>
            </TableCell>
            <TableCell>{getStatusBadge(credential.verification_status)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>

                {credential.document_url && (
                  <Button variant="ghost" size="icon" onClick={() => window.open(credential.document_url, "_blank")}>
                    <FileText className="h-4 w-4" />
                  </Button>
                )}

                {credential.verification_status === "pending" && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-green-600"
                      onClick={() => handleVerify(credential.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600"
                      onClick={() => handleReject(credential.id)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
