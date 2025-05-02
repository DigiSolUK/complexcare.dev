"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  Battery,
  BatteryCharging,
  BatteryLow,
  Clock,
  Plus,
  RefreshCw,
  Trash2,
  WifiOff,
} from "lucide-react"
import type { WearableDevice } from "@/types/wearables"
import { formatDistanceToNow } from "date-fns"
import { AddWearableDeviceDialog } from "./add-wearable-device-dialog"
import { useToast } from "@/components/ui/use-toast"

interface WearableDeviceListProps {
  patientId?: string
}

export function WearableDeviceList({ patientId }: WearableDeviceListProps) {
  const [devices, setDevices] = useState<WearableDevice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false)
  const { toast } = useToast()

  const fetchDevices = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const url = patientId ? `/api/wearables/devices/${patientId}` : "/api/wearables/devices"

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Failed to fetch wearable devices")
      }

      const data = await response.json()
      setDevices(data)
    } catch (err) {
      setError("Error loading wearable devices. Please try again.")
      console.error("Error fetching wearable devices:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDevices()
  }, [patientId])

  const handleDeleteDevice = async (deviceId: string) => {
    try {
      const response = await fetch(`/api/wearables/devices/${deviceId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete device")
      }

      toast({
        title: "Device removed",
        description: "The wearable device has been successfully removed.",
      })

      // Refresh the device list
      fetchDevices()
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to remove the device. Please try again.",
        variant: "destructive",
      })
      console.error("Error deleting device:", err)
    }
  }

  const handleSyncDevice = async (deviceId: string) => {
    try {
      const response = await fetch(`/api/wearables/devices/${deviceId}/sync`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to sync device")
      }

      toast({
        title: "Sync initiated",
        description: "The device sync has been initiated. Data will be updated shortly.",
      })

      // Refresh the device list after a short delay to allow sync to complete
      setTimeout(fetchDevices, 2000)
    } catch (err) {
      toast({
        title: "Sync failed",
        description: "Failed to sync the device. Please try again.",
        variant: "destructive",
      })
      console.error("Error syncing device:", err)
    }
  }

  const getBatteryIcon = (batteryLevel?: number) => {
    if (batteryLevel === undefined) return <Battery className="h-4 w-4 text-gray-400" />
    if (batteryLevel <= 20) return <BatteryLow className="h-4 w-4 text-red-500" />
    if (batteryLevel >= 90) return <BatteryCharging className="h-4 w-4 text-green-500" />
    return <Battery className="h-4 w-4 text-amber-500" />
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "inactive":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            Inactive
          </Badge>
        )
      case "disconnected":
        return (
          <Badge variant="outline" className="text-red-500 border-red-500">
            Disconnected
          </Badge>
        )
      case "low_battery":
        return (
          <Badge variant="outline" className="text-red-500 border-red-500">
            Low Battery
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Wearable Devices</span>
          <Button size="sm" onClick={() => setIsAddDeviceOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Device
          </Button>
        </CardTitle>
        <CardDescription>Manage connected wearable devices and view their status</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
            <p className="text-red-500">{error}</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => fetchDevices()}>
              <RefreshCw className="h-4 w-4 mr-2" /> Try Again
            </Button>
          </div>
        ) : devices.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <WifiOff className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-500">No wearable devices connected</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => setIsAddDeviceOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Connect Device
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Sync</TableHead>
                <TableHead>Battery</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell className="font-medium">
                    {device.manufacturer} {device.model}
                    <div className="text-xs text-gray-500">{device.serialNumber}</div>
                  </TableCell>
                  <TableCell>{device.deviceType.replace("_", " ")}</TableCell>
                  <TableCell>{getStatusBadge(device.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      <span className="text-sm">
                        {device.lastSyncDate
                          ? formatDistanceToNow(new Date(device.lastSyncDate), { addSuffix: true })
                          : "Never"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getBatteryIcon(device.batteryLevel)}
                      <span className="ml-1 text-sm">
                        {device.batteryLevel !== undefined ? `${device.batteryLevel}%` : "Unknown"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleSyncDevice(device.id)}>
                        <RefreshCw className="h-4 w-4" />
                        <span className="sr-only">Sync</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteDevice(device.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        Data from wearable devices is synchronized automatically based on device settings.
      </CardFooter>

      <AddWearableDeviceDialog
        open={isAddDeviceOpen}
        onOpenChange={setIsAddDeviceOpen}
        patientId={patientId}
        onDeviceAdded={fetchDevices}
      />
    </Card>
  )
}
