"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, FileText, Clock, Target, Users } from "lucide-react"
import { CreateCarePlanTemplateDialog } from "./create-care-plan-template-dialog"

interface CarePlanTemplate {
  id: string
  name: string
  description: string
  category: string
  condition: string
  goals: string[]
  interventions: string[]
  duration_days: number
  usage_count: number
  created_by_name: string
}

export function CarePlanTemplateLibrary() {
  const [templates, setTemplates] = useState<CarePlanTemplate[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<CarePlanTemplate[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTemplates()
  }, [])

  useEffect(() => {
    filterTemplates()
  }, [templates, searchQuery, selectedCategory])

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/care-plans/templates")
      if (response.ok) {
        const data = await response.json()
        setTemplates(data)
      }
    } catch (error) {
      console.error("Error fetching templates:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterTemplates = () => {
    let filtered = templates

    if (searchQuery) {
      filtered = filtered.filter(
        (template) =>
          template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.condition.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((template) => template.category === selectedCategory)
    }

    setFilteredTemplates(filtered)
  }

  const categories = [
    { value: "all", label: "All Templates", icon: FileText },
    { value: "chronic", label: "Chronic Care", icon: Clock },
    { value: "acute", label: "Acute Care", icon: Target },
    { value: "preventive", label: "Preventive Care", icon: Users },
    { value: "mental-health", label: "Mental Health", icon: Target },
    { value: "rehabilitation", label: "Rehabilitation", icon: Target },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "chronic":
        return "bg-purple-100 text-purple-800"
      case "acute":
        return "bg-red-100 text-red-800"
      case "preventive":
        return "bg-green-100 text-green-800"
      case "mental-health":
        return "bg-blue-100 text-blue-800"
      case "rehabilitation":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
          {categories.map((category) => (
            <TabsTrigger key={category.value} value={category.value}>
              <category.icon className="h-4 w-4 mr-1" />
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-48 animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTemplates.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No templates found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? "Try adjusting your search criteria" : "Create your first template to get started"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge className={getCategoryColor(template.category)}>{template.category}</Badge>
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium">Condition</p>
                        <p className="text-sm text-muted-foreground">{template.condition}</p>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span>
                          <strong>{template.goals.length}</strong> Goals
                        </span>
                        <span>
                          <strong>{template.interventions.length}</strong> Interventions
                        </span>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t">
                        <span className="text-xs text-muted-foreground">Used {template.usage_count} times</span>
                        <Button size="sm">Use Template</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreateCarePlanTemplateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => {
          fetchTemplates()
          setIsCreateDialogOpen(false)
        }}
      />
    </div>
  )
}
