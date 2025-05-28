"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, History, TrendingUp } from "lucide-react"
import { MedicationInteractionChecker } from "@/components/ai/medication-interaction-checker"
import { format } from "date-fns"

interface MedicationInteractionDashboardProps {
  patientId?: string
}

export function MedicationInteractionDashboard({ patientId }: MedicationInteractionDashboardProps) {
  const [interactionHistory, setInteractionHistory] = useState([])
  const [statistics, setStatistics] = useState({
    totalChecks: 0,
    severeInteractions: 0,
    moderateInteractions: 0,
    mildInteractions: 0,
  })

  useEffect(() => {
    if (patientId) {
      fetchInteractionHistory()
      fetchStatistics()
    }
  }, [patientId])

  const fetchInteractionHistory = async () => {
    try {
      const response = await fetch(`/api/medications/interactions/history?patientId=${patientId}`)
      if (response.ok) {
        const data = await response.json()
        setInteractionHistory(data)
      }
    } catch (error) {
      console.error("Error fetching interaction history:", error)
    }
  }

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`/api/medications/interactions/stats?patientId=${patientId}`)
      if (response.ok) {
        const data = await response.json()
        setStatistics(data)
      }
    } catch (error) {
      console.error("Error fetching statistics:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Checks</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalChecks}</div>
            <p className="text-xs text-muted-foreground">Interaction checks performed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Severe</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.severeInteractions}</div>
            <p className="text-xs text-muted-foreground">Severe interactions found</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moderate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.moderateInteractions}</div>
            <p className="text-xs text-muted-foreground">Moderate interactions found</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mild</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.mildInteractions}</div>
            <p className="text-xs text-muted-foreground">Mild interactions found</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="checker" className="space-y-4">
        <TabsList>
          <TabsTrigger value="checker">Check Interactions</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="database">Common Interactions</TabsTrigger>
        </TabsList>

        <TabsContent value="checker">
          <MedicationInteractionChecker />
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Interaction Check History</CardTitle>
              <CardDescription>Previous medication interaction checks</CardDescription>
            </CardHeader>
            <CardContent>
              {interactionHistory.length === 0 ? (
                <div className="text-center py-8">
                  <History className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No interaction checks performed yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {interactionHistory.map((check: any) => (
                    <div key={check.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">Medications Checked:</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {check.medications.map((med: string, idx: number) => (
                              <Badge key={idx} variant="secondary">
                                {med}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(check.checked_at), "PPP")}
                        </span>
                      </div>

                      {check.interactions && check.interactions.length > 0 && (
                        <Alert className="mt-2">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Interactions Found</AlertTitle>
                          <AlertDescription>{check.interactions.length} interaction(s) detected</AlertDescription>
                        </Alert>
                      )}

                      <p className="text-xs text-muted-foreground mt-2">Checked by: {check.checked_by_name}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Common Drug Interactions Database</CardTitle>
              <CardDescription>Reference database of known drug interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">Coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
