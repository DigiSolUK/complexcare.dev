export type PricingTier = {
  id: string
  name: string
  description: string
  monthlyPrice: number
  annualPrice: number
  features: string[]
  isPopular: boolean
  isCustom: boolean
}

// Default pricing tiers
export const defaultPricingTiers: PricingTier[] = [
  {
    id: "basic",
    name: "Basic",
    description: "Essential care management features for small agencies",
    monthlyPrice: 99,
    annualPrice: 990,
    features: [
      "patient_management",
      "care_professional_management",
      "basic_scheduling",
      "basic_reporting",
      "document_management",
    ],
    isPopular: false,
    isCustom: false,
  },
  {
    id: "standard",
    name: "Standard",
    description: "Advanced features for growing care providers",
    monthlyPrice: 199,
    annualPrice: 1990,
    features: [
      "patient_management",
      "care_professional_management",
      "advanced_scheduling",
      "basic_reporting",
      "document_management",
      "medication_management",
      "care_plan_management",
      "basic_invoicing",
      "timesheet_management",
    ],
    isPopular: true,
    isCustom: false,
  },
  {
    id: "premium",
    name: "Premium",
    description: "Comprehensive solution for established care organizations",
    monthlyPrice: 349,
    annualPrice: 3490,
    features: [
      "patient_management",
      "care_professional_management",
      "advanced_scheduling",
      "advanced_reporting",
      "document_management",
      "medication_management",
      "care_plan_management",
      "advanced_invoicing",
      "timesheet_management",
      "gp_connect",
      "risk_assessment",
      "audit_trail",
      "custom_forms",
    ],
    isPopular: false,
    isCustom: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Tailored solutions for large healthcare providers",
    monthlyPrice: 599,
    annualPrice: 5990,
    features: [
      "patient_management",
      "care_professional_management",
      "advanced_scheduling",
      "advanced_reporting",
      "document_management",
      "medication_management",
      "care_plan_management",
      "advanced_invoicing",
      "timesheet_management",
      "gp_connect",
      "risk_assessment",
      "audit_trail",
      "custom_forms",
      "api_access",
      "white_labeling",
      "dedicated_support",
      "multi_location",
    ],
    isPopular: false,
    isCustom: false,
  },
  {
    id: "custom",
    name: "Custom",
    description: "Bespoke solution tailored to your specific requirements",
    monthlyPrice: 0,
    annualPrice: 0,
    features: [],
    isPopular: false,
    isCustom: true,
  },
]

// Function to get all pricing tiers
export async function getPricingTiers(): Promise<PricingTier[]> {
  try {
    // In a real implementation, this would fetch from a database
    return defaultPricingTiers
  } catch (error) {
    console.error("Error fetching pricing tiers:", error)
    return defaultPricingTiers
  }
}

// Function to get tenant pricing tier
export async function getTenantPricingTier(): Promise<PricingTier> {
  try {
    // In a real implementation, this would fetch the tenant's pricing tier from a database
    // For now, return the standard tier as a default
    return defaultPricingTiers[1] // Standard tier
  } catch (error) {
    console.error("Error fetching tenant pricing tier:", error)
    return defaultPricingTiers[0] // Basic tier as fallback
  }
}

// Function to update tenant pricing tier
export async function updateTenantPricingTier(tierId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // In a real implementation, this would update the tenant's pricing tier in a database
    console.log(`Updating tenant pricing tier to ${tierId}`)
    return { success: true }
  } catch (error) {
    console.error("Error updating tenant pricing tier:", error)
    return { success: false, error: (error as Error).message }
  }
}

// Function to create a custom pricing tier
export async function createCustomPricingTier(
  name: string,
  description: string,
  monthlyPrice: number,
  annualPrice: number,
  features: string[],
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    // In a real implementation, this would create a custom pricing tier in a database
    console.log(`Creating custom pricing tier: ${name}`)
    return { success: true, id: `custom_${Date.now()}` }
  } catch (error) {
    console.error("Error creating custom pricing tier:", error)
    return { success: false, error: (error as Error).message }
  }
}

