"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, parseISO } from "date-fns"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  File,
  FileText,
  FileImage,
  FileIcon as FilePdf,
  FileSpreadsheet,
  Download,
  Eye,
  Trash2,
  Upload,
  FolderPlus,
  Folder,
} from "lucide-react"

interface Document {
  id: string
  patient_id: string
  title: string
  file_name: string
  file_type: string
  file_size: number
  category: string
  description?: string
  uploaded_by: string
  uploaded_by_name?: string
  created_at: string
  updated_at: string
  url?: string
}

interface DocumentFolder {
  id: string
  name: string
  document_count: number
}

interface PatientDocumentsProps {
  patientId: string
}

const documentFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  category: z.string({
    required_error: "Please select a category",
  }),
  description: z.string().optional(),
  file: z
    .any()
    .refine((file) => file?.size, {
      message: "Please select a file.",
    })
    .refine((file) => file?.size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5MB.",
    }),
})

export function PatientDocuments({ patientId }: PatientDocumentsProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [folders, setFolders] = useState<DocumentFolder[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isAddFolderDialogOpen, setIsAddFolderDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [newFolderName, setNewFolderName] = useState("")

  const form = useForm<z.infer<typeof documentFormSchema>>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      category: "medical_records",
    },
  })

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/patients/${patientId}/documents`)

        if (response.ok) {
          const data = await response.json()
          setDocuments(data)
        } else {
          console.error("Failed to fetch documents")
          // For demo purposes, set some sample data
          setDocuments([
            {
              id: "1",
              patient_id: patientId,
              title: "Discharge Summary",
              file_name: "discharge_summary_2022.pdf",
              file_type: "application/pdf",
              file_size: 1024 * 1024 * 2.5, // 2.5MB
              category: "medical_records",
              description: "Hospital discharge summary from London General Hospital",
              uploaded_by: "user123",
              uploaded_by_name: "Dr. Sarah Thompson",
              created_at: "2022-05-15T10:30:00Z",
              updated_at: "2022-05-15T10:30:00Z",
            },
            {
              id: "2",
              patient_id: patientId,
              title: "Blood Test Results",
              file_name: "blood_test_results_2023.pdf",
              file_type: "application/pdf",
              file_size: 1024 * 1024 * 1.2, // 1.2MB
              category: "lab_results",
              description: "Complete blood count and metabolic panel",
              uploaded_by: "user456",
              uploaded_by_name: "Dr. Robert Williams",
              created_at: "2023-02-10T14:15:00Z",
              updated_at: "2023-02-10T14:15:00Z",
            },
            {
              id: "3",
              patient_id: patientId,
              title: "Chest X-Ray",
              file_name: "chest_xray_2023.jpg",
              file_type: "image/jpeg",
              file_size: 1024 * 1024 * 3.7, // 3.7MB
              category: "imaging",
              description: "Frontal and lateral chest X-ray",
              uploaded_by: "user789",
              uploaded_by_name: "Dr. Elizabeth Johnson",
              created_at: "2023-03-22T09:45:00Z",
              updated_at: "2023-03-22T09:45:00Z",
            },
            {
              id: "4",
              patient_id: patientId,
              title: "Care Plan",
              file_name: "care_plan_2023.docx",
              file_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              file_size: 1024 * 1024 * 0.8, // 0.8MB
              category: "care_plans",
              description: "Updated care plan for diabetes management",
              uploaded_by: "user123",
              uploaded_by_name: "Dr. Sarah Thompson",
              created_at: "2023-04-05T11:20:00Z",
              updated_at: "2023-04-05T11:20:00Z",
            },
          ])
        }

        // Fetch folders or create sample folders
        setFolders([
          { id: "folder1", name: "Medical Records", document_count: 2 },
          { id: "folder2", name: "Lab Results", document_count: 1 },
          { id: "folder3", name: "Imaging", document_count: 1 },
          { id: "folder4", name: "Care Plans", document_count: 1 },
        ])
      } catch (error) {
        console.error("Error fetching documents:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [patientId])

  const onSubmit = async (values: z.infer<typeof documentFormSchema>) => {
    try {
      // In a real implementation, you would upload the file and send data to your API
      console.log("Submitting document:", values)

      // Mock implementation for demo
      const file = values.file[0]
      const newDocument: Document = {
        id: `temp-${Date.now()}`,
        patient_id: patientId,
        title: values.title,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        category: values.category,
        description: values.description,
        uploaded_by: "current_user",
        uploaded_by_name: "Current User",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      setDocuments([newDocument, ...documents])
      setIsAddDialogOpen(false)
      form.reset()
    } catch (error) {
      console.error("Error adding document:", error)
    }
  }

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: DocumentFolder = {
        id: `folder-${Date.now()}`,
        name: newFolderName,
        document_count: 0,
      }
      setFolders([...folders, newFolder])
      setNewFolderName("")
      setIsAddFolderDialogOpen(false)
    }
  }

  const handleDeleteDocument = (id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      setDocuments(documents.filter((doc) => doc.id !== id))
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) {
      return <FilePdf className="h-6 w-6 text-red-500" />
    } else if (fileType.includes("image")) {
      return <FileImage className="h-6 w-6 text-blue-500" />
    } else if (fileType.includes("spreadsheet") || fileType.includes("excel")) {
      return <FileSpreadsheet className="h-6 w-6 text-green-500" />
    } else if (fileType.includes("word") || fileType.includes("document")) {
      return <FileText className="h-6 w-6 text-blue-700" />
    } else {
      return <File className="h-6 w-6 text-gray-500" />
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "medical_records":
        return <Badge className="bg-blue-100 text-blue-800">Medical Records</Badge>
      case "lab_results":
        return <Badge className="bg-green-100 text-green-800">Lab Results</Badge>
      case "imaging":
        return <Badge className="bg-purple-100 text-purple-800">Imaging</Badge>
      case "care_plans":
        return <Badge className="bg-teal-100 text-teal-800">Care Plans</Badge>
      case "prescriptions":
        return <Badge className="bg-orange-100 text-orange-800">Prescriptions</Badge>
      case "consent_forms":
        return <Badge className="bg-yellow-100 text-yellow-800">Consent Forms</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Other</Badge>
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const filteredDocuments = documents.filter((doc) => {
    if (selectedFolder) {
      // Map category to folder name for demo purposes
      const folderMap: Record<string, string> = {
        medical_records: "Medical Records",
        lab_results: "Lab Results",
        imaging: "Imaging",
        care_plans: "Care Plans",
      }

      const folder = folders.find((f) => f.id === selectedFolder)
      return folder && folderMap[doc.category] === folder.name
    }

    if (activeTab === "all") return true
    return doc.category === activeTab
  })

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>Patient's medical documents and files</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Documents</CardTitle>
          <CardDescription>Patient's medical documents and files</CardDescription>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddFolderDialogOpen} onOpenChange={setIsAddFolderDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <FolderPlus className="mr-2 h-4 w-4" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
                <DialogDescription>Create a new folder to organize patient documents.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="folderName" className="text-right">
                    Folder Name
                  </Label>
                  <Input
                    id="folderName"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddFolder}>Create Folder</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>Upload a new document for this patient.</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Document Title</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., Discharge Summary, Lab Results, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="medical_records">Medical Records</SelectItem>
                            <SelectItem value="lab_results">Lab Results</SelectItem>
                            <SelectItem value="imaging">Imaging</SelectItem>
                            <SelectItem value="care_plans">Care Plans</SelectItem>
                            <SelectItem value="prescriptions">Prescriptions</SelectItem>
                            <SelectItem value="consent_forms">Consent Forms</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description of the document"
                            className="resize-none"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field: { onChange, value, ...rest } }) => (
                      <FormItem>
                        <FormLabel>File</FormLabel>
                        <FormControl>
                          <Input type="file" onChange={(e) => onChange(e.target.files)} {...rest} />
                        </FormControl>
                        <FormDescription>
                          Maximum file size: 5MB. Supported formats: PDF, DOC, DOCX, JPG, PNG.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Upload Document</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-4">
            <div className="font-medium text-sm">Folders</div>
            <div className="space-y-1">
              <Button
                variant={selectedFolder === null ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedFolder(null)}
              >
                <Folder className="mr-2 h-4 w-4" />
                All Documents
              </Button>
              {folders.map((folder) => (
                <Button
                  key={folder.id}
                  variant={selectedFolder === folder.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedFolder(folder.id)}
                >
                  <Folder className="mr-2 h-4 w-4" />
                  {folder.name}
                  <Badge variant="outline" className="ml-auto">
                    {folder.document_count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="medical_records">Medical Records</TabsTrigger>
                <TabsTrigger value="lab_results">Lab Results</TabsTrigger>
                <TabsTrigger value="imaging">Imaging</TabsTrigger>
                <TabsTrigger value="care_plans">Care Plans</TabsTrigger>
                <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                <TabsTrigger value="consent_forms">Consent Forms</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                {filteredDocuments.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No Documents Found</h3>
                    <p className="text-muted-foreground mb-4">
                      {selectedFolder
                        ? "No documents in this folder."
                        : activeTab === "all"
                          ? "No documents have been uploaded for this patient yet."
                          : `No ${activeTab.replace("_", " ")} documents found for this patient.`}
                    </p>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Document
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredDocuments.map((doc) => (
                      <Card key={doc.id} className="overflow-hidden">
                        <div className="flex p-4">
                          <div className="mr-4 flex items-center justify-center">{getFileIcon(doc.file_type)}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-base font-medium">{doc.title}</h3>
                              {getCategoryBadge(doc.category)}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {doc.file_name} • {formatFileSize(doc.file_size)}
                            </p>
                            {doc.description && <p className="text-sm mt-2">{doc.description}</p>}
                            <div className="flex items-center text-xs text-muted-foreground mt-2">
                              <span>
                                Uploaded by {doc.uploaded_by_name || "Unknown"} on{" "}
                                {format(parseISO(doc.created_at), "PPP")}
                              </span>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive"
                                onClick={() => handleDeleteDocument(doc.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Label({ htmlFor, className, children }: { htmlFor: string; className?: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    >
      {children}
    </label>
  )
}
