"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileTextIcon, LoaderIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function DocumentAnalyzer() {
  const [documentText, setDocumentText] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("input")

  const handleAnalyze = async () => {
    if (!documentText.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/document-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ document: documentText }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.text)
        setActiveTab("result")
      } else {
        setError(data.text || "Failed to analyze document")
      }
    } catch (error) {
      console.error("Error analyzing document:", error)
      setError("An error occurred while analyzing the document")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileTextIcon className="h-5 w-5" />
          Medical Document Analyzer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Document Input</TabsTrigger>
            <TabsTrigger value="result" disabled={!result}>
              Analysis Result
            </TabsTrigger>
          </TabsList>
          <TabsContent value="input" className="mt-4">
            <Textarea
              placeholder="Paste medical document text here..."
              className="min-h-[300px]"
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              disabled={isLoading}
            />
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </TabsContent>
          <TabsContent value="result" className="mt-4">
            {result && <div className="bg-muted p-4 rounded-md min-h-[300px] whitespace-pre-line">{result}</div>}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAnalyze} disabled={isLoading || !documentText.trim()} className="w-full">
          {isLoading ? (
            <>
              <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Document"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
