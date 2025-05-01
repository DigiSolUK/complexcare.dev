"use client"

import type React from "react"

import { useState } from "react"
import { SuccessStep } from "./steps/success-step"
import { createTenant } from "@/lib/services/tenant-wizard-service"

interface TenantWizardProps {
  initialStep?: number
}

export function TenantWizard({ initialStep = 0 }: TenantWizardProps) {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    plan: "standard",
    adminEmail: "",
  })
  const [createdTenant, setCreatedTenant] = useState<{ id: string; name: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const tenant = await createTenant(formData)
      setCreatedTenant(tenant)
      setCurrentStep(currentStep + 1)
    } catch (error) {
      console.error("Error creating tenant:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // If we're at the success step and have a created tenant
  if (currentStep === 1 && createdTenant) {
    return <SuccessStep tenantId={createdTenant.id} tenantName={createdTenant.name} />
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Create New Tenant</h2>
        <p className="text-muted-foreground">Fill out the form below to create a new tenant in the system.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields would go here */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-4 py-2 rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Tenant"}
          </button>
        </div>
      </form>
    </div>
  )
}
