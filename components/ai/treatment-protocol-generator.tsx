"use client"

import { Input } from "@/components/ui/input"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LoaderIcon, FileTextIcon, DownloadIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

type ProtocolType = "standard" | "detailed" | "personalized"

export default function TreatmentProtocolGenerator() {
  const [condition, setCondition] = useState("")
  const [patientDetails, setPatientDetails] = useState("")
  const [protocolType, setProtocolType] = useState<ProtocolType>("standard")
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("input")

  const handleGenerate = async () => {
    if (!condition.trim()) {
      setError("Medical condition is required")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/treatment-protocol", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ condition, patientDetails, protocolType }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.text)
        setActiveTab("result")
      } else {
        setError(data.error || "Failed to generate treatment protocol")
      }
    } catch (error) {
      console.error("Error generating treatment protocol:", error)
      setError("An error occurred while generating the treatment protocol")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (!result) return

    const blob = new Blob([result], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `treatment-protocol-${condition}-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileTextIcon className="h-5 w-5" />
          Treatment Protocol Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Input</TabsTrigger>
            <TabsTrigger value="result" disabled={!result}>
              Generated Protocol
            </TabsTrigger>
          </TabsList>
          <TabsContent value="input" className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="condition">Medical Condition</Label>
                <Input
                  id="condition"
                  placeholder="Enter medical condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patient-details">Patient Details (Optional)</Label>
                <Textarea
                  id="patient-details"
                  placeholder="Enter patient-specific details (age, gender, medical history, etc.)"
                  className="min-h-[100px]"
                  value={patientDetails}
                  onChange={(e) => setPatientDetails(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="protocol-type">Protocol Type</Label>
                <Select value={protocolType} onValueChange={(value) => setProtocolType(value as ProtocolType)}>
                  <SelectTrigger id="protocol-type">
                    <SelectValue placeholder="Select protocol type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                    <SelectItem value="personalized">Personalized</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleGenerate} disabled={isLoading || !condition.trim()} className="w-full">
                {isLoading ? (
                  <>
                    <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Protocol"
                )}
              </Button>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
          <TabsContent value="result" className="mt-4">
            {result && (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md min-h-[300px] whitespace-pre-line">{result}</div>
                <Button onClick={handleDownload} className="w-full" variant="outline">
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Download Protocol
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
