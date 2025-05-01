"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LoaderIcon, LightbulbIcon } from "lucide-react"

export default function MedicalTerminologyExplainer() {
  const [terminology, setTerminology] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("input")

  const handleExplain = async () => {
    if (!terminology.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call to AI-powered terminology explainer
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock explanation
      const mockExplanation = `
      **${terminology}**: This is a demo explanation of the medical term. It includes the definition, common usage, and related concepts.
      
      - **Definition**: A brief explanation of what the term means.
      - **Usage**: How the term is used in clinical practice.
      - **Related Concepts**: Other terms or concepts related to this term.
    `

      setResult(mockExplanation)
      setActiveTab("result")
    } catch (error) {
      console.error("Error explaining terminology:", error)
      setError("An error occurred while explaining the terminology")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LightbulbIcon className="h-5 w-5" />
          Medical Terminology Explainer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Terminology</TabsTrigger>
            <TabsTrigger value="result" disabled={!result}>
              Explanation
            </TabsTrigger>
          </TabsList>
          <TabsContent value="input" className="mt-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Enter a medical term or abbreviation to get a clear and concise explanation.
                </p>
                <Textarea
                  placeholder="Enter medical terminology here... (e.g., myocardial infarction, COPD, etc.)"
                  className="min-h-[200px]"
                  value={terminology}
                  onChange={(e) => setTerminology(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button onClick={handleExplain} disabled={isLoading || !terminology.trim()} className="w-full">
                {isLoading ? (
                  <>
                    <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                    Explaining...
                  </>
                ) : (
                  "Explain Terminology"
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
            {result && <div className="bg-muted p-4 rounded-md min-h-[300px] whitespace-pre-line">{result}</div>}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
