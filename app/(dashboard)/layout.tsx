import type React from "react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Users, Calendar, FileText, ClipboardList, Home, Settings, User, BarChart4, Pill } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-gray-50 border-r">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-blue-600">ComplexCare CRM</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard" className="flex items-center p-2 rounded-md hover:bg-gray-100">
            <Home className="h-5 w-5 mr-3 text-gray-500" />
            <span>Dashboard</span>
          </Link>
          <Link href="/patients" className="flex items-center p-2 rounded-md hover:bg-gray-100">
            <Users className="h-5 w-5 mr-3 text-gray-500" />
            <span>Patients</span>
          </Link>
          <Link href="/appointments" className="flex items-center p-2 rounded-md hover:bg-gray-100">
            <Calendar className="h-5 w-5 mr-3 text-gray-500" />
            <span>Appointments</span>
          </Link>
          <Link href="/clinical-notes" className="flex items-center p-2 rounded-md hover:bg-gray-100">
            <FileText className="h-5 w-5 mr-3 text-gray-500" />
            <span>Clinical Notes</span>
          </Link>
          <Link href="/medications" className="flex items-center p-2 rounded-md hover:bg-gray-100">
            <Pill className="h-5 w-5 mr-3 text-gray-500" />
            <span>Medications</span>
          </Link>
          <Link href="/tasks" className="flex items-center p-2 rounded-md hover:bg-gray-100">
            <ClipboardList className="h-5 w-5 mr-3 text-gray-500" />
            <span>Tasks</span>
          </Link>
          <Link href="/reports" className="flex items-center p-2 rounded-md hover:bg-gray-100">
            <BarChart4 className="h-5 w-5 mr-3 text-gray-500" />
            <span>Reports</span>
          </Link>
          <div className="pt-4 mt-4 border-t">
            <Link href="/settings" className="flex items-center p-2 rounded-md hover:bg-gray-100">
              <Settings className="h-5 w-5 mr-3 text-gray-500" />
              <span>Settings</span>
            </Link>
            <Link href="/profile" className="flex items-center p-2 rounded-md hover:bg-gray-100">
              <User className="h-5 w-5 mr-3 text-gray-500" />
              <span>Profile</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6">
          <div className="md:hidden">
            <h2 className="text-xl font-semibold text-blue-600">ComplexCare CRM</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-50 px-3 py-1 rounded-md border border-yellow-200">
              <span className="text-sm text-yellow-800">Public Mode</span>
            </div>
            <ModeToggle />
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium">JD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
