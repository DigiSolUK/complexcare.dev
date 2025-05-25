"use client"

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface LineChartProps {
  data: any[]
  categories?: string[]
  index?: string
  colors?: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
}

export function LineChart({
  data,
  categories,
  index = "name",
  colors = ["#3b82f6"],
  valueFormatter = (value: number) => `${value}`,
  yAxisWidth = 40,
}: LineChartProps) {
  // Handle data in format {x: number, y: number}
  const formattedData = data.map((item) => {
    if ("x" in item && "y" in item) {
      return { name: item.x.toString(), value: item.y }
    }
    return item
  })

  if (!formattedData?.length) {
    return (
      <div className="flex h-[350px] w-full items-center justify-center text-muted-foreground">No data available</div>
    )
  }

  const categoryKeys =
    categories ||
    (formattedData[0].value !== undefined ? ["value"] : Object.keys(formattedData[0]).filter((key) => key !== index))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsLineChart data={formattedData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey={index} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          width={yAxisWidth}
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={valueFormatter}
        />
        <Tooltip
          formatter={(value: number) => [valueFormatter(value), ""]}
          contentStyle={{ backgroundColor: "white", borderRadius: "6px", border: "1px solid #e2e8f0" }}
        />
        {categoryKeys.length > 1 && <Legend />}
        {categoryKeys.map((key, i) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[i % colors.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}
