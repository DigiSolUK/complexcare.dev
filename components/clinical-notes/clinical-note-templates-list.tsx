"use client"

import { useState } from "react"
import { MoreHorizontal, Copy, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import type { ClinicalNoteCategory, ClinicalNoteTemplate } from "@/lib/services/clinical-notes-service"

interface ClinicalNoteTemplatesListProps {
  templates: ClinicalNoteTemplate[]
  categories: ClinicalNoteCategory[]
  loading: boolean
}

export default function ClinicalNoteTemplatesList({ templates, categories, loading }: ClinicalNoteTemplatesListProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCopyTemplate = (template: ClinicalNoteTemplate) => {
    navigator.clipboard.writeText(template.content)
    toast({
      title: "Template copied",
      description: "The template content has been copied to your clipboard.",
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[150px]" />
          <Skeleton className="h-[150px]" />
          <Skeleton className="h-[150px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No templates found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleCopyTemplate(template)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Content
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {template.category_id && (
                  <Badge variant="outline" className="mt-1">
                    {template.category_name}
                  </Badge>
                )}
                <CardDescription className="mt-2">Template</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm">{template.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