// Function to get features by category
export const getFeaturesByCategory = () => {
  // This function would ideally fetch feature categories from a database or API
  // For now, we'll use a hardcoded map
  return {
    clinical: [
      { key: "patient_management", name: "Patient Management" },
      { key: "medication_management", name: "Medication Management" },
      { key: "care_plan_management", name: "Care Plan Management" },
      { key: "risk_assessment", name: "Risk Assessment" },
    ],
    operations: [
      { key: "care_professional_management", name: "Care Professional Management" },
      { key: "basic_scheduling", name: "Basic Scheduling" },
      { key: "advanced_scheduling", name: "Advanced Scheduling" },
      { key: "document_management", name: "Document Management" },
      { key: "timesheet_management", name: "Timesheet Management" },
      { key: "custom_forms", name: "Custom Forms" },
      { key: "multi_location", name: "Multi-Location Support" },
    ],
    finance: [
      { key: "basic_invoicing", name: "Basic Invoicing" },
      { key: "advanced_invoicing", name: "Advanced Invoicing" },
    ],
    reporting: [
      { key: "basic_reporting", name: "Basic Reporting" },
      { key: "advanced_reporting", name: "Advanced Reporting" },
      { key: "audit_trail", name: "Audit Trail" },
    ],
    integrations: [
      { key: "gp_connect", name: "GP Connect Integration" },
      { key: "api_access", name: "API Access" },
    ],
    system: [
      { key: "white_labeling", name: "White Labeling" },
      { key: "dedicated_support", name: "Dedicated Support" },
    ],
  }
}

// Define feature categories type for TypeScript
export type FeatureCategory = "clinical" | "operations" | "finance" | "reporting" | "integrations" | "system"

// Define feature list for reference
export const featuresList = [
  { key: "patient_management", name: "Patient Management", category: "clinical" as FeatureCategory },
  { key: "medication_management", name: "Medication Management", category: "clinical" as FeatureCategory },
  { key: "care_plan_management", name: "Care Plan Management", category: "clinical" as FeatureCategory },
  { key: "risk_assessment", name: "Risk Assessment", category: "clinical" as FeatureCategory },
  {
    key: "care_professional_management",
    name: "Care Professional Management",
    category: "operations" as FeatureCategory,
  },
  { key: "basic_scheduling", name: "Basic Scheduling", category: "operations" as FeatureCategory },
  { key: "advanced_scheduling", name: "Advanced Scheduling", category: "operations" as FeatureCategory },
  { key: "document_management", name: "Document Management", category: "operations" as FeatureCategory },
  { key: "timesheet_management", name: "Timesheet Management", category: "operations" as FeatureCategory },
  { key: "custom_forms", name: "Custom Forms", category: "operations" as FeatureCategory },
  { key: "multi_location", name: "Multi-Location Support", category: "operations" as FeatureCategory },
  { key: "basic_invoicing", name: "Basic Invoicing", category: "finance" as FeatureCategory },
  { key: "advanced_invoicing", name: "Advanced Invoicing", category: "finance" as FeatureCategory },
  { key: "basic_reporting", name: "Basic Reporting", category: "reporting" as FeatureCategory },
  { key: "advanced_reporting", name: "Advanced Reporting", category: "reporting" as FeatureCategory },
  { key: "audit_trail", name: "Audit Trail", category: "reporting" as FeatureCategory },
  { key: "gp_connect", name: "GP Connect Integration", category: "integrations" as FeatureCategory },
  { key: "api_access", name: "API Access", category: "integrations" as FeatureCategory },
  { key: "white_labeling", name: "White Labeling", category: "system" as FeatureCategory },
  { key: "dedicated_support", name: "Dedicated Support", category: "system" as FeatureCategory },
]

