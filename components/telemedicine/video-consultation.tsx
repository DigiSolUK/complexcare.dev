"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertCircle,
  Camera,
  CameraOff,
  Clipboard,
  FileText,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  Share2,
  User,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface VideoConsultationProps {
  sessionId: string
  patientId: string
  careProfessionalId: string
  patientName: string
  careProfessionalName: string
  isCareProfessional: boolean
  onEndSession: () => void
}

export function VideoConsultation({
  sessionId,
  patientId,
  careProfessionalId,
  patientName,
  careProfessionalName,
  isCareProfessional,
  onEndSession,
}: VideoConsultationProps) {
  const [sessionStatus, setSessionStatus] = useState<string>("connecting")
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false)
  const [isCameraOff, setIsCameraOff] = useState<boolean>(false)
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false)
  const [sessionNotes, setSessionNotes] = useState<string>("")
  const [showEndDialog, setShowEndDialog] = useState<boolean>(false)
  const [connectionQuality, setConnectionQuality] = useState<string>("good")
  const [participants, setParticipants] = useState<any[]>([])

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const { toast } = useToast()

  // Mock WebRTC connections - in a real implementation, this would use a WebRTC library
  useEffect(() => {
    // Simulate connecting to the session
    const connectToSession = async () => {
      try {
        // In a real implementation, this would initialize WebRTC
        setSessionStatus("connecting")

        // Request camera and microphone permissions
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

        // Display local video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }

        // Simulate connection delay
        setTimeout(() => {
          setSessionStatus("connected")
          setParticipants([
            {
              id: isCareProfessional ? patientId : careProfessionalId,
              name: isCareProfessional ? patientName : careProfessionalName,
              role: isCareProfessional ? "Patient" : "Care Professional",
              joinTime: new Date(),
            },
            {
              id: isCareProfessional ? careProfessionalId : patientId,
              name: isCareProfessional ? careProfessionalName : patientName,
              role: isCareProfessional ? "Care Professional" : "Patient",
              joinTime: new Date(),
            },
          ])

          // Record participant join in the database
          recordParticipantJoin()

          // Simulate remote video (in a real implementation, this would come from the WebRTC peer)
          simulateRemoteVideo()
        }, 2000)
      } catch (error) {
        console.error("Error accessing media devices:", error)
        setSessionStatus("error")
        toast({
          title: "Connection Error",
          description: "Could not access camera or microphone. Please check your device permissions.",
          variant: "destructive",
        })
      }
    }

    connectToSession()

    // Cleanup function
    return () => {
      // In a real implementation, this would close WebRTC connections
      if (localVideoRef.current?.srcObject) {
        const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  const simulateRemoteVideo = () => {
    // In a real implementation, this would be the remote peer's video stream
    // For demo purposes, we're just showing a placeholder
    if (remoteVideoRef.current) {
      // Create a canvas to generate a placeholder video
      const canvas = document.createElement("canvas")
      canvas.width = 640
      canvas.height = 480
      const ctx = canvas.getContext("2d")

      // Function to draw a frame
      const drawFrame = () => {
        if (ctx) {
          // Clear canvas
          ctx.fillStyle = "#f0f0f0"
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          // Draw a simple avatar
          ctx.fillStyle = "#4f46e5"
          ctx.beginPath()
          ctx.arc(canvas.width / 2, canvas.height / 2 - 50, 80, 0, Math.PI * 2)
          ctx.fill()

          // Draw a body
          ctx.beginPath()
          ctx.arc(canvas.width / 2, canvas.height / 2 + 120, 140, Math.PI, Math.PI * 2)
          ctx.fill()

          // Add text
          ctx.fillStyle = "#ffffff"
          ctx.font = "24px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText(
            isCareProfessional ? patientName : careProfessionalName,
            canvas.width / 2,
            canvas.height / 2 + 180,
          )

          // Add timestamp
          ctx.fillStyle = "#000000"
          ctx.font = "14px sans-serif"
          ctx.fillText(new Date().toLocaleTimeString(), canvas.width / 2, canvas.height - 20)
        }

        // Schedule next frame
        requestAnimationFrame(drawFrame)
      }

      // Start animation
      drawFrame()

      // Convert canvas to video stream
      const stream = canvas.captureStream(30) // 30 FPS
      remoteVideoRef.current.srcObject = stream
    }
  }

  const recordParticipantJoin = async () => {
    try {
      // In a real implementation, this would call the API to record the participant joining
      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
      }

      // This would be an actual API call
      console.log("Recording participant join:", {
        sessionId,
        userId: isCareProfessional ? careProfessionalId : patientId,
        userType: isCareProfessional ? "care_professional" : "patient",
        deviceInfo,
      })
    } catch (error) {
      console.error("Error recording participant join:", error)
    }
  }

  const toggleMicrophone = () => {
    if (localVideoRef.current?.srcObject) {
      const audioTracks = (localVideoRef.current.srcObject as MediaStream).getAudioTracks()
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsMicMuted(!isMicMuted)
    }
  }

  const toggleCamera = () => {
    if (localVideoRef.current?.srcObject) {
      const videoTracks = (localVideoRef.current.srcObject as MediaStream).getVideoTracks()
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsCameraOff(!isCameraOff)
    }
  }

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
        if (localVideoRef.current) {
          // Save the current video stream to restore later
          const currentStream = localVideoRef.current.srcObject
          // Replace with screen share
          localVideoRef.current.srcObject = screenStream

          // Listen for the end of screen sharing
          screenStream.getVideoTracks()[0].onended = () => {
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = currentStream
              setIsScreenSharing(false)
            }
          }
        }
        setIsScreenSharing(true)
      } else {
        // Stop screen sharing
        if (localVideoRef.current?.srcObject) {
          const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks()
          tracks.forEach((track) => track.stop())

          // Restore camera
          const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          localVideoRef.current.srcObject = cameraStream
        }
        setIsScreenSharing(false)
      }
    } catch (error) {
      console.error("Error toggling screen share:", error)
      toast({
        title: "Screen Sharing Error",
        description: "Could not start or stop screen sharing.",
        variant: "destructive",
      })
    }
  }

  const handleEndSession = async () => {
    try {
      // In a real implementation, this would call the API to end the session
      console.log("Ending session:", {
        sessionId,
        notes: sessionNotes,
      })

      // Stop all media tracks
      if (localVideoRef.current?.srcObject) {
        const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }

      if (remoteVideoRef.current?.srcObject) {
        const tracks = (remoteVideoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }

      setSessionStatus("ended")
      onEndSession()
    } catch (error) {
      console.error("Error ending session:", error)
      toast({
        title: "Error",
        description: "Could not end the session properly.",
        variant: "destructive",
      })
    }
  }

  const getConnectionQualityColor = () => {
    switch (connectionQuality) {
      case "excellent":
        return "bg-green-500"
      case "good":
        return "bg-green-400"
      case "fair":
        return "bg-yellow-500"
      case "poor":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
        <div className="lg:col-span-2 flex flex-col">
          {/* Main video area */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden flex-grow">
            {sessionStatus === "connecting" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                  <p className="text-white mt-4">Connecting to session...</p>
                </div>
              </div>
            )}

            {sessionStatus === "error" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <AlertCircle className="h-12 w-12 text-red-500" />
                  <p className="text-white mt-4">Failed to connect to the session</p>
                  <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {sessionStatus === "connected" && (
              <>
                <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover"></video>

                {/* Connection quality indicator */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 rounded-full px-3 py-1">
                  <div className={`h-3 w-3 rounded-full ${getConnectionQualityColor()}`}></div>
                  <span className="text-white text-xs capitalize">{connectionQuality}</span>
                </div>

                {/* Local video (picture-in-picture) */}
                <div className="absolute bottom-4 right-4 w-1/4 h-1/4 border-2 border-white rounded-lg overflow-hidden shadow-lg">
                  <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>

                  {isCameraOff && (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
              </>
            )}

            {sessionStatus === "ended" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <PhoneOff className="h-12 w-12 text-red-500" />
                  <p className="text-white mt-4">Session has ended</p>
                  <Button variant="outline" className="mt-4" onClick={() => (window.location.href = "/dashboard")}>
                    Return to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Video controls */}
          {sessionStatus === "connected" && (
            <div className="flex justify-center items-center gap-4 p-4 bg-gray-100 rounded-lg mt-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant={isMicMuted ? "destructive" : "secondary"} size="icon" onClick={toggleMicrophone}>
                      {isMicMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isMicMuted ? "Unmute Microphone" : "Mute Microphone"}</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant={isCameraOff ? "destructive" : "secondary"} size="icon" onClick={toggleCamera}>
                      {isCameraOff ? <CameraOff className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isCameraOff ? "Turn Camera On" : "Turn Camera Off"}</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isScreenSharing ? "destructive" : "secondary"}
                      size="icon"
                      onClick={toggleScreenShare}
                    >
                      {isScreenSharing ? <Monitor className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isScreenSharing ? "Stop Screen Sharing" : "Share Screen"}</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button variant="destructive" onClick={() => setShowEndDialog(true)}>
                <PhoneOff className="h-5 w-5 mr-2" />
                End Session
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="bg-white rounded-lg shadow-sm border">
          <Tabs defaultValue="participants">
            <TabsList className="w-full">
              <TabsTrigger value="participants" className="flex-1">
                Participants
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex-1">
                Notes
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex-1">
                Chat
              </TabsTrigger>
            </TabsList>

            <TabsContent value="participants" className="p-4">
              <h3 className="font-medium mb-4">Session Participants</h3>
              <div className="space-y-4">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{participant.name}</p>
                      <p className="text-sm text-muted-foreground">{participant.role}</p>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {new Date(participant.joinTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="notes" className="p-4">
              <h3 className="font-medium mb-4">Session Notes</h3>
              <Textarea
                placeholder="Enter session notes here..."
                className="min-h-[200px]"
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
              />
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" className="mr-2">
                  <Clipboard className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Save Notes
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="chat" className="p-4">
              <h3 className="font-medium mb-4">Session Chat</h3>
              <div className="bg-gray-100 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
                <p className="text-muted-foreground text-center">
                  Chat functionality will be available in the next update.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* End Session Dialog */}
      <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End Telemedicine Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to end this session? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {isCareProfessional && (
            <div className="py-4">
              <label className="block text-sm font-medium mb-2">Session Notes</label>
              <Textarea
                placeholder="Enter any final notes about this session..."
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEndDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleEndSession}>
              End Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
