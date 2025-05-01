"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LiveLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [tenantId, setTenantId] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Basic validation
    if (!email || !password || !tenantId) {
      setError("Please fill in all fields.")
      setIsLoading(false)
      return
    }

    // Simulate authentication (replace with your actual authentication logic)
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

    if (email === "test@example.com" && password === "password" && tenantId === "test-tenant") {
      // Successful login - redirect to dashboard
      router.push("/dashboard")
    } else {
      setError("Invalid credentials. Please try again.")
    }

    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Live Tenant Login</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="tenantId">Tenant ID</Label>
              <Input
                type="text"
                id="tenantId"
                placeholder="Enter Tenant ID"
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
