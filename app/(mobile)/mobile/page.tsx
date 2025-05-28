"use client"

import { useState } from "react"
import { Home, Users, Calendar, CheckSquare, Settings, Search, Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function MobilePage() {
  const [activeTab, setActiveTab] = useState("home")

  const navigationItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "patients", label: "Patients", icon: Users },
    { id: "appointments", label: "Schedule", icon: Calendar },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">ComplexCare</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4">
        {activeTab === "home" && (
          <div className="space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-sm text-muted-foreground">Patients Today</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-sm text-muted-foreground">Appointments</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-sm text-muted-foreground">Pending Tasks</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-sm text-muted-foreground">New Notes</p>
                </CardContent>
              </Card>
            </div>

            {/* Today's Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Today's Appointments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { time: "09:00", patient: "John Smith", type: "Check-up" },
                  { time: "10:30", patient: "Mary Johnson", type: "Follow-up" },
                  { time: "14:00", patient: "Robert Brown", type: "Assessment" },
                ].map((apt, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{apt.patient}</p>
                      <p className="text-sm text-muted-foreground">{apt.type}</p>
                    </div>
                    <Badge variant="outline">{apt.time}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Urgent Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Urgent Tasks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  "Review medication for Patient #1234",
                  "Complete assessment for John Smith",
                  "Update care plan for Mary Johnson",
                ].map((task, i) => (
                  <div key={i} className="flex items-start gap-2 p-2">
                    <CheckSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <p className="text-sm">{task}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "patients" && (
          <div className="space-y-4">
            <Input placeholder="Search patients..." className="w-full" />
            <div className="space-y-2">
              {[
                { name: "John Smith", id: "P1234", status: "Active" },
                { name: "Mary Johnson", id: "P1235", status: "Active" },
                { name: "Robert Brown", id: "P1236", status: "Inactive" },
              ].map((patient, i) => (
                <Card key={i}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">{patient.id}</p>
                    </div>
                    <Badge variant={patient.status === "Active" ? "default" : "secondary"}>{patient.status}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="space-y-4">
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Appointment calendar coming soon</p>
            </div>
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="space-y-4">
            <div className="text-center py-8">
              <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Task management coming soon</p>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Profile</h3>
                  <p className="text-sm text-muted-foreground">Manage your account settings</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Notifications</h3>
                  <p className="text-sm text-muted-foreground">Configure notification preferences</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Security</h3>
                  <p className="text-sm text-muted-foreground">Update password and security settings</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t">
        <div className="flex justify-around py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === item.id ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
