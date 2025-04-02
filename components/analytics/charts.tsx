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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

// Patient Analytics
const patientDemographicsData = [
  { age: "0-17", count: 12 },
  { age: "18-34", count: 35 },
  { age: "35-49", count: 58 },
  { age: "50-64", count: 85 },
  { age: "65-79", count: 42 },
  { age: "80+", count: 14 },
]

const patientConditionsData = [
  { name: "Diabetes", value: 65 },
  { name: "Hypertension", value: 85 },
  { name: "Heart Disease", value: 45 },
  { name: "Respiratory", value: 30 },
  { name: "Mental Health", value: 58 },
  { name: "Other", value: 48 },
]

const patientReferralSourceData = [
  { name: "GP Referral", value: 120 },
  { name: "Hospital", value: 80 },
  { name: "Self-Referral", value: 25 },
  { name: "Social Services", value: 15 },
  { name: "Other Healthcare", value: 6 },
]

// Appointment Analytics
const appointmentTypesData = [
  { type: "Initial Assessment", count: 45 },
  { type: "Follow-up", count: 120 },
  { type: "Care Review", count: 65 },
  { type: "Emergency", count: 12 },
  { type: "Specialist", count: 35 },
]

const appointmentTrendsData = [
  { month: "Jan", completed: 110, cancelled: 12, missed: 8 },
  { month: "Feb", completed: 125, cancelled: 10, missed: 5 },
  { month: "Mar", completed: 140, cancelled: 15, missed: 10 },
  { month: "Apr", completed: 135, cancelled: 12, missed: 7 },
  { month: "May", completed: 150, cancelled: 8, missed: 6 },
  { month: "Jun", completed: 160, cancelled: 10, missed: 5 },
]

const appointmentWaitTimeData = [
  { category: "Initial Assessment", time: 8.5 },
  { category: "Follow-up", time: 4.2 },
  { category: "Care Review", time: 3.5 },
  { category: "Specialist", time: 12.3 },
]

// Clinical Outcome Analytics
const outcomesByConditionData = [
  { condition: "Diabetes", improved: 75, stable: 15, declined: 10 },
  { condition: "Hypertension", improved: 65, stable: 25, declined: 10 },
  { condition: "Heart Disease", improved: 55, stable: 30, declined: 15 },
  { condition: "Respiratory", improved: 60, stable: 30, declined: 10 },
  { condition: "Mental Health", improved: 70, stable: 20, declined: 10 },
]

const readmissionRatesData = [
  { month: "Jan", rate: 5.2 },
  { month: "Feb", rate: 4.8 },
  { month: "Mar", rate: 4.5 },
  { month: "Apr", rate: 4.2 },
  { month: "May", rate: 3.9 },
  { month: "Jun", rate: 3.7 },
]

// Staff Performance Analytics
const staffProductivityData = [
  { staff: "Dr. Johnson", appointments: 145, carePlans: 35, reviews: 28 },
  { staff: "Dr. Williams", appointments: 130, carePlans: 42, reviews: 34 },
  { staff: "Nurse Smith", appointments: 165, carePlans: 28, reviews: 22 },
  { staff: "Dr. Brown", appointments: 120, carePlans: 38, reviews: 30 },
  { staff: "Nurse Davis", appointments: 150, carePlans: 32, reviews: 26 },
]

const patientFeedbackData = [
  { category: "Clinical Care", score: 4.8 },
  { category: "Communication", score: 4.5 },
  { category: "Responsiveness", score: 4.7 },
  { category: "Environment", score: 4.6 },
  { category: "Overall", score: 4.7 },
]

// Financial Analytics
const revenueByServiceData = [
  { service: "Initial Assessments", revenue: 35000 },
  { service: "Care Plans", revenue: 65000 },
  { service: "Follow-ups", revenue: 48000 },
  { service: "Specialist Care", revenue: 58000 },
  { service: "Emergency Care", revenue: 22000 },
]

const financialTrendsData = [
  { month: "Jan", revenue: 85000, expenses: 62000, profit: 23000 },
  { month: "Feb", revenue: 92000, expenses: 65000, profit: 27000 },
  { month: "Mar", revenue: 98000, expenses: 68000, profit: 30000 },
  { month: "Apr", revenue: 90000, expenses: 70000, profit: 20000 },
  { month: "May", revenue: 105000, expenses: 72000, profit: 33000 },
  { month: "Jun", revenue: 110000, expenses: 75000, profit: 35000 },
]

