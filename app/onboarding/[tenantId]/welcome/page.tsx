"use client"

import { useOnboarding } from "@/contexts/onboarding-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

export default function WelcomePage() {
  const { completeStep } = useOnboarding()

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome to ComplexCare CRM</h1>

      <p className="text-lg mb-8">
        We're excited to help you get started with our platform. This quick onboarding process will guide you through
        setting up your organization and getting the most out of ComplexCare.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Patient Management</CardTitle>
            <CardDescription>Comprehensive patient records and care plans</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Manage patient information, medical history, and care plans in one secure location.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Care Professional Tools</CardTitle>
            <CardDescription>Streamline your care team's workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Schedule appointments, manage credentials, and optimize care professional assignments.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clinical Documentation</CardTitle>
            <CardDescription>Efficient note-taking and documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Create, store, and share clinical notes and documentation with your team.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance & Reporting</CardTitle>
            <CardDescription>Stay compliant with UK healthcare regulations</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Generate reports and ensure compliance with CQC and NHS requirements.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Let's get started!</CardTitle>
          <CardDescription>Complete this onboarding to set up your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            This onboarding will guide you through setting up your organization profile, inviting team members, and
            configuring your ComplexCare instance.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={() => completeStep("welcome")} className="gap-2">
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
