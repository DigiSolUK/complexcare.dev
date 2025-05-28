"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Edit2, AlertCircle } from "lucide-react"
import { format } from "date-fns"

interface InsuranceInfo {
  provider: string
  policy_number: string
  group_number?: string
  status: "active" | "expired" | "pending"
  start_date: string
  end_date?: string
  coverage_type: string
}

interface PatientInsuranceInfoProps {
  patientId: string
}

export function PatientInsuranceInfo({ patientId }: PatientInsuranceInfoProps) {
  const [insurance, setInsurance] = useState<InsuranceInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      setInsurance({
        provider: "NHS",
        policy_number: "NHS123456789",
        status: "active",
        start_date: "2020-01-01",
        coverage_type: "Full Coverage",
      })
      setIsLoading(false)
    }, 1000)
  }, [patientId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "expired":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Insurance Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Insurance Information</CardTitle>
          <CardDescription>Coverage and policy details</CardDescription>
        </div>
        <Button size="sm" variant="outline">
          <Edit2 className="h-4 w-4 mr-1" />
          Update
        </Button>
      </CardHeader>
      <CardContent>
        {insurance ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-medium">{insurance.provider}</span>
              </div>
              <Badge className={getStatusColor(insurance.status)}>{insurance.status}</Badge>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Policy Number</p>
                <p className="font-medium">{insurance.policy_number}</p>
              </div>

              {insurance.group_number && (
                <div>
                  <p className="text-sm text-muted-foreground">Group Number</p>
                  <p className="font-medium">{insurance.group_number}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground">Coverage Type</p>
                <p className="font-medium">{insurance.coverage_type}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Effective Date</p>
                <p className="font-medium">{format(new Date(insurance.start_date), "PPP")}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No insurance information on file</p>
            <Button size="sm" className="mt-2">
              Add Insurance
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
