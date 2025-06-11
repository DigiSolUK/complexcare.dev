"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { createTenantInvitationAction } from "@/lib/actions/tenant-actions"
import type { UserRole } from "@/lib/auth/permissions"
import { Loader2 } from "lucide-react"

interface InviteUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenantId: string
  onInvitationSent: () => void
}

export function InviteUserDialog({ open, onOpenChange, tenantId, onInvitationSent }: InviteUserDialogProps) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<UserRole>("member") // Default role
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await createTenantInvitationAction(tenantId, email, role)
      if (result.success) {
        toast({
          title: "Invitation Sent",
          description: `An invitation has been sent to ${email}. (URL logged to console)`,
          duration: 5000,
        })
        onInvitationSent()
        onOpenChange(false)
        setEmail("")
        setRole("member")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send invitation.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending invitation:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite User to Tenant</DialogTitle>
          <DialogDescription>Enter the email and role for the new user.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select onValueChange={(value: UserRole) => setRole(value)} value={role} disabled={isLoading}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="care_professional">Care Professional</SelectItem>
                  {/* Add other roles if applicable */}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
