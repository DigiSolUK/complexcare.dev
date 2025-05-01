"use client"

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface BarChartProps {
  data: Array<{
    name: string
    value: number
  }>
  xAxisKey: string
  yAxisKey: string
  categories: string[]
  index?: string
  colors?: string[]
  valueFormatter?: (value: number) => string
  layout?: "horizontal" | "vertical"
}

export function BarChart({
  data,
  xAxisKey,
  yAxisKey,
  categories,
  colors = ["#0ea5e9"],
  valueFormatter = (value: number) => `${value}`,
  layout = "horizontal",
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        layout={layout}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 60,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        {layout === "horizontal" ? (
          <>
            <XAxis
              dataKey={xAxisKey}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={valueFormatter} />
          </>
        ) : (
          <>
            <XAxis
              type="number"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={valueFormatter}
            />
            <YAxis
              dataKey={xAxisKey}
              type="category"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={150}
            />
          </>
        )}
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
          <Bar
            key={category}
            dataKey={yAxisKey}
            fill={colors[index % colors.length]}
            radius={[4, 4, 0, 0]}
            maxBarSize={60}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
