"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Wrench,
  Database,
  Package,
  FileCode,
  Settings,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface FixResult {
  success: boolean
  message: string
  details?: any
  guidance?: string[]
  missingVars?: string[]
  results?: any[]
}

interface FixOption {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  variant: "default" | "destructive" | "outline" | "secondary"
}

const fixOptions: FixOption[] = [
  {
    id: "database_connection",
    name: "Database Connection",
    description: "Verify and fix database connection issues",
    icon: <Database className="h-4 w-4" />,
    variant: "default",
  },
  {
    id: "missing_tables",
    name: "Missing Tables",
    description: "Create missing database tables and indexes",
    icon: <FileCode className="h-4 w-4" />,
    variant: "default",
  },
  {
    id: "module_resolution",
    name: "Module Resolution",
    description: "Get guidance for fixing module import issues",
    icon: <Package className="h-4 w-4" />,
    variant: "outline",
  },
  {
    id: "env_variables",
    name: "Environment Variables",
    description: "Check for required environment variables",
    icon: <Settings className="h-4 w-4" />,
    variant: "outline",
  },
  {
    id: "all",
    name: "Fix All Issues",
    description: "Attempt to fix all known issues automatically",
    icon: <Wrench className="h-4 w-4" />,
    variant: "destructive",
  },
]

export default function AutoFixPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, FixResult>>({})
  const { toast } = useToast()

  const runFix = async (fixType: string) => {
    setLoading(fixType)

    try {
      const response = await fetch("/api/diagnostics/fix-errors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ errorType: fixType }),
      })

      const result: FixResult = await response.json()

      setResults((prev) => ({
        ...prev,
        [fixType]: result,
      }))

      if (result.success) {
        toast({
          title: "Fix Applied Successfully",
          description: result.message,
        })
      } else {
        toast({
          title: "Fix Failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      const errorResult: FixResult = {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
      }

      setResults((prev) => ({
        ...prev,
        [fixType]: errorResult,
      }))

      toast({
        title: "Error Running Fix",
        description: errorResult.message,
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const getResultIcon = (result: FixResult | undefined) => {
    if (!result) return null

    if (result.success) {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />
    } else {
      return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Automatic Error Fixes</h1>
        <p className="text-muted-foreground">Run automatic fixes for common issues in your ComplexCare CRM system</p>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          These fixes will attempt to automatically resolve common issues. Some fixes may modify your database
          structure. It's recommended to backup your data before running these fixes in production.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4">
        {fixOptions.map((option) => {
          const result = results[option.id]

          return (
            <Card key={option.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">{option.icon}</div>
                    <div>
                      <CardTitle className="text-lg">{option.name}</CardTitle>
                      <CardDescription>{option.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getResultIcon(result)}
                    <Button variant={option.variant} onClick={() => runFix(option.id)} disabled={loading !== null}>
                      {loading === option.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Running...
                        </>
                      ) : (
                        "Run Fix"
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {result && (
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={result.success ? "default" : "destructive"}>
                        {result.success ? "Success" : "Failed"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{result.message}</span>
                    </div>

                    {result.guidance && (
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm font-medium mb-2">Guidance:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {result.guidance.map((item, index) => (
                            <li key={index} className="text-sm text-muted-foreground">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.missingVars && result.missingVars.length > 0 && (
                      <div className="bg-destructive/10 p-3 rounded-lg">
                        <p className="text-sm font-medium mb-2">Missing Environment Variables:</p>
                        <div className="flex flex-wrap gap-2">
                          {result.missingVars.map((varName) => (
                            <Badge key={varName} variant="outline">
                              {varName}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.results && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Detailed Results:</p>
                        {result.results.map((subResult, index) => (
                          <div key={index} className="bg-muted p-2 rounded text-sm">
                            <pre className="whitespace-pre-wrap">{JSON.stringify(subResult, null, 2)}</pre>
                          </div>
                        ))}
                      </div>
                    )}

                    {result.details && (
                      <details className="cursor-pointer">
                        <summary className="text-sm font-medium">Technical Details</summary>
                        <pre className="mt-2 p-3 bg-muted rounded-lg text-xs overflow-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-2">Need More Help?</h3>
        <p className="text-sm text-muted-foreground mb-3">
          If these automatic fixes don't resolve your issues, try these additional steps:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li>
            Check the error logs at <code className="bg-background px-1 rounded">/diagnostics/error-logs</code>
          </li>
          <li>
            Review the database schema at <code className="bg-background px-1 rounded">/diagnostics/schema</code>
          </li>
          <li>Verify your environment variables are correctly set</li>
          <li>Clear your browser cache and Next.js cache</li>
          <li>Restart your development server</li>
        </ul>
      </div>
    </div>
  )
}
