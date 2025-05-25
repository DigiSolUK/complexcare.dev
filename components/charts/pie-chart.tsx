"use client"

import { useEffect, useRef, useState } from "react"
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"

interface PieChartProps {
  data: any[]
  nameKey: string
  valueKey: string
  height?: number
  colors?: string[]
}

export function PieChart({
  data,
  nameKey,
  valueKey,
  height = 300,
  colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"],
}: PieChartProps) {
  const [chartWidth, setChartWidth] = useState(0)
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chartRef.current) {
      setChartWidth(chartRef.current.getBoundingClientRect().width)
    }

    const handleResize = () => {
      if (chartRef.current) {
        setChartWidth(chartRef.current.getBoundingClientRect().width)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!data || data.length === 0) {
    return (
      <Card className="flex items-center justify-center h-[300px] bg-muted/10">
        <p className="text-muted-foreground">No data available</p>
      </Card>
    )
  }

  return (
    <div ref={chartRef} style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={80}
            fill="#8884d8"
            dataKey={valueKey}
            nameKey={nameKey}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}
