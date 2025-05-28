"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ValidationPreviewProps {
  originalData: any[]
  validatedData: any[]
  validationResult: {
    errors: Array<{
      field: string
      row?: number
      severity: string
    }>
    warnings: Array<{
      field: string
      row?: number
    }>
  }
}

export function ValidationPreview({ originalData, validatedData, validationResult }: ValidationPreviewProps) {
  const [showSensitiveData, setShowSensitiveData] = useState(false)
  const [viewMode, setViewMode] = useState<"all" | "errors" | "changes">("all")

  const getRowStatus = (rowIndex: number) => {
    const hasError = validationResult.errors.some((e) => e.row === rowIndex + 1)
    const hasWarning = validationResult.warnings.some((w) => w.row === rowIndex + 1)
    const hasChanges = JSON.stringify(originalData[rowIndex]) !== JSON.stringify(validatedData[rowIndex])

    if (hasError) return "error"
    if (hasWarning) return "warning"
    if (hasChanges) return "changed"
    return "valid"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "changed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const maskSensitiveData = (value: string, field: string) => {
    if (!showSensitiveData && ["nhs_number", "email", "phone"].includes(field)) {
      return value.replace(/./g, "•").slice(0, 8) + "..."
    }
    return value
  }

  const filteredData = validatedData.filter((_, index) => {
    const status = getRowStatus(index)
    if (viewMode === "errors") return status === "error"
    if (viewMode === "changes") return status === "changed"
    return true
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Data Preview</CardTitle>
            <CardDescription>Review validated data before import</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowSensitiveData(!showSensitiveData)}>
            {showSensitiveData ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Sensitive
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Show Sensitive
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Records ({validatedData.length})</TabsTrigger>
            <TabsTrigger value="errors">Errors ({validationResult.errors.filter((e) => e.row).length})</TabsTrigger>
            <TabsTrigger value="changes">
              Changes ({validatedData.filter((_, i) => getRowStatus(i) === "changed").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={viewMode}>
            <ScrollArea className="h-[400px] w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Status</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>DOB</TableHead>
                    <TableHead>NHS Number</TableHead>
                    <TableHead>Postcode</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((row, index) => {
                    const status = getRowStatus(index)
                    return (
                      <TableRow
                        key={index}
                        className={cn(
                          status === "error" && "bg-red-50 dark:bg-red-950/20",
                          status === "warning" && "bg-yellow-50 dark:bg-yellow-950/20",
                          status === "changed" && "bg-blue-50 dark:bg-blue-950/20",
                        )}
                      >
                        <TableCell>{getStatusIcon(status)}</TableCell>
                        <TableCell className="font-medium">
                          {row.first_name} {row.last_name}
                        </TableCell>
                        <TableCell>{maskSensitiveData(row.email || "", "email")}</TableCell>
                        <TableCell>{maskSensitiveData(row.phone || "", "phone")}</TableCell>
                        <TableCell>{row.date_of_birth || "-"}</TableCell>
                        <TableCell>{maskSensitiveData(row.nhs_number || "", "nhs_number")}</TableCell>
                        <TableCell>{row.postcode || "-"}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              <span>Valid</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-blue-500 mr-1" />
              <span>Modified</span>
            </div>
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
              <span>Warning</span>
            </div>
            <div className="flex items-center">
              <XCircle className="h-4 w-4 text-red-500 mr-1" />
              <span>Error</span>
            </div>
          </div>
          <Badge variant="outline">
            {filteredData.length} of {validatedData.length} records shown
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
