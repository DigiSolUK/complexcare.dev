"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Upload, FileText, AlertCircle, CheckCircle, Sparkles, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { analyzeImportFile } from "@/lib/ai/onboarding-ai-service"
import type { DataImportAnalysis } from "@/lib/ai/onboarding-ai-service"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface AIDataImportProps {
  onComplete: () => void
}

export function AIDataImport({ onComplete }: AIDataImportProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("patients")
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [analysis, setAnalysis] = useState<DataImportAnalysis | null>(null)
  const [importProgress, setImportProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setAnalysis(null)
      setImportProgress(0)
    }
  }

  const analyzeFile = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to analyze.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    try {
      const fileContent = await file.text()
      const result = await analyzeImportFile(fileContent, file.type)
      setAnalysis(result)

      toast({
        title: "File analysis complete",
        description: "AI has analyzed your file and provided mapping suggestions.",
      })
    } catch (error) {
      console.error("Error analyzing file:", error)
      toast({
        title: "Error analyzing file",
        description: "There was a problem analyzing your file.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const startImport = async () => {
    if (!file || !analysis) {
      toast({
        title: "Analysis required",
        description: "Please analyze the file before importing.",
        variant: "destructive",
      })
      return
    }

    setIsImporting(true)
    setImportProgress(0)

    try {
      // Simulate import process with progress updates
      for (let i = 0; i <= 100; i += 10) {
        setImportProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      toast({
        title: "Import complete",
        description: `Successfully imported data from ${file.name}.`,
      })

      // Reset state
      setFile(null)
      setAnalysis(null)
      setImportProgress(0)

      // Notify parent component
      onComplete()
    } catch (error) {
      console.error("Error importing data:", error)
      toast({
        title: "Import failed",
        description: "There was a problem importing your data.",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2" />
          AI-Assisted Data Import
        </CardTitle>
        <CardDescription>Import your existing data with AI-powered mapping and validation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="staff">Care Professionals</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patient-file">Patient Data File</Label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    id="patient-file"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload CSV or Excel files containing patient records.
                  </p>
                </div>
                <Button type="button" onClick={analyzeFile} disabled={!file || isAnalyzing} variant="outline">
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </div>

            {file && (
              <div className="flex items-center p-3 bg-muted rounded-md">
                <FileText className="h-5 w-5 text-muted-foreground mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB • {file.type || "Unknown type"}
                  </p>
                </div>
              </div>
            )}

            {analysis && (
              <div className="space-y-4">
                <Alert variant={analysis.invalidRows > 0 ? "destructive" : "default"}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Analysis Results</AlertTitle>
                  <AlertDescription>
                    Found approximately {analysis.validRows} valid rows and {analysis.invalidRows} potential issues.
                  </AlertDescription>
                </Alert>

                {analysis.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">AI Suggestions</h3>
                    <ul className="space-y-1">
                      {analysis.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {Object.keys(analysis.mappedFields).length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Field Mapping</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Source Field</TableHead>
                          <TableHead>Maps To</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(analysis.mappedFields).map(([source, target]) => (
                          <TableRow key={source}>
                            <TableCell>{source}</TableCell>
                            <TableCell className="font-medium">{target}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                <Button onClick={startImport} disabled={isImporting} className="w-full">
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      Import Data
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                {isImporting && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Import Progress</span>
                      <span className="text-sm font-medium">{importProgress}%</span>
                    </div>
                    <Progress value={importProgress} className="h-2" />
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="staff">
            <div className="p-8 text-center text-muted-foreground">
              <Upload className="h-8 w-8 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Import Care Professional Data</h3>
              <p className="mb-4">Upload a CSV or Excel file containing your care professional records.</p>
              <Button variant="outline">Select File</Button>
            </div>
          </TabsContent>

          <TabsContent value="appointments">
            <div className="p-8 text-center text-muted-foreground">
              <Upload className="h-8 w-8 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Import Appointment Data</h3>
              <p className="mb-4">Upload a CSV or Excel file containing your appointment records.</p>
              <Button variant="outline">Select File</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onComplete}>
          Skip for now
        </Button>
      </CardFooter>
    </Card>
  )
}
