import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface SuccessStepProps {
  tenantId: string
  tenantName: string
}

export function SuccessStep({ tenantId, tenantName }: SuccessStepProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Tenant Created Successfully!</CardTitle>
        <CardDescription className="text-center">Your new tenant has been created and is ready to use.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-4">
          <div className="font-medium">Tenant Name</div>
          <div className="text-sm text-muted-foreground">{tenantName}</div>
        </div>
        <div className="rounded-lg bg-muted p-4">
          <div className="font-medium">Tenant ID</div>
          <div className="text-sm text-muted-foreground">{tenantId}</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/superadmin/tenants">View All Tenants</Link>
        </Button>
        <Button asChild>
          <Link href={`/superadmin/tenants/${tenantId}`}>Manage Tenant</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
