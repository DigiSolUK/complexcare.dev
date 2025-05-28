"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ExternalLink, Mail, Settings } from "lucide-react"
import Link from "next/link"

interface SuccessPageProps {
  tenantName: string
  tenantId: string
  subdomain: string
  adminEmail: string
}

export function SuccessPage({ tenantName, tenantId, subdomain, adminEmail }: SuccessPageProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold">Tenant Created Successfully!</h1>
        <p className="mt-2 text-muted-foreground">{tenantName} has been set up and is ready to use.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
          <CardDescription>Here are the next steps to get your tenant up and running.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Check your email</p>
              <p className="text-sm text-muted-foreground">We've sent login instructions to {adminEmail}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <ExternalLink className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Access your tenant</p>
              <p className="text-sm text-muted-foreground">
                Your tenant is available at{" "}
                <a
                  href={`https://${subdomain}.complexcare.uk`}
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {subdomain}.complexcare.uk
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Settings className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Configure settings</p>
              <p className="text-sm text-muted-foreground">Customize your tenant settings and invite team members</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center space-x-4">
        <Button variant="outline" asChild>
          <Link href="/tenants">View All Tenants</Link>
        </Button>
        <Button asChild>
          <Link href={`/tenants/${tenantId}/settings`}>Manage Tenant Settings</Link>
        </Button>
      </div>
    </div>
  )
}
