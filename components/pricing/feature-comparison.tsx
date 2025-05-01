import { Check, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { featureCatalog } from "@/lib/features/feature-catalog"

interface PricingTier {
  id: string
  name: string
  includedFeatures: string[]
}

const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    includedFeatures: [
      "patient-management",
      "care-professional-profiles",
      "basic-scheduling",
      "document-storage",
      "standard-support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    includedFeatures: [
      "patient-management",
      "care-professional-profiles",
      "basic-scheduling",
      "document-storage",
      "standard-support",
      "advanced-scheduling",
      "medication-management",
      "care-plan-builder",
      "timesheet-management",
      "invoicing-billing",
      "priority-support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    includedFeatures: [
      "patient-management",
      "care-professional-profiles",
      "basic-scheduling",
      "document-storage",
      "standard-support",
      "advanced-scheduling",
      "medication-management",
      "care-plan-builder",
      "timesheet-management",
      "invoicing-billing",
      "priority-support",
      "multi-tenant-management",
      "advanced-analytics",
      "custom-integrations",
      "compliance-management",
      "white-labeling",
      "dedicated-account-manager",
    ],
  },
]

export function FeatureComparison() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Feature</TableHead>
            {pricingTiers.map((tier) => (
              <TableHead key={tier.id} className="text-center">
                {tier.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.values(featureCatalog).map((category) => (
            <>
              <TableRow key={category.id} className="bg-muted/50">
                <TableCell colSpan={4} className="font-medium">
                  {category.name}
                </TableCell>
              </TableRow>
              {category.features.map((feature) => (
                <TableRow key={feature.id}>
                  <TableCell className="font-medium">{feature.name}</TableCell>
                  {pricingTiers.map((tier) => (
                    <TableCell key={`${tier.id}-${feature.id}`} className="text-center">
                      {tier.includedFeatures.includes(feature.id) ? (
                        <Check className="h-4 w-4 mx-auto text-green-500" />
                      ) : (
                        <X className="h-4 w-4 mx-auto text-muted-foreground" />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
