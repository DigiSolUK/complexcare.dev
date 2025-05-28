"use client"

import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts"

interface BarChartProps {
  data: any[]
  categories: string[]
  index: string
  colors?: string[]
  valueFormatter?: (value: number) => string
  className?: string
}

export function BarChart({
  data,
  categories,
  index,
  colors = ["#0ea5e9", "#6366f1", "#10b981", "#f43f5e", "#8b5cf6"],
  valueFormatter = (value: number) => `${value}`,
  className,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsBarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey={index} stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" tickFormatter={valueFormatter} />
        <Tooltip
          formatter={(value: number) => [valueFormatter(value), ""]}
          labelFormatter={(label) => `${label}`}
          contentStyle={{ backgroundColor: "#ffffff", borderRadius: "6px", border: "1px solid #e2e8f0" }}
        />
        <Legend />
        {categories.map((category, i) => (
          <Bar key={category} dataKey={category} fill={colors[i % colors.length]} radius={[4, 4, 0, 0]} />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
