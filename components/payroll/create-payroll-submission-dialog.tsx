"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

interface CreatePayrollSubmissionDialogProps {
  tenantId: string
  onSubmit?: () => void
}

export function CreatePayrollSubmissionDialog({ tenantId, onSubmit }: CreatePayrollSubmissionDialogProps) {
  const [open, setOpen] = useState(false)
  const [providers, setProviders] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [selectedProvider, setSelectedProvider] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      fetchProviders()
      fetchUsers()
    }
  }, [open, tenantId])

  const fetchProviders = async () => {
    try {
      const response = await fetch(`/api/payroll-providers?tenantId=${tenantId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch payroll providers")
      }
      const data = await response.json()
      setProviders(data.providers)
    } catch (error) {
      console.error("Error fetching providers:", error)
      toast({
        title: "Error",
        description: "Failed to load payroll providers. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      // This would fetch care professionals/users who can have payroll
      const response = await fetch(`/api/users?tenantId=${tenantId}&role=care_professional`)
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }
      const data = await response.json()
      setUsers(data.users)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const resetForm = () => {
    setSelectedProvider("")
    setStartDate(undefined)
    setEndDate(undefined)
    setSelectedUsers([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProvider || !startDate || !endDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch("/api/payroll-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenantId,
          providerId: selectedProvider,
          payPeriodStart: format(startDate, "yyyy-MM-dd"),
          payPeriodEnd: format(endDate, "yyyy-MM-dd"),
          userIds: selectedUsers.length > 0 ? selectedUsers : undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create payroll submission")
      }

      toast({
        title: "Submission created",
        description: "The payroll submission has been successfully created.",
      })

      setOpen(false)
      resetForm()

      if (onSubmit) {
        onSubmit()
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create payroll submission. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Submission
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Payroll Submission</DialogTitle>
          <DialogDescription>Submit payroll data to your provider.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="provider">Payroll Provider</Label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger id="provider">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Staff Members (optional)</Label>
              <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                {users.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No staff members found</p>
                ) : (
                  <div className="space-y-2">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`user-${user.id}`}
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => toggleUser(user.id)}
                        />
                        <Label htmlFor={`user-${user.id}`} className="text-sm cursor-pointer">
                          {user.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Leave empty to include all staff with approved timesheets</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Payroll"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
