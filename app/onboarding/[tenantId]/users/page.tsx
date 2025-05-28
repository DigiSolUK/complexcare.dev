"use client"

import type React from "react"

import { useState } from "react"
import { useOnboarding } from "@/contexts/onboarding-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Plus, Trash2, Mail, Loader2, UserPlus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

interface UserInvite {
  email: string
  role: string
  id: string
}

export default function InviteUsersPage() {
  const { markStepAsCompleted } = useOnboarding()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("user")
  const [invites, setInvites] = useState<UserInvite[]>([])

  const addInvite = () => {
    if (!email) return

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    // Check for duplicates
    if (invites.some((invite) => invite.email === email)) {
      toast({
        title: "Duplicate email",
        description: "This email has already been added.",
        variant: "destructive",
      })
      return
    }

    setInvites([...invites, { email, role, id: Date.now().toString() }])
    setEmail("")
  }

  const removeInvite = (id: string) => {
    setInvites(invites.filter((invite) => invite.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (invites.length > 0) {
        toast({
          title: "Invitations sent",
          description: `${invites.length} team members have been invited.`,
        })
      }

      markStepAsCompleted("users")
    } catch (error) {
      toast({
        title: "Error sending invitations",
        description: "There was a problem sending the invitations.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Invite Team Members</h1>
        <p className="text-muted-foreground mt-2">Add your team to collaborate on the platform</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add Team Members</CardTitle>
            <CardDescription>Invite colleagues to join your organization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colleague@example.com"
                />
              </div>

              <div className="w-full md:w-1/3 space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="clinician">Clinician</SelectItem>
                    <SelectItem value="user">Standard User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button type="button" onClick={addInvite} className="w-full md:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>

            {invites.length > 0 ? (
              <div className="border rounded-md">
                <div className="bg-muted px-4 py-2 rounded-t-md border-b">
                  <h3 className="font-medium">Pending Invitations</h3>
                </div>
                <ul className="divide-y">
                  {invites.map((invite) => (
                    <li key={invite.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-muted-foreground mr-3" />
                        <div>
                          <p>{invite.email}</p>
                          <Badge variant="outline" className="mt-1">
                            {invite.role === "admin" && "Administrator"}
                            {invite.role === "manager" && "Manager"}
                            {invite.role === "clinician" && "Clinician"}
                            {invite.role === "user" && "Standard User"}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInvite(invite.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="border border-dashed rounded-md p-8 flex flex-col items-center justify-center text-center">
                <UserPlus className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="font-medium text-lg">No team members added yet</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  Add team members by entering their email address and selecting a role above.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => markStepAsCompleted("users")}>
              Skip for now
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Invitations...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
