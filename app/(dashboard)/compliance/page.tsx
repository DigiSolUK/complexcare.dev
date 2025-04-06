import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Download,
  FileText,
  Info,
  Lock,
  RefreshCw,
  Shield,
  UserCog,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Compliance Dashboard | ComplexCare CRM",
  description: "Monitor and manage GDPR compliance and data protection",
}

export default function CompliancePage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Compliance Dashboard</h1>
        <p className="text-muted-foreground mt-2">Monitor and manage GDPR compliance and data protection</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="data-requests">Data Requests</TabsTrigger>
          <TabsTrigger value="consent">Consent Management</TabsTrigger>
          <TabsTrigger value="audits">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Compliance Score
                </CardTitle>
                <CardDescription>Overall GDPR compliance rating</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="text-4xl font-bold text-primary">87%</div>
                  <Progress value={87} className="w-full" />
                  <p className="text-sm text-muted-foreground">Last updated: 2 days ago</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  Data Requests
                </CardTitle>
                <CardDescription>Subject access and deletion requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pending</span>
                    <Badge variant="outline">3</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completed (30 days)</span>
                    <Badge variant="outline">12</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Overdue</span>
                    <Badge variant="destructive">1</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserCog className="h-5 w-5 text-primary" />
                  Consent Status
                </CardTitle>
                <CardDescription>Patient consent management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Valid Consents</span>
                    <Badge variant="outline" className="bg-green-50">
                      94%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Expiring Soon</span>
                    <Badge variant="outline" className="bg-yellow-50">
                      12
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Expired</span>
                    <Badge variant="destructive">7</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Compliance Action Required</AlertTitle>
            <AlertDescription>
              There are 3 pending data subject access requests that need to be processed within the next 7 days to
              maintain GDPR compliance.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Data Protection Impact Assessments
                </CardTitle>
                <CardDescription>Recent and upcoming DPIAs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className="mt-0.5">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">Patient Records System</h4>
                      <p className="text-sm text-muted-foreground">Completed on 15 Mar 2023</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          High Risk
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Special Category Data
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className="mt-0.5">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">Telehealth Integration</h4>
                      <p className="text-sm text-muted-foreground">Due by 30 Jun 2023</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          Medium Risk
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Third Party
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className="mt-0.5">
                      <Info className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-medium">Staff Training Platform</h4>
                      <p className="text-sm text-muted-foreground">Scheduled for 10 Jul 2023</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          Low Risk
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Compliance Documentation
                </CardTitle>
                <CardDescription>Key policies and procedures</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">Privacy Policy</h4>
                        <p className="text-xs text-muted-foreground">Updated 2 months ago</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">Data Retention Policy</h4>
                        <p className="text-xs text-muted-foreground">Updated 3 months ago</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">Data Breach Response Plan</h4>
                        <p className="text-xs text-muted-foreground">Updated 1 month ago</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">Subject Access Request Procedure</h4>
                        <p className="text-xs text-muted-foreground">Updated 2 months ago</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data-requests" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Subject Requests</CardTitle>
              <CardDescription>
                Manage and process data subject access, rectification, and deletion requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <h4 className="font-medium">Access Request - John Smith</h4>
                    <p className="text-sm text-muted-foreground">Requested on 10 Jun 2023</p>
                    <Badge variant="destructive" className="mt-2">
                      Due in 3 days
                    </Badge>
                  </div>
                  <Button>Process</Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <h4 className="font-medium">Deletion Request - Sarah Johnson</h4>
                    <p className="text-sm text-muted-foreground">Requested on 15 Jun 2023</p>
                    <Badge variant="outline" className="mt-2">
                      Due in 12 days
                    </Badge>
                  </div>
                  <Button>Process</Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <h4 className="font-medium">Rectification Request - Michael Brown</h4>
                    <p className="text-sm text-muted-foreground">Requested on 18 Jun 2023</p>
                    <Badge variant="outline" className="mt-2">
                      Due in 15 days
                    </Badge>
                  </div>
                  <Button>Process</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completed Requests</CardTitle>
              <CardDescription>History of processed data subject requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <h4 className="font-medium">Access Request - Emily Wilson</h4>
                    <p className="text-sm text-muted-foreground">Completed on 5 Jun 2023</p>
                    <Badge variant="success" className="mt-2">
                      Completed
                    </Badge>
                  </div>
                  <Button variant="outline">View Details</Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <h4 className="font-medium">Deletion Request - Robert Taylor</h4>
                    <p className="text-sm text-muted-foreground">Completed on 1 Jun 2023</p>
                    <Badge variant="success" className="mt-2">
                      Completed
                    </Badge>
                  </div>
                  <Button variant="outline">View Details</Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <h4 className="font-medium">Access Request - James Anderson</h4>
                    <p className="text-sm text-muted-foreground">Completed on 25 May 2023</p>
                    <Badge variant="success" className="mt-2">
                      Completed
                    </Badge>
                  </div>
                  <Button variant="outline">View Details</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consent" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Consent Management</CardTitle>
              <CardDescription>Track and manage patient consent for data processing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Consent Categories</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Medical Treatment</h4>
                        <Badge variant="outline" className="bg-green-50">
                          98% Valid
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Consent to provide medical treatment and care
                      </p>
                      <Progress value={98} className="h-2" />
                    </div>

                    <div className="p-4 rounded-lg border">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Data Sharing</h4>
                        <Badge variant="outline" className="bg-yellow-50">
                          87% Valid
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Consent to share data with other healthcare providers
                      </p>
                      <Progress value={87} className="h-2" />
                    </div>

                    <div className="p-4 rounded-lg border">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Research</h4>
                        <Badge variant="outline" className="bg-yellow-50">
                          76% Valid
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Consent to use anonymized data for research</p>
                      <Progress value={76} className="h-2" />
                    </div>

                    <div className="p-4 rounded-lg border">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Marketing</h4>
                        <Badge variant="outline" className="bg-red-50">
                          42% Valid
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Consent to receive marketing communications</p>
                      <Progress value={42} className="h-2" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Expiring Consents</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <h4 className="font-medium">John Smith - Research Consent</h4>
                        <p className="text-sm text-muted-foreground">Expires in 7 days (30 Jun 2023)</p>
                        <Badge variant="destructive" className="mt-2">
                          Action Required
                        </Badge>
                      </div>
                      <Button>Renew</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <h4 className="font-medium">Sarah Johnson - Data Sharing Consent</h4>
                        <p className="text-sm text-muted-foreground">Expires in 14 days (7 Jul 2023)</p>
                        <Badge variant="outline" className="mt-2">
                          Action Needed
                        </Badge>
                      </div>
                      <Button>Renew</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <h4 className="font-medium">Michael Brown - Marketing Consent</h4>
                        <p className="text-sm text-muted-foreground">Expires in 21 days (14 Jul 2023)</p>
                        <Badge variant="outline" className="mt-2">
                          Action Needed
                        </Badge>
                      </div>
                      <Button>Renew</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Consent Templates</CardTitle>
              <CardDescription>Standardized consent forms and templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">General Treatment Consent</h4>
                      <p className="text-xs text-muted-foreground">Last updated: 15 May 2023</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Data Sharing Agreement</h4>
                      <p className="text-xs text-muted-foreground">Last updated: 1 Jun 2023</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Research Participation</h4>
                      <p className="text-xs text-muted-foreground">Last updated: 10 Jun 2023</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Marketing Communications</h4>
                      <p className="text-xs text-muted-foreground">Last updated: 5 Jun 2023</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audits" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>Track system access and data processing activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Recent Activity</h3>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Patient Record Access</h4>
                        <p className="text-sm text-muted-foreground">
                          Dr. Sarah Johnson accessed patient record #12345
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            Read
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Patient Data
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">Today, 10:23 AM</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Patient Record Update</h4>
                        <p className="text-sm text-muted-foreground">
                          Nurse Michael Brown updated medication list for patient #67890
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            Write
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Medical Data
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">Today, 09:45 AM</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Data Export</h4>
                        <p className="text-sm text-muted-foreground">
                          Admin user exported anonymized patient data for research
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            Export
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Anonymized
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">Yesterday, 4:12 PM</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">System Configuration</h4>
                        <p className="text-sm text-muted-foreground">
                          System administrator updated data retention settings
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            Admin
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Configuration
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">Yesterday, 2:30 PM</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Failed Login Attempt</h4>
                        <p className="text-sm text-muted-foreground">
                          Multiple failed login attempts for user account john.smith@example.com
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="destructive" className="text-xs">
                            Security
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Authentication
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">2 days ago, 8:15 AM</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Processing Register</CardTitle>
              <CardDescription>Record of data processing activities as required by GDPR Article 30</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border">
                  <h4 className="font-medium">Patient Records Management</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Purpose</p>
                      <p className="text-sm">Provision of healthcare services</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Data Categories</p>
                      <p className="text-sm">Personal data, Special category health data</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Legal Basis</p>
                      <p className="text-sm">Explicit consent, Vital interests, Public health</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Retention Period</p>
                      <p className="text-sm">8 years after last treatment</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border">
                  <h4 className="font-medium">Staff Records</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Purpose</p>
                      <p className="text-sm">Employment administration</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Data Categories</p>
                      <p className="text-sm">Personal data, Employment data</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Legal Basis</p>
                      <p className="text-sm">Contract performance, Legal obligation</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Retention Period</p>
                      <p className="text-sm">6 years after employment ends</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border">
                  <h4 className="font-medium">Research Data</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Purpose</p>
                      <p className="text-sm">Medical research</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Data Categories</p>
                      <p className="text-sm">Anonymized health data</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Legal Basis</p>
                      <p className="text-sm">Explicit consent, Public interest</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Retention Period</p>
                      <p className="text-sm">10 years after study completion</p>
                    </div>
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

