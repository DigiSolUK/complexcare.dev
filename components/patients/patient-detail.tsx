import type { Patient } from "@/types/patient"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Phone, Mail, Home, AlertTriangle, Pill, User, Activity } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface PatientDetailProps {
  patient: Patient
}

export function PatientDetail({ patient }: PatientDetailProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {patient.firstName} {patient.lastName}
          </CardTitle>
          <CardDescription>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>DOB: {formatDate(patient.dateOfBirth)}</span>
              {patient.nhsNumber && (
                <>
                  <span className="mx-2">•</span>
                  <span>NHS: {patient.nhsNumber}</span>
                </>
              )}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">Contact Information</h3>
                <div className="space-y-2">
                  {patient.address && (
                    <div className="flex items-start gap-2">
                      <Home className="h-4 w-4 mt-1 text-muted-foreground" />
                      <span>{patient.address}</span>
                    </div>
                  )}
                  {patient.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{patient.phoneNumber}</span>
                    </div>
                  )}
                  {patient.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{patient.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {patient.emergencyContact && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">Emergency Contact</h3>
                  <p>{patient.emergencyContact}</p>
                </div>
              )}

              {patient.medicalConditions && patient.medicalConditions.length > 0 && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">Medical Conditions</h3>
                  <div className="flex flex-wrap gap-2">
                    {patient.medicalConditions.map((condition, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {patient.medications && patient.medications.length > 0 && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">Medications</h3>
                  <div className="flex flex-wrap gap-2">
                    {patient.medications.map((medication, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        <Pill className="h-3 w-3" />
                        {medication}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {patient.allergies && patient.allergies.length > 0 && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">Allergies</h3>
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive" className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {patient.notes && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">Notes</h3>
                  <p className="text-sm whitespace-pre-line">{patient.notes}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GP Connect Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <User className="h-5 w-5" />
            GP Connect Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {patient.gpConnect?.gpName && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">GP Name</h3>
                  <p>{patient.gpConnect.gpName}</p>
                </div>
              )}

              {patient.gpConnect?.gpPractice && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Practice Name</h3>
                  <p>{patient.gpConnect.gpPractice}</p>
                </div>
              )}

              {patient.gpConnect?.gpAddress && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Practice Address</h3>
                  <p>{patient.gpConnect.gpAddress}</p>
                </div>
              )}

              {patient.gpConnect?.gpPhoneNumber && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Contact Number</h3>
                  <p>{patient.gpConnect.gpPhoneNumber}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {patient.gpConnect?.gpEmail && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Email</h3>
                  <p>{patient.gpConnect.gpEmail}</p>
                </div>
              )}

              {patient.gpConnect?.lastAppointment && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Last Appointment</h3>
                  <p>{formatDate(patient.gpConnect.lastAppointment)}</p>
                </div>
              )}

              {patient.gpConnect?.nextAppointment && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Next Appointment</h3>
                  <p>{formatDate(patient.gpConnect.nextAppointment)}</p>
                </div>
              )}

              {patient.gpConnect?.nhsConnectStatus && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">NHS Connect Status</h3>
                  <Badge
                    variant={
                      patient.gpConnect.nhsConnectStatus === "connected"
                        ? "success"
                        : patient.gpConnect.nhsConnectStatus === "pending"
                          ? "warning"
                          : "destructive"
                    }
                  >
                    {patient.gpConnect.nhsConnectStatus.charAt(0).toUpperCase() +
                      patient.gpConnect.nhsConnectStatus.slice(1)}
                  </Badge>
                </div>
              )}

              {patient.gpConnect?.referralStatus && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Referral Status</h3>
                  <p>{patient.gpConnect.referralStatus}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

