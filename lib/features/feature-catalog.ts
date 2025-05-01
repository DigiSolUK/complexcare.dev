export interface Feature {
  id: string
  name: string
  description: string
  category: FeatureCategory
  tier: FeatureTier
  price: number // Monthly price in GBP
  isCore: boolean // Core features are included in all plans
}

export enum FeatureCategory {
  CLINICAL = "clinical",
  ADMINISTRATIVE = "administrative",
  FINANCIAL = "financial",
  COMPLIANCE = "compliance",
  REPORTING = "reporting",
  AI = "ai",
  INTEGRATION = "integration",
}

export enum FeatureTier {
  ESSENTIAL = "essential",
  PROFESSIONAL = "professional",
  ENTERPRISE = "enterprise",
}

export interface FeaturePlan {
  id: string
  name: string
  description: string
  basePrice: number
  features: string[] // Array of feature IDs
}

// Define all available features
export const features: Feature[] = [
  // Clinical Features
  {
    id: "patient-management",
    name: "Patient Management",
    description: "Manage patient records, demographics, and medical history",
    category: FeatureCategory.CLINICAL,
    tier: FeatureTier.ESSENTIAL,
    price: 0, // Included in base price
    isCore: true,
  },
  {
    id: "care-plans",
    name: "Care Plans",
    description: "Create and manage personalized care plans for patients",
    category: FeatureCategory.CLINICAL,
    tier: FeatureTier.ESSENTIAL,
    price: 0, // Included in base price
    isCore: true,
  },
  {
    id: "medication-management",
    name: "Medication Management",
    description: "Track medications, dosages, and schedules",
    category: FeatureCategory.CLINICAL,
    tier: FeatureTier.ESSENTIAL,
    price: 0, // Included in base price
    isCore: true,
  },
  {
    id: "clinical-notes",
    name: "Clinical Notes",
    description: "Document patient encounters and clinical observations",
    category: FeatureCategory.CLINICAL,
    tier: FeatureTier.ESSENTIAL,
    price: 0, // Included in base price
    isCore: true,
  },
  {
    id: "advanced-care-planning",
    name: "Advanced Care Planning",
    description: "Create and manage advanced care directives and preferences",
    category: FeatureCategory.CLINICAL,
    tier: FeatureTier.PROFESSIONAL,
    price: 15,
    isCore: false,
  },
  {
    id: "clinical-decision-support",
    name: "Clinical Decision Support",
    description: "AI-powered clinical decision support tools",
    category: FeatureCategory.CLINICAL,
    tier: FeatureTier.ENTERPRISE,
    price: 35,
    isCore: false,
  },

  // Administrative Features
  {
    id: "appointment-scheduling",
    name: "Appointment Scheduling",
    description: "Schedule and manage patient appointments",
    category: FeatureCategory.ADMINISTRATIVE,
    tier: FeatureTier.ESSENTIAL,
    price: 0, // Included in base price
    isCore: true,
  },
  {
    id: "staff-management",
    name: "Staff Management",
    description: "Manage care professionals, credentials, and schedules",
    category: FeatureCategory.ADMINISTRATIVE,
    tier: FeatureTier.ESSENTIAL,
    price: 0, // Included in base price
    isCore: true,
  },
  {
    id: "document-management",
    name: "Document Management",
    description: "Store, organize, and share clinical documents",
    category: FeatureCategory.ADMINISTRATIVE,
    tier: FeatureTier.ESSENTIAL,
    price: 0, // Included in base price
    isCore: true,
  },
  {
    id: "task-management",
    name: "Task Management",
    description: "Assign and track tasks for staff members",
    category: FeatureCategory.ADMINISTRATIVE,
    tier: FeatureTier.PROFESSIONAL,
    price: 10,
    isCore: false,
  },
  {
    id: "advanced-scheduling",
    name: "Advanced Scheduling",
    description: "Complex scheduling rules, recurring appointments, and resource allocation",
    category: FeatureCategory.ADMINISTRATIVE,
    tier: FeatureTier.PROFESSIONAL,
    price: 15,
    isCore: false,
  },
  {
    id: "workflow-automation",
    name: "Workflow Automation",
    description: "Automate administrative workflows and processes",
    category: FeatureCategory.ADMINISTRATIVE,
    tier: FeatureTier.ENTERPRISE,
    price: 25,
    isCore: false,
  },

  // Financial Features
  {
    id: "invoicing",
    name: "Invoicing",
    description: "Create and manage invoices for services",
    category: FeatureCategory.FINANCIAL,
    tier: FeatureTier.ESSENTIAL,
    price: 0, // Included in base price
    isCore: true,
  },
  {
    id: "payment-tracking",
    name: "Payment Tracking",
    description: "Track payments and outstanding balances",
    category: FeatureCategory.FINANCIAL,
    tier: FeatureTier.ESSENTIAL,
    price: 0, // Included in base price
    isCore: true,
  },
  {
    id: "payroll-management",
    name: "Payroll Management",
    description: "Manage staff payroll and timesheets",
    category: FeatureCategory.FINANCIAL,
    tier: FeatureTier.PROFESSIONAL,
    price: 20,
    isCore: false,
  },
  {
    id: "financial-reporting",
    name: "Financial Reporting",
    description: "Generate financial reports and analytics",
    category: FeatureCategory.FINANCIAL,
    tier: FeatureTier.PROFESSIONAL,
    price: 15,
    isCore: false,
  },
  {
    id: "billing-integration",
    name: "Billing Integration",
    description: "Integrate with third-party billing systems",
    category: FeatureCategory.FINANCIAL,
    tier: FeatureTier.ENTERPRISE,
    price: 30,
    isCore: false,
  },

  // Compliance Features
  {
    id: "audit-logs",
    name: "Audit Logs",
    description: "Track system access and changes for compliance",
    category: FeatureCategory.COMPLIANCE,
    tier: FeatureTier.ESSENTIAL,
    price: 0, // Included in base price
    isCore: true,
  },
  {
    id: "credential-verification",
    name: "Credential Verification",
    description: "Verify and track staff credentials and certifications",
    category: FeatureCategory.COMPLIANCE,
    tier: FeatureTier.PROFESSIONAL,
    price: 15,
    isCore: false,
  },
  {
    id: "policy-management",
    name: "Policy Management",
    description: "Create and manage compliance policies and procedures",
    category: FeatureCategory.COMPLIANCE,
    tier: FeatureTier.PROFESSIONAL,
    price: 15,
    isCore: false,
  },
  {
    id: "risk-assessment",
    name: "Risk Assessment",
    description: "Conduct and document risk assessments",
    category: FeatureCategory.COMPLIANCE,
    tier: FeatureTier.ENTERPRISE,
    price: 25,
    isCore: false,
  },
  {
    id: "compliance-reporting",
    name: "Compliance Reporting",
    description: "Generate compliance reports for regulatory requirements",
    category: FeatureCategory.COMPLIANCE,
    tier: FeatureTier.ENTERPRISE,
    price: 25,
    isCore: false,
  },

  // Reporting Features
  {
    id: "basic-reporting",
    name: "Basic Reporting",
    description: "Generate basic operational reports",
    category: FeatureCategory.REPORTING,
    tier: FeatureTier.ESSENTIAL,
    price: 0, // Included in base price
    isCore: true,
  },
  {
    id: "advanced-analytics",
    name: "Advanced Analytics",
    description: "Advanced data analytics and visualization",
    category: FeatureCategory.REPORTING,
    tier: FeatureTier.PROFESSIONAL,
    price: 20,
    isCore: false,
  },
  {
    id: "custom-reports",
    name: "Custom Reports",
    description: "Create and save custom report templates",
    category: FeatureCategory.REPORTING,
    tier: FeatureTier.PROFESSIONAL,
    price: 15,
    isCore: false,
  },
  {
    id: "data-export",
    name: "Data Export",
    description: "Export data in various formats (CSV, Excel, PDF)",
    category: FeatureCategory.REPORTING,
    tier: FeatureTier.PROFESSIONAL,
    price: 10,
    isCore: false,
  },
  {
    id: "predictive-analytics",
    name: "Predictive Analytics",
    description: "AI-powered predictive analytics for patient outcomes",
    category: FeatureCategory.REPORTING,
    tier: FeatureTier.ENTERPRISE,
    price: 40,
    isCore: false,
  },

  // AI Features
  {
    id: "ai-clinical-notes",
    name: "AI Clinical Notes",
    description: "AI-assisted clinical note generation",
    category: FeatureCategory.AI,
    tier: FeatureTier.PROFESSIONAL,
    price: 25,
    isCore: false,
  },
  {
    id: "ai-care-planning",
    name: "AI Care Planning",
    description: "AI-assisted care plan generation",
    category: FeatureCategory.AI,
    tier: FeatureTier.PROFESSIONAL,
    price: 30,
    isCore: false,
  },
  {
    id: "ai-risk-stratification",
    name: "AI Risk Stratification",
    description: "AI-powered patient risk stratification",
    category: FeatureCategory.AI,
    tier: FeatureTier.ENTERPRISE,
    price: 35,
    isCore: false,
  },
  {
    id: "ai-medication-interaction",
    name: "AI Medication Interaction",
    description: "AI-powered medication interaction checking",
    category: FeatureCategory.AI,
    tier: FeatureTier.ENTERPRISE,
    price: 30,
    isCore: false,
  },

  // Integration Features
  {
    id: "api-access",
    name: "API Access",
    description: "Access to ComplexCare API for custom integrations",
    category: FeatureCategory.INTEGRATION,
    tier: FeatureTier.PROFESSIONAL,
    price: 20,
    isCore: false,
  },
  {
    id: "gp-connect",
    name: "GP Connect Integration",
    description: "Integration with GP Connect for patient data",
    category: FeatureCategory.INTEGRATION,
    tier: FeatureTier.ENTERPRISE,
    price: 35,
    isCore: false,
  },
  {
    id: "pharmacy-integration",
    name: "Pharmacy Integration",
    description: "Integration with pharmacy systems for medication management",
    category: FeatureCategory.INTEGRATION,
    tier: FeatureTier.ENTERPRISE,
    price: 30,
    isCore: false,
  },
  {
    id: "third-party-integrations",
    name: "Third-Party Integrations",
    description: "Integration with third-party healthcare systems",
    category: FeatureCategory.INTEGRATION,
    tier: FeatureTier.ENTERPRISE,
    price: 40,
    isCore: false,
  },
]

