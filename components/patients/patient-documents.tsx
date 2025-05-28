"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Upload, Download, Eye } from "lucide-react"
import { format, parseISO } from "date-fns"

interface Document {
  id: string
  name: string
  type: string
  size: number
  uploaded_at: string
  uploaded_by_name: string
  status: string
}

interface PatientDocumentsProps {
  patientId: string
}

export function PatientDocuments({ patientId }: PatientDocumentsProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!patientId) return

      setIsLoading(true)
      try {
        // This would be replaced with a real API call
        // const response = await fetch(`/api/patients/${patientId}/documents`)
        // const data = await response.json()

        // Mock data for now
        const mockDocuments = [
          {
            id: "1",
            name: "Medical History.pdf",
            type: "application/pdf",
            size: 2500000,
            uploaded_at: new Date().toISOString(),
            uploaded_by_name: "Dr. Sarah Johnson",
            status: "verified",
          },
          {
            id: "2",
            name: "Blood Test Results.pdf",
            type: "application/pdf",
            size: 1200000,
            uploaded_at: new Date(Date.now() - 86400000).toISOString(),
            uploaded_by_name: "Lab Technician",
            status: "pending",
          },
          {
            id: "3",
            name: "Prescription.docx",
            type: "application/docx",
            size: 500000,
            uploaded_at: new Date(Date.now() - 172800000).toISOString(),
            uploaded_by_name: "Dr. Sarah Johnson",
            status: "verified",
          },
        ]

        setTimeout(() => {
          setDocuments(mockDocuments)
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching documents:", error)
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [patientId])

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "verified":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return "📄"
    if (type.includes("doc")) return "📝"
    if (type.includes("image")) return "🖼️"
    return "📁"
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>Patient medical documents and files</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Documents</CardTitle>
          <CardDescription>Patient medical documents and files</CardDescription>
        </div>
        <Button size="sm">
          <Upload className="h-4 w-4 mr-1" />
          Upload Document
        </Button>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-6">
            <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No documents uploaded</p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="border rounded-md p-3">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getFileIcon(doc.type)}</span>
                    <div>
                      <h4 className="font-medium text-sm">{doc.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(doc.size)} • Uploaded {format(parseISO(doc.uploaded_at), "PPP")}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(doc.status)}>{doc.status}</Badge>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Documents
        </Button>
      </CardFooter>
    </Card>
  )
}
