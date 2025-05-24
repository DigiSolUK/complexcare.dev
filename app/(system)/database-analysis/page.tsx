"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Database,
  Table,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  FileText,
  Activity,
  Settings,
  DollarSign,
  Users,
  Shield,
  Clock,
  Pill,
  Calendar,
  ClipboardList,
  Key,
  Receipt,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DatabaseAnalysis {
  totalTables: number
  tables: string[]
  tableDetails: Record<
    string,
    {
      columns: Array<{
        column_name: string
        data_type: string
        is_nullable: string
        column_default: string | null
      }>
      rowCount: number
      sampleData: any[]
    }
  >
  features: Record<string, boolean>
  patientTableDetails: any
  recommendations: Array<{
    priority: string
    feature: string
    description: string
    tables: string[]
  }>
}

export default function DatabaseAnalysisPage() {
  const [analysis, setAnalysis] = useState<DatabaseAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalysis = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/database-analysis")
      if (!response.ok) {
        throw new Error("Failed to fetch database analysis")
      }
      const data = await response.json()
      if (data.success) {
        setAnalysis(data.analysis)
      } else {
        throw new Error(data.error || "Analysis failed")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalysis()
  }, [])

  const getFeatureIcon = (feature: string) => {
    const iconMap: Record<string, any> = {
      hasWearableData: Activity,
      hasIntegrationSettings: Settings,
      hasAuditLogs: Shield,
      hasNotifications: AlertCircle,
      hasDocumentManagement: FileText,
      hasFinancialData: DollarSign,
      hasRecruitmentData: Users,
      hasContentManagement: FileText,
      hasComplianceData: Shield,
      hasPayrollData: DollarSign,
      hasTimesheets: Clock,
      hasClinicalNotes: FileText,
      hasCarePlans: ClipboardList,
      hasMedications: Pill,
      hasAppointments: Calendar,
      hasTasks: ClipboardList,
      hasCredentials: Key,
      hasApiKeys: Key,
      hasInvoicing: Receipt,
    }
    return iconMap[feature] || Database
  }

  const getFeatureLabel = (feature: string) => {
    const labelMap: Record<string, string> = {
      hasWearableData: "Wearable Integration",
      hasIntegrationSettings: "Integration Settings",
      hasAuditLogs: "Audit Logs",
      hasNotifications: "Notifications",
      hasDocumentManagement: "Document Management",
      hasFinancialData: "Financial Data",
      hasRecruitmentData: "Recruitment",
      hasContentManagement: "Content Management",
      hasComplianceData: "Compliance",
      hasPayrollData: "Payroll",
      hasTimesheets: "Timesheets",
      hasClinicalNotes: "Clinical Notes",
      hasCarePlans: "Care Plans",
      hasMedications: "Medications",
      hasAppointments: "Appointments",
      hasTasks: "Tasks",
      hasCredentials: "Credentials",
      hasApiKeys: "API Keys",
      hasInvoicing: "Invoicing",
    }
    return labelMap[feature] || feature
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchAnalysis} className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    )
  }

  if (!analysis) {
    return null
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="h-8 w-8" />
            Database Analysis
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive analysis of your NeonDB database structure and features
          </p>
        </div>
        <Button onClick={fetchAnalysis} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
            <Table className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.totalTables}</div>
            <p className="text-xs text-muted-foreground">Database tables found</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Features</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.values(analysis.features).filter(Boolean).length}</div>
            <p className="text-xs text-muted-foreground">
              Out of {Object.keys(analysis.features).length} tracked features
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.recommendations.length}</div>
            <p className="text-xs text-muted-foreground">
              {analysis.recommendations.filter((r) => r.priority === "high").length} high priority
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="patient-data">Patient Data</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Overview</CardTitle>
              <CardDescription>Summary of your ComplexCare CRM database structure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analysis.tables.slice(0, 12).map((table) => (
                  <div key={table} className="flex items-center gap-2">
                    <Table className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{table}</span>
                    <Badge variant="outline" className="ml-auto">
                      {analysis.tableDetails[table]?.rowCount || 0}
                    </Badge>
                  </div>
                ))}
                {analysis.tables.length > 12 && (
                  <div className="text-sm text-muted-foreground">+{analysis.tables.length - 12} more tables</div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Feature Status</CardTitle>
                <CardDescription>Quick overview of implemented features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(analysis.features)
                    .slice(0, 8)
                    .map(([feature, enabled]) => {
                      const Icon = getFeatureIcon(feature)
                      return (
                        <div key={feature} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{getFeatureLabel(feature)}</span>
                          </div>
                          {enabled ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Recommendations</CardTitle>
                <CardDescription>High priority features to implement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.recommendations
                    .filter((r) => r.priority === "high")
                    .slice(0, 5)
                    .map((rec, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{rec.feature}</span>
                          <Badge variant={getPriorityColor(rec.priority)}>{rec.priority}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{rec.description}</p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Tables</CardTitle>
              <CardDescription>Detailed information about each table in your database</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {analysis.tables.map((table) => {
                    const details = analysis.tableDetails[table]
                    return (
                      <Card key={table}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{table}</CardTitle>
                            <Badge variant="outline">{details?.rowCount || 0} rows</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Columns:</div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {details?.columns.map((col) => (
                                <div key={col.column_name} className="text-xs">
                                  <span className="font-medium">{col.column_name}</span>
                                  <span className="text-muted-foreground"> ({col.data_type})</span>
                                  {col.is_nullable === "NO" && (
                                    <Badge variant="outline" className="ml-1 text-xs">
                                      Required
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Implementation Status</CardTitle>
              <CardDescription>Track which features are implemented in your database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(analysis.features).map(([feature, enabled]) => {
                  const Icon = getFeatureIcon(feature)
                  return (
                    <Card key={feature} className={enabled ? "border-green-200" : "border-red-200"}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5" />
                            <CardTitle className="text-base">{getFeatureLabel(feature)}</CardTitle>
                          </div>
                          {enabled ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {enabled ? "Feature is implemented" : "Feature not yet implemented"}
                        </p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Recommendations</CardTitle>
              <CardDescription>Suggested features and improvements for your CRM</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.recommendations.map((rec, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{rec.feature}</CardTitle>
                        <Badge variant={getPriorityColor(rec.priority)}>{rec.priority} priority</Badge>
                      </div>
                      <CardDescription>{rec.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm">
                        <span className="font-medium">Required tables: </span>
                        <span className="text-muted-foreground">{rec.tables.join(", ")}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patient-data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Table Analysis</CardTitle>
              <CardDescription>Detailed analysis of the patient data structure</CardDescription>
            </CardHeader>
            <CardContent>
              {analysis.patientTableDetails ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Patients</span>
                    <Badge variant="outline" className="text-lg">
                      {analysis.patientTableDetails.totalCount}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Table Columns</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {analysis.patientTableDetails.columns.map((col: any) => (
                        <div key={col.column_name} className="text-xs">
                          <span className="font-medium">{col.column_name}</span>
                          <span className="text-muted-foreground"> ({col.data_type})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {analysis.patientTableDetails.sampleData && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Sample Patient Data</h4>
                      <Card>
                        <CardContent className="pt-4">
                          <pre className="text-xs overflow-x-auto">
                            {JSON.stringify(analysis.patientTableDetails.sampleData, null, 2)}
                          </pre>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No Patient Table Found</AlertTitle>
                  <AlertDescription>The patients table was not found in the database.</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
