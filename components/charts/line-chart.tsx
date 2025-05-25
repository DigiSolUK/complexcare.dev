"use client"

import {
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts"

interface LineChartProps {
  data: any[]
  categories?: string[]
  index?: string
  colors?: string[]
  valueFormatter?: (value: any) => string
  yAxisWidth?: number
  className?: string
}

export function LineChart({
  data,
  categories = [],
  index = "name",
  colors = ["#2563eb", "#8b5cf6", "#10b981"],
  valueFormatter,
  yAxisWidth = 40,
  className,
}: LineChartProps) {
  // If no categories provided, try to infer from data
  const dataKeys =
    categories.length > 0 ? categories : data.length > 0 ? Object.keys(data[0]).filter((key) => key !== index) : []

  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey={index} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={yAxisWidth} />
        <Tooltip
          formatter={valueFormatter}
          contentStyle={{
            backgroundColor: "var(--background)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
          }}
        />
        {dataKeys.length > 1 && <Legend />}
        {dataKeys.map((key, i) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[i % colors.length]}
            strokeWidth={2}
            dot={false}
            name={key}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}
