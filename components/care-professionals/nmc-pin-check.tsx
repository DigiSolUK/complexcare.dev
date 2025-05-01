"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface NMCPinCheckProps {
  careProfessionalId: string
  initialPin?: string
  initialStatus?: "verified" | "unverified" | "expired" | "pending"
  onVerify?: (status: "verified" | "unverified" | "expired" | "pending") => void
}

export function NMCPinCheck({
  careProfessionalId,
  initialPin = "",
  initialStatus = "unverified",
  onVerify,
}: NMCPinCheckProps) {
  const [pin, setPin] = useState(initialPin)
  const [status, setStatus] = useState<"verified" | "unverified" | "expired" | "pending">(initialStatus)
  const [isChecking, setIsChecking] = useState(false)
  const { toast } = useToast()

  const handleVerify = async () => {
    if (!pin.trim()) {
      toast({
        title: "Error",
        description: "Please enter an NMC PIN",
        variant: "destructive",
      })
      return
    }

    setIsChecking(true)
    setStatus("pending")

    try {
      // Simulate API call to NMC
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, we'll use some simple validation
      // In production, this would call an actual NMC API
      const newStatus = validatePin(pin)
      setStatus(newStatus)

      if (onVerify) {
        onVerify(newStatus)
      }

      toast({
        title: newStatus === "verified" ? "PIN Verified" : "Verification Failed",
        description: getStatusMessage(newStatus),
        variant: newStatus === "verified" ? "default" : "destructive",
      })
    } catch (error) {
      console.error("Error verifying NMC PIN:", error)
      setStatus("unverified")
      toast({
        title: "Verification Error",
        description: "An error occurred while verifying the NMC PIN. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsChecking(false)
    }
  }

  // Simple validation for demo purposes
  const validatePin = (pin: string): "verified" | "unverified" | "expired" => {
    // Check if PIN is in the correct format (e.g., 2 letters followed by 6 digits)
    const pinRegex = /^[A-Za-z]{2}\d{6}$/
    if (!pinRegex.test(pin)) {
      return "unverified"
    }

    // For demo purposes, certain PINs are considered "expired"
    if (pin.endsWith("000000")) {
      return "expired"
    }

    return "verified"
  }

  const getStatusMessage = (status: "verified" | "unverified" | "expired" | "pending") => {
    switch (status) {
      case "verified":
        return "The NMC PIN has been successfully verified."
      case "unverified":
        return "The NMC PIN could not be verified. Please check and try again."
      case "expired":
        return "The NMC PIN has expired or is no longer valid."
      case "pending":
        return "Verification in progress..."
      default:
        return "Unknown status"
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            Verified
          </Badge>
        )
      case "unverified":
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <XCircle className="h-4 w-4" />
            Unverified
          </Badge>
        )
      case "expired":
        return (
          <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            Expired
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <Loader2 className="h-4 w-4 animate-spin" />
            Pending
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          NMC PIN Verification
          {getStatusBadge()}
        </CardTitle>
        <CardDescription>Verify the Nursing and Midwifery Council PIN for this care professional</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="nmc-pin">NMC PIN</Label>
            <Input id="nmc-pin" placeholder="e.g. AB123456" value={pin} onChange={(e) => setPin(e.target.value)} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setPin("")}>
          Clear
        </Button>
        <Button onClick={handleVerify} disabled={isChecking}>
          {isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying
            </>
          ) : (
            "Verify PIN"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
