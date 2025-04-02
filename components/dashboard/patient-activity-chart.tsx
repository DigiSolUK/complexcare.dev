"use client"

import type React from "react"

import { useTheme } from "next-themes"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { name: "Jan", visits: 130 },
  { name: "Feb", visits: 160 },
  { name: "Mar", visits: 180 },
  { name: "Apr", visits: 165 },
  { name: "May", visits: 190 },
  { name: "Jun", visits: 220 },
  { name: "Jul", visits: 205 },
  { name: "Aug", visits: 230 },
  { name: "Sep", visits: 215 },
  { name: "Oct", visits: 240 },
  { name: "Nov", visits: 225 },
  { name: "Dec", visits: 235 },
]

interface PatientActivityChartProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PatientActivityChart({ className, ...props }: PatientActivityChartProps) {
  const { theme } = useTheme()

  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>Patient Activity</CardTitle>
        <CardDescription>Daily patient visits over the past year</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
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
              <Bar dataKey="visits" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

