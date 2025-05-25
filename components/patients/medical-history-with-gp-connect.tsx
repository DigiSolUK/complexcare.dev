"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RefreshCw, Download, CheckCircle2, AlertCircle, Pill } from "lucide-react"
import { format } from "date-fns"
import { ComprehensiveMedicalHistory } from "./comprehensive-medical-history"

interface MedicalHistoryWithGPConnectProps {
  patientId: string
  tenantId: string
  nhsNumber?: string
}

export function MedicalHistoryWithGPConnect({
  patientId,
  tenantId,
  nhsNumber,
}: MedicalHistoryWithGPConnectProps) {
  const [syncStatus, setSyncStatus] = useState<{
    lastSync?: Date
    status?: string
    message?: string
  }>({})
  const [syncing, setSyncing] = useState(false)
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false)
  const [syncResults, setSyncResults] = useState<any>(null)
  const [gpConnectEnabled, setGpConnectEnabled] = useState(false)

  useEffect(() => {
    checkGPConnectStatus()
    fetchSyncStatus()
  }, [patientId])

  const checkGPConnectStatus = async () => {
    try {
      const response = await fetch(`/api/tenants/${tenantId}/gp-connect-config/status`)
      const data = await response.json()
      setGpConnectEnabled(data.enabled)
    } catch (error) {
      console.error("Error checking GP Connect status:", error)
    }
  }

  const fetchSyncStatus = async () => {
    try {
      const response = await fetch(`/api/patients/${patientId}/gp-connect/sync-status`)
      if (response.ok) {
        const data = await response.json()
        setSyncStatus({
          lastSync: data.lastSync ? new Date(data.lastSync) : undefined,
          status: data.status,
          message: data.message,
        })
      }
    } catch (error) {
      console.error("Error fetching sync status:", error)
    }
  }

  const handleSync = async () => {
    if (!nhsNumber) {
      toast({
        title: "NHS Number Required",
        description: "Patient must have an NHS number to sync with GP Connect",
        variant: "destructive",
      })
      return
    }

    setSyncing(true)
    setSyncResults(null)

    try {
      const response = await fetch(`/api/patients/${patientId}/gp-connect/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nhsNumber,
          syncTypes: ["medications", "conditions", "allergies", "immunizations"],
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Sync failed")
      }

      setSyncResults(result)
      setIsSyncDialogOpen(true)

      // Update sync status
      setSyncStatus({
        lastSync: new Date(),
        status: "success",
        message: `Synced ${result.totalRecords} records`,
      })

      toast({
        title: "Sync Complete",
        description: `Successfully synced ${result.totalRecords} records from GP Connect`,
      })

      // Refresh the page to show new data
      window.location.reload()
    } catch (error) {
      console.error("Error syncing with GP Connect:", error)

      setSyncStatus({
        lastSync: new Date(),
        status: "failed",
        message: error instanceof Error ? error.message : "Unknown error",
      })

      toast({
        title: "Sync Failed",
        description: error instanceof Error ? error.message : "Failed to sync with GP Connect",
        variant: "destructive",
      })
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* GP Connect Sync Status */}
      {gpConnectEnabled && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center">
                  <Download className="h-5 w-5 mr-2" />
                  GP Connect Integration
                </CardTitle>
                <CardDescription>
                  Sync patient data from their GP practice
                </CardDescription>
              </div>
              <Button 
                onClick={handleSync} 
                disabled={syncing || !nhsNumber}
                size="sm"
              >
                {syncing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync Now
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {syncStatus.lastSync && (
              <Alert variant={syncStatus.status === "success" ? "default" : "destructive"}>
                {syncStatus.status === "success" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>Last Sync</AlertTitle>
                <AlertDescription>
                  <div className="space-y-1">
                    <div>
                      <span className="font-medium">Date:</span>{" "}
                      {format(syncStatus.lastSync, "dd MMM yyyy HH:mm")}
                    </div>
                    {syncStatus.message && (
                      <div>
                        <span className="font-medium">Result:</span> {syncStatus.message}
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {!nhsNumber && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>NHS Number Required</AlertTitle>
                <AlertDescription>
                  This patient needs an NHS number to sync data from GP Connect
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Medical History Component */}
      <ComprehensiveMedicalHistory patientId={patientId} tenantId={tenantId} />

      {/* Sync Results Dialog */}
      <Dialog open={isSyncDialogOpen} onOpenChange={setIsSyncDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>GP Connect Sync Results</DialogTitle>
            <DialogDescription>
              Summary of data synced from the patient's GP practice
            </DialogDescription>
          </DialogHeader>

          {syncResults && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <Pill className\
