"use client"

import { useEffect, useRef, useState } from "react"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card } from "@/components/ui/card"

interface LineChartProps {
  data: any[]
  xAxisKey: string
  yAxisKey: string
  height?: number
  color?: string
}

export function LineChart({ data, xAxisKey, yAxisKey, height = 300, color = "#3b82f6" }: LineChartProps) {
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
        <RechartsLineChart
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
          <Line type="monotone" dataKey={yAxisKey} stroke={color} activeDot={{ r: 8 }} />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}
