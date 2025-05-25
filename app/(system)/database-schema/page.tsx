"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Database, Table, RefreshCw, AlertCircle, FileText, Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function DatabaseSchemaPage() {
  const [schemaMarkdown, setSchemaMarkdown] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()

  useEffect(() => {
    const fetchSchemaDoc = async () => {
      try {
        setLoading(true)
        setError(null)

        // In a real implementation, this would fetch the actual markdown file
        // For now, we'll just simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Simulate fetching the markdown content
        const response = await fetch("/api/database-schema")

        if (!response.ok) {
          throw new Error("Failed to fetch database schema documentation")
        }

        const data = await response.json()
        setSchemaMarkdown(data.content)
      } catch (err) {
        console.error("Error fetching schema documentation:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchSchemaDoc()
  }, [])

  const handleGenerateSchema = async () => {
    try {
      toast({
        title: "Generating schema documentation",
        description: "This may take a few moments...",
      })

      const response = await fetch("/api/admin/database-schema/generate", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to generate schema documentation")
      }

      toast({
        title: "Success!",
        description: "Database schema documentation has been generated.",
        variant: "success",
      })

      // Reload the page to show the new documentation
      window.location.reload()
    } catch (err) {
      console.error("Error generating schema documentation:", err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to generate schema documentation",
        variant: "destructive",
      })
    }
  }

  const handleDownloadSchema = () => {
    if (!schemaMarkdown) return

    const blob = new Blob([schemaMarkdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "database-schema.md"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded",
      description: "Database schema documentation has been downloaded.",
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Database className="h-6 w-6 mr-2" />
            Database Schema Documentation
          </h1>
          <p className="text-muted-foreground">Comprehensive documentation of the ComplexCare CRM database schema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownloadSchema}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button onClick={handleGenerateSchema}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerate
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
          <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Architecture</CardTitle>
              <CardDescription>Key principles and design decisions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Multi-tenancy</h3>
                  <p className="text-muted-foreground">
                    All tables include a <code>tenant_id</code> column to isolate data between different healthcare
                    organizations. This allows multiple organizations to use the same database while keeping their data
                    completely separate.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">Soft Deletion</h3>
                  <p className="text-muted-foreground">
                    Most tables use a <code>deleted_at</code> timestamp for soft deletion rather than permanently
                    removing records. This preserves data for audit purposes and allows for potential recovery.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">Audit Trails</h3>
                  <p className="text-muted-foreground">
                    Tables include <code>created_at</code>, <code>updated_at</code>, <code>created_by</code>, and{" "}
                    <code>updated_by</code> fields for comprehensive audit trails, enabling tracking of all changes.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">UUID Primary Keys</h3>
                  <p className="text-muted-foreground">
                    All tables use UUID primary keys for better security, distribution, and to prevent sequential ID
                    guessing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schema Statistics</CardTitle>
              <CardDescription>Overview of database objects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold">25+</div>
                  <div className="text-sm text-muted-foreground">Tables</div>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold">200+</div>
                  <div className="text-sm text-muted-foreground">Columns</div>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold">30+</div>
                  <div className="text-sm text-muted-foreground">Relationships</div>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold">40+</div>
                  <div className="text-sm text-muted-foreground">Indexes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Table className="h-5 w-5 mr-2" />
                Core Tables
              </CardTitle>
              <CardDescription>Primary tables in the database schema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "tenants", description: "Organizations using the system" },
                  { name: "users", description: "System users across all tenants" },
                  { name: "tenant_users", description: "User-tenant relationships" },
                  { name: "patients", description: "Patient information" },
                  { name: "care_professionals", description: "Healthcare providers" },
                  { name: "credentials", description: "Professional certifications" },
                  { name: "appointments", description: "Scheduled appointments" },
                  { name: "clinical_notes", description: "Patient clinical documentation" },
                  { name: "tasks", description: "Tasks and to-dos" },
                  { name: "care_plans", description: "Patient care plans" },
                  { name: "medications", description: "Patient medications" },
                  { name: "invoices", description: "Billing and invoices" },
                  { name: "activity_logs", description: "Audit trail of activities" },
                  { name: "documents", description: "Uploaded documents" },
                  { name: "clinical_note_categories", description: "Categories for notes" },
                ].map((table) => (
                  <div key={table.name} className="border rounded-lg p-4">
                    <h3 className="font-medium text-sm">{table.name}</h3>
                    <p className="text-xs text-muted-foreground">{table.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Alert>
            <FileText className="h-4 w-4" />
            <AlertTitle>Full Schema Details</AlertTitle>
            <AlertDescription>
              For detailed information about each table including columns, constraints, and sample queries, please refer
              to the full documentation in the <code>docs/database-schema.md</code> file.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="relationships" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Entity Relationship Diagram</CardTitle>
              <CardDescription>Visual representation of table relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-muted/20">
                <pre className="text-xs overflow-auto p-4">
                  {`erDiagram
    TENANTS ||--o{ TENANT_USERS : has
    TENANTS ||--o{ PATIENTS : has
    TENANTS ||--o{ CARE_PROFESSIONALS : has
    TENANTS ||--o{ APPOINTMENTS : has
    TENANTS ||--o{ CLINICAL_NOTES : has
    TENANTS ||--o{ TASKS : has
    TENANTS ||--o{ CARE_PLANS : has
    TENANTS ||--o{ MEDICATIONS : has
    TENANTS ||--o{ INVOICES : has
    TENANTS ||--o{ ACTIVITY_LOGS : has
    TENANTS ||--o{ DOCUMENTS : has
    
    USERS ||--o{ TENANT_USERS : belongs_to
    USERS ||--o{ CLINICAL_NOTES : authors
    USERS ||--o{ TASKS : creates
    USERS ||--o{ TASKS : assigned
    USERS ||--o{ ACTIVITY_LOGS : performs
    
    PATIENTS ||--o{ APPOINTMENTS : has
    PATIENTS ||--o{ CLINICAL_NOTES : has
    PATIENTS ||--o{ CARE_PLANS : has
    PATIENTS ||--o{ MEDICATIONS : takes
    PATIENTS ||--o{ INVOICES : billed
    PATIENTS ||--o{ DOCUMENTS : has
    
    CARE_PROFESSIONALS ||--o{ APPOINTMENTS : conducts
    CARE_PROFESSIONALS ||--o{ CREDENTIALS : has
    CARE_PROFESSIONALS ||--o{ CARE_PLANS : manages
    
    CLINICAL_NOTE_CATEGORIES ||--o{ CLINICAL_NOTES : categorizes
    
    INVOICES ||--o{ INVOICE_ITEMS : contains`}
                </pre>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                This diagram shows the main entities and their relationships in the database schema. Each line
                represents a foreign key relationship between tables.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Relationships</CardTitle>
              <CardDescription>Important relationships between tables</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Multi-tenant Architecture</h3>
                  <p className="text-sm text-muted-foreground">
                    All tables have a foreign key relationship to the <code>tenants</code> table via the{" "}
                    <code>tenant_id</code> column. This is the foundation of the multi-tenant architecture.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">User-Tenant Relationship</h3>
                  <p className="text-sm text-muted-foreground">
                    The <code>tenant_users</code> table implements a many-to-many relationship between{" "}
                    <code>users</code> and <code>tenants</code>, allowing users to belong to multiple organizations with
                    different roles.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">Patient-Centered Care</h3>
                  <p className="text-sm text-muted-foreground">
                    Multiple tables reference the <code>patients</code> table, including <code>appointments</code>,{" "}
                    <code>clinical_notes</code>,<code>care_plans</code>, <code>medications</code>, and{" "}
                    <code>invoices</code>, reflecting the patient-centered approach.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="best-practices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Working with the Database</CardTitle>
              <CardDescription>Best practices for database operations</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="font-medium mr-2">1.</span>
                  <div>
                    <span className="font-medium">Always Include Tenant ID:</span>
                    <span className="text-muted-foreground ml-2">
                      Every query should include the tenant_id to maintain data isolation
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">2.</span>
                  <div>
                    <span className="font-medium">Use Parameterized Queries:</span>
                    <span className="text-muted-foreground ml-2">
                      Always use parameterized queries to prevent SQL injection
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">3.</span>
                  <div>
                    <span className="font-medium">Soft Deletion:</span>
                    <span className="text-muted-foreground ml-2">
                      Use soft deletion (setting deleted_at) rather than DELETE statements
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">4.</span>
                  <div>
                    <span className="font-medium">Transactions:</span>
                    <span className="text-muted-foreground ml-2">
                      Use transactions for operations that modify multiple tables
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">5.</span>
                  <div>
                    <span className="font-medium">Limit Result Sets:</span>
                    <span className="text-muted-foreground ml-2">
                      Always limit the number of rows returned to prevent performance issues
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">6.</span>
                  <div>
                    <span className="font-medium">Include Created/Updated By:</span>
                    <span className="text-muted-foreground ml-2">
                      Set created_by and updated_by fields to maintain audit trails
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">7.</span>
                  <div>
                    <span className="font-medium">Check Permissions:</span>
                    <span className="text-muted-foreground ml-2">
                      Verify user permissions before executing database operations
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">8.</span>
                  <div>
                    <span className="font-medium">Handle NULL Values:</span>
                    <span className="text-muted-foreground ml-2">
                      Always handle NULL values appropriately in queries and application code
                    </span>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schema Migrations</CardTitle>
              <CardDescription>Best practices for database schema changes</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="font-medium mr-2">1.</span>
                  <div>
                    <span className="font-medium">Idempotent Migrations:</span>
                    <span className="text-muted-foreground ml-2">
                      Design migrations to be idempotent (can be run multiple times without issues)
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">2.</span>
                  <div>
                    <span className="font-medium">Check Before Altering:</span>
                    <span className="text-muted-foreground ml-2">
                      Always check if tables/columns exist before creating or altering them
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">3.</span>
                  <div>
                    <span className="font-medium">Backward Compatibility:</span>
                    <span className="text-muted-foreground ml-2">Maintain backward compatibility when possible</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">4.</span>
                  <div>
                    <span className="font-medium">Transaction Wrapping:</span>
                    <span className="text-muted-foreground ml-2">
                      Wrap migrations in transactions to ensure atomicity
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">5.</span>
                  <div>
                    <span className="font-medium">Backup Before Migration:</span>
                    <span className="text-muted-foreground ml-2">Always create a backup before running migrations</span>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
