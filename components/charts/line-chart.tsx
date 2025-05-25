"use client"

import {
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

interface LineChartProps {
  data: any[]
  categories: string[]
  index: string
  className?: string
}

export function LineChart({ data, categories, index, className }: LineChartProps) {
  const colors = ["#2563eb", "#8b5cf6", "#10b981"]

  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey={index} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip />
        {categories.map((category, i) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={colors[i % colors.length]}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}
