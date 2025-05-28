import { redirect } from "next/navigation"

export default function OnboardingIndexPage({ params }: { params: { tenantId: string } }) {
  redirect(`/onboarding/${params.tenantId}/welcome`)
}
