import { Suspense } from "react"
import { PayrollProvidersContent } from "./payroll-providers-content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function PayrollProvidersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payroll Providers</h1>
        <p className="text-muted-foreground mt-2">Manage your payroll provider integrations and settings.</p>
      </div>

      <Suspense fallback={<PayrollProvidersSkeleton />}>
        <PayrollProvidersContent />
      </Suspense>
    </div>
  )
}

function PayrollProvidersSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payroll Providers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}

