import { tenantQuery, tenantInsert } from "@/lib/db-utils"

// Compliance Policy Type
export type CompliancePolicy = {
  id: string
  tenant_id: string
  title: string
  description: string | null
  content: string
  category: string
  version: string
  effective_date: string
  review_date: string | null
  last_reviewed_date: string | null
  status: "draft" | "active" | "archived"
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
}

// Training Type
export type ComplianceTraining = {
  id: string
  tenant_id: string
  title: string
  description: string | null
  content: string | null
  category: string
  duration_minutes: number | null
  frequency_months: number | null
  status: "active" | "inactive"
  required_for: string
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
}

// Risk Assessment Type
export type ComplianceRiskAssessment = {
  id: string
  tenant_id: string
  title: string
  description: string | null
  category: string
  risk_level: "Low" | "Medium" | "High"
  likelihood: number
  impact: number
  mitigation_plan: string | null
  status: "Identified" | "In Progress" | "Mitigated" | "Accepted"
  review_date: string | null
  identified_date: string
  assigned_to: string | null
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
}

// Audit Log Type
export type ComplianceAuditLog = {
  id: string
  tenant_id: string
  user_id: string | null
  action_type: string
  entity_type: string
  entity_id: string | null
  description: string
  ip_address: string | null
  user_agent: string | null
  created_at: string
  performed_by_name?: string
}

// Get all compliance policies
export async function getPolicies(tenantId: string): Promise<CompliancePolicy[]> {
  return tenantQuery<CompliancePolicy>(tenantId, `SELECT * FROM compliance_policies ORDER BY title`)
}

// Get all trainings
export async function getTrainings(tenantId: string): Promise<ComplianceTraining[]> {
  return tenantQuery<ComplianceTraining>(tenantId, `SELECT * FROM compliance_training ORDER BY title`)
}

// Get all risk assessments
export async function getRiskAssessments(tenantId: string): Promise<ComplianceRiskAssessment[]> {
  return tenantQuery<ComplianceRiskAssessment>(
    tenantId,
    `SELECT * FROM compliance_risk_assessments ORDER BY risk_level DESC, created_at DESC`,
  )
}

// Get audit logs
export async function getAuditLogs(tenantId: string, limit: number): Promise<ComplianceAuditLog[]> {
  const query = `
    SELECT 
      cal.*,
      u.name as performed_by_name
    FROM compliance_audit_logs cal
    LEFT JOIN users u ON cal.user_id = u.id
    WHERE cal.tenant_id = $1
    ORDER BY cal.created_at DESC
    LIMIT $2
  `
  return tenantQuery<ComplianceAuditLog>(tenantId, query, [tenantId, limit])
}

// Log audit event
export async function logAuditEvent(
  tenantId: string,
  auditData: Partial<ComplianceAuditLog>,
): Promise<ComplianceAuditLog> {
  const now = new Date().toISOString()
  const auditLogs = await tenantInsert<ComplianceAuditLog>("compliance_audit_logs", {
    ...auditData,
    tenant_id: tenantId,
    created_at: now,
  })
  return auditLogs[0]
}

// Create a new compliance policy
export async function createPolicy(
  tenantId: string,
  policyData: Omit<CompliancePolicy, "id" | "tenant_id" | "created_at" | "updated_at">,
  userId: string,
): Promise<CompliancePolicy> {
  const now = new Date().toISOString()
  const policies = await tenantInsert<CompliancePolicy>("compliance_policies", {
    ...policyData,
    tenant_id: tenantId,
    created_at: now,
    updated_at: now,
    created_by: userId,
    updated_by: userId,
  })
  return policies[0]
}

// Create a new compliance risk assessment
export async function createRiskAssessment(
  tenantId: string,
  riskAssessmentData: Omit<ComplianceRiskAssessment, "id" | "tenant_id" | "created_at" | "updated_at">,
  userId: string,
): Promise<ComplianceRiskAssessment> {
  const now = new Date().toISOString()
  const riskAssessments = await tenantInsert<ComplianceRiskAssessment>("compliance_risk_assessments", {
    ...riskAssessmentData,
    tenant_id: tenantId,
    created_at: now,
    updated_at: now,
    created_by: userId,
    updated_by: userId,
  })
  return riskAssessments[0]
}

