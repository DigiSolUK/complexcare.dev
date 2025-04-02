import type { Metadata } from "next"
import { PlusCircle, Newspaper, FileText, Paperclip } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BlogPostTable } from "@/components/content/blog-post-table"
import { PageContentTable } from "@/components/content/page-content-table"

export const metadata: Metadata = {
  title: "Content Management",
  description: "Manage blogs and website content",
}

export default function ContentPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
          <p className="text-muted-foreground">Manage blogs and website content</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            New Page
          </Button>
          <Button>
            <Newspaper className="mr-2 h-4 w-4" />
            New Blog Post
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Published Blog Posts</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+3</span> this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Website Pages</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+1</span> this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Media Assets</CardTitle>
            <Paperclip className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">56</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12</span> this month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="blog" className="space-y-4">
        <TabsList>
          <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          <TabsTrigger value="pages">Website Pages</TabsTrigger>
          <TabsTrigger value="media">Media Library</TabsTrigger>
        </TabsList>

        <TabsContent value="blog" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blog Posts</CardTitle>
              <CardDescription>Manage your blog content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Input placeholder="Search blog posts..." className="max-w-sm" />
                <Button variant="outline">Filter</Button>
              </div>
              <BlogPostTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Website Pages</CardTitle>
              <CardDescription>Manage your website pages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Input placeholder="Search pages..." className="max-w-sm" />
                <Button variant="outline">Filter</Button>
              </div>
              <PageContentTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Media Library</CardTitle>
              <CardDescription>Manage your media assets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Input placeholder="Search media..." className="max-w-sm" />
                <Button variant="outline">Filter</Button>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Upload Media
                </Button>
              </div>
              <p className="text-muted-foreground">Media library functionality coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

