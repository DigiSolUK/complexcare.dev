"use client"

import { useTheme } from "next-themes"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Jan",
    total: 580,
  },
  {
    name: "Feb",
    total: 690,
  },
  {
    name: "Mar",
    total: 1100,
  },
  {
    name: "Apr",
    total: 1200,
  },
  {
    name: "May",
    total: 1380,
  },
  {
    name: "Jun",
    total: 1500,
  },
  {
    name: "Jul",
    total: 1700,
  },
  {
    name: "Aug",
    total: 1890,
  },
  {
    name: "Sep",
    total: 2100,
  },
  {
    name: "Oct",
    total: 2400,
  },
  {
    name: "Nov",
    total: 2780,
  },
  {
    name: "Dec",
    total: 3000,
  },
]

export function PatientActivityChart() {
  const { theme } = useTheme()

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip
          cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
          contentStyle={{
            backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
            borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
            borderRadius: "0.375rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
          labelStyle={{
            color: theme === "dark" ? "#e5e7eb" : "#1f2937",
            fontWeight: 600,
            marginBottom: "0.25rem",
          }}
        />
        <Bar dataKey="total" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f46e5" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#8b5cf6" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  )
}
