"use client"

import {
  Line,
  LineChart as RechartsLineChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface LineChartProps {
  data: Array<{
    name: string
    value: number
  }>
  xAxisKey: string
  yAxisKey: string
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
}

export function LineChart({
  data,
  xAxisKey,
  yAxisKey,
  categories,
  colors = ["#0ea5e9"],
  valueFormatter = (value: number) => `${value}`,
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={valueFormatter} />
        <Tooltip
          formatter={valueFormatter}
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            borderColor: "hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
        />
        <Legend />
        {categories.map((category, index) => (
          <Line
            key={category}
            type="monotone"
            dataKey={yAxisKey}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}
