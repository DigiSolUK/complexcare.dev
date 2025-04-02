import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"
import { featuresList } from "@/lib/services/feature-service"

// Define the Feature and FeaturesByCategory types locally to avoid import issues
interface Feature {
  key: string
  name: string
  description: string
  category: string
  defaultEnabled: boolean
  isEnabled?: boolean
  config?: Record<string, any>
}

interface FeaturesByCategory {
  [category: string]: Feature[]
}

// Function to group features by category
function groupFeaturesByCategory(features: Feature[]): FeaturesByCategory {
  return features.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = []
    }
    acc[feature.category].push(feature)
    return acc
  }, {} as FeaturesByCategory)
}

// Function to get all features with their status
async function getAllFeaturesWithStatus(tenantId: string): Promise<Feature[]> {
  try {
    const sql = neon(process.env.DATABASE_URL || "")
    const result = await sql`
      SELECT feature_key, is_enabled, config
      FROM tenant_features
      WHERE tenant_id = ${tenantId}
    `

    // Create a map of feature keys to their enabled status
    const featureStatusMap = new Map<string, boolean>()
    const featureConfigMap = new Map<string, Record<string, any>>()

    result.forEach((feature) => {
      featureStatusMap.set(feature.feature_key, feature.is_enabled)
      if (feature.config) {
        try {
          const config = typeof feature.config === "string" ? JSON.parse(feature.config) : feature.config
          featureConfigMap.set(feature.feature_key, config)
        } catch (e) {
          console.error(`Error parsing config for feature ${feature.feature_key}:`, e)
        }
      }
    })

    // Map available features to include their enabled status
    return featuresList.map((feature) => ({
      ...feature,
      isEnabled: featureStatusMap.has(feature.key) ? featureStatusMap.get(feature.key)! : feature.defaultEnabled,
      config: featureConfigMap.has(feature.key) ? featureConfigMap.get(feature.key)! : undefined,
    }))
  } catch (error) {
    console.error("Error getting all features with status:", error)

    // In case of error, return available features with their default values
    return featuresList.map((feature) => ({
      ...feature,
      isEnabled: feature.defaultEnabled,
    }))
  }
}

// Function to update a tenant feature
async function updateTenantFeature(
  tenantId: string,
  featureKey: string,
  isEnabled: boolean,
  config?: Record<string, any>,
): Promise<any> {
  try {
    const sql = neon(process.env.DATABASE_URL || "")

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

/**
 * GET /api/tenant/features
 * Returns all features for the current tenant with their enabled status
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = session.user.tenant_id

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID not found" }, { status: 400 })
    }

    const features = await getAllFeaturesWithStatus(tenantId)
    const featuresByCategory = groupFeaturesByCategory(features)

    return NextResponse.json({
      features,
      featuresByCategory,
    })
  } catch (error) {
    console.error("Error fetching tenant features:", error)

    // Return default features on error
    const defaultFeatures = featuresList.map((feature) => ({
      ...feature,
      isEnabled: feature.defaultEnabled,
    }))

    return NextResponse.json({
      features: defaultFeatures,
      featuresByCategory: groupFeaturesByCategory(defaultFeatures),
      error: "Error fetching features, using defaults",
    })
  }
}

/**
 * PATCH /api/tenant/features
 * Updates a feature for the current tenant
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tenantId = session.user.tenant_id

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID not found" }, { status: 400 })
    }

    const { featureKey, isEnabled, config } = await req.json()

    if (!featureKey) {
      return NextResponse.json({ error: "Feature key is required" }, { status: 400 })
    }

    if (typeof isEnabled !== "boolean") {
      return NextResponse.json({ error: "isEnabled must be a boolean" }, { status: 400 })
    }

    const updatedFeature = await updateTenantFeature(tenantId, featureKey, isEnabled, config)

    return NextResponse.json({
      success: true,
      feature: updatedFeature,
    })
  } catch (error) {
    console.error("Error updating tenant feature:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update tenant feature",
        message: (error as Error).message,
      },
      { status: 500 },
    )
  }
}

