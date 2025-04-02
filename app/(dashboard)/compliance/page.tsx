import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CompliancePolicies } from "@/components/compliance/compliance-policies"
import { ComplianceTraining } from "@/components/compliance/compliance-training"
import { ComplianceRiskAssessment } from "@/components/compliance/compliance-risk-assessment"
import { ComplianceAuditLog } from "@/components/compliance/compliance-audit-log"
import { ComplianceReports } from "@/components/compliance/compliance-reports"
import { ComplianceCredentialChecks } from "@/components/compliance/compliance-credential-checks"

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Compliance</h1>
        <p className="text-muted-foreground mt-2">
          Manage compliance policies, training, risk assessments, and audit logs.
        </p>
      </div>
      <Tabs defaultValue="policies">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="credentials">Credential Checks</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="policies">
          <CompliancePolicies />
        </TabsContent>
        <TabsContent value="training">
          <ComplianceTraining />
        </TabsContent>
        <TabsContent value="risk">
          <ComplianceRiskAssessment />
        </TabsContent>
        <TabsContent value="audit">
          <ComplianceAuditLog />
        </TabsContent>
        <TabsContent value="credentials">
          <ComplianceCredentialChecks />
        </TabsContent>
        <TabsContent value="reports">
          <ComplianceReports />
        </TabsContent>
      </Tabs>
    </div>
  )
}

