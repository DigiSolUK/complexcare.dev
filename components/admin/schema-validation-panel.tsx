"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, XCircle, RefreshCw, Download, Copy } from "lucide-react"
import type { SchemaMismatch } from "@/lib/db/schema-validator"

interface SchemaValidationResult {
  isValid: boolean
  mismatches: SchemaMismatch[]
  timestamp: string
  fixSql?: string
}

export function SchemaValidationPanel() {
  const [result, setResult] = useState<SchemaValidationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function runValidation() {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/schema-validation")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to validate schema")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Could add a toast notification here
        console.log("Copied to clipboard")
      })
      .catch((err) => {
        console.error("Failed to copy:", err)
      })
  }

  function downloadSql() {
    if (!result?.fixSql) return

    const blob = new Blob([result.fixSql], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `schema-fixes-${new Date().toISOString().split("T")[0]}.sql`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function getSeverityColor(severity: string) {
    return severity === "error" ? "text-red-500" : "text-amber-500"
  }

  function getSeverityIcon(severity: string) {
    return severity === "error" ? (
      <XCircle className="h-5 w-5 text-red-500" />
    ) : (
      <AlertTriangle className="h-5 w-5 text-amber-500" />
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Database Schema Validation</span>
          {result && (
            <Badge variant={result.isValid ? "success" : "destructive"}>
              {result.isValid ? "Valid" : `${result.mismatches.length} Issues`}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Validate the database schema against expected models</CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Validation Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Last validated: {new Date(result.timestamp).toLocaleString()}
            </div>

            {result.isValid ? (
              <Alert variant="success" className="mb-4 bg-green-50 border-green-200">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <AlertTitle className="text-green-700">Schema is valid</AlertTitle>
                <AlertDescription className="text-green-600">
                  The database schema matches the expected models.
                </AlertDescription>
              </Alert>
            ) : (
              <Tabs defaultValue="issues">
                <TabsList className="mb-4">
                  <TabsTrigger value="issues">Issues ({result.mismatches.length})</TabsTrigger>
                  <TabsTrigger value="sql">SQL Fixes</TabsTrigger>
                </TabsList>

                <TabsContent value="issues" className="space-y-4">
                  {result.mismatches.map((mismatch, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex items-start gap-2">
                        {getSeverityIcon(mismatch.severity)}
                        <div>
                          <h4 className="font-medium">
                            {mismatch.type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}:{" "}
                            {mismatch.entity}
                          </h4>
                          <div className="mt-2 text-sm">
                            <div>
                              <span className="font-medium">Expected:</span> {mismatch.expected}
                            </div>
                            <div>
                              <span className="font-medium">Actual:</span> {mismatch.actual || "missing"}
                            </div>
                            <div className={`mt-2 ${getSeverityColor(mismatch.severity)}`}>
                              <span className="font-medium">Severity:</span> {mismatch.severity}
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            <span className="font-medium">Suggestion:</span> {mismatch.suggestion}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="sql">
                  {result.fixSql ? (
                    <div className="relative">
                      <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-auto max-h-96 text-sm">
                        {result.fixSql}
                      </pre>
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 bg-slate-800 hover:bg-slate-700 text-white"
                          onClick={() => copyToClipboard(result.fixSql || "")}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 bg-slate-800 hover:bg-slate-700 text-white"
                          onClick={downloadSql}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">No SQL fixes needed</div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </>
        )}

        {!result && !loading && !error && (
          <div className="text-center py-8 text-muted-foreground">
            Click the button below to validate the database schema
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-muted-foreground">Validating schema...</p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button onClick={runValidation} disabled={loading} className="w-full">
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Validating...
            </>
          ) : (
            "Validate Schema"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
