import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAllClinicalNotes } from "@/lib/services/clinical-notes-service"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

// Loading component for Suspense
function LoadingNotes() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="animate-pulse bg-gray-200 h-6 w-1/3 rounded"></CardTitle>
        <CardDescription className="animate-pulse bg-gray-200 h-4 w-1/2 rounded"></CardDescription>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse space-y-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Clinical notes table component
async function ClinicalNotesTable() {
  try {
    const notes = await getAllClinicalNotes(DEFAULT_TENANT_ID, 20, 0)

    return (
      <Card>
        <CardHeader>
          <CardTitle>Clinical Notes</CardTitle>
          <CardDescription>View and manage clinical notes</CardDescription>
          <div className="flex items-center gap-4 pt-4">
            <Input placeholder="Search notes..." className="max-w-sm" />
            <Button>Search</Button>
          </div>
        </CardHeader>
        <CardContent>
          {notes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notes.map((note) => (
                  <TableRow key={note.id}>
                    <TableCell className="font-medium">
                      {note.title}
                      {note.is_important && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                          Important
                        </span>
                      )}
                    </TableCell>
                    <TableCell>Patient ID: {note.patient_id}</TableCell>
                    <TableCell>{new Date(note.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>Author ID: {note.author_id}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                          note.is_private
                            ? "bg-amber-50 text-amber-700 ring-amber-600/20"
                            : "bg-green-50 text-green-700 ring-green-600/20"
                        }`}
                      >
                        {note.is_private ? "Private" : "Standard"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link href={`/clinical-notes/${note.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4 text-muted-foreground">No clinical notes found</div>
          )}
        </CardContent>
      </Card>
    )
  } catch (error) {
    console.error("Error loading clinical notes:", error)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clinical Notes</CardTitle>
          <CardDescription>Error loading clinical notes data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
            <h3 className="text-lg font-semibold">Database Connection Error</h3>
            <p>Unable to load clinical notes data. Please check your database connection.</p>
            <p className="text-sm mt-2">Error details: {error instanceof Error ? error.message : String(error)}</p>
          </div>
        </CardContent>
      </Card>
    )
  }
}

export default function ClinicalNotesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Clinical Notes</h2>
        <Button>Add Note</Button>
      </div>

      <Suspense fallback={<LoadingNotes />}>
        <ClinicalNotesTable />
      </Suspense>
    </div>
  )
}
