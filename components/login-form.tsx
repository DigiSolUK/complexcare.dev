"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function LoginForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard"
  const error = searchParams?.get("error")

  const handleAuth0Login = async () => {
    setIsLoading(true)
    try {
      await signIn("auth0", { callbackUrl })
    } catch (error) {
      console.error("Auth0 login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          <p>Authentication error. Please try again.</p>
        </div>
      )}
      <Button variant="outline" type="button" disabled={isLoading} onClick={handleAuth0Login} className="w-full">
        {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : <Icons.auth0 className="mr-2 h-4 w-4" />}
        Sign in with Auth0
      </Button>
    </div>
  )
}

