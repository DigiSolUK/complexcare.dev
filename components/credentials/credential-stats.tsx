import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Clock, Award, XCircle } from "lucide-react"

interface CredentialStatsProps {
  stats: {
    total: number
    verified: number
    pending: number
    rejected: number
    expired: number
  }
}

export function CredentialStats({ stats }: CredentialStatsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Award className="h-5 w-5 text-primary mb-1" />
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <CheckCircle className="h-5 w-5 text-green-600 mb-1" />
            <p className="text-2xl font-bold">{stats.verified}</p>
            <p className="text-xs text-muted-foreground">Verified</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Clock className="h-5 w-5 text-amber-600 mb-1" />
            <p className="text-2xl font-bold">{stats.pending}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <XCircle className="h-5 w-5 text-red-600 mb-1" />
            <p className="text-2xl font-bold">{stats.rejected + stats.expired}</p>
            <p className="text-xs text-muted-foreground">Issues</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
