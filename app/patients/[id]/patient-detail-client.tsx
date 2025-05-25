"use client"

import { useState } from "react"
import { MoreVertical, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import type { Patient } from "@/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PatientActivityHistory } from "@/components/patients/patient-activity-history"

interface PatientDetailClientProps {
  patient: Patient
}

export function PatientDetailClient({ patient }: PatientDetailClientProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="md:flex md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">{patient.name}</h1>
          <p className="text-sm text-muted-foreground">
            {patient.email} | {patient.phone}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="sm:max-w-lg">
              <SheetHeader>
                <SheetTitle>Edit Patient</SheetTitle>
                <SheetDescription>
                  Make changes to your patient profile here. Click save when you're done.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" defaultValue={patient.name} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input id="email" defaultValue={patient.email} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input id="phone" defaultValue={patient.phone} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Address
                  </Label>
                  <Textarea id="address" defaultValue={patient.address} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Switch id="status" defaultChecked={patient.status} />
                </div>
              </div>
              {/* @ts-ignore */}
              <Button onClick={() => setOpen(false)} variant="primary">
                Save changes
              </Button>
            </SheetContent>
          </Sheet>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <MoreVertical className="mr-2 h-4 w-4" /> Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>View</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="clinical-notes">Clinical Notes</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="care-plans">Care Plans</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Age</p>
                <p className="text-sm text-muted-foreground">{patient.age}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Gender</p>
                <p className="text-sm text-muted-foreground">{patient.gender}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Medical History</p>
                <p className="text-sm text-muted-foreground">{patient.medicalHistory}</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="clinical-notes" className="space-y-4">
            Clinical Notes
          </TabsContent>
          <TabsContent value="medications" className="space-y-4">
            Medications
          </TabsContent>
          <TabsContent value="appointments" className="space-y-4">
            Appointments
          </TabsContent>
          <TabsContent value="care-plans" className="space-y-4">
            Care Plans
          </TabsContent>
          <TabsContent value="documents" className="space-y-4">
            Documents
          </TabsContent>
          <TabsContent value="activity" className="space-y-4">
            <PatientActivityHistory patientId={patient.id} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

PatientDetailClient.Skeleton = function PatientDetailClientSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  )
}
