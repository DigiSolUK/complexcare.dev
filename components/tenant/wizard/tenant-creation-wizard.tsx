"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StepIndicator } from "./step-indicator"
import { BasicInfoStep } from "./steps/basic-info-step"
import { ContactInfoStep } from "./steps/contact-info-step"
import { SubscriptionStep } from "./steps/subscription-step"
import { FeaturesStep } from "./steps/features-step"
import { AdminUserStep } from "./steps/admin-user-step"
import { ReviewStep } from "./steps/review-step"
import { TenantWizardProvider, useTenantWizard } from "./tenant-wizard-context"
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

const steps = [
  { id: "basic", name: "Basic Info", component: BasicInfoStep },
  { id: "contact", name: "Contact", component: ContactInfoStep },
  { id: "subscription", name: "Plan", component: SubscriptionStep },
  { id: "features", name: "Features", component: FeaturesStep },
  { id: "admin", name: "Admin", component: AdminUserStep },
  { id: "review", name: "Review", component: ReviewStep },
]

function WizardContent() {
  const { currentStep, setCurrentStep, canProceed, data, isSubmitting, setIsSubmitting } = useTenantWizard()
  const { toast } = useToast()
  const router = useRouter()

  const CurrentStepComponent = steps[currentStep].component

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Tenant created successfully!",
        description: `${data.basicInfo.name} has been created.`,
      })

      // Redirect to tenants list or the new tenant's dashboard
      router.push("/tenants")
    } catch (error) {
      toast({
        title: "Error creating tenant",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Create New Tenant</h1>
        <p className="mt-2 text-muted-foreground">Follow the steps below to set up a new tenant organization.</p>
      </div>

      <StepIndicator steps={steps} currentStep={currentStep} />

      <Card className="p-6">
        <CurrentStepComponent />
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0 || isSubmitting}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        {currentStep === steps.length - 1 ? (
          <Button onClick={handleSubmit} disabled={!canProceed(currentStep) || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Create Tenant
              </>
            )}
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={!canProceed(currentStep) || isSubmitting}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

export function TenantCreationWizard() {
  return (
    <TenantWizardProvider>
      <WizardContent />
    </TenantWizardProvider>
  )
}
