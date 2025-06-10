"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"
import type { Patient } from "@/types"
import { useCallback, useEffect, useState } from "react"

interface TaskFilterControlsProps {
  patients: Patient[]
}

export function TaskFilterControls({ patients }: TaskFilterControlsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentPatientId = searchParams.get("patientId") || ""
  const currentStatus = searchParams.get("status") || ""
  const currentSearch = searchParams.get("search") || ""

  const [patientFilter, setPatientFilter] = useState(currentPatientId)
  const [statusFilter, setStatusFilter] = useState(currentStatus)
  const [searchQuery, setSearchQuery] = useState(currentSearch)

  // Update local state when search params change (e.g., from direct URL navigation)
  useEffect(() => {
    setPatientFilter(currentPatientId)
    setStatusFilter(currentStatus)
    setSearchQuery(currentSearch)
  }, [currentPatientId, currentStatus, currentSearch])

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams],
  )

  const applyFilters = () => {
    let queryString = ""
    if (patientFilter) {
      queryString = createQueryString("patientId", patientFilter)
    }
    if (statusFilter) {
      queryString = createQueryString("status", statusFilter)
    }
    if (searchQuery) {
      queryString = createQueryString("search", searchQuery)
    }
    router.push(`/tasks?${queryString}`)
  }

  const resetFilters = () => {
    setPatientFilter("")
    setStatusFilter("")
    setSearchQuery("")
    router.push(`/tasks`)
  }

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-md border p-4">
      <div className="flex-1 min-w-[180px]">
        <Select value={patientFilter} onValueChange={setPatientFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Patient" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Patients</SelectItem>
            {patients.map((patient) => (
              <SelectItem key={patient.id} value={patient.id}>
                {patient.fullName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 min-w-[180px]">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 min-w-[180px]">
        <Input placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>
      <Button onClick={applyFilters}>Apply Filters</Button>
      {(patientFilter || statusFilter || searchQuery) && (
        <Button variant="outline" onClick={resetFilters}>
          <XCircle className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      )}
    </div>
  )
}
