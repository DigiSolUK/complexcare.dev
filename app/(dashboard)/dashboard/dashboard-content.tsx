"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, ClipboardList, Heart } from "lucide-react"

export function DashboardContent() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-400 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">248</div>
            <p className="text-xs text-gray-600">
              <span className="text-green-600">+4%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-400 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Appointments Today</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">8</div>
            <p className="text-xs text-gray-600">3 pending confirmation</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-400 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Tasks Due</CardTitle>
            <ClipboardList className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">11</div>
            <p className="text-xs text-gray-600">5 overdue</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-400 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Active Care Plans</CardTitle>
            <Heart className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">187</div>
            <p className="text-xs text-gray-600">12 require review</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800">Recent Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "John Smith", status: "Active", lastSeen: "Today" },
                { name: "Emily Johnson", status: "Critical", lastSeen: "Yesterday" },
                { name: "Michael Williams", status: "Stable", lastSeen: "2 days ago" },
                { name: "Sarah Brown", status: "Active", lastSeen: "3 days ago" },
              ].map((patient, index) => (
                <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div>
                    <p className="font-medium text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-600">Last seen: {patient.lastSeen}</p>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      patient.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : patient.status === "Critical"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {patient.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800">Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "10:00", patient: "John Smith", type: "Check-up" },
                { time: "11:30", patient: "Emily Johnson", type: "Follow-up" },
                { time: "14:00", patient: "Michael Williams", type: "Consultation" },
                { time: "16:30", patient: "Sarah Brown", type: "Assessment" },
              ].map((appointment, index) => (
                <div key={index} className="flex items-center border-b border-gray-100 pb-2">
                  <div className="bg-blue-50 text-blue-700 rounded-md p-2 flex flex-col items-center justify-center min-w-[60px] mr-4">
                    <span className="text-xs font-medium">{appointment.time}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{appointment.patient}</p>
                    <p className="text-sm text-gray-600">{appointment.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
