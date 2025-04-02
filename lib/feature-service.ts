import { neon } from "@neondatabase/serverless"
import { getTenantId } from "../tenant-utils"
import { getTenantPricingTier } from "./pricing-service"

export type FeatureCategory = "clinical" | "operations" | "finance" | "reporting" | "integrations" | "system"

export type Feature = {
  key: string
  name: string
  description: string
  category: FeatureCategory
  defaultEnabled: boolean
  enabled?: boolean // Optional property to hold the current enabled state
}

// Add these exports at the top of the file, after the existing imports
export const AVAILABLE_FEATURES = {
  PATIENT_MANAGEMENT: {
    key: "patient_management",
    name: "Patient Management",
    description: "Core patient record management",
    category: "clinical",
    defaultEnabled: true,
  },
  MEDICATION_MANAGEMENT: {
    key: "medication_management",
    name: "Medication Management",
    description: "Track and manage patient medications",
    category: "clinical",
    defaultEnabled: true,
  },
  CARE_PLAN_MANAGEMENT: {
    key: "care_plan_management",
    name: "Care Plan Management",
    description: "Create and manage patient care plans",
    category: "clinical",
    defaultEnabled: true,
  },
  RISK_ASSESSMENT: {
    key: "risk_assessment",
    name: "Risk Assessment",
    description: "Conduct and track patient risk assessments",
    category: "clinical",
    defaultEnabled: false,
  },
  CARE_PROFESSIONAL_MANAGEMENT: {
    key: "care_professional_management",
    name: "Care Professional Management",
    description: "Manage care staff and professionals",
    category: "operations",
    defaultEnabled: true,
  },
  BASIC_SCHEDULING: {
    key: "basic_scheduling",
    name: "Basic Scheduling",
    description: "Schedule care visits and appointments",
    category: "operations",
    defaultEnabled: true,
  },
  ADVANCED_SCHEDULING: {
    key: "advanced_scheduling",
    name: "Advanced Scheduling",
    description: "Advanced scheduling with recurring visits and conflict detection",
    category: "operations",
    defaultEnabled: false,
  },
  DOCUMENT_MANAGEMENT: {
    key: "document_management",
    name: "Document Management",
    description: "Upload and manage patient documents",
    category: "operations",
    defaultEnabled: true,
  },
  TIMESHEET_MANAGEMENT: {
    key: "timesheet_management",
    name: "Timesheet Management",
    description: "Track and approve staff timesheets",
    category: "operations",
    defaultEnabled: false,
  },
  CUSTOM_FORMS: {
    key: "custom_forms",
    name: "Custom Forms",
    description: "Create and use custom forms for assessments",
    category: "operations",
    defaultEnabled: false,
  },
  MULTI_LOCATION: {
    key: "multi_location",
    name: "Multi-Location Support",
    description: "Support for multiple care locations",
    category: "operations",
    defaultEnabled: false,
  },
  BASIC_INVOICING: {
    key: "basic_invoicing",
    name: "Basic Invoicing",
    description: "Generate simple invoices for care services",
    category: "finance",
    defaultEnabled: false,
  },
  ADVANCED_INVOICING: {
    key: "advanced_invoicing",
    name: "Advanced Invoicing",
    description: "Comprehensive invoicing with customization",
    category: "finance",
    defaultEnabled: false,
  },
  BASIC_REPORTING: {
    key: "basic_reporting",
    name: "Basic Reporting",
    description: "Standard reports for care delivery",
    category: "reporting",
    defaultEnabled: true,
  },
  ADVANCED_REPORTING: {
    key: "advanced_reporting",
    name: "Advanced Reporting",
    description: "Custom and advanced analytics",
    category: "reporting",
    defaultEnabled: false,
  },
  AUDIT_TRAIL: {
    key: "audit_trail",
    name: "Audit Trail",
    description: "Comprehensive audit logging",
    category: "reporting",
    defaultEnabled: false,
  },
  GP_CONNECT: {
    key: "gp_connect",
    name: "GP Connect Integration",
    description: "Integration with GP Connect for patient records",
    category: "integrations",
    defaultEnabled: false,
  },
  API_ACCESS: {
    key: "api_access",
    name: "API Access",
    description: "Access to the ComplexCare API",
    category: "integrations",
    defaultEnabled: false,
  },
  WHITE_LABELING: {
    key: "white_labeling",
    name: "White Labeling",
    description: "Customize branding and appearance",
    category: "system",
    defaultEnabled: false,
  },
  DEDICATED_SUPPORT: {
    key: "dedicated_support",
    name: "Dedicated Support",
    description: "Priority support with dedicated account manager",
    category: "system",
    defaultEnabled: false,
  },
}

