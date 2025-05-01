"use client"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface User {
  id: string
  name: string
  email: string
}

interface AddUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddUser: (userId: string, role: string) => void
}

export function AddUserDialog({ open, onOpenChange, onAddUser }: AddUserDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState("")
  const [selectedRole, setSelectedRole] = useState("user")

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search term")
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/admin/users?search=${encodeURIComponent(searchQuery)}`)
      if (!response.ok) throw new Error("Failed to search users")

      const data = await response.json()
      setSearchResults(data.users || [])
    } catch (error) {
      console.error("Error searching users:", error)
      toast.error("Failed to search users")
    } finally {
      setIsSearching(false)
    }
  }

  const handleSubmit = () => {
    if (!selectedUserId) {
      toast.error("Please select a user")
      return
    }

    onAddUser(selectedUserId, selectedRole)
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setSearchQuery("")
    setSearchResults([])
    setSelectedUserId("")
    setSelectedRole("user")
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) resetForm()
        onOpenChange(newOpen)
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Existing User</DialogTitle>
          <DialogDescription>Search for an existing user to add to this tenant.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="search" className="text-right">
              Search
            </Label>
            <div className="col-span-3 flex gap-2">
              <Input
                id="search"
                placeholder="Name or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="button" variant="secondary" onClick={handleSearch} disabled={isSearching}>
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="user" className="text-right">
                User
              </Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {searchResults.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={!selectedUserId}>
            Add User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
