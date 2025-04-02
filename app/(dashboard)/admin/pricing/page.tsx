import { getTenantPricingTier } from "@/lib/services/pricing-service"
import { PricingManagement } from "@/components/admin/pricing-management"

// Make this route dynamic to allow server-side features like cookies
export const dynamic = "force-dynamic"

export default async function AdminPricingPage() {
  let currentTier = { id: "default" }

  try {
    currentTier = await getTenantPricingTier()
  } catch (error) {
    console.error("Error loading pricing tier:", error)
    // Continue with default tier
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Pricing Management</h1>
      <PricingManagement currentTierId={currentTier.id} />
    </div>
  )
}

