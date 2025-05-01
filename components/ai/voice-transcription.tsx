"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Mic, MicOff, Save, Copy, Trash2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function VoiceTranscription() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [processingProgress, setProcessingProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [patientContext, setPatientContext] = useState("")
  const [noteType, setNoteType] = useState("consultation")
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)

    // Start timer
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1)
    }, 1000)

    // In a real implementation, this would use the Web Speech API or a similar service
    toast({
      title: "Recording started",
      description: "Speak clearly into your microphone",
    })
  }

  const stopRecording = () => {
    setIsRecording(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    // Simulate processing the audio
    setIsProcessing(true)
    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsProcessing(false)

          // Simulate transcription result
          const mockTranscriptions = [
            "Patient reports increased pain in lower back, rating it 7 out of 10. Pain is worse in the morning and after prolonged sitting. No radiation of pain to legs. Patient has been taking paracetamol with minimal relief.",
            "Follow-up appointment for hypertension management. Blood pressure today is 142/88. Patient reports good medication adherence but admits to increased salt intake over the holidays. Discussed dietary modifications and importance of regular exercise.",
            "Patient presents with symptoms of upper respiratory infection including cough, nasal congestion, and low-grade fever for the past 3 days. No shortness of breath or chest pain. Lungs clear on auscultation.",
          ]

          setTranscript(mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)])
          return 100
        }
        return prev + 10
      })
    }, 200)

    // Log usage to analytics
    try {
      fetch("/api/log-ai-tool-usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolName: "voice-transcription",
          noteType,
          duration: recordingTime,
        }),
      })
    } catch (error) {
      console.error("Failed to log tool usage:", error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript)
    toast({
      title: "Copied to clipboard",
      description: "Transcript has been copied to your clipboard",
    })
  }

  const handleSave = () => {
    // In a real implementation, this would save to the patient record
    toast({
      title: "Note saved",
      description: "Transcription has been saved to the patient record",
    })
  }

  const handleClear = () => {
    setTranscript("")
    toast({
      description: "Transcript cleared",
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Voice Transcription</CardTitle>
          <CardDescription>Record and transcribe clinical notes using AI speech recognition</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Select value={noteType} onValueChange={setNoteType}>
              <SelectTrigger>
                <SelectValue placeholder="Select note type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consultation">Consultation Note</SelectItem>
                <SelectItem value="assessment">Assessment Note</SelectItem>
                <SelectItem value="procedure">Procedure Note</SelectItem>
                <SelectItem value="discharge">Discharge Summary</SelectItem>
                <SelectItem value="referral">Referral Letter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Textarea
            placeholder="Patient context (optional)"
            value={patientContext}
            onChange={(e) => setPatientContext(e.target.value)}
            rows={3}
          />

          <div className="flex justify-center">
            <Button
              variant={isRecording ? "destructive" : "default"}
              size="lg"
              className="rounded-full h-24 w-24 flex flex-col items-center justify-center gap-1"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
            >
              {isRecording ? (
                <>
                  <MicOff className="h-8 w-8" />
                  <span className="text-xs">{formatTime(recordingTime)}</span>
                </>
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </Button>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="text-center text-sm text-muted-foreground">Processing audio...</div>
              <Progress value={processingProgress} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transcription</CardTitle>
          <CardDescription>AI-generated transcription of your voice recording</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Transcription will appear here after recording"
            className="min-h-[300px]"
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="icon" onClick={handleClear} disabled={!transcript}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopy} disabled={!transcript}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button onClick={handleSave} disabled={!transcript}>
              <Save className="h-4 w-4 mr-2" />
              Save to Record
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
