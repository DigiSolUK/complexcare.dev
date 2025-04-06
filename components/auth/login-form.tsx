"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { useTransition } from "react"
import { logout } from "@/lib/actions/auth-actions"

export function LoginForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard"
  const error = searchParams?.get("error")
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  return (
    <div className="grid gap-6">
      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          <p>Authentication error. Please try again.</p>
        </div>
      )}
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={() => {
          setIsLoading(true)
          window.location.href = `/api/auth/signin/auth0?callbackUrl=${callbackUrl}`
        }}
        className="w-full"
      >
        {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : <Icons.auth0 className="mr-2 h-4 w-4" />}
        Sign in with Auth0
      </Button>
      <Button
        variant="destructive"
        type="button"
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            await logout()
            router.refresh()
          })
        }}
        className="w-full"
      >
        Logout
      </Button>
    </div>
  )
}

