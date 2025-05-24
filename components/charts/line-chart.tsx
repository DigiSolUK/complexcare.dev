"use client"

import { Line, LineChart as RechartsLineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { useTheme } from "next-themes"

interface LineChartProps {
  data: {
    name: string
    value: number
  }[]
  colors?: string[]
}

export function LineChart({ data, colors = ["#3b82f6"] }: LineChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data}>
        <XAxis dataKey="name" stroke={isDark ? "#888888" : "#888888"} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke={isDark ? "#888888" : "#888888"}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          cursor={{ fill: "transparent" }}
          contentStyle={{
            backgroundColor: isDark ? "#1f2937" : "#ffffff",
            border: "none",
            borderRadius: "4px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
          formatter={(value: number) => [`${value}`, "Count"]}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={colors[0]}
          strokeWidth={2}
          dot={{ r: 4, strokeWidth: 2 }}
          activeDot={{ r: 6, strokeWidth: 2 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}
