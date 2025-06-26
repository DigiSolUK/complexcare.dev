"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Filter, PlusCircle, Search, MoreHorizontal, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import type { Patient } from "@/types" // Import Patient type from types/index.ts
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/confirm-dialog"

export default function PatientsPage() {
  const { toast } = useToast()
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddPatientDialogOpen, setIsAddPatientDialogOpen] = useState(false)
  const [newPatientData, setNewPatientData] = useState<Partial<Patient>>({
    // tenant_id is now handled by the API route from the session
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    contact_number: "",
    email: "",
    address: {},
    medical_record_number: "",
    primary_care_provider: "",
    avatar_url: "",
    status: "active", // Default status
  })

  // New state for filters
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterGender, setFilterGender] = useState<string>("all")

  // State for deactivation confirmation
  const [isDeactivateConfirmOpen, setIsDeactivateConfirmOpen] = useState(false)
  const [patientToDeactivate, setPatientToDeactivate] = useState<Patient | null>(null)

  const fetchPatients = async () => {
    try {
      setLoading(true)
      // Remove tenantId from query parameter, API route gets it from session
      const response = await fetch(`/api/patients`)

      if (!response.ok) {
        throw new Error(`Failed to fetch patients: ${response.status}`)
      }

      const data = await response.json()
      setPatients(data)
    } catch (err) {
      console.error("Error fetching patients:", err)
      setError("Failed to load patients. Please try again later.")
      toast({
        title: "Error",
        description: `Failed to load patients: ${err instanceof Error ? err.message : String(err)}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, []) // No dependency on newPatientData.tenant_id anymore

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewPatientData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewPatientData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    setNewPatientData((prev) => ({ ...prev, date_of_birth: date ? format(date, "yyyy-MM-dd") : "" }))
  }

  const handleAddPatient = async () => {
    try {
      // Remove tenant_id from the body, as the API route will add it from the session
      const { tenant_id, ...dataToSend } = newPatientData

      const response = await fetch("/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to add patient: ${response.status}`)
      }

      toast({
        title: "Success",
        description: "Patient added successfully.",
      })
      await fetchPatients() // Refresh the list
      setIsAddPatientDialogOpen(false)
      setNewPatientData({
        // Reset state, no tenant_id needed here
        first_name: "",
        last_name: "",
        date_of_birth: "",
        gender: "",
        contact_number: "",
        email: "",
        address: {},
        medical_record_number: "",
        primary_care_provider: "",
        avatar_url: "",
        status: "active",
      })
    } catch (err: any) {
      console.error("Error adding patient:", err)
      setError(err.message || "Failed to add patient.")
      toast({
        title: "Error",
        description: `Failed to add patient: ${err.message}`,
        variant: "destructive",
      })
    }
  }

  const handleDeactivateClick = (patient: Patient) => {
    setPatientToDeactivate(patient)
    setIsDeactivateConfirmOpen(true)
  }

  const handleConfirmDeactivate = async () => {
    if (!patientToDeactivate) return

    try {
      const response = await fetch(`/api/patients/${patientToDeactivate.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to deactivate patient: ${response.status}`)
      }

      toast({
        title: "Success",
        description: `${patientToDeactivate.first_name} ${patientToDeactivate.last_name} has been deactivated.`,
      })
      await fetchPatients() // Refresh the list
    } catch (err: any) {
      console.error("Error deactivating patient:", err)
      toast({
        title: "Error",
        description: `Failed to deactivate patient: ${err.message}`,
        variant: "destructive",
      })
    } finally {
      setIsDeactivateConfirmOpen(false)
      setPatientToDeactivate(null)
    }
  }

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase()
    const searchLower = searchTerm.toLowerCase()

    const matchesSearch =
      fullName.includes(searchLower) ||
      patient.medical_record_number?.includes(searchLower) ||
      patient.primary_care_provider?.toLowerCase().includes(searchLower)

    const matchesStatus = filterStatus === "all" || patient.status?.toLowerCase() === filterStatus.toLowerCase()
    const matchesGender = filterGender === "all" || patient.gender?.toLowerCase() === filterGender.toLowerCase()

    return matchesSearch && matchesStatus && matchesGender
  })

  if (loading) {
    return <PatientsPageSkeleton />
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Patients</h1>
        <p className="text-muted-foreground">Manage your patients and their care plans</p>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Patient Directory</CardTitle>
            <CardDescription>View and manage all your patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search patients..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-4">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="filter-status">Status</Label>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                          <SelectTrigger id="filter-status">
                            <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                            <SelectItem value="stable">Stable</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="filter-gender">Gender</Label>
                        <Select value={filterGender} onValueChange={setFilterGender}>
                          <SelectTrigger id="filter-gender">
                            <SelectValue placeholder="Filter by gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setFilterStatus("all")
                          setFilterGender("all")
                        }}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button size="sm" onClick={() => setIsAddPatientDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Patient
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>DOB</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Primary Care Provider</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src={patient.avatar_url || "/placeholder.svg"}
                                alt={`${patient.first_name} ${patient.last_name}`}
                              />
                              <AvatarFallback>{`${patient.first_name.charAt(0)}${patient.last_name.charAt(0)}`}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {patient.first_name} {patient.last_name}
                              </div>
                              <div className="text-sm text-muted-foreground">NHS: {patient.medical_record_number}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{format(new Date(patient.date_of_birth), "dd/MM/yyyy")}</TableCell>
                        <TableCell>{patient.gender}</TableCell>
                        <TableCell>
                          <Badge variant={patient.status === "active" ? "default" : "secondary"}>
                            {patient.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell max-w-xs truncate">
                          {patient.primary_care_provider}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/patients/${patient.id}`}>View Details</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>Edit Patient</DropdownMenuItem> {/* This would open the edit dialog */}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeactivateClick(patient)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Deactivate Patient
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No patients found matching your search or filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Patient Dialog */}
      <Dialog open={isAddPatientDialogOpen} onOpenChange={setIsAddPatientDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
            <DialogDescription>Enter the details for the new patient.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="first_name" className="text-right">
                First Name
              </Label>
              <Input
                id="first_name"
                name="first_name"
                value={newPatientData.first_name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last_name" className="text-right">
                Last Name
              </Label>
              <Input
                id="last_name"
                name="last_name"
                value={newPatientData.last_name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date_of_birth" className="text-right">
                Date of Birth
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !newPatientData.date_of_birth && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newPatientData.date_of_birth ? (
                      format(new Date(newPatientData.date_of_birth), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newPatientData.date_of_birth ? new Date(newPatientData.date_of_birth) : undefined}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gender" className="text-right">
                Gender
              </Label>
              <Select onValueChange={(value) => handleSelectChange("gender", value)} value={newPatientData.gender}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact_number" className="text-right">
                Phone
              </Label>
              <Input
                id="contact_number"
                name="contact_number"
                value={newPatientData.contact_number}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={newPatientData.email}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="medical_record_number" className="text-right">
                NHS Number
              </Label>
              <Input
                id="medical_record_number"
                name="medical_record_number"
                value={newPatientData.medical_record_number}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="primary_care_provider" className="text-right">
                Primary Care Provider
              </Label>
              <Input
                id="primary_care_provider"
                name="primary_care_provider"
                value={newPatientData.primary_care_provider}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="avatar_url" className="text-right">
                Avatar URL
              </Label>
              <Input
                id="avatar_url"
                name="avatar_url"
                value={newPatientData.avatar_url || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            {/* Address fields can be added here, potentially as a nested object in newPatientData.address */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPatientDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPatient}>Add Patient</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate Patient Confirmation Dialog */}
      <ConfirmDialog
        open={isDeactivateConfirmOpen}
        onOpenChange={setIsDeactivateConfirmOpen}
        onConfirm={handleConfirmDeactivate}
        title="Deactivate Patient"
        description={`Are you sure you want to deactivate ${patientToDeactivate?.first_name} ${patientToDeactivate?.last_name}? This will set their status to 'inactive'.`}
        confirmText="Deactivate"
        cancelText="Cancel"
      />
    </div>
  )
}

function PatientsPageSkeleton() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <Skeleton className="h-10 w-full md:w-96" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>

          <div className="rounded-md border">
            <div className="p-4">
              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-48 hidden md:block" />
                <Skeleton className="h-6 w-24" />
              </div>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center gap-4 py-4 border-t">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-5 w-48 hidden md:block" />
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-16" />
                      <Skeleton className="h-9 w-24" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
