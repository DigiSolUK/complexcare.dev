export interface Office365Integration {
  id: string
  tenantId: string
  isEnabled: boolean
  clientId: string
  clientSecret?: string
  tenantName?: string
  redirectUri: string
  scopes: string[]
  accessToken?: string
  refreshToken?: string
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Office365Email {
  id: string
  subject: string
  from: EmailAddress
  to: EmailAddress[]
  cc?: EmailAddress[]
  bcc?: EmailAddress[]
  body: string
  isRead: boolean
  receivedAt: Date
  importance: "low" | "normal" | "high"
  hasAttachments: boolean
  attachments?: EmailAttachment[]
}

export interface EmailAddress {
  name?: string
  address: string
}

export interface EmailAttachment {
  id: string
  name: string
  contentType: string
  size: number
  contentId?: string
  isInline?: boolean
}

export interface CalendarEvent {
  id: string
  subject: string
  body?: string
  location?: string
  startTime: Date
  endTime: Date
  isAllDay: boolean
  organizer: EmailAddress
  attendees: EventAttendee[]
  recurrence?: RecurrencePattern
  status: "confirmed" | "tentative" | "cancelled"
}

export interface EventAttendee {
  emailAddress: EmailAddress
  responseStatus?: "accepted" | "declined" | "tentative" | "notResponded"
  type?: "required" | "optional" | "resource"
}

export interface RecurrencePattern {
  type: "daily" | "weekly" | "monthly" | "yearly"
  interval: number
  daysOfWeek?: ("monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday")[]
  dayOfMonth?: number
  monthOfYear?: number
  endDate?: Date
  numberOfOccurrences?: number
}
