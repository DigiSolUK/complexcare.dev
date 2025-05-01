import type { Metadata } from "next"
import { FolderOpen, FileUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DocumentTable } from "@/components/documents/document-table"
import { DocumentFolders } from "@/components/documents/document-folders"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Documents",
  description: "Manage patient and organization documents",
}

export default function DocumentsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Manage patient and organization documents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FolderOpen className="mr-2 h-4 w-4" />
            New Folder
          </Button>
          <Button>
            <FileUp className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="patients">Patient Documents</TabsTrigger>
          <TabsTrigger value="organization">Organization Documents</TabsTrigger>
          <TabsTrigger value="policies">Policies & Procedures</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Library</CardTitle>
              <CardDescription>Manage all your documents in one place</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Input placeholder="Search documents..." className="max-w-sm" />
                <Button variant="outline">Filter</Button>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-6">
                <DocumentFolders />
              </div>

              <DocumentTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Documents</CardTitle>
              <CardDescription>Manage documents related to patients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Input placeholder="Search patient documents..." className="max-w-sm" />
                <Button variant="outline">Filter</Button>
              </div>
              <DocumentTable filter="patient" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Documents</CardTitle>
              <CardDescription>Manage documents related to your organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Input placeholder="Search organization documents..." className="max-w-sm" />
                <Button variant="outline">Filter</Button>
              </div>
              <DocumentTable filter="organization" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Policies & Procedures</CardTitle>
              <CardDescription>Manage organizational policies and procedures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Input placeholder="Search policies..." className="max-w-sm" />
                <Button variant="outline">Filter</Button>
              </div>
              <DocumentTable filter="policy" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Templates</CardTitle>
              <CardDescription>Manage reusable document templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Input placeholder="Search templates..." className="max-w-sm" />
                <Button variant="outline">Filter</Button>
              </div>
              <DocumentTable filter="template" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
