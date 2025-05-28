"use client"

import { useEffect, useRef, useState } from "react"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card } from "@/components/ui/card"

interface BarChartProps {
  data: any[]
  xAxisKey: string
  yAxisKeys: string[]
  height?: number
  colors?: string[]
}

export function BarChart({
  data,
  xAxisKey,
  yAxisKeys,
  height = 300,
  colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
}: BarChartProps) {
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
        <RechartsBarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {yAxisKeys.map((key, index) => (
            <Bar key={key} dataKey={key} fill={colors[index % colors.length]} />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
