import type { NeonDatabase } from "@neondatabase/serverless"

export async function up(sql: NeonDatabase): Promise<void> {
  // Create audit_logs table
  await sql`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL,
      user_id UUID NOT NULL,
      action VARCHAR(100) NOT NULL,
      entity_type VARCHAR(50) NOT NULL,
      entity_id UUID,
      changes JSONB,
      ip_address INET,
      user_agent TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `

  // Add indexes for performance
  await sql`
    CREATE INDEX idx_audit_logs_tenant_id ON audit_logs(tenant_id);
    CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
    CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
    CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
  `
}

export async function down(sql: NeonDatabase): Promise<void> {
  // Drop the table (this will also drop all indexes)
  await sql`
    DROP TABLE IF EXISTS audit_logs
  `
}
