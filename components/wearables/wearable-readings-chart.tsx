"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { format, subDays, startOfDay, endOfDay } from "date-fns"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { WearableReading, WearableReadingType } from "@/types/wearables"

interface WearableReadingsChartProps {
  patientId: string
}

const readingTypeOptions: { value: WearableReadingType; label: string }[] = [
  { value: "heart_rate", label: "Heart Rate" },
  { value: "blood_pressure", label: "Blood Pressure" },
  { value: "blood_glucose", label: "Blood Glucose" },
  { value: "steps", label: "Steps" },
  { value: "sleep", label: "Sleep" },
  { value: "temperature", label: "Temperature" },
  { value: "oxygen_saturation", label: "Oxygen Saturation" },
]

const timeRanges = [
  { value: "1", label: "24 Hours" },
  { value: "7", label: "7 Days" },
  { value: "30", label: "30 Days" },
  { value: "90", label: "90 Days" },
]

export function WearableReadingsChart({ patientId }: WearableReadingsChartProps) {
  const [readings, setReadings] = useState<WearableReading[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedReadingType, setSelectedReadingType] = useState<WearableReadingType>("heart_rate")
  const [timeRange, setTimeRange] = useState("7")
  const [activeTab, setActiveTab] = useState("chart")

  const fetchReadings = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const startDate = format(startOfDay(subDays(new Date(), Number.parseInt(timeRange))), "yyyy-MM-dd'T'HH:mm:ss")

      const endDate = format(endOfDay(new Date()), "yyyy-MM-dd'T'HH:mm:ss")

      const response = await fetch(
        `/api/wearables/readings/${patientId}?type=${selectedReadingType}&startDate=${startDate}&endDate=${endDate}`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch wearable readings")
      }

      const data = await response.json()
      setReadings(data)
    } catch (err) {
      setError("Error loading wearable readings. Please try again")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReadings()
  }, [patientId, selectedReadingType, timeRange])

  const formatReadingValue = (reading: WearableReading) => {
    switch (reading.type) {
      case "heart_rate":
        return `${reading.value} bpm`
      case "blood_pressure":
        return reading.value
      case "blood_glucose":
        return `${reading.value} mg/dL`
      case "steps":
        return reading.value
      case "sleep":
        return `${reading.value} hours`
      case "temperature":
        return `${reading.value}°C`
      case "oxygen_saturation":
        return `${reading.value}%`
      default:
        return reading.value
    }
  }

  const getChartData = () => {
    return readings.map((reading) => ({
      timestamp: format(new Date(reading.timestamp), "MM/dd HH:mm"),
      value: typeof reading.value === "string" ? Number.parseFloat(reading.value) : reading.value,
      formattedValue: formatReadingValue(reading),
    }))
  }

  const getYAxisLabel = () => {
    switch (selectedReadingType) {
      case "heart_rate":
        return "BPM"
      case "blood_pressure":
        return "mmHg"
      case "blood_glucose":
        return "mg/dL"
      case "steps":
        return "Steps"
      case "sleep":
        return "Hours"
      case "temperature":
        return "°C"
      case "oxygen_saturation":
        return "%"
      default:
        return "Value"
    }
  }

  const renderChart = () => {
    const chartData = getChartData()

    if (chartData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-muted-foreground">No data available for the selected time period</p>
        </div>
      )
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis label={{ value: getYAxisLabel(), angle: -90, position: "insideLeft" }} />
          <Tooltip
            formatter={(value, name) => [value, selectedReadingType.replace("_", " ")]}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            name={readingTypeOptions.find((opt) => opt.value === selectedReadingType)?.label || selectedReadingType}
            stroke="#0ea5e9"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  const renderTable = () => {
    if (readings.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-muted-foreground">No data available for the selected time period</p>
        </div>
      )
    }

    return (
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Reading</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Device</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {readings.map((reading, index) => (
              <TableRow key={index}>
                <TableCell>{format(new Date(reading.timestamp), "dd/MM/yyyy HH:mm")}</TableCell>
                <TableCell>{readingTypeOptions.find((opt) => opt.value === reading.type)?.label}</TableCell>
                <TableCell>{formatReadingValue(reading)}</TableCell>
                <TableCell>{reading.device_name || "Unknown device"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Wearable Device Readings</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="w-full sm:w-1/2">
            <Select
              value={selectedReadingType}
              onValueChange={(value) => setSelectedReadingType(value as WearableReadingType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select reading type" />
              </SelectTrigger>
              <SelectContent>
                {readingTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-1/2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-auto">
            <Button onClick={fetchReadings} variant="outline" disabled={isLoading}>
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              <TabsContent value="chart" className="mt-0">
                {renderChart()}
              </TabsContent>
              <TabsContent value="table" className="mt-0">
                {renderTable()}
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}
