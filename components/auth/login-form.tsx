"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { useToast } from "@/components/ui/use-toast"
import { useErrorTracking } from "@/lib/error-tracking"

export function LoginForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [email, setEmail] = React.useState<string>("")
  const [password, setPassword] = React.useState<string>("")

  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard"
  const { toast } = useToast()
  const { trackError } = useErrorTracking()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Successfully signed in. Redirecting...",
        })
        router.push(callbackUrl)
        router.refresh()
      } else {
        throw new Error(data.message || "Invalid email or password")
      }
    } catch (error) {
      console.error("Login error:", error)
      const errorMessage = error instanceof Error ? error.message : "An error occurred during sign in"

      trackError(error as Error, {
        component: "LoginForm",
        action: "signin",
        severity: "medium",
        category: "authentication",
        metadata: {
          email: email,
          callbackUrl: callbackUrl,
          hasPassword: !!password,
        },
      })

      toast({
        title: "Authentication failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect="off"
          disabled={isLoading}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoCapitalize="none"
          autoComplete="current-password"
          autoCorrect="off"
          disabled={isLoading}
          required
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Sign In
      </Button>
    </form>
  )
}
