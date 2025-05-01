"use client"

import { CardDescription } from "@/components/ui/card"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, MessageSquare } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { BodyMap } from "@/components/patients/body-map"
import { Textarea } from "@/components/ui/textarea"

interface PatientDailyLogsProps {
  patientId: string
}

interface DailyLog {
  id: string
  date: Date
  notes: string
  bodyMapAreas: string[]
  bodyMapNotes: string
}

export function PatientDailyLogs({ patientId }: PatientDailyLogsProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [logs, setLogs] = useState<DailyLog[]>([])
  const [newLogNotes, setNewLogNotes] = useState("")
  const [newLogBodyMapAreas, setNewLogBodyMapAreas] = useState<string[]>([])
  const [newLogBodyMapNotes, setNewLogBodyMapNotes] = useState("")

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
  }

  const handleAddLog = () => {
    if (!selectedDate) return

    const newLog: DailyLog = {
      id: Date.now().toString(),
      date: selectedDate,
      notes: newLogNotes,
      bodyMapAreas: newLogBodyMapAreas,
      bodyMapNotes: newLogBodyMapNotes,
    }

    setLogs([...logs, newLog])
    setNewLogNotes("")
    setNewLogBodyMapAreas([])
    setNewLogBodyMapNotes("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Logs</CardTitle>
        <CardDescription>Record daily observations and notes for the patient</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button onClick={handleAddLog}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Add Log
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter your notes for the day"
                  value={newLogNotes}
                  onChange={(e) => setNewLogNotes(e.target.value)}
                />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Body Map</CardTitle>
              </CardHeader>
              <CardContent>
                <BodyMap
                  selectedAreas={newLogBodyMapAreas}
                  onChange={(areas) => setNewLogBodyMapAreas(areas)}
                  notes={newLogBodyMapNotes}
                  onNotesChange={(notes) => setNewLogBodyMapNotes(notes)}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium">
            Daily Logs for {selectedDate ? format(selectedDate, "PPP") : "Select a date"}
          </h3>
          {logs
            .filter((log) => format(log.date, "yyyy-MM-dd") === format(selectedDate || new Date(), "yyyy-MM-dd"))
            .map((log) => (
              <Card key={log.id} className="mb-4">
                <CardHeader>
                  <CardTitle>Log for {format(log.date, "PPP")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{log.notes}</p>
                  {log.bodyMapAreas.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium">Body Map Areas</h4>
                      <p className="text-sm text-muted-foreground">{log.bodyMapAreas.join(", ")}</p>
                      <p className="text-sm text-muted-foreground">{log.bodyMapNotes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
