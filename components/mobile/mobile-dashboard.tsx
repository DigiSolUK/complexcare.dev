import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MobileDashboard() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-sm text-muted-foreground">Today</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">3 new today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">5 urgent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">2 unread</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Appointments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { time: "09:00", patient: "John Smith", type: "Check-up" },
            { time: "10:30", patient: "Sarah Johnson", type: "Follow-up" },
            { time: "13:15", patient: "Michael Brown", type: "Assessment" },
          ].map((appointment, index) => (
            <div key={index} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
              <div>
                <div className="font-medium">{appointment.patient}</div>
                <div className="text-sm text-muted-foreground">{appointment.type}</div>
              </div>
              <div className="text-sm">{appointment.time}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Urgent Tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { task: "Review medication changes", patient: "Emma Wilson" },
            { task: "Complete assessment form", patient: "David Lee" },
            { task: "Follow up on test results", patient: "Lisa Taylor" },
          ].map((task, index) => (
            <div key={index} className="flex items-start space-x-2 border-b pb-2 last:border-0 last:pb-0">
              <div className="h-5 w-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="h-2 w-2 rounded-full bg-destructive"></div>
              </div>
              <div>
                <div className="font-medium">{task.task}</div>
                <div className="text-sm text-muted-foreground">Patient: {task.patient}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
