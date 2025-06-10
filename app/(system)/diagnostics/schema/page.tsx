// This is the code from the previous response, with improved error display.
// Ensure this version is active in your project.
"use client"

import { useEffect, useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, DatabaseZapIcon } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

type Column = {
  column: string
  position: number
  type: string
  nullable: "YES" | "NO"
  default: string | null
}

type Schema = Record<string, Column[]>

export default function DatabaseSchemaPage() {
  const [schema, setSchema] = useState<Schema | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSchema = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/diagnostics/schema")
        if (!response.ok) {
          const errorData = await response.json()
          // Construct a more informative error message
          let message = `Failed to fetch schema. Status: ${response.status}.`
          if (errorData.error) message += ` Error: ${errorData.error}.`
          if (errorData.details) message += ` Details: ${errorData.details}.`
          throw new Error(message)
        }
        const data: Schema = await response.json()
        if (Object.keys(data).length === 0) {
          setError("No tables found in the public schema or schema is empty. The API returned an empty object.")
          setSchema(null)
        } else {
          setSchema(data)
        }
      } catch (err) {
        let detailedError = "An unknown error occurred while fetching the schema."
        if (err instanceof Error) {
          detailedError = err.message
        }
        setError(detailedError)
        console.error("Error in fetchSchema on page.tsx:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSchema()
  }, [])

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <LoadingSpinner className="h-12 w-12 mb-4 text-blue-600" />
          <p className="text-xl font-semibold text-gray-700">Querying Database Schema...</p>
          <p className="text-sm text-gray-500">Fetching live structure from your database.</p>
        </div>
      )
    }

    if (error) {
      return (
        <Alert variant="destructive" className="mt-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Fetching Database Schema</AlertTitle>
          <AlertDescription>
            <p className="font-semibold">The following error occurred:</p>
            <pre className="mt-2 whitespace-pre-wrap rounded-md bg-slate-100 p-2 text-sm text-red-700">{error}</pre>
            <p className="mt-2">
              Please check the browser console (Network and Console tabs) and your server logs for more details. Common
              issues include database connectivity problems or errors within the API route.
            </p>
          </AlertDescription>
        </Alert>
      )
    }

    if (!schema || Object.keys(schema).length === 0) {
      return (
        <Alert>
          <DatabaseZapIcon className="h-4 w-4" />
          <AlertTitle>No Schema Information Found</AlertTitle>
          <AlertDescription>
            Could not find any tables in the public schema, or the schema is empty. Please ensure your database is
            connected and contains tables, and that the API route is functioning correctly.
          </AlertDescription>
        </Alert>
      )
    }

    return (
      <Accordion type="multiple" className="w-full space-y-2">
        {Object.entries(schema)
          .sort(([tableNameA], [tableNameB]) => tableNameA.localeCompare(tableNameB))
          .map(([tableName, columns]) => (
            <AccordionItem
              value={tableName}
              key={tableName}
              className="rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline data-[state=open]:border-b">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DatabaseZapIcon className="h-5 w-5 text-blue-600" />
                    <span className="font-mono text-blue-700">{tableName}</span>
                  </div>
                  <Badge variant="outline" className="font-normal">
                    {columns.length} columns
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="w-[50px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                          #
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                          Column Name
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                          Data Type
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                          Nullable
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                          Default Value
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-slate-200 bg-white">
                      {columns.map((col) => (
                        <TableRow key={col.column} className="hover:bg-slate-50">
                          <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">
                            {col.position}
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-semibold font-mono text-slate-800">
                            {col.column}
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-mono text-purple-600">
                            {col.type}
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                            {col.nullable === "YES" ? (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                Yes
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="border-green-300 bg-green-50 text-green-700">
                                No
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">
                            {col.default || <span className="italic">NULL</span>}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
      </Accordion>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-800">Live Database Schema</h1>
          <p className="mt-2 text-lg text-slate-600">
            A real-time, detailed view of all tables and columns in your application's public database schema.
          </p>
        </header>
        <main className="rounded-lg bg-white p-6 shadow-xl">{renderContent()}</main>
        <footer className="mt-12 text-center text-sm text-slate-500">
          <p>Schema information is fetched live from the database. Last updated: {new Date().toLocaleString()}</p>
        </footer>
      </div>
    </div>
  )
}
