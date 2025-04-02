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

