"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Database, Key, Table, RefreshCw, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DatabaseScanPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  async function fetchDatabaseScan() {
    setLoading(true)
    try {
      const res = await fetch("/api/diagnostics/database-scan")
      if (!res.ok) throw new Error(`HTTP error ${res.status}`)
      const data = await res.json()
      setData(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDatabaseScan()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Database Scan</h1>
        <Button onClick={fetchDatabaseScan} disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {loading ? "Scanning..." : "Scan Database"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Connection Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  {data.connection ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span>{data.connection ? "Connected" : "Not Connected"}</span>
                </div>
                {data.databaseInfo && (
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Database: {data.databaseInfo.db_name}</p>
                    <p className="truncate">Version: {data.databaseInfo.db_version}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Table className="h-5 w-5 text-blue-500 mr-2" />
                  <span>{data.tables.length} tables found</span>
                </div>
                {data.missingTables.length > 0 && (
                  <div className="mt-2 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                    <span>{data.missingTables.length} expected tables missing</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Relationships</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Key className="h-5 w-5 text-purple-500 mr-2" />
                  <span>{data.relationships.length} relationships found</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {data.recommendations.length > 0 && (
            <Alert className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Recommendations</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 mt-2">
                  {data.recommendations.map((rec: string, i: number) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="tables">
            <TabsList className="mb-4">
              <TabsTrigger value="tables">Tables</TabsTrigger>
              <TabsTrigger value="relationships">Relationships</TabsTrigger>
              <TabsTrigger value="missing">Missing Components</TabsTrigger>
            </TabsList>

            <TabsContent value="tables">
              <Card>
                <CardHeader>
                  <CardTitle>Database Tables</CardTitle>
                  <CardDescription>All tables in the database with their columns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {data.tables.map((table: any) => (
                    <div key={table.name} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium flex items-center">
                          <Database className="h-4 w-4 mr-2" />
                          {table.name}
                        </h3>
                        <Badge variant="outline">{table.rowCount} rows</Badge>
                      </div>
                      {table.description && <p className="text-sm text-gray-500 mb-2">{table.description}</p>}
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 px-2">Column</th>
                              <th className="text-left py-2 px-2">Type</th>
                              <th className="text-left py-2 px-2">Nullable</th>
                              <th className="text-left py-2 px-2">Default</th>
                            </tr>
                          </thead>
                          <tbody>
                            {table.columns.map((column: any, i: number) => (
                              <tr key={i} className="border-b">
                                <td className="py-1.5 px-2 font-medium">{column.column_name}</td>
                                <td className="py-1.5 px-2">
                                  {column.data_type}
                                  {column.character_maximum_length && ` (${column.character_maximum_length})`}
                                </td>
                                <td className="py-1.5 px-2">{column.is_nullable === "YES" ? "Yes" : "No"}</td>
                                <td className="py-1.5 px-2 text-gray-500">{column.column_default || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="relationships">
              <Card>
                <CardHeader>
                  <CardTitle>Database Relationships</CardTitle>
                  <CardDescription>Foreign key relationships between tables</CardDescription>
                </CardHeader>
                <CardContent>
                  {data.relationships.length === 0 ? (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>No relationships found</AlertTitle>
                      <AlertDescription>
                        Your database doesn't have any foreign key relationships defined. This might indicate a problem
                        with the schema design.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Source Table</th>
                            <th className="text-left py-2">Source Column</th>
                            <th className="text-left py-2"></th>
                            <th className="text-left py-2">Target Table</th>
                            <th className="text-left py-2">Target Column</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.relationships.map((rel: any, i: number) => (
                            <tr key={i} className="border-b">
                              <td className="py-2 font-medium">{rel.source_table}</td>
                              <td className="py-2">{rel.source_column}</td>
                              <td className="py-2 text-center">→</td>
                              <td className="py-2 font-medium">{rel.target_table}</td>
                              <td className="py-2">{rel.target_column}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="missing">
              <Card>
                <CardHeader>
                  <CardTitle>Missing Components</CardTitle>
                  <CardDescription>Tables and columns that are expected but missing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {data.missingTables.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">Missing Tables</h3>
                        <ul className="list-disc pl-5">
                          {data.missingTables.map((table: string, i: number) => (
                            <li key={i}>{table}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {data.missingColumns.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">Missing Columns</h3>
                        {data.missingColumns.map((item: any, i: number) => (
                          <div key={i} className="mb-4">
                            <h4 className="font-medium">{item.table}</h4>
                            <ul className="list-disc pl-5">
                              {item.missingColumns.map((col: string, j: number) => (
                                <li key={j}>{col}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {data.missingTables.length === 0 && data.missingColumns.length === 0 && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>No missing components</AlertTitle>
                        <AlertDescription>
                          All expected tables and columns are present in the database.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
