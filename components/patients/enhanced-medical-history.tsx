"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComprehensiveMedicalHistory } from "@/components/patients/comprehensive-medical-history"
import { GPConnectMedicalHistory } from "@/components/patients/gp-connect-medical-history"
import { ImportGPConnectDialog } from "@/components/patients/import-gp-connect-dialog"
import { Pill, Database } from "lucide-react"

interface EnhancedMedicalHistoryProps {
  patientId: string
  nhsNumber: string
  tenantId: string
}

export function EnhancedMedicalHistory({ patientId, nhsNumber, tenantId }: EnhancedMedicalHistoryProps) {
  const [activeTab, setActiveTab] = useState("local")
  const [refreshKey, setRefreshKey] = useState(0)

  const handleImportComplete = () => {
    // Refresh the medical history component
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Medical History</CardTitle>
            <CardDescription>Comprehensive medical history from all sources</CardDescription>
          </div>
          <ImportGPConnectDialog patientId={patientId} nhsNumber={nhsNumber} onImportComplete={handleImportComplete} />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="local" className="flex items-center">
              <Database className="h-4 w-4 mr-2" />
              Local Records
            </TabsTrigger>
            <TabsTrigger value="gp-connect" className="flex items-center">
              <Pill className="h-4 w-4 mr-2" />
              GP Connect Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="local">
            <ComprehensiveMedicalHistory key={`local-${refreshKey}`} patientId={patientId} tenantId={tenantId} />
          </TabsContent>

          <TabsContent value="gp-connect">
            <GPConnectMedicalHistory key={`gp-${refreshKey}`} patientId={patientId} nhsNumber={nhsNumber} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
