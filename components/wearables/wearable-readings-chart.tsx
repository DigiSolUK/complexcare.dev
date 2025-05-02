"use client"

import { useState } from "react"
import type { WearableReading, WearableReadingType } from "@/types/wearables"
import { format, subDays, startOfDay, endOfDay } from "date-fns"

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
  const [readings, setReadings] = useState<WearableReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReadingType, setSelectedReadingType] = useState<WearableReadingType>('heart_rate');
  const [timeRange, setTimeRange] = useState('7');
  const [activeTab, setActiveTab] = useState('chart');

  const fetchReadings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const startDate = format(
        startOfDay(subDays(new Date(), Number.parseInt(timeRange))),
        'yyyy-MM-dd\'T\'HH:mm:ss'
      );
      
      const endDate = format(
        endOfDay(new Date()),
        'yyyy-MM-dd\'T\'HH:mm:ss'
      );
      
      const response = await fetch(
        `/api/wearables/readings/${patientId}?type=${selectedReadingType}&startDate=${startDate}&endDate=${endDate}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch wearable readings');
      }
      
      const data = await response.json();
      setReadings(data);
    } catch (err) {
      setError('Error loading wearable readings. Please try again');
    }
