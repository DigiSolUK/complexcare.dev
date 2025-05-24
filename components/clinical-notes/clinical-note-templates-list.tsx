"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Copy, FileText } from "lucide-react"
import { type ClinicalNoteTemplate, getClinicalNoteTemplates } from "@/lib/services/clinical-notes-service"
import { format, parseISO } from "date-fns"

export function ClinicalNoteTemplatesList() {
  const [templates, setTemplates] = useState<ClinicalNoteTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const templatesData = await getClinicalNoteTemplates()
        setTemplates(templatesData)
      } catch (error) {
        console.error("Error fetching templates:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Note Templates</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>

      {isLoading ? (
        <p className="text-center py-8 text-muted-foreground">Loading templates...</p>
      ) : templates.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">No templates found</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                {template.category_name && (
                  <Badge variant="outline" className="mt-1">
                    {template.category_name}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm text-muted-foreground line-clamp-3">
                  {template.content.substring(0, 150)}
                  {template.content.length > 150 && "..."}
                </div>
              </CardContent>
              <CardFooter className="pt-2 flex justify-between">
                <div className="text-xs text-muted-foreground">
                  Created: {format(parseISO(template.created_at), "MMM d, yyyy")}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-1" />
                    Use
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
