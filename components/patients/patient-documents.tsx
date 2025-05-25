"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Upload, Download, File } from "lucide-react"
import { format, parseISO } from "date-fns"

interface Document {
  id: string
  name: string
  file_type: string
  file_size: number
  uploaded_at: string
  uploaded_by_name: string
  category?: string
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
        // This would be a real API call in production
        // const response = await fetch(`/api/patients/${patientId}/documents?limit=5`)
        // if (response.ok) {
        //   const data = await response.json()
        //   setDocuments(data)
        // }

        // Mock data for now
        setTimeout(() => {
          setDocuments([
            {
              id: "1",
              name: "Discharge Summary.pdf",
              file_type: "pdf",
              file_size: 1240000,
              uploaded_at: new Date().toISOString(),
              uploaded_by_name: "Dr. Sarah Johnson",
              category: "Medical Records",
            },
            {
              id: "2",
              name: "Blood Test Results.pdf",
              file_type: "pdf",
              file_size: 890000,
              uploaded_at: new Date(Date.now() - 86400000).toISOString(),
              uploaded_by_name: "Lab Technician",
              category: "Test Results",
            },
            {
              id: "3",
              name: "Care Plan.docx",
              file_type: "docx",
              file_size: 450000,
              uploaded_at: new Date(Date.now() - 172800000).toISOString(),
              uploaded_by_name: "Nurse Williams",
              category: "Care Plans",
            },
          ])
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
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return <File className="h-4 w-4 text-red-500" />
      case "docx":
      case "doc":
        return <File className="h-4 w-4 text-blue-500" />
      case "xlsx":
      case "xls":
        return <File className="h-4 w-4 text-green-500" />
      case "jpg":
      case "jpeg":
      case "png":
        return <File className="h-4 w-4 text-purple-500" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>Patient documents and files</CardDescription>
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
          <CardDescription>Patient documents and files</CardDescription>
        </div>
        <Button size="sm">
          <Upload className="h-4 w-4 mr-1" />
          Upload
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
              <div key={doc.id} className="border-b pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    {getFileIcon(doc.file_type)}
                    <h4 className="font-medium text-sm">{doc.name}</h4>
                  </div>
                  {doc.category && (
                    <Badge variant="outline" className="text-xs">
                      {doc.category}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {format(parseISO(doc.uploaded_at), "PPP")} by {doc.uploaded_by_name}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{formatFileSize(doc.file_size)}</span>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Download className="h-3.5 w-3.5" />
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
