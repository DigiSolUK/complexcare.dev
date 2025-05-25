"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Appointment } from "@/types"
import { useTenant } from "@/contexts"

interface AppointmentListProps {
  appointments: Appointment[]
}

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments }) => {
  const { tenant } = useTenant()
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>(appointments)

  useEffect(() => {
    if (tenant) {
      // Filter appointments based on the tenant ID.  This assumes each appointment has a tenantId property.
      const filtered = appointments.filter((appointment) => appointment.tenantId === tenant.id)
      setFilteredAppointments(filtered)
    } else {
      // If no tenant is selected, show all appointments.  This might need adjustment based on requirements.
      setFilteredAppointments(appointments)
    }
  }, [appointments, tenant])

  if (!appointments || appointments.length === 0) {
    return <p>No appointments scheduled.</p>
  }

  return (
    <div>
      <h2>Appointments</h2>
      {filteredAppointments.length === 0 ? (
        <p>No appointments found for the current tenant.</p>
      ) : (
        <ul>
          {filteredAppointments.map((appointment) => (
            <li key={appointment.id}>
              {appointment.title} - {appointment.date} - {appointment.time}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AppointmentList
