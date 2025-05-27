"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Sparkles,
  FileWarning,
  Users,
  Loader2,
  Download,
  Lightbulb,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  validatePatientData,
  detectDuplicates,
  suggestDataCorrections,
  type ValidationResult,
  type DuplicateDetection,
  type ValidationSuggestion,
} from "@/lib/ai/data-validation-service"
import { cn } from "@/lib/utils"

interface IntelligentValidatorProps {
  data: any[]
  onValidationComplete: (validatedData: any[]) => void
  onCancel: () => void
}

export function IntelligentValidator({ data, onValidationComplete, onCancel }: IntelligentValidatorProps) {
  const { toast } = useToast()
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [duplicates, setDuplicates] = useState<DuplicateDetection | null>(null)
  const [corrections, setCorrections] = useState<ValidationSuggestion[]>([])
  const [appliedCorrections, setAppliedCorrections] = useState<Set<string>>(new Set())
  const [validationProgress, setValidationProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    startValidation()
  }, [data])

  const startValidation = async () => {
    setIsValidating(true)
    setValidationProgress(0)

    try {
      // Step 1: Basic validation
      setValidationProgress(25)
      const validation = await validatePatientData(data)
      setValidationResult(validation)

      // Step 2: Duplicate detection
      setValidationProgress(50)
      const duplicateResults = await detectDuplicates(data)
      setDuplicates(duplicateResults)

      // Step 3: AI corrections
      setValidationProgress(75)
      const correctionSuggestions = await suggestDataCorrections(data)
      setCorrections(correctionSuggestions)

      setValidationProgress(100)

      toast({
        title: "Validation complete",
        description: `Found ${validation.errors.length} errors and ${duplicateResults.totalDuplicates} potential duplicates.`,
      })
    } catch (error) {
      console.error("Validation error:", error)
      toast({
        title: "Validation failed",
        description: "There was an error validating your data.",
        variant: "destructive",
      })
    } finally {
      setIsValidating(false)
    }
  }

  const applyCorrection = (correction: ValidationSuggestion) => {
    const key = `${correction.row}-${correction.field}`
    setAppliedCorrections((prev) => new Set(prev).add(key))

    // Update the data with the correction
    if (correction.row !== undefined) {
      data[correction.row - 1][correction.field] = correction.suggestedValue
    }

    toast({
      title: "Correction applied",
      description: `Updated ${correction.field} value.`,
    })
  }

  const applyAllCorrections = () => {
    corrections.forEach((correction) => {
      if (correction.confidence >= 0.7) {
        applyCorrection(correction)
      }
    })

    toast({
      title: "All corrections applied",
      description: `Applied ${corrections.filter((c) => c.confidence >= 0.7).length} high-confidence corrections.`,
    })
  }

  const proceedWithImport = () => {
    onValidationComplete(data)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600"
      case "high":
        return "text-orange-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="h-4 w-4" />
      case "high":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <FileWarning className="h-4 w-4" />
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            Intelligent Data Validation
          </span>
          {validationResult && (
            <Badge variant={validationResult.score >= 80 ? "default" : "destructive"}>
              Quality Score: {validationResult.score}%
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          AI-powered validation is checking your data for errors, duplicates, and quality issues
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isValidating ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Validating data...</span>
                <span>{validationProgress}%</span>
              </div>
              <Progress value={validationProgress} className="h-2" />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="errors">
                  Errors {validationResult && `(${validationResult.errors.length})`}
                </TabsTrigger>
                <TabsTrigger value="duplicates">
                  Duplicates {duplicates && `(${duplicates.totalDuplicates})`}
                </TabsTrigger>
                <TabsTrigger value="suggestions">
                  Suggestions {corrections.length > 0 && `(${corrections.length})`}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{data.length}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Valid Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {data.length - (validationResult?.errors.filter((e) => e.severity === "critical").length || 0)}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Issues Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">
                        {(validationResult?.errors.length || 0) + (duplicates?.totalDuplicates || 0)}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {validationResult && validationResult.score < 80 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Data Quality Issues Detected</AlertTitle>
                    <AlertDescription>
                      Your data quality score is below 80%. We recommend reviewing and applying the suggested
                      corrections before importing.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Validation Summary</h3>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Basic field validation completed
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Duplicate detection completed
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      AI-powered corrections generated
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="errors">
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Row</TableHead>
                        <TableHead>Field</TableHead>
                        <TableHead>Error</TableHead>
                        <TableHead>Severity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {validationResult?.errors.map((error, index) => (
                        <TableRow key={index}>
                          <TableCell>{error.row || "N/A"}</TableCell>
                          <TableCell className="font-medium">{error.field}</TableCell>
                          <TableCell>{error.message}</TableCell>
                          <TableCell>
                            <div className={cn("flex items-center", getSeverityColor(error.severity))}>
                              {getSeverityIcon(error.severity)}
                              <span className="ml-1 capitalize">{error.severity}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="duplicates">
                {duplicates && duplicates.groups.length > 0 ? (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {duplicates.groups.map((group, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle className="text-sm flex items-center justify-between">
                              <span className="flex items-center">
                                <Users className="h-4 w-4 mr-2" />
                                Duplicate Group {index + 1}
                              </span>
                              <Badge variant="secondary">
                                {group.confidence >= 0.9 ? "High" : "Medium"} Confidence
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-2">
                              Rows {group.rows.map((r) => r + 1).join(", ")} appear to be duplicates based on{" "}
                              {group.matchFields.join(", ")}
                            </p>
                            <div className="space-y-2">
                              {group.rows.map((rowIndex) => (
                                <div key={rowIndex} className="text-sm p-2 bg-muted rounded">
                                  Row {rowIndex + 1}: {data[rowIndex].first_name} {data[rowIndex].last_name}
                                  {data[rowIndex].date_of_birth && ` (DOB: ${data[rowIndex].date_of_birth})`}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-8 w-8 mx-auto mb-4 text-green-500" />
                    <p>No duplicate records detected</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="suggestions">
                {corrections.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        AI has suggested {corrections.length} corrections to improve data quality
                      </p>
                      <Button onClick={applyAllCorrections} size="sm" variant="outline">
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Apply All High-Confidence
                      </Button>
                    </div>
                    <ScrollArea className="h-[350px]">
                      <div className="space-y-2">
                        {corrections.map((correction, index) => {
                          const key = `${correction.row}-${correction.field}`
                          const isApplied = appliedCorrections.has(key)

                          return (
                            <Card key={index} className={cn(isApplied && "opacity-60")}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="space-y-1 flex-1">
                                    <div className="flex items-center space-x-2">
                                      <Badge variant="outline">Row {correction.row}</Badge>
                                      <Badge variant="secondary">{correction.field}</Badge>
                                      <Badge variant={correction.confidence >= 0.8 ? "default" : "secondary"}>
                                        {Math.round(correction.confidence * 100)}% confidence
                                      </Badge>
                                    </div>
                                    <div className="text-sm space-y-1">
                                      <div>
                                        <span className="text-muted-foreground">Original:</span>{" "}
                                        <code className="bg-muted px-1 rounded">{correction.originalValue}</code>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Suggested:</span>{" "}
                                        <code className="bg-green-100 dark:bg-green-900 px-1 rounded">
                                          {correction.suggestedValue}
                                        </code>
                                      </div>
                                      <div className="text-muted-foreground italic">{correction.reason}</div>
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant={isApplied ? "ghost" : "default"}
                                    onClick={() => applyCorrection(correction)}
                                    disabled={isApplied}
                                  >
                                    {isApplied ? (
                                      <>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Applied
                                      </>
                                    ) : (
                                      "Apply"
                                    )}
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </ScrollArea>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Sparkles className="h-8 w-8 mx-auto mb-4" />
                    <p>No corrections suggested - your data looks good!</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={onCancel}>
                Cancel Import
              </Button>
              <div className="space-x-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Validation Report
                </Button>
                <Button
                  onClick={proceedWithImport}
                  disabled={validationResult?.errors.filter((e) => e.severity === "critical").length > 0}
                >
                  Proceed with Import
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
