"use client"

import { useState, useEffect } from "react"
import { format, parseISO } from "date-fns"
import { Check, X, Clock, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TimeOffRequestForm } from "./time-off-request-form"
import { getProviderTimeOffRequestsAction, updateTimeOffRequestStatusAction } from "@/lib/actions/availability-actions"
import { toast } from "@/components/ui/use-toast"
import type { TimeOffRequest, TimeOffStatus } from "@/types/availability"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Provider {
  id: string
  first_name: string
  last_name: string
}

interface TimeOffRequestsListProps {
  providers: Provider[]
  providerId?: string
  isAdmin?: boolean
  currentUserId?: string
}

export function TimeOffRequestsList({
  providers,
  providerId,
  isAdmin = false,
  currentUserId,
}: TimeOffRequestsListProps) {
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<TimeOffRequest | null>(null)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("pending")

  const fetchTimeOffRequests = async () => {
    if (!providerId && !isAdmin) return

    setLoading(true)
    try {
      const result = await getProviderTimeOffRequestsAction(providerId || "all")

      if (result.success && result.data) {
        setTimeOffRequests(result.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to load time off requests",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching time off requests:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading time off requests",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTimeOffRequests()
  }, [providerId, isAdmin])

  const handleUpdateStatus = async (status: TimeOffStatus) => {
    if (!selectedRequest) return

    setIsProcessing(true)
    try {
      const result = await updateTimeOffRequestStatusAction(
        selectedRequest.id,
        status,
        status === "approved" ? currentUserId || null : null,
        selectedRequest.provider_id,
      )

      if (result.success) {
        toast({
          title: `Request ${status}`,
          description: `The time off request has been ${status} successfully`,
        })
        setShowApproveDialog(false)
        setShowRejectDialog(false)
        setShowCancelDialog(false)
        setSelectedRequest(null)
        fetchTimeOffRequests()
      } else {
        toast({
          title: "Error",
          description: `Failed to ${status} time off request`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(`Error ${status} time off request:`, error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: TimeOffStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Check className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <X className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <X className="mr-1 h-3 w-3" />
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const filteredRequests = timeOffRequests.filter((request) => {
    if (activeTab === "all") return true
    return request.status === activeTab
  })

  const getProviderName = (providerId: string) => {
    const provider = providers.find((p) => p.id === providerId)
    return provider ? `${provider.first_name} ${provider.last_name}` : "Unknown Provider"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Time Off Requests</CardTitle>
            <CardDescription>Manage time off requests for providers</CardDescription>
          </div>
          {(providerId || isAdmin) && (
            <TimeOffRequestForm providers={providers} providerId={providerId} onSuccess={fetchTimeOffRequests} />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No {activeTab !== "all" ? activeTab : ""} time off requests found
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                      <div>
                        <h3 className="font-medium">
                          {isAdmin ? getProviderName(request.provider_id) : request.reason.replace(/_/g, " ")}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-3 w-3" />
                          {format(parseISO(request.start_date), "PPP")} - {format(parseISO(request.end_date), "PPP")}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(request.status as TimeOffStatus)}
                        {request.status === "pending" && (
                          <>
                            {isAdmin && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 border-green-200 hover:bg-green-50"
                                  onClick={() => {
                                    setSelectedRequest(request)
                                    setShowApproveDialog(true)
                                  }}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => {
                                    setSelectedRequest(request)
                                    setShowRejectDialog(true)
                                  }}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            {(providerId === request.provider_id || currentUserId === request.provider_id) && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-gray-600 border-gray-200 hover:bg-gray-50"
                                onClick={() => {
                                  setSelectedRequest(request)
                                  setShowCancelDialog(true)
                                }}
                              >
                                Cancel
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {isAdmin && (
                      <div className="mb-2">
                        <p className="text-sm font-medium">Reason</p>
                        <p className="text-sm capitalize">{request.reason.replace(/_/g, " ")}</p>
                      </div>
                    )}

                    {request.notes && (
                      <div>
                        <p className="text-sm font-medium">Notes</p>
                        <p className="text-sm">{request.notes}</p>
                      </div>
                    )}

                    {request.status === "approved" && request.approved_by && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        Approved by {request.approved_by_name || "Admin"} on{" "}
                        {format(parseISO(request.approved_at!), "PPP")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Approve confirmation dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Time Off Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this time off request? This will mark the provider as unavailable for the
              requested dates.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleUpdateStatus("approved")}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? "Approving..." : "Approve"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject confirmation dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Time Off Request</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to reject this time off request?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleUpdateStatus("rejected")}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? "Rejecting..." : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel confirmation dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Time Off Request</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to cancel this time off request?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleUpdateStatus("cancelled")}
              disabled={isProcessing}
              className="bg-gray-600 hover:bg-gray-700"
            >
              {isProcessing ? "Cancelling..." : "Cancel Request"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
