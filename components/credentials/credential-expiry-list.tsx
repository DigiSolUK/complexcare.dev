import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import type { ProfessionalCredential } from "@/types"

interface CredentialExpiryListProps {
  credentials: ProfessionalCredential[]
}

export function CredentialExpiryList({ credentials }: CredentialExpiryListProps) {
  const getCredentialTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      nmc_pin: "NMC PIN",
      dbs_check: "DBS Check",
      qualification: "Qualification",
      training: "Training Certificate",
      insurance: "Professional Insurance",
      license: "Professional License",
      certification: "Professional Certification",
      other: "Other Credential",
    }
    return typeMap[type] || type
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    return Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getExpiryBadge = (expiryDate: string) => {
    const daysLeft = getDaysUntilExpiry(expiryDate)

    if (daysLeft <= 7) {
      return <Badge variant="destructive">Urgent</Badge>
    } else if (daysLeft <= 30) {
      return (
        <Badge variant="outline" className="bg-amber-100 text-amber-800">
          Soon
        </Badge>
      )
    } else {
      return <Badge variant="outline">Upcoming</Badge>
    }
  }

  // Sort by expiry date (soonest first)
  const sortedCredentials = [...credentials].sort((a, b) => {
    if (!a.expiry_date) return 1
    if (!b.expiry_date) return -1
    return new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime()
  })

  return (
    <div className="space-y-2">
      {sortedCredentials.map((credential) => (
        <div key={credential.id} className="flex items-center justify-between border-b pb-2 last:border-0">
          <div>
            <p className="text-sm font-medium">{getCredentialTypeLabel(credential.credential_type)}</p>
            <p className="text-xs text-muted-foreground flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {credential.expiry_date ? formatDate(credential.expiry_date) : "No expiry"}
            </p>
          </div>
          {credential.expiry_date && getExpiryBadge(credential.expiry_date)}
        </div>
      ))}
    </div>
  )
}
