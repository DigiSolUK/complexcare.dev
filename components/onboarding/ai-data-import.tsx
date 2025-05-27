"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, FileText, Sparkles, ArrowRight, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { IntelligentValidator } from "@/components/data-import/intelligent-validator"
import { ValidationPreview } from "@/components/data-import/validation-preview"
import { Progress } from "@/components/ui/progress"

interface AIDataImportProps {
  onComplete: () => void
}

type ImportStep = "upload" | "validate" | "preview" | "import"

export function AIDataImport({ onComplete }: AIDataImportProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("patients")
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<any[]>([])
  const [validatedData, setValidatedData] = useState<any[]>([])
  const [validationResult, setValidationResult] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState<ImportStep>("upload")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setCurrentStep("upload")
      setParsedData([])
      setValidatedData([])
    }
  }

  const parseFile = async () => {
    if (!file) return

    setIsProcessing(true)
    try {
      const fileContent = await file.text()

      // Simple CSV parsing (in production, use a proper CSV parser)
      const lines = fileContent.split("\n").filter((line) => line.trim())
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"))

      const data = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim())
        const row: any = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ""
        })
        return row
      })

      setParsedData(data)
      setCurrentStep("validate")

      toast({
        title: "File parsed successfully",
        description: `Found ${data.length} records ready for validation.`,
      })
    } catch (error) {
      console.error("Error parsing file:", error)
      toast({
        title: "Error parsing file",
        description: "Please ensure your file is properly formatted.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleValidationComplete = (validated: any[]) => {
    setValidatedData(validated)
    setValidationResult({
      errors: [], // This would be populated by the validator
      warnings: [],
    })
    setCurrentStep("preview")
  }

  const handleImport = async () => {
    setIsProcessing(true)
    try {
      // Simulate import process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Import successful",
        description: `Successfully imported ${validatedData.length} records.`,
      })

      onComplete()
    } catch (error) {
      console.error("Error importing data:", error)
      toast({
        title: "Import failed",
        description: "There was an error importing your data.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getStepNumber = (step: ImportStep): number => {
    const steps: ImportStep[] = ["upload", "validate", "preview", "import"]
    return steps.indexOf(step) + 1
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2" />
          AI-Powered Data Import
        </CardTitle>
        <CardDescription>Import your existing data with intelligent validation and mapping</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Step {getStepNumber(currentStep)} of 4</span>
            <span className="capitalize">{currentStep}</span>
          </div>
          <Progress value={getStepNumber(currentStep) * 25} className="h-2" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="staff">Care Professionals</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {currentStep === "upload" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="data-file">Select Data File</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Input
                        id="data-file"
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileChange}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Upload CSV or Excel files containing your records.
                      </p>
                    </div>
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

                <Button onClick={parseFile} disabled={!file || isProcessing} className="w-full">
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue to Validation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {currentStep === "validate" && parsedData.length > 0 && (
              <IntelligentValidator
                data={parsedData}
                onValidationComplete={handleValidationComplete}
                onCancel={() => setCurrentStep("upload")}
              />
            )}

            {currentStep === "preview" && validatedData.length > 0 && (
              <div className="space-y-4">
                <ValidationPreview
                  originalData={parsedData}
                  validatedData={validatedData}
                  validationResult={validationResult}
                />

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep("validate")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Validation
                  </Button>
                  <Button onClick={handleImport} disabled={isProcessing}>
                    {isProcessing ? (
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
                </div>
              </div>
            )}
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
