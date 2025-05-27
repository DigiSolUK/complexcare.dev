"use client"

import { useOnboarding } from "@/contexts/onboarding-context"
import { useTenant } from "@/contexts/tenant-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, CheckCircle, Lightbulb, Users, FileText, Settings } from "lucide-react"

export default function WelcomePage() {
  const { markStepAsCompleted } = useOnboarding()
  const { currentTenant } = useTenant()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">Welcome to ComplexCare CRM</h1>
        <p className="text-muted-foreground text-lg">Let's get your organization set up for success</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Patient Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Manage patient records, medical history, and care plans in one place.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Clinical Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Create, organize, and search clinical notes with ease.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-primary" />
              AI-Powered Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Get intelligent recommendations and automate routine tasks.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2 text-primary" />
              Customizable Workflows
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Tailor the platform to match your organization's unique processes.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>What to expect during onboarding</CardTitle>
          <CardDescription>We'll guide you through setting up your organization in just a few steps</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium">Organization Profile</h3>
              <p className="text-sm text-muted-foreground">Complete your organization details and branding</p>
            </div>
          </div>
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium">Invite Team Members</h3>
              <p className="text-sm text-muted-foreground">Add your team and assign appropriate roles</p>
            </div>
          </div>
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium">Add Patients & Care Professionals</h3>
              <p className="text-sm text-muted-foreground">Start building your patient database and care team</p>
            </div>
          </div>
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium">Set Up Integrations</h3>
              <p className="text-sm text-muted-foreground">Connect with other healthcare systems and tools</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => markStepAsCompleted("welcome")} className="w-full">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
