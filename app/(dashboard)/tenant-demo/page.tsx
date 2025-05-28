"use client"

import { useTenantContext } from "@/contexts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TenantSwitcher } from "@/components/tenant/tenant-switcher"

export default function TenantDemoPage() {
  const { currentTenant, tenants, isLoading, error } = useTenantContext()

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Tenant Context Demo</h1>
        <p className="text-muted-foreground">This page demonstrates the tenant context functionality.</p>
      </div>

      <div className="flex justify-end">
        <TenantSwitcher />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Tenant</CardTitle>
            <CardDescription>Information about the currently selected tenant</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading tenant information...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : currentTenant ? (
              <div className="space-y-2">
                <p>
                  <strong>ID:</strong> {currentTenant.id}
                </p>
                <p>
                  <strong>Name:</strong> {currentTenant.name}
                </p>
                <p>
                  <strong>Slug:</strong> {currentTenant.slug}
                </p>
                {currentTenant.plan && (
                  <p>
                    <strong>Plan:</strong> {currentTenant.plan}
                  </p>
                )}
              </div>
            ) : (
              <p>No tenant selected</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Tenants</CardTitle>
            <CardDescription>List of all tenants you have access to</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading tenants...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : tenants.length > 0 ? (
              <ul className="space-y-2">
                {tenants.map((tenant) => (
                  <li key={tenant.id} className="p-2 border rounded">
                    <p>
                      <strong>{tenant.name}</strong> ({tenant.slug})
                    </p>
                    {tenant.plan && <p className="text-sm text-muted-foreground">Plan: {tenant.plan}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tenants available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
