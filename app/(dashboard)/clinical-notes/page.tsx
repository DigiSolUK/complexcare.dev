import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockData } from "@/lib/db"

export default function ClinicalNotesPage() {
  // Use mock data directly
  const clinicalNotes = mockData.clinical_notes

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clinical Notes</h1>
        <Link href="/clinical-notes/new">
          <Button>Create New Note</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clinical Notes List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Important</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clinicalNotes.map((note) => {
                // Find patient name
                const patient = mockData.patients.find((p) => p.id === note.patient_id)
                const patientName = patient ? `${patient.first_name} ${patient.last_name}` : "Unknown Patient"

                // Find author name
                const author = mockData.care_professionals.find((cp) => cp.id === note.author_id)
                const authorName = author
                  ? `${author.title} ${author.first_name} ${author.last_name}`
                  : "Unknown Author"

                // Format date
                const date = new Date(note.created_at).toLocaleDateString()

                return (
                  <TableRow key={note.id}>
                    <TableCell className="font-medium">{note.title}</TableCell>
                    <TableCell>{patientName}</TableCell>
                    <TableCell>{authorName}</TableCell>
                    <TableCell>{date}</TableCell>
                    <TableCell>
                      {note.is_important ? (
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                          <span>Yes</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-gray-300 mr-2"></div>
                          <span>No</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link href={`/clinical-notes/${note.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        <Link href={`/clinical-notes/${note.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}

              {/* Add a few more mock notes */}
              <TableRow>
                <TableCell className="font-medium">Medication Review</TableCell>
                <TableCell>Robert Johnson</TableCell>
                <TableCell>Dr. Wilson</TableCell>
                <TableCell>{new Date().toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-gray-300 mr-2"></div>
                    <span>No</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link href="/clinical-notes/cn3">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                    <Link href="/clinical-notes/cn3/edit">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">Follow-up Consultation</TableCell>
                <TableCell>Sarah Williams</TableCell>
                <TableCell>Nurse Johnson</TableCell>
                <TableCell>{new Date().toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                    <span>Yes</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link href="/clinical-notes/cn4">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                    <Link href="/clinical-notes/cn4/edit">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