export const featuresList: Feature[] = [
  // Clinical features
  {
    key: "patient_management",
    name: "Patient Management",
    description: "Core patient record management",
    category: "clinical",
    defaultEnabled: true,
  },
  {
    key: "medication_management",
    name: "Medication Management",
    description: "Track and manage patient medications",
    category: "clinical",
    defaultEnabled: true,
  },
  {
    key: "care_plan_management",
    name: "Care Plan Management",
    description: "Create and manage patient care plans",
    category: "clinical",
    defaultEnabled: true,
  },
  {
    key: "risk_assessment",
    name: "Risk Assessment",
    description: "Conduct and track patient risk assessments",
    category: "clinical",
    defaultEnabled: false,
  },

  // Operations features
  {
    key: "care_professional_management",
    name: "Care Professional Management",
    description: "Manage care staff and professionals",
    category: "operations",
    defaultEnabled: true,
  },
  {
    key: "basic_scheduling",
    name: "Basic Scheduling",
    description: "Schedule care visits and appointments",
    category: "operations",
    defaultEnabled: true,
  },
  {
    key: "advanced_scheduling",
    name: "Advanced Scheduling",
    description: "Advanced scheduling with recurring visits and conflict detection",
    category: "operations",
    defaultEnabled: false,
  },
  {
    key: "document_management",
    name: "Document Management",
    description: "Upload and manage patient documents",
    category: "operations",
    defaultEnabled: true,
  },
  {
    key: "timesheet_management",
    name: "Timesheet Management",
    description: "Track and approve staff timesheets",
    category: "operations",
    defaultEnabled: false,
  },
  {
    key: "custom_forms",
    name: "Custom Forms",
    description: "Create and use custom forms for assessments",
    category: "operations",
    defaultEnabled: false,
  },
  {
    key: "multi_location",
    name: "Multi-Location Support",
    description: "Support for multiple care locations",
    category: "operations",
    defaultEnabled: false,
  },

  // Finance features
  {
    key: "basic_invoicing",
    name: "Basic Invoicing",
    description: "Generate simple invoices for care services",
    category: "finance",
    defaultEnabled: false,
  },
  {
    key: "advanced_invoicing",
    name: "Advanced Invoicing",
    description: "Comprehensive invoicing with customization",
    category: "finance",
    defaultEnabled: false,
  },

  // Reporting features
  {
    key: "basic_reporting",
    name: "Basic Reporting",
    description: "Standard reports for care delivery",
    category: "reporting",
    defaultEnabled: true,
  },
  {
    key: "advanced_reporting",
    name: "Advanced Reporting",
    description: "Custom and advanced analytics",
    category: "reporting",
    defaultEnabled: false,
  },
  {
    key: "audit_trail",
    name: "Audit Trail",
    description: "Comprehensive audit logging",
    category: "reporting",
    defaultEnabled: false,
  },

  // Integrations features
  {
    key: "gp_connect",
    name: "GP Connect Integration",
    description: "Integration with GP Connect for patient records",
    category: "integrations",
    defaultEnabled: false,
  },
  {
    key: "api_access",
    name: "API Access",
    description: "Access to the ComplexCare API",
    category: "integrations",
    defaultEnabled: false,
  },

  // System features
  {
    key: "white_labeling",
    name: "White Labeling",
    description: "Customize branding and appearance",
    category: "system",
    defaultEnabled: false,
  },
  {
    key: "dedicated_support",
    name: "Dedicated Support",
    description: "Priority support with dedicated account manager",
    category: "system",
    defaultEnabled: false,
  },
]

export const featureMap = featuresList.reduce(
  (acc, feature) => {
    acc[feature.key] = feature
    return acc
  },
  {} as Record<string, Feature>,
)

export async function getEnabledFeatures() {
  try {
    const tenantId = await getTenantId()
    if (!tenantId) throw new Error("Tenant ID not found")

    const sql = neon(process.env.DATABASE_URL)
    const result = await sql`
      SELECT feature_key, is_enabled
      FROM tenant_features
      WHERE tenant_id = ${tenantId}
    `

    // Convert to a map for easy lookup
    const enabledFeaturesMap = result.reduce(
      (acc, row) => {
        acc[row.feature_key] = row.is_enabled
        return acc
      },
      {} as Record<string, boolean>,
    )

    // Get pricing tier features
    const pricingTier = await getTenantPricingTier()
    const tierFeatures = pricingTier.features

    // Combine explicitly enabled features with pricing tier features
    return featuresList.map((feature) => {
      // If feature is explicitly set in tenant_features, use that value
      if (enabledFeaturesMap[feature.key] !== undefined) {
        return {
          ...feature,
          enabled: enabledFeaturesMap[feature.key],
        }
      }

      // If feature is included in pricing tier, enable it
      if (tierFeatures.includes(feature.key)) {
        return {
          ...feature,
          enabled: true,
        }
      }

      // Otherwise, use default value
      return {
        ...feature,
        enabled: feature.defaultEnabled,
      }
    })
  } catch (error) {
    console.error("Error fetching enabled features:", error)
    // Fallback to default values
    return featuresList.map((feature) => ({
      ...feature,
      enabled: feature.defaultEnabled,
    }))
  }
}

