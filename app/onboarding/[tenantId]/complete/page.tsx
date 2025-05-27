"use client"

import { useOnboarding } from "@/contexts/onboarding-context"
import { useTenant } from "@/contexts/tenant-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ArrowRight, BookOpen, Video, MessageSquareIcon as MessageSquareHelp, Rocket } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function CompletePage() {
  const { steps, markStepAsCompleted } = useOnboarding()
  const { currentTenant } = useTenant()
  const router = useRouter()
  const { toast } = useToast()

  const completedSteps = steps.filter((step) => step.isCompleted).length
  const totalSteps = steps.length - 1 // Excluding the complete step itself
  const completionPercentage = Math.round((completedSteps / totalSteps) * 100)

  const handleComplete = () => {
    markStepAsCompleted("complete")

    toast({
      title: "Onboarding completed!",
      description: "You're all set to start using ComplexCare CRM.",
    })

    // Redirect to dashboard
    router.push("/dashboard")
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">You're Almost Done!</h1>
        <p className="text-muted-foreground mt-2">You've completed {completionPercentage}% of the setup process</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Setup Summary</CardTitle>
          <CardDescription>Here's what you've accomplished so far</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {steps.slice(0, -1).map((step) => (
              <li key={step.id} className="flex items-start">
                <div className="mr-3 mt-0.5">
                  {step.isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button onClick={handleComplete} className="w-full">
            Complete Setup & Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-primary" />
              Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Explore our comprehensive documentation to learn more about the platform.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              View Docs
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Video className="h-4 w-4 mr-2 text-primary" />
              Tutorial Videos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Watch tutorial videos to get up to speed quickly with key features.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              Watch Tutorials
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <MessageSquareHelp className="h-4 w-4 mr-2 text-primary" />
              Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Get help from our support team if you have any questions.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              Contact Support
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Rocket className="h-4 w-4 mr-2 text-primary" />
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Discover recommended next steps to get the most out of the platform.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              View Recommendations
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
