"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AlertCircle, CheckCircle, Clock, Edit, ExternalLink, FileText, Shield, Trash2 } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { ProfessionalCredential } from "@/types"

interface CredentialListProps {
  credentials: ProfessionalCredential[]
  onView: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => Promise<void>
  onVerify?: (id: string) => void
}

export function CredentialList({ credentials, onView, onEdit, onDelete, onVerify }: CredentialListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const getCredentialTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      nmc_pin: "NMC PIN",
      dbs_check: "DBS Check",
      qualification: "Qualification",
      training: "Training Certificate",
      insurance: "Professional Insurance",
      license: "Professional License",
      certification: "Professional Certification",
      other: "Other Credential",
    }
    return typeMap[type] || type
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleDelete = async (id: string) => {
    if (onDelete) {
      setDeletingId(id)
      try {
        await onDelete(id)
      } finally {
        setDeletingId(null)
      }
    }
  }

  const isExpired = (expiryDate: string | null | undefined) => {
    if (!expiryDate) return false
    return new Date(expiryDate) < new Date()
  }

  const isExpiringSoon = (expiryDate: string | null | undefined) => {
    if (!expiryDate) return false
    const expiry = new Date(expiryDate)
    const today = new Date()
    const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0
  }

  return (
    <div className="space-y-4">
      {credentials.map((credential) => (
        <Card key={credential.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4">
              <div className="space-y-1 mb-2 sm:mb-0">
                <div className="flex items-center">
                  <h3 className="font-medium">{getCredentialTypeLabel(credential.credential_type)}</h3>
                  <div className="ml-2">{getStatusBadge(credential.verification_status)}</div>
                </div>
                <p className="text-sm text-muted-foreground">Number: {credential.credential_number}</p>
                {credential.issuing_authority && (
                  <p className="text-sm text-muted-foreground">Issued by: {credential.issuing_authority}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-1">
                  {credential.issue_date && (
                    <span className="text-xs text-muted-foreground flex items-center">
                      Issued: {formatDate(credential.issue_date)}
                    </span>
                  )}
                  {credential.expiry_date && (
                    <span className="text-xs flex items-center">
                      Expires: {formatDate(credential.expiry_date)}
                      {isExpired(credential.expiry_date) && (
                        <Badge variant="destructive" className="ml-1 text-[10px] py-0 h-4">
                          Expired
                        </Badge>
                      )}
                      {isExpiringSoon(credential.expiry_date) && !isExpired(credential.expiry_date) && (
                        <Badge variant="outline" className="ml-1 text-[10px] py-0 h-4 bg-amber-100 text-amber-800">
                          Soon
                        </Badge>
                      )}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {credential.document_url && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={credential.document_url} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4 mr-1" />
                      View
                    </a>
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => onView(credential.id)}>
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Details
                </Button>
                {onEdit && (
                  <Button variant="ghost" size="sm" onClick={() => onEdit(credential.id)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
                {onVerify && credential.verification_status === "pending" && (
                  <Button variant="ghost" size="sm" onClick={() => onVerify(credential.id)}>
                    <Shield className="h-4 w-4 mr-1" />
                    Verify
                  </Button>
                )}
                {onDelete && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this credential. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(credential.id)}
                          disabled={deletingId === credential.id}
                        >
                          {deletingId === credential.id ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
