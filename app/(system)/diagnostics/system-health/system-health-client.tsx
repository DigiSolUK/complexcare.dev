"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle2, Loader2, Server, Database, KeyRound, Users, Settings2 } from "lucide-react"

type CheckStatus = "idle" | "loading" | "success" | "error"
interface CheckResult {
  status: CheckStatus
  data: any | null
  error: string | null
  title: string
  description: string
  endpoint: string
  icon: React.ElementType
}

const initialChecks: CheckResult[] = [
  {
    title: "Environment Variables",
    description: "Verify access to Vercel environment variables.",
    endpoint: "/api/diagnostics/env-check",
    status: "idle",
    data: null,
    error: null,
    icon: Settings2,
  },
  {
    title: "Database Connectivity",
    description: "Test connection to the Neon database.",
    endpoint: "/api/diagnostics/db-check",
    status: "idle",
    data: null,
    error: null,
    icon: Database,
  },
  {
    title: "Database Schema",
    description: "Fetch current database schema.",
    endpoint: "/api/diagnostics/schema",
    status: "idle",
    data: null,
    error: null,
    icon: Database,
  },
  {
    title: "Authentication Status",
    description: "Check current user session and auth setup.",
    endpoint: "/api/diagnostics/auth-check",
    status: "idle",
    data: null,
    error: null,
    icon: Users,
  },
  {
    title: "API Integrations Config",
    description: "Verify configuration for key API integrations.",
    endpoint: "/api/diagnostics/integrations-status",
    status: "idle",
    data: null,
    error: null,
    icon: KeyRound,
  },
]

export default function SystemHealthClient() {
  const [checks, setChecks] = useState<CheckResult[]>(initialChecks)

  const runCheck = useCallback(
    async (index: number) => {
      setChecks((prev) => prev.map((c, i) => (i === index ? { ...c, status: "loading", error: null, data: null } : c)))
      const check = checks[index]
      try {
        const response = await fetch(check.endpoint)
        const responseData = await response.json()
        if (!response.ok) {
          throw new Error(responseData.message || responseData.error || `Request failed with status ${response.status}`)
        }
        setChecks((prev) => prev.map((c, i) => (i === index ? { ...c, status: "success", data: responseData } : c)))
      } catch (err: any) {
        setChecks((prev) => prev.map((c, i) => (i === index ? { ...c, status: "error", error: err.message } : c)))
      }
    },
    [checks],
  ) // Add checks to dependency array

  const runAllChecks = useCallback(() => {
    checks.forEach((_, index) => {
      // Add a small delay between starting checks if desired, or run in parallel
      setTimeout(() => runCheck(index), index * 200)
    })
  }, [checks, runCheck])

  const getStatusIcon = (status: CheckStatus) => {
    if (status === "loading") return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
    if (status === "success") return <CheckCircle2 className="h-5 w-5 text-green-500" />
    if (status === "error") return <AlertCircle className="h-5 w-5 text-red-500" />
    return <Server className="h-5 w-5 text-gray-400" />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={runAllChecks} disabled={checks.some((c) => c.status === "loading")}>
          {checks.some((c) => c.status === "loading") && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Run All Checks
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {checks.map((check, index) => (
          <Card key={check.title}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <check.icon
                  className={`h-8 w-8 ${
                    check.status === "success"
                      ? "text-green-500"
                      : check.status === "error"
                        ? "text-red-500"
                        : check.status === "loading"
                          ? "text-blue-500"
                          : "text-gray-500"
                  }`}
                />
                {getStatusIcon(check.status)}
              </div>
              <CardTitle className="mt-2">{check.title}</CardTitle>
              <CardDescription>{check.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => runCheck(index)} disabled={check.status === "loading"} className="w-full">
                {check.status === "loading" ? "Running..." : "Run Check"}
              </Button>
              {check.status === "success" && check.data && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 rounded-md">
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">Check Successful</p>
                  <pre className="mt-1 text-xs text-green-600 dark:text-green-400 overflow-auto max-h-40 bg-white dark:bg-black p-2 rounded">
                    {JSON.stringify(check.data, null, 2)}
                  </pre>
                </div>
              )}
              {check.status === "error" && check.error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 rounded-md">
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">Error</p>
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{check.error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manual Checks & Further Diagnostics</CardTitle>
          <CardDescription>Some areas require manual verification or command-line tools.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Area</TableHead>
                <TableHead>Action / Tool</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Code Integrity (Static)</TableCell>
                <TableCell>Run `npm run lint` and `npm run type-check` (or `tsc --noEmit`)</TableCell>
                <TableCell>Ensure these scripts are defined in your `package.json`. Fix any reported issues.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">UI Functionality</TableCell>
                <TableCell>Manual testing of key user flows.</TableCell>
                <TableCell>
                  Login, patient creation/viewing, medication logging, care plan management, etc. Check responsiveness.
                  Use browser dev tools for console errors.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Performance</TableCell>
                <TableCell>Vercel Analytics, Browser DevTools (Lighthouse, Performance tab)</TableCell>
                <TableCell>Identify slow loading pages, large assets, inefficient client-side rendering.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Security</TableCell>
                <TableCell>Manual review & Vercel security features.</TableCell>
                <TableCell>
                  Check for OWASP Top 10 vulnerabilities (XSS, SQLi, etc.). Ensure proper input validation, output
                  encoding, secure headers. Review Vercel's firewall and audit logs.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Vercel Runtime Logs</TableCell>
                <TableCell>Vercel Dashboard -&gt; Project -&gt; Logs</TableCell>
                <TableCell>
                  Monitor for runtime errors from API routes or server components, especially after deployments or
                  during high traffic.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
