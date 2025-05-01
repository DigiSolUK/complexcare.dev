import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, BarChart, PieChart, Calendar } from "lucide-react"

export function ComplianceReports() {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Summary Reports</TabsTrigger>
          <TabsTrigger value="policy">Policy Reports</TabsTrigger>
          <TabsTrigger value="training">Training Reports</TabsTrigger>
          <TabsTrigger value="risk">Risk Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <BarChart className="mr-2 h-5 w-5 text-primary" />
                  Compliance Overview
                </CardTitle>
                <CardDescription>Overall compliance status summary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-primary">87%</div>
                  <p className="text-sm text-muted-foreground">Overall Compliance Score</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Policy Compliance</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Training Compliance</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Risk Assessment Compliance</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Audit Compliance</span>
                    <span className="font-medium">95%</span>
                  </div>
                </div>
                <Button className="w-full mt-4">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  Monthly Compliance Trends
                </CardTitle>
                <CardDescription>Compliance trends over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md mb-4">
                  <p className="text-muted-foreground">Trend chart visualization</p>
                </div>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <PieChart className="mr-2 h-5 w-5 text-primary" />
                  Compliance by Department
                </CardTitle>
                <CardDescription>Compliance breakdown by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md mb-4">
                  <p className="text-muted-foreground">Department chart visualization</p>
                </div>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="policy" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  Policy Status Report
                </CardTitle>
                <CardDescription>Status of all compliance policies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Active Policies</span>
                    <span className="font-medium">42</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Policies Due for Review</span>
                    <span className="font-medium">7</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Overdue Reviews</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Recently Updated</span>
                    <span className="font-medium">12</span>
                  </div>
                </div>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <BarChart className="mr-2 h-5 w-5 text-primary" />
                  Policy Compliance Report
                </CardTitle>
                <CardDescription>Staff compliance with policies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md mb-4">
                  <p className="text-muted-foreground">Policy compliance visualization</p>
                </div>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  Policy Review Schedule
                </CardTitle>
                <CardDescription>Upcoming policy reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Due This Month</span>
                    <span className="font-medium">4</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Due Next Month</span>
                    <span className="font-medium">7</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Due in 3 Months</span>
                    <span className="font-medium">12</span>
                  </div>
                </div>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Schedule
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <BarChart className="mr-2 h-5 w-5 text-primary" />
                  Training Completion Report
                </CardTitle>
                <CardDescription>Staff training completion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md mb-4">
                  <p className="text-muted-foreground">Training completion visualization</p>
                </div>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  Training Compliance by Role
                </CardTitle>
                <CardDescription>Training compliance by staff role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Care Managers</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Care Professionals</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Administrative Staff</span>
                    <span className="font-medium">95%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Support Staff</span>
                    <span className="font-medium">82%</span>
                  </div>
                </div>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  Training Due Report
                </CardTitle>
                <CardDescription>Upcoming training requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Due This Month</span>
                    <span className="font-medium">18</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Due Next Month</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Overdue</span>
                    <span className="font-medium">5</span>
                  </div>
                </div>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <PieChart className="mr-2 h-5 w-5 text-primary" />
                  Risk Assessment Status
                </CardTitle>
                <CardDescription>Status of all risk assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md mb-4">
                  <p className="text-muted-foreground">Risk status visualization</p>
                </div>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <BarChart className="mr-2 h-5 w-5 text-primary" />
                  Risk Level Distribution
                </CardTitle>
                <CardDescription>Distribution of risk levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>High Risk</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Medium Risk</span>
                    <span className="font-medium">28</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Low Risk</span>
                    <span className="font-medium">35</span>
                  </div>
                </div>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  Risk Mitigation Status
                </CardTitle>
                <CardDescription>Status of risk mitigation actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Completed</span>
                    <span className="font-medium">32</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>In Progress</span>
                    <span className="font-medium">18</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Not Started</span>
                    <span className="font-medium">7</span>
                  </div>
                </div>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>Create customized compliance reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Custom report builder functionality coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
