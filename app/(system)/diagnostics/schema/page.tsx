"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, Database, Key, AlertCircle } from "lucide-react"

interface ColumnInfo {
  column_name: string
  data_type: string
  is_nullable: string
  column_default: string | null
  character_maximum_length: number | null
}

interface SchemaData {
  tables: string[]
  schemas: Record<string, ColumnInfo[]>
  foreignKeys: Array<{
    table_name: string
    column_name: string
    foreign_table_name: string
    foreign_column_name: string
  }>
  timestamp: string
}

export default function DatabaseSchemaPage() {
  const [schemaData, setSchemaData] = useState<SchemaData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTable, setSelectedTable] = useState<string | null>(null)

  const fetchSchema = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/diagnostics/schema")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch schema")
      }

      const data = await response.json()
      setSchemaData(data)

      // Auto-select first table if none selected
      if (!selectedTable && data.tables.length > 0) {
        setSelectedTable(data.tables[0])
      }
    } catch (err) {
      console.error("Error fetching schema:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch schema")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchema()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-[600px]" />
          <div className="md:col-span-3">
            <Skeleton className="h-[600px]" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchSchema} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Database Schema</h1>
          <p className="text-gray-500">
            Last updated: {schemaData ? new Date(schemaData.timestamp).toLocaleString() : "Never"}
          </p>
        </div>
        <Button onClick={fetchSchema} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Tables List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-4 w-4 mr-2" />
              Tables
            </CardTitle>
            <CardDescription>{schemaData?.tables.length || 0} tables found</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[600px] overflow-y-auto">
              {schemaData?.tables.map((table) => (
                <button
                  key={table}
                  onClick={() => setSelectedTable(table)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                    selectedTable === table ? "bg-gray-100 font-medium" : ""
                  }`}
                >
                  {table}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Table Details */}
        <div className="md:col-span-3">
          {selectedTable && schemaData && (
            <Card>
              <CardHeader>
                <CardTitle>{selectedTable}</CardTitle>
                <CardDescription>{schemaData.schemas[selectedTable]?.length || 0} columns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Columns */}
                  <div>
                    <h3 className="font-medium mb-2">Columns</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Column Name</th>
                            <th className="text-left py-2">Type</th>
                            <th className="text-left py-2">Nullable</th>
                            <th className="text-left py-2">Default</th>
                          </tr>
                        </thead>
                        <tbody>
                          {schemaData.schemas[selectedTable]?.map((column) => (
                            <tr key={column.column_name} className="border-b">
                              <td className="py-2 font-mono text-xs">{column.column_name}</td>
                              <td className="py-2">
                                <Badge variant="outline" className="font-mono text-xs">
                                  {column.data_type}
                                  {column.character_maximum_length && ` (${column.character_maximum_length})`}
                                </Badge>
                              </td>
                              <td className="py-2">
                                <Badge variant={column.is_nullable === "YES" ? "secondary" : "default"}>
                                  {column.is_nullable}
                                </Badge>
                              </td>
                              <td className="py-2 font-mono text-xs text-gray-500">{column.column_default || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Foreign Keys */}
                  {schemaData.foreignKeys.filter((fk) => fk.table_name === selectedTable).length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2 flex items-center">
                        <Key className="h-4 w-4 mr-2" />
                        Foreign Keys
                      </h3>
                      <div className="space-y-2">
                        {schemaData.foreignKeys
                          .filter((fk) => fk.table_name === selectedTable)
                          .map((fk, index) => (
                            <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                              <span className="font-mono">{fk.column_name}</span>
                              <span className="mx-2">→</span>
                              <span className="font-mono">
                                {fk.foreign_table_name}.{fk.foreign_column_name}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
