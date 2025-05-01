import { sql } from "@/lib/db"
import { z } from "zod"
import { getDefaultTenantId } from "@/lib/tenant"

// Schema for tenant features
const tenantFeatureSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  featureId: z.string(),
  enabled: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type TenantFeature = z.infer<typeof tenantFeatureSchema>

// Schema for feature selection
const featureSelectionSchema = z.object({
  tenantId: z.string().uuid().optional(),
  features: z.array(z.string()),
})

export type FeatureSelection = z.infer<typeof featureSelectionSchema>

export async function getTenantFeatures(tenantId: string = getDefaultTenantId()) {
  try {
    const result = await sql`
      SELECT * FROM tenant_features
      WHERE tenant_id = ${tenantId}
    `

    return result.rows.map((row) => ({
      id: row.id,
      tenantId: row.tenant_id,
      featureId: row.feature_id,
      enabled: row.enabled,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }))
  } catch (error) {
    console.error("Error fetching tenant features:", error)
    return []
  }
}

export async function updateTenantFeatures(selection: FeatureSelection) {
  const tenantId = selection.tenantId || getDefaultTenantId()

  try {
    // First, disable all features for this tenant
    await sql`
      UPDATE tenant_features
      SET enabled = false, updated_at = NOW()
      WHERE tenant_id = ${tenantId}
    `

    // Then enable the selected features
    for (const featureId of selection.features) {
      // Check if the feature exists for this tenant
      const existingFeature = await sql`
        SELECT * FROM tenant_features
        WHERE tenant_id = ${tenantId} AND feature_id = ${featureId}
      `

      if (existingFeature.rows.length > 0) {
        // Update existing feature
        await sql`
          UPDATE tenant_features
          SET enabled = true, updated_at = NOW()
          WHERE tenant_id = ${tenantId} AND feature_id = ${featureId}
        `
      } else {
        // Insert new feature
        await sql`
          INSERT INTO tenant_features (tenant_id, feature_id, enabled, created_at, updated_at)
          VALUES (${tenantId}, ${featureId}, true, NOW(), NOW())
        `
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating tenant features:", error)
    return { success: false, error: "Failed to update tenant features" }
  }
}

export async function isTenantFeatureEnabled(featureId: string, tenantId: string = getDefaultTenantId()) {
  try {
    const result = await sql`
      SELECT enabled FROM tenant_features
      WHERE tenant_id = ${tenantId} AND feature_id = ${featureId}
    `

    if (result.rows.length === 0) {
      return false
    }

    return result.rows[0].enabled
  } catch (error) {
    console.error("Error checking tenant feature:", error)
    return false
  }
}
