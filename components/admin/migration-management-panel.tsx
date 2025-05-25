"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, RefreshCw, PlayCircle, RotateCcw, Lock, Clock, FileText } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface MigrationStatus {
  executed: Array<{
    id: string
    name: string
    checksum: string
    executed_at: string
    execution_time_ms: number
    rolled_back: boolean
    rolled_back_at?: string
  }>
  pending: Array<{
    id: string
    name: string
    timestamp: number
    checksum: string
  }>
  locked: boolean
}

export function MigrationManagementPanel() {
  const [status, setStatus] = useState<MigrationStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dryRun, setDryRun] = useState(true)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<"run" | "rollback" | null>(null)

  useEffect(() => {
    fetchStatus()
  }, [])

  async function fetchStatus() {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/migrations")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch migration status")
      }

      const data = await response.json()
      setStatus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  async function runMigrations() {
    if (!dryRun) {
      setConfirmAction("run")
      setShowConfirmDialog(true)
      return
    }

    await executeMigrations()
  }

  async function executeMigrations() {
    setLoading(true)
    setError(null)
    setShowConfirmDialog(false)

    try {
      const response = await fetch("/api/admin/migrations/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dryRun }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to run migrations")
      }

      const data = await response.json()
      setStatus(data.status)

      if (!dryRun) {
        // Show success message
        console.log("Migrations completed successfully")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  async function rollbackMigration() {
    if (!dryRun) {
      setConfirmAction("rollback")
      setShowConfirmDialog(true)
      return
    }

    await executeRollback()
  }

  async function executeRollback() {
    setLoading(true)
    setError(null)
    setShowConfirmDialog(false)

    try {
      const response = await fetch("/api/admin/migrations/rollback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dryRun }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to rollback migration")
      }

      const data = await response.json()
      setStatus(data.status)

      if (!dryRun) {
        // Show success message
        console.log("Rollback completed successfully")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  function handleConfirm() {
    if (confirmAction === "run") {
      executeMigrations()
    } else if (confirmAction === "rollback") {
      executeRollback()
    }
  }

  if (loading && !status) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Database Migrations</CardTitle>
              <CardDescription>Manage database schema changes</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch id="dry-run" checked={dryRun} onCheckedChange={setDryRun} />
                <Label htmlFor="dry-run">Dry Run</Label>
              </div>
              <Button onClick={fetchStatus} variant="outline" size="sm" disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {status?.locked && (
            <Alert variant="warning" className="mb-4">
              <Lock className="h-4 w-4" />
              <AlertTitle>Migrations Locked</AlertTitle>
              <AlertDescription>
                Another migration process is currently running. Please wait for it to complete.
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="pending">
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Pending ({status?.pending.length || 0})</TabsTrigger>
              <TabsTrigger value="executed">Executed ({status?.executed.length || 0})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {status?.pending.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>All migrations are up to date</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Migration</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Checksum</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {status?.pending.map((migration) => (
                      <TableRow key={migration.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            {migration.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{new Date(migration.timestamp).toLocaleString()}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {migration.checksum.substring(0, 8)}...
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="executed">
              {status?.executed.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4" />
                  <p>No migrations have been executed yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Migration</TableHead>
                      <TableHead>Executed</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {status?.executed.map((migration) => (
                      <TableRow key={migration.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            {migration.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {formatDistanceToNow(new Date(migration.executed_at), { addSuffix: true })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{migration.execution_time_ms}ms</Badge>
                        </TableCell>
                        <TableCell>
                          {migration.rolled_back ? (
                            <Badge variant="destructive">Rolled Back</Badge>
                          ) : (
                            <Badge variant="success">Applied</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            onClick={rollbackMigration}
            disabled={loading || status?.executed.length === 0 || status?.locked}
            variant="outline"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Rollback Last
          </Button>
          <Button onClick={runMigrations} disabled={loading || status?.pending.length === 0 || status?.locked}>
            <PlayCircle className="h-4 w-4 mr-2" />
            Run Migrations
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmAction === "run" ? "Run Migrations" : "Rollback Migration"}</DialogTitle>
            <DialogDescription>
              {confirmAction === "run"
                ? `Are you sure you want to run ${status?.pending.length} pending migration(s)? This will modify your database schema.`
                : "Are you sure you want to rollback the last migration? This will revert the most recent schema changes."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} variant={confirmAction === "rollback" ? "destructive" : "default"}>
              {confirmAction === "run" ? "Run Migrations" : "Rollback"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
