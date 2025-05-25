"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Plus, Download, Eye } from "lucide-react"
import { format, parseISO } from "date-fns"

interface Document {
  id: string
  title: string
  file_name: string
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
        const response = await fetch(`/api/patients/${patientId}/documents?limit=5`)
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return "📄"
    if (fileType.includes("image")) return "🖼️"
    if (fileType.includes("word")) return "📝"
    if (fileType.includes("excel") || fileType.includes("spreadsheet")) return "📊"
    return "📁"
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>Patient files and documents</CardDescription>
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
          <CardDescription>Patient files and documents</CardDescription>
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
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{getFileIcon(doc.file_type)}</div>
                  <div>
                    <h4 className="font-medium text-sm">{doc.title}</h4>
                    <p className="text-xs text-muted-foreground mb-1">
                      {doc.file_name} ({formatFileSize(doc.file_size)})
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        Uploaded {format(parseISO(doc.uploaded_at), "PPP")} by {doc.uploaded_by_name}
                      </p>
                      {doc.category && (
                        <Badge variant="outline" className="text-xs">
                          {doc.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
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
