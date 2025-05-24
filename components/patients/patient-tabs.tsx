"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Pill,
  Calendar,
  FileText,
  ClipboardList,
  Receipt,
  Activity,
  HeartPulse,
  FileSpreadsheet,
} from "lucide-react"

interface PatientTabsProps {
  patientId: string
}

export default function PatientTabs({ patientId }: PatientTabsProps) {
  const pathname = usePathname()

  const tabs = [
    {
      value: "overview",
      label: "Overview",
      icon: <User className="h-4 w-4 mr-2" />,
      href: `/patients/${patientId}`,
    },
    {
      value: "medications",
      label: "Medications",
      icon: <Pill className="h-4 w-4 mr-2" />,
      href: `/patients/${patientId}/medications`,
    },
    {
      value: "appointments",
      label: "Appointments",
      icon: <Calendar className="h-4 w-4 mr-2" />,
      href: `/patients/${patientId}/appointments`,
    },
    {
      value: "clinical-notes",
      label: "Clinical Notes",
      icon: <FileText className="h-4 w-4 mr-2" />,
      href: `/patients/${patientId}/clinical-notes`,
    },
    {
      value: "care-plans",
      label: "Care Plans",
      icon: <ClipboardList className="h-4 w-4 mr-2" />,
      href: `/patients/${patientId}/care-plans`,
    },
    {
      value: "invoices",
      label: "Invoices",
      icon: <Receipt className="h-4 w-4 mr-2" />,
      href: `/patients/${patientId}/invoices`,
    },
    {
      value: "vitals",
      label: "Vitals",
      icon: <Activity className="h-4 w-4 mr-2" />,
      href: `/patients/${patientId}/vitals`,
    },
    {
      value: "assessments",
      label: "Assessments",
      icon: <HeartPulse className="h-4 w-4 mr-2" />,
      href: `/patients/${patientId}/assessments`,
    },
    {
      value: "documents",
      label: "Documents",
      icon: <FileSpreadsheet className="h-4 w-4 mr-2" />,
      href: `/patients/${patientId}/documents`,
    },
  ]

  // Determine active tab based on current path
  const activeTab = tabs.find((tab) => pathname === tab.href)?.value || "overview"

  return (
    <Tabs value={activeTab} className="w-full overflow-x-auto">
      <TabsList className="w-full justify-start">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="flex items-center" asChild>
            <Link href={tab.href}>
              {tab.icon}
              {tab.label}
            </Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
