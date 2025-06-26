"use client"

import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface PieChartProps {
  data: Array<{
    name: string
    value: number
  }>
  category: string
  index: string
  colors?: string[]
  valueFormatter?: (value: number) => string
}

export function PieChart({
  data,
  category,
  index,
  colors = ["#0ea5e9", "#22c55e", "#eab308", "#ef4444", "#8b5cf6"],
  valueFormatter = (value: number) => `${value}`,
}: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey={category}
          nameKey={index}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={valueFormatter}
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            borderColor: "hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
        />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}
