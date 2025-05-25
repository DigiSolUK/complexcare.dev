"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon, TrendingDown, TrendingUp } from "lucide-react"

interface FinancialData {
  currentMonth: {
    revenue: number
    expenses: number
    outstanding: number
    overdue: number
  }
  previousMonth: {
    revenue: number
    expenses: number
    outstanding: number
    overdue: number
  }
}

interface FinancialOverviewProps {
  data?: FinancialData
  isLoading?: boolean
}

export function FinancialOverview({ data, isLoading = false }: FinancialOverviewProps) {
  // Default data for when real data isn't available
  const defaultData: FinancialData = {
    currentMonth: {
      revenue: 42500,
      expenses: 31200,
      outstanding: 12500,
      overdue: 3800,
    },
    previousMonth: {
      revenue: 38900,
      expenses: 29800,
      outstanding: 14200,
      overdue: 4500,
    },
  }

  const financialData = data || defaultData

  // Calculate percentage changes
  const revenueChange = calculatePercentageChange(
    financialData.currentMonth.revenue,
    financialData.previousMonth.revenue,
  )
  const expensesChange = calculatePercentageChange(
    financialData.currentMonth.expenses,
    financialData.previousMonth.expenses,
  )
  const outstandingChange = calculatePercentageChange(
    financialData.currentMonth.outstanding,
    financialData.previousMonth.outstanding,
  )
  const overdueChange = calculatePercentageChange(
    financialData.currentMonth.overdue,
    financialData.previousMonth.overdue,
  )

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-[180px]" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-[250px]" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-6 w-[150px]" />
                <Skeleton className="h-3 w-[100px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
        <CardDescription>Current month financial metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Revenue</p>
            <p className="text-2xl font-bold">£{financialData.currentMonth.revenue.toLocaleString()}</p>
            <div className="flex items-center text-xs">
              {revenueChange >= 0 ? (
                <>
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">+{revenueChange}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                  <span className="text-red-500">{revenueChange}%</span>
                </>
              )}
              <span className="ml-1 text-muted-foreground">vs last month</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Expenses</p>
            <p className="text-2xl font-bold">£{financialData.currentMonth.expenses.toLocaleString()}</p>
            <div className="flex items-center text-xs">
              {expensesChange <= 0 ? (
                <>
                  <TrendingDown className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">{expensesChange}%</span>
                </>
              ) : (
                <>
                  <TrendingUp className="mr-1 h-3 w-3 text-red-500" />
                  <span className="text-red-500">+{expensesChange}%</span>
                </>
              )}
              <span className="ml-1 text-muted-foreground">vs last month</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Outstanding Invoices</p>
            <p className="text-2xl font-bold">£{financialData.currentMonth.outstanding.toLocaleString()}</p>
            <div className="flex items-center text-xs">
              {outstandingChange <= 0 ? (
                <>
                  <TrendingDown className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">{outstandingChange}%</span>
                </>
              ) : (
                <>
                  <TrendingUp className="mr-1 h-3 w-3 text-red-500" />
                  <span className="text-red-500">+{outstandingChange}%</span>
                </>
              )}
              <span className="ml-1 text-muted-foreground">vs last month</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Overdue Payments</p>
            <p className="text-2xl font-bold">£{financialData.currentMonth.overdue.toLocaleString()}</p>
            <div className="flex items-center text-xs">
              {overdueChange <= 0 ? (
                <>
                  <TrendingDown className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">{overdueChange}%</span>
                </>
              ) : (
                <>
                  <TrendingUp className="mr-1 h-3 w-3 text-red-500" />
                  <span className="text-red-500">+{overdueChange}%</span>
                </>
              )}
              <span className="ml-1 text-muted-foreground">vs last month</span>
            </div>
          </div>
        </div>

        {!data && (
          <Alert variant="outline" className="mt-6">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>Showing demo data. Connect to finance API for real metrics.</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0
  const change = ((current - previous) / previous) * 100
  return Math.round(change)
}
