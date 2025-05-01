"use client"

import { useTheme } from "next-themes"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const revenueData = [
  { month: "Jan", income: 6500, expenses: 4500 },
  { month: "Feb", income: 7200, expenses: 4800 },
  { month: "Mar", income: 8100, expenses: 5100 },
  { month: "Apr", income: 7800, expenses: 5200 },
  { month: "May", income: 8800, expenses: 5600 },
  { month: "Jun", income: 9500, expenses: 5800 },
]

const invoiceStatusData = [
  { status: "Paid", count: 42, value: 12500 },
  { status: "Unpaid", count: 18, value: 6300 },
  { status: "Overdue", count: 5, value: 4320 },
  { status: "Draft", count: 3, value: 1675 },
  { status: "Cancelled", count: 2, value: 950 },
]

const paymentMethodData = [
  { method: "Credit Card", value: 8750 },
  { method: "Bank Transfer", value: 6200 },
  { method: "Cash", value: 1350 },
  { method: "Other", value: 450 },
]

const outstandingByAgeData = [
  { age: "0-30 days", value: 6300 },
  { age: "31-60 days", value: 2800 },
  { age: "61-90 days", value: 1250 },
  { age: ">90 days", value: 270 },
]

// Custom color palette
const colors = {
  income: "#4f46e5", // indigo
  expenses: "#f97316", // orange
  paid: "#10b981", // green
  unpaid: "#f59e0b", // amber
  overdue: "#ef4444", // red
  draft: "#6b7280", // gray
  cancelled: "#3b82f6", // blue
  creditCard: "#8b5cf6", // purple
  bankTransfer: "#3b82f6", // blue
  cash: "#10b981", // green
  other: "#6b7280", // gray
  outstanding: "#ec4899", // pink
}

export function FinancialOverview() {
  const { theme } = useTheme()

  // Get the appropriate color for invoice status
  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return colors.paid
      case "Unpaid":
        return colors.unpaid
      case "Overdue":
        return colors.overdue
      case "Draft":
        return colors.draft
      case "Cancelled":
        return colors.cancelled
      default:
        return colors.other
    }
  }

  // Get the appropriate color for payment method
  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case "Credit Card":
        return colors.creditCard
      case "Bank Transfer":
        return colors.bankTransfer
      case "Cash":
        return colors.cash
      default:
        return colors.other
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Monthly income and expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `£${value}`}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                    border: "none",
                    borderRadius: "4px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                  formatter={(value) => [`£${value}`, ""]}
                />
                <Legend />
                <Bar dataKey="income" name="Income" fill={colors.income} radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill={colors.expenses} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Status</CardTitle>
            <CardDescription>Current status of all invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={invoiceStatusData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis
                    type="number"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `£${value}`}
                  />
                  <YAxis type="category" dataKey="status" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                      border: "none",
                      borderRadius: "4px",
                    }}
                    formatter={(value, name, props) => [`£${value}`, props.payload.status]}
                  />
                  <Bar dataKey="value" name="Value" radius={[0, 4, 4, 0]}>
                    {invoiceStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getInvoiceStatusColor(entry.status)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Breakdown of payment methods used</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentMethodData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="method" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `£${value}`}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                      border: "none",
                      borderRadius: "4px",
                    }}
                    formatter={(value, name, props) => [`£${value}`, props.payload.method]}
                  />
                  <Bar dataKey="value" name="Amount" radius={[4, 4, 0, 0]}>
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getPaymentMethodColor(entry.method)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Outstanding Balances by Age</CardTitle>
          <CardDescription>Aging analysis of outstanding invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={outstandingByAgeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="age" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `£${value}`}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                    border: "none",
                    borderRadius: "4px",
                  }}
                  formatter={(value) => [`£${value}`, "Outstanding"]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Outstanding"
                  stroke={colors.outstanding}
                  strokeWidth={3}
                  dot={{ r: 6, fill: colors.outstanding, strokeWidth: 2, stroke: "white" }}
                  activeDot={{ r: 8, fill: colors.outstanding, strokeWidth: 2, stroke: "white" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
