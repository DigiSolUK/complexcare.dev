import { TimesheetTable } from "@/components/timesheets/timesheet-table"

export const dynamic = "force-dynamic"

export default function TimesheetsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Timesheets</h1>
        <p className="text-muted-foreground">Manage and approve care professional timesheets</p>
      </div>

      <TimesheetTable />
    </div>
  )
}

