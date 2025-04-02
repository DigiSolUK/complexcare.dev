import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getCareProfessionalById } from "@/lib/services/care-professional-service"
import { getCredentialById } from "@/lib/services/credential-service"
import { CredentialVerificationForm } from "@/components/care-professionals/credential-verification-form"
import { Skeleton } from "@/components/ui/skeleton"
import { getCurrentUser } from "@/lib/auth-utils"

export const dynamic = "force-dynamic"

interface CredentialVerificationPageProps {
  params: {
    id: string
    credentialId: string
  }
}

export default async function CredentialVerificationPage({ params }: CredentialVerificationPageProps) {
  const user = await getCurrentUser()
  if (!user) {
    return notFound()
  }

  const professional = await getCareProfessionalById(user.tenant_id, params.id)
  if (!professional) {
    return notFound()
  }

  const credential = await getCredentialById(user.tenant_id, params.credentialId)
  if (!credential) {
    return notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Verify Credential</h1>
        <p className="text-muted-foreground">
          Verify professional credential for {professional.first_name} {professional.last_name}
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <CredentialVerificationForm professional={professional} credential={credential} />
      </Suspense>
    </div>
  )
}

