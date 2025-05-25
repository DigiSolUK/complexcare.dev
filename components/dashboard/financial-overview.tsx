"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDown, ArrowUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface FinancialOverviewProps {
  isLoading?: boolean
}

export function FinancialOverview({ isLoading = false }: FinancialOverviewProps) {
  // In a real implementation, this data would come from an API
  const financialData = {
    currentMonth: {
      revenue: 78450,
      expenses: 42300,
      outstanding: 12800,
      overdue: 5200,
      revenueChange: 8.2,
      expensesChange: 3.5,
      outstandingChange: -2.1,
      overdueChange: -5.3,
    },
    previousMonth: {
      revenue: 72500,
      expenses: 40900,
      outstanding: 13100,
      overdue: 5500,
    },
  }

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
          <Skeleton className="h-[300px] w-full" />
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
        <Tabs defaultValue="current">
          <TabsList className="mb-4">
            <TabsTrigger value="current">Current Month</TabsTrigger>
            <TabsTrigger value="previous">Previous Month</TabsTrigger>
          </TabsList>
          <TabsContent value="current">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <FinancialMetricCard
                title="Revenue"
                value={financialData.currentMonth.revenue}
                change={financialData.currentMonth.revenueChange}
                prefix="£"
              />
              <FinancialMetricCard
                title="Expenses"
                value={financialData.currentMonth.expenses}
                change={financialData.currentMonth.expensesChange}
                prefix="£"
                invertChange
              />
              <FinancialMetricCard
                title="Outstanding"
                value={financialData.currentMonth.outstanding}
                change={financialData.currentMonth.outstandingChange}
                prefix="£"
                invertChange
              />
              <FinancialMetricCard
                title="Overdue"
                value={financialData.currentMonth.overdue}
                change={financialData.currentMonth.overdueChange}
                prefix="£"
                invertChange
              />
            </div>
          </TabsContent>
          <TabsContent value="previous">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <FinancialMetricCard title="Revenue" value={financialData.previousMonth.revenue} prefix="£" />
              <FinancialMetricCard title="Expenses" value={financialData.previousMonth.expenses} prefix="£" />
              <FinancialMetricCard title="Outstanding" value={financialData.previousMonth.outstanding} prefix="£" />
              <FinancialMetricCard title="Overdue" value={financialData.previousMonth.overdue} prefix="£" />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

interface FinancialMetricCardProps {
  title: string
  value: number
  change?: number
  prefix?: string
  invertChange?: boolean
}

function FinancialMetricCard({ title, value, change, prefix = "", invertChange = false }: FinancialMetricCardProps) {
  const formattedValue = new Intl.NumberFormat("en-GB").format(value)

  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        <div className="mt-1 flex items-center">
          {prefix && <span className="mr-1 text-xl font-bold">{prefix}</span>}
          <span className="text-2xl font-bold">{formattedValue}</span>
        </div>
        {change !== undefined && (
          <div className="mt-2 flex items-center">
            {change > 0 ? (
              <div className={`flex items-center text-xs ${invertChange ? "text-red-500" : "text-green-500"}`}>
                <ArrowUp className="mr-1 h-3 w-3" />
                <span>{change.toFixed(1)}%</span>
              </div>
            ) : (
              <div className={`flex items-center text-xs ${invertChange ? "text-green-500" : "text-red-500"}`}>
                <ArrowDown className="mr-1 h-3 w-3" />
                <span>{Math.abs(change).toFixed(1)}%</span>
              </div>
            )}
            <span className="ml-1 text-xs text-muted-foreground">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