export async function updateFeatureStatus(featureKey: string, isEnabled: boolean) {
  try {
    const tenantId = await getTenantId()
    if (!tenantId) throw new Error("Tenant ID not found")

    const sql = neon(process.env.DATABASE_URL)

    // Check if feature exists
    const feature = featuresList.find((f) => f.key === featureKey)
    if (!feature) {
      throw new Error(`Feature ${featureKey} not found`)
    }

    // Check if feature is already in the database
    const existingFeature = await sql`
      SELECT * FROM tenant_features
      WHERE tenant_id = ${tenantId} AND feature_key = ${featureKey}
    `

    if (existingFeature.length > 0) {
      // Update existing feature
      await sql`
        UPDATE tenant_features
        SET is_enabled = ${isEnabled}
        WHERE tenant_id = ${tenantId} AND feature_key = ${featureKey}
      `
    } else {
      // Insert new feature
      await sql`
        INSERT INTO tenant_features (tenant_id, feature_key, is_enabled)
        VALUES (${tenantId}, ${featureKey}, ${isEnabled})
      `
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating feature status:", error)
    return { success: false, error: (error as Error).message }
  }
}

// Add these functions at the end of the file

export interface FeaturesByCategory {
  [category: string]: Feature[]
}

export async function getAllFeaturesWithStatus(tenantId: string): Promise<Feature[]> {
  try {
    // Get all tenant features from the database
    const sql = neon(process.env.DATABASE_URL)
    const result = await sql`
      SELECT feature_key, is_enabled
      FROM tenant_features
      WHERE tenant_id = ${tenantId}
    `

    // Create a map of feature keys to their enabled status
    const featureStatusMap = new Map<string, boolean>()

    result.forEach((feature) => {
      featureStatusMap.set(feature.feature_key, feature.is_enabled)
    })

    // Get pricing tier features
    const pricingTier = await getTenantPricingTier()
    const tierFeatures = pricingTier.features

    // Map available features to include their enabled status
    return featuresList.map((feature) => {
      // If feature is explicitly set in tenant_features, use that value
      if (featureStatusMap.has(feature.key)) {
        return {
          ...feature,
          enabled: featureStatusMap.get(feature.key)!,
        }
      }

      // If feature is included in pricing tier, enable it
      if (tierFeatures.includes(feature.key)) {
        return {
          ...feature,
          enabled: true,
        }
      }

      // Otherwise, use default value
      return {
        ...feature,
        enabled: feature.defaultEnabled,
      }
    })
  } catch (error) {
    console.error("Error getting all features with status:", error)

    // In case of error, return available features with their default values
    return featuresList.map((feature) => ({
      ...feature,
      enabled: feature.defaultEnabled,
    }))
  }
}

export function groupFeaturesByCategory(features: Feature[]): FeaturesByCategory {
  return features.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = []
    }
    acc[feature.category].push(feature)
    return acc
  }, {} as FeaturesByCategory)
}

export async function updateTenantFeature(
  tenantId: string,
  featureKey: string,
  isEnabled: boolean,
  config?: Record<string, any>,
): Promise<any> {
  try {
    const sql = neon(process.env.DATABASE_URL)

    // Check if feature exists
    const feature = featuresList.find((f) => f.key === featureKey)
    if (!feature) {
      throw new Error(`Feature ${featureKey} not found`)
    }

    // Check if feature is already in the database
    const existingFeature = await sql`
      SELECT * FROM tenant_features
      WHERE tenant_id = ${tenantId} AND feature_key = ${featureKey}
    `

    if (existingFeature.length > 0) {
      // Update existing feature
      if (config) {
        return await sql`
          UPDATE tenant_features
          SET is_enabled = ${isEnabled}, config = ${JSON.stringify(config)}
          WHERE tenant_id = ${tenantId} AND feature_key = ${featureKey}
          RETURNING *
        `
      } else {
        return await sql`
          UPDATE tenant_features
          SET is_enabled = ${isEnabled}
          WHERE tenant_id = ${tenantId} AND feature_key = ${featureKey}
          RETURNING *
        `
      }
    } else {
      // Insert new feature
      if (config) {
        return await sql`
          INSERT INTO tenant_features (tenant_id, feature_key, is_enabled, config)
          VALUES (${tenantId}, ${featureKey}, ${isEnabled}, ${JSON.stringify(config)})
          RETURNING *
        `
      } else {
        return await sql`
          INSERT INTO tenant_features (tenant_id, feature_key, is_enabled)
          VALUES (${tenantId}, ${featureKey}, ${isEnabled})
          RETURNING *
        `
      }
    }
  } catch (error) {
    console.error(`Error updating tenant feature ${featureKey}:`, error)
    throw error
  }
}

