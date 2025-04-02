import type { Metadata } from "next"
import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage system settings and preferences",
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage system settings and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="organization" className="space-y-4">
        <TabsList>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="users">Users & Permissions</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="billing">Billing & Subscription</TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>Manage your organization information and branding</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input id="org-name" placeholder="Enter organization name" defaultValue="ComplexCare UK Ltd" />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="org-address">Address</Label>
                  <Textarea
                    id="org-address"
                    placeholder="Enter organization address"
                    defaultValue="123 Healthcare Street, London, UK, W1 1AA"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="grid gap-3">
                    <Label htmlFor="org-phone">Phone Number</Label>
                    <Input id="org-phone" placeholder="Enter phone number" defaultValue="+44 20 1234 5678" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="org-email">Email Address</Label>
                    <Input id="org-email" placeholder="Enter email address" defaultValue="info@complexcare.uk" />
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="org-website">Website</Label>
                  <Input id="org-website" placeholder="Enter website URL" defaultValue="https://complexcare.uk" />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="org-timezone">Timezone</Label>
                  <Select defaultValue="europe-london">
                    <SelectTrigger id="org-timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="europe-london">Europe/London (GMT/BST)</SelectItem>
                      <SelectItem value="europe-paris">Europe/Paris (CET/CEST)</SelectItem>
                      <SelectItem value="america-new_york">America/New York (EST/EDT)</SelectItem>
                      <SelectItem value="america-los_angeles">America/Los Angeles (PST/PDT)</SelectItem>
                      <SelectItem value="asia-tokyo">Asia/Tokyo (JST)</SelectItem>
                      <SelectItem value="australia-sydney">Australia/Sydney (AEST/AEDT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Customize your organization's branding elements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label>Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-md border border-dashed border-muted-foreground flex items-center justify-center">
                      <span className="text-muted-foreground">Logo</span>
                    </div>
                    <Button variant="outline">Upload New Logo</Button>
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label>Primary Color</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-md bg-primary"></div>
                    <Input type="text" defaultValue="#0070f3" className="w-32" />
                    <Button variant="outline">Change</Button>
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label>Secondary Color</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-md bg-secondary"></div>
                    <Input type="text" defaultValue="#f5f5f5" className="w-32" />
                    <Button variant="outline">Change</Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Branding
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users and their access permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button>Add New User</Button>
              </div>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left font-medium">Name</th>
                      <th className="p-3 text-left font-medium">Email</th>
                      <th className="p-3 text-left font-medium">Role</th>
                      <th className="p-3 text-left font-medium">Status</th>
                      <th className="p-3 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3">John Smith</td>
                      <td className="p-3">john.smith@complexcare.uk</td>
                      <td className="p-3">Administrator</td>
                      <td className="p-3">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="p-3">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Sarah Johnson</td>
                      <td className="p-3">sarah.johnson@complexcare.uk</td>
                      <td className="p-3">Care Manager</td>
                      <td className="p-3">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="p-3">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Michael Brown</td>
                      <td className="p-3">michael.brown@complexcare.uk</td>
                      <td className="p-3">Care Professional</td>
                      <td className="p-3">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="p-3">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Emily Wilson</td>
                      <td className="p-3">emily.wilson@complexcare.uk</td>
                      <td className="p-3">Finance Manager</td>
                      <td className="p-3">
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                          Invited
                        </span>
                      </td>
                      <td className="p-3">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Role Management</CardTitle>
              <CardDescription>Configure roles and their associated permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button>Create New Role</Button>
              </div>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left font-medium">Role Name</th>
                      <th className="p-3 text-left font-medium">Description</th>
                      <th className="p-3 text-left font-medium">Users</th>
                      <th className="p-3 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3">Administrator</td>
                      <td className="p-3">Full system access and control</td>
                      <td className="p-3">1</td>
                      <td className="p-3">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Care Manager</td>
                      <td className="p-3">Manage care plans and staff</td>
                      <td className="p-3">3</td>
                      <td className="p-3">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Care Professional</td>
                      <td className="p-3">Deliver care and update records</td>
                      <td className="p-3">12</td>
                      <td className="p-3">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Finance Manager</td>
                      <td className="p-3">Manage billing and finances</td>
                      <td className="p-3">2</td>
                      <td className="p-3">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when notifications are sent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <Switch id="sms-notifications" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="app-notifications">In-App Notifications</Label>
                    <Switch id="app-notifications" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">Receive notifications within the application</p>
                </div>

                <div className="grid gap-3">
                  <Label>Notification Events</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-appointments" className="text-sm">
                        Appointment Reminders
                      </Label>
                      <Switch id="notify-appointments" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-tasks" className="text-sm">
                        Task Assignments
                      </Label>
                      <Switch id="notify-tasks" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-care-plans" className="text-sm">
                        Care Plan Updates
                      </Label>
                      <Switch id="notify-care-plans" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-documents" className="text-sm">
                        Document Uploads
                      </Label>
                      <Switch id="notify-documents" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-messages" className="text-sm">
                        New Messages
                      </Label>
                      <Switch id="notify-messages" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Notification Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Customize notification email templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="template-type">Template Type</Label>
                  <Select defaultValue="appointment-reminder">
                    <SelectTrigger id="template-type">
                      <SelectValue placeholder="Select template type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appointment-reminder">Appointment Reminder</SelectItem>
                      <SelectItem value="task-assignment">Task Assignment</SelectItem>
                      <SelectItem value="care-plan-update">Care Plan Update</SelectItem>
                      <SelectItem value="document-upload">Document Upload</SelectItem>
                      <SelectItem value="welcome-email">Welcome Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="email-subject">Email Subject</Label>
                  <Input
                    id="email-subject"
                    placeholder="Enter email subject"
                    defaultValue="Your Upcoming Appointment Reminder"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="email-body">Email Body</Label>
                  <Textarea
                    id="email-body"
                    placeholder="Enter email body"
                    className="min-h-[200px]"
                    defaultValue="Dear {{patient_name}},

This is a reminder that you have an appointment scheduled with {{care_professional}} on {{appointment_date}} at {{appointment_time}}.

Please contact us if you need to reschedule or have any questions.

Best regards,
The ComplexCare Team"
                  />
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Services</CardTitle>
              <CardDescription>Manage integrations with external services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-600"
                      >
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Electronic Health Records (EHR)</h3>
                      <p className="text-sm text-muted-foreground">Connected to NHS Digital Services</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-md bg-green-100 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-600"
                      >
                        <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                        <line x1="2" x2="22" y1="10" y2="10"></line>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Payment Gateway</h3>
                      <p className="text-sm text-muted-foreground">Connected to Stripe</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-md bg-purple-100 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-purple-600"
                      >
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                        <line x1="4" x2="4" y1="22" y2="15"></line>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Prescription Service</h3>
                      <p className="text-sm text-muted-foreground">Connected to NHS Prescription Service</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-md bg-orange-100 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-orange-600"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                        <line x1="3" x2="21" y1="9" y2="9"></line>
                        <line x1="9" x2="9" y1="21" y2="9"></line>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Calendar Integration</h3>
                      <p className="text-sm text-muted-foreground">Connected to Google Calendar</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex justify-end">
                  <Button variant="outline">Add New Integration</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>Manage API keys and access for developers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label>API Keys</Label>
                  <div className="flex items-center gap-4">
                    <Input type="password" value="sk_live_51NzQwELkMm6mNXXXXXXXXXXXX" readOnly />
                    <Button variant="outline">Copy</Button>
                    <Button variant="outline">Regenerate</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This is your live API key. Keep it secure and never share it publicly.
                  </p>
                </div>

                <div className="grid gap-3">
                  <Label>Webhook URL</Label>
                  <div className="flex items-center gap-4">
                    <Input type="text" value="https://api.complexcare.uk/webhooks/v1" readOnly />
                    <Button variant="outline">Copy</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Use this URL to receive webhook notifications from our service.
                  </p>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="api-access">API Access</Label>
                    <Switch id="api-access" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">Enable or disable API access to your account</p>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save API Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Management</CardTitle>
              <CardDescription>Enable or disable features for your organization</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Manage which features are available in your ComplexCare CRM instance. You can enable or disable features
                based on your organization's needs.
              </p>
              <Button asChild>
                <a href="/settings/features">Manage Features</a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>Manage your subscription plan and billing information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex items-center justify-between p-4 border rounded-md bg-primary/5">
                  <div>
                    <h3 className="font-medium">Current Plan: Enterprise</h3>
                    <p className="text-sm text-muted-foreground">£499/month, billed annually</p>
                    <p className="text-sm text-muted-foreground mt-1">Next billing date: 15 June 2023</p>
                  </div>
                  <Button variant="outline">Change Plan</Button>
                </div>

                <div className="grid gap-3">
                  <Label>Payment Method</Label>
                  <div className="flex items-center gap-4 p-4 border rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-600"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                      <line x1="2" x2="22" y1="10" y2="10"></line>
                    </svg>
                    <div>
                      <p className="font-medium">Visa ending in 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label>Billing Address</Label>
                  <div className="p-4 border rounded-md">
                    <p>ComplexCare UK Ltd</p>
                    <p>123 Healthcare Street</p>
                    <p>London, W1 1AA</p>
                    <p>United Kingdom</p>
                    <Button variant="ghost" size="sm" className="mt-2 -ml-2">
                      Edit Address
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label>Billing History</Label>
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-3 text-left font-medium">Date</th>
                          <th className="p-3 text-left font-medium">Description</th>
                          <th className="p-3 text-left font-medium">Amount</th>
                          <th className="p-3 text-left font-medium">Status</th>
                          <th className="p-3 text-left font-medium">Invoice</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-3">15 May 2023</td>
                          <td className="p-3">Enterprise Plan - Annual</td>
                          <td className="p-3">£5,988.00</td>
                          <td className="p-3">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Paid
                            </span>
                          </td>
                          <td className="p-3">
                            <Button variant="ghost" size="sm">
                              Download
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3">15 May 2022</td>
                          <td className="p-3">Enterprise Plan - Annual</td>
                          <td className="p-3">£5,988.00</td>
                          <td className="p-3">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Paid
                            </span>
                          </td>
                          <td className="p-3">
                            <Button variant="ghost" size="sm">
                              Download
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-3">15 May 2021</td>
                          <td className="p-3">Professional Plan - Annual</td>
                          <td className="p-3">£2,988.00</td>
                          <td className="p-3">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Paid
                            </span>
                          </td>
                          <td className="p-3">
                            <Button variant="ghost" size="sm">
                              Download
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

