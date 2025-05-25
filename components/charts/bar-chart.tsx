"use client"

import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface BarChartProps {
  data:
    | Array<{
        name: string
        value: number
      }>
    | Array<{
        label: string
        value: number
      }>
  colors?: string[]
}

export function BarChart({ data, colors = ["#3b82f6"] }: BarChartProps) {
  // Convert data if it uses label instead of name
  const formattedData = data.map((item) => {
    if ("label" in item) {
      return { name: item.label, value: item.value }
    }
    return item
  })

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsBarChart data={formattedData}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip />
        <Bar dataKey="value" fill={colors[0]} radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