// COLORS for pie charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#a855f7", "#ef4444"]

export function PatientAnalytics() {
  const { theme } = useTheme()

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Patient Demographics & Insights</h2>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Patient Data
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
            <CardDescription>Patient demographics by age group</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patientDemographicsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="age" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                      border: "none",
                      borderRadius: "4px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                  />
                  <Bar dataKey="count" name="Patients" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Main Conditions</CardTitle>
            <CardDescription>Distribution of primary conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={patientConditionsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {patientConditionsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                      border: "none",
                      borderRadius: "4px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Referral Sources</CardTitle>
            <CardDescription>How patients are referred to your service</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patientReferralSourceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  />
                  <Bar dataKey="value" name="Patients" fill="var(--primary)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function AppointmentAnalytics() {
  const { theme } = useTheme()

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Appointment Analytics</h2>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Appointment Data
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Appointment Trends</CardTitle>
            <CardDescription>Monthly appointment statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appointmentTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                      border: "none",
                      borderRadius: "4px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="completed" name="Completed" fill="var(--primary)" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="cancelled" name="Cancelled" fill="var(--muted)" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="missed" name="Missed" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appointment Types</CardTitle>
            <CardDescription>Distribution by appointment type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={appointmentTypesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                  >
                    {appointmentTypesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                      border: "none",
                      borderRadius: "4px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Average Wait Times</CardTitle>
            <CardDescription>Average wait time in days by appointment type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appointmentWaitTimeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    label={{ value: "Days", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                      border: "none",
                      borderRadius: "4px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                  />
                  <Bar dataKey="time" name="Wait Time (Days)" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function ClinicalOutcomeAnalytics() {
  const { theme } = useTheme()

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Clinical Outcomes</h2>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Clinical Data
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Outcomes by Condition</CardTitle>
            <CardDescription>Patient outcomes by primary condition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={outcomesByConditionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="condition" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                      border: "none",
                      borderRadius: "4px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="improved" name="Improved" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="stable" name="Stable" fill="#f59e0b" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="declined" name="Declined" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Readmission Rates</CardTitle>
            <CardDescription>Monthly readmission rates (%)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={readmissionRatesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 10]}
                    ticks={[0, 2, 4, 6, 8, 10]}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                      border: "none",
                      borderRadius: "4px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                    formatter={(value) => [`${value}%`, "Readmission Rate"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    name="Readmission Rate"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "var(--primary)" }}
                    activeDot={{ r: 6, fill: "var(--primary)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function StaffPerformanceAnalytics() {
  const { theme } = useTheme()

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Staff Performance</h2>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Staff Data
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Staff Productivity</CardTitle>
            <CardDescription>Key performance metrics by staff member</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={staffProductivityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="staff" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                      border: "none",
                      borderRadius: "4px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="appointments" name="Appointments" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="carePlans" name="Care Plans" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="reviews" name="Reviews" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patient Feedback</CardTitle>
            <CardDescription>Average patient satisfaction scores (out of 5)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patientFeedbackData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 5]}
                    ticks={[0, 1, 2, 3, 4, 5]}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                      border: "none",
                      borderRadius: "4px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                    formatter={(value) => [`${value}/5`, "Score"]}
                  />
                  <Bar dataKey="score" name="Satisfaction Score" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function FinancialAnalytics() {
  const { theme } = useTheme()

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Financial Analytics</h2>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Financial Data
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Service</CardTitle>
            <CardDescription>Revenue breakdown by service type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByServiceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="service" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `£${value / 1000}k`}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                      border: "none",
                      borderRadius: "4px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                    formatter={(value) => [`£${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Bar dataKey="revenue" name="Revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Trends</CardTitle>
            <CardDescription>Monthly revenue, expenses, and profit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financialTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `£${value / 1000}k`}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                      border: "none",
                      borderRadius: "4px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                    formatter={(value) => [`£${value.toLocaleString()}`, ""]}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#10b981"
                    fill="#10b98120"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    name="Expenses"
                    stroke="#ef4444"
                    fill="#ef444420"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    name="Profit"
                    stroke="#3b82f6"
                    fill="#3b82f620"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

