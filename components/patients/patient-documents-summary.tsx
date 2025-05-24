"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Plus, Download } from "lucide-react"
import { format, parseISO } from "date-fns"

interface Document {
  id: string
  title: string
  type: string
  file_size?: number
  uploaded_date: string
  uploaded_by_name?: string
  is_confidential: boolean
}

interface PatientDocumentsSummaryProps {
  patientId: string
}

function PatientDocumentsSummary({ patientId }: PatientDocumentsSummaryProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!patientId) return

      setIsLoading(true)
      try {
        const response = await fetch(`/api/patients/${patientId}/documents?limit=3`)
        if (response.ok) {
          const data = await response.json()
          setDocuments(data)
        }
      } catch (error) {
        console.error("Error fetching documents:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [patientId])

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size"
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>Patient files and documentation</CardDescription>
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
          <CardDescription>Patient files and documentation</CardDescription>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
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
            {documents.map((document) => (
              <div key={document.id} className="border-b pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{document.title}</h4>
                    {document.is_confidential && (
                      <Badge variant="destructive" className="text-xs">
                        Confidential
                      </Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {document.type} - {formatFileSize(document.file_size)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Uploaded {format(parseISO(document.uploaded_date), "PPP")}
                  {document.uploaded_by_name && ` by ${document.uploaded_by_name}`}
                </p>
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

export default PatientDocumentsSummary
