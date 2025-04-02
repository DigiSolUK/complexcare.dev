"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle, AlertCircle, Loader2, Calendar } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DBSCheckProps {
  careProfessionalId: string
  initialCertificateNumber?: string
  initialType?: "basic" | "standard" | "enhanced"
  initialIssueDate?: Date
  initialStatus?: "verified" | "unverified" | "expired" | "pending"
  onVerify?: (status: "verified" | "unverified" | "expired" | "pending") => void
}

export function DBSCheck({
  careProfessionalId,
  initialCertificateNumber = "",
  initialType = "enhanced",
  initialIssueDate,
  initialStatus = "unverified",
  onVerify,
}: DBSCheckProps) {
  const [certificateNumber, setCertificateNumber] = useState(initialCertificateNumber)
  const [type, setType] = useState<"basic" | "standard" | "enhanced">(initialType)
  const [issueDate, setIssueDate] = useState<Date | undefined>(initialIssueDate)
  const [status, setStatus] = useState<"verified" | "unverified" | "expired" | "pending">(initialStatus)
  const [isChecking, setIsChecking] = useState(false)
  const { toast } = useToast()

  const handleVerify = async () => {
    if (!certificateNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a DBS certificate number",
        variant: "destructive",
      })
      return
    }

    if (!issueDate) {
      toast({
        title: "Error",
        description: "Please select the issue date",
        variant: "destructive",
      })
      return
    }

    setIsChecking(true)
    setStatus("pending")

    try {
      // Simulate API call to DBS
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, we'll use some simple validation
      // In production, this would call an actual DBS API
      const newStatus = validateCertificate(certificateNumber, issueDate)
      setStatus(newStatus)

      if (onVerify) {
        onVerify(newStatus)
      }

      toast({
        title: newStatus === "verified" ? "Certificate Verified" : "Verification Failed",
        description: getStatusMessage(newStatus),
        variant: newStatus === "verified" ? "default" : "destructive",
      })
    } catch (error) {
      console.error("Error verifying DBS certificate:", error)
      setStatus("unverified")
      toast({
        title: "Verification Error",
        description: "An error occurred while verifying the DBS certificate. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsChecking(false)
    }
  }

  // Simple validation for demo purposes
  const validateCertificate = (certificateNumber: string, issueDate: Date): "verified" | "unverified" | "expired" => {
    // Check if certificate number is in the correct format (e.g., 12 digits)
    const certificateRegex = /^\d{12}$/
    if (!certificateRegex.test(certificateNumber)) {
      return "unverified"
    }

    // Check if the certificate is expired (more than 3 years old)
    const threeYearsAgo = new Date()
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3)
    if (issueDate < threeYearsAgo) {
      return "expired"
    }

    return "verified"
  }

  const getStatusMessage = (status: "verified" | "unverified" | "expired" | "pending") => {
    switch (status) {
      case "verified":
        return "The DBS certificate has been successfully verified."
      case "unverified":
        return "The DBS certificate could not be verified. Please check and try again."
      case "expired":
        return "The DBS certificate has expired. A new check is required."
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
          DBS Certificate Verification
          {getStatusBadge()}
        </CardTitle>
        <CardDescription>
          Verify the Disclosure and Barring Service certificate for this care professional
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="dbs-certificate">Certificate Number</Label>
            <Input
              id="dbs-certificate"
              placeholder="e.g. 123456789012"
              value={certificateNumber}
              onChange={(e) => setCertificateNumber(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="dbs-type">DBS Check Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as "basic" | "standard" | "enhanced")}>
              <SelectTrigger id="dbs-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="enhanced">Enhanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="dbs-issue-date">Issue Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button id="dbs-issue-date" variant="outline" className="w-full justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {issueDate ? format(issueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent mode="single" selected={issueDate} onSelect={setIssueDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            setCertificateNumber("")
            setIssueDate(undefined)
          }}
        >
          Clear
        </Button>
        <Button onClick={handleVerify} disabled={isChecking}>
          {isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying
            </>
          ) : (
            "Verify Certificate"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

