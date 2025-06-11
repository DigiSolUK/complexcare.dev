"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { acceptTenantInvitationAction } from "@/lib/actions/tenant-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function AcceptInvitationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const token = searchParams.get("token")

    if (!token) {
      setStatus("error")
      setMessage("No invitation token found in the URL.")
      return
    }

    const handleAcceptInvitation = async () => {
      try {
        const result = await acceptTenantInvitationAction(token)
        if (result.success) {
          setStatus("success")
          setMessage(result.message || "Invitation accepted successfully! You are now a member of the tenant.")
          toast({
            title: "Invitation Accepted",
            description: "You have successfully joined the tenant.",
          })
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push("/dashboard")
          }, 3000)
        } else {
          setStatus("error")
          setMessage(result.error || "Failed to accept invitation.")
          toast({
            title: "Error",
            description: result.error || "Failed to accept invitation.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error accepting invitation:", error)
        setStatus("error")
        setMessage("An unexpected error occurred while accepting the invitation.")
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        })
      }
    }

    handleAcceptInvitation()
  }, [searchParams, router, toast])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-md p-6">
        <CardHeader className="text-center">
          {status === "loading" && <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-500" />}
          {status === "success" && <CheckCircle className="mx-auto h-12 w-12 text-green-500" />}
          {status === "error" && <XCircle className="mx-auto h-12 w-12 text-red-500" />}
          <CardTitle className="mt-4 text-2xl">
            {status === "loading" && "Accepting Invitation..."}
            {status === "success" && "Invitation Accepted!"}
            {status === "error" && "Invitation Failed"}
          </CardTitle>
          <CardDescription className="mt-2">{message}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {status === "success" && (
            <p className="text-sm text-muted-foreground">Redirecting you to the dashboard shortly...</p>
          )}
          {status === "error" && (
            <Button asChild className="mt-4">
              <Link href="/login">Go to Login</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
