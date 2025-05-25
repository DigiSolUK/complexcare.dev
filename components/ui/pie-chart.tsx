"use client"

import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface PieChartProps {
  data: Array<{
    name: string
    value: number
  }>
  colors?: string[]
}

export function PieChart({ data, colors = ["#3b82f6", "#22c55e", "#ef4444", "#f59e0b"] }: PieChartProps) {
  if (!data?.length) {
    return (
      <div className="flex h-[350px] w-full items-center justify-center text-muted-foreground">No data available</div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}`, "Value"]} />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}