// Define standard feature plans
export const featurePlans: FeaturePlan[] = [
  {
    id: "essential",
    name: "Essential",
    description: "Core features for small care providers",
    basePrice: 99,
    features: features.filter((f) => f.tier === FeatureTier.ESSENTIAL || f.isCore).map((f) => f.id),
  },
  {
    id: "professional",
    name: "Professional",
    description: "Advanced features for growing care providers",
    basePrice: 199,
    features: features
      .filter((f) => f.tier === FeatureTier.ESSENTIAL || f.tier === FeatureTier.PROFESSIONAL || f.isCore)
      .map((f) => f.id),
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Comprehensive solution for large care organizations",
    basePrice: 399,
    features: features.map((f) => f.id), // All features
  },
]

// Helper functions
export function getFeatureById(id: string): Feature | undefined {
  return features.find((f) => f.id === id)
}

export function getFeaturesByCategory(category: FeatureCategory): Feature[] {
  return features.filter((f) => f.category === category)
}

export function getFeaturesByTier(tier: FeatureTier): Feature[] {
  return features.filter((f) => f.tier === tier)
}

export function getPlanById(id: string): FeaturePlan | undefined {
  return featurePlans.find((p) => p.id === id)
}

export function calculatePlanPrice(planId: string, additionalFeatures: string[] = []): number {
  const plan = getPlanById(planId)
  if (!plan) return 0

  let price = plan.basePrice

  // Add price of additional features not included in the plan
  additionalFeatures.forEach((featureId) => {
    if (!plan.features.includes(featureId)) {
      const feature = getFeatureById(featureId)
      if (feature) {
        price += feature.price
      }
    }
  })

  return price
}

export function calculateCustomPrice(selectedFeatures: string[]): number {
  // Start with a base price for core features
  let price = 75 // Base price for custom plan

  // Add price of selected features
  selectedFeatures.forEach((featureId) => {
    const feature = getFeatureById(featureId)
    if (feature && !feature.isCore) {
      price += feature.price
    }
  })

  return price
}
