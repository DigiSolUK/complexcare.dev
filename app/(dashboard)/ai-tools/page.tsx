import type { Metadata } from "next"
import { Brain, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ErrorBoundary } from "@/components/error-boundary"

// AI Tool Components
import { PatientChat } from "@/components/ai/patient-chat"
import { DocumentAnalyzer } from "@/components/ai/document-analyzer"
import { PatientAnalyzer } from "@/components/ai/patient-analyzer"
import { ReportGenerator } from "@/components/ai/report-generator"
import { RecommendationsGenerator } from "@/components/ai/recommendations-generator"
import { MedicationInteractionChecker } from "@/components/ai/medication-interaction-checker"
import { CarePlanGenerator } from "@/components/ai/care-plan-generator"
import TreatmentProtocolGenerator from "@/components/ai/treatment-protocol-generator"
import { VoiceTranscription } from "@/components/ai/voice-transcription"
import { SocialDeterminantsAnalyzer } from "@/components/ai/social-determinants-analyzer"
import { DischargePlanningAssistant } from "@/components/ai/discharge-planning-assistant"
import { PredictiveAnalytics } from "@/components/ai/predictive-analytics"
import { TaskAutomation } from "@/components/ai/task-automation"
import { AISearch } from "@/components/ai/ai-search"

export const metadata: Metadata = {
  title: "AI Tools | ComplexCare CRM",
  description: "AI-powered tools for healthcare professionals",
}

export default function AIToolsPage() {
  return (
    <ErrorBoundary componentPath="app/(dashboard)/ai-tools/page.tsx">
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">AI Tools</h1>
          </div>
        </div>

        <div>
          <p className="text-muted-foreground">
            AI-powered tools to assist healthcare professionals in providing better care for patients. These tools are
            designed to enhance clinical decision-making, streamline workflows, and improve patient outcomes.
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important Note</AlertTitle>
          <AlertDescription>
            These AI tools are designed to assist healthcare professionals and should not replace clinical judgment.
            Always review AI-generated content before making clinical decisions.
          </AlertDescription>
        </Alert>

        <Separator />

        <Tabs defaultValue="clinical" className="space-y-6">
          <div className="overflow-x-auto pb-2">
            <TabsList className="inline-flex w-auto min-w-full">
              <TabsTrigger value="clinical">Clinical Decision Support</TabsTrigger>
              <TabsTrigger value="documentation">Documentation</TabsTrigger>
              <TabsTrigger value="analysis">Analysis & Insights</TabsTrigger>
              <TabsTrigger value="patient-care">Patient Care</TabsTrigger>
              <TabsTrigger value="workflow">Workflow Automation</TabsTrigger>
            </TabsList>
          </div>

          {/* Clinical Decision Support Tools */}
          <TabsContent value="clinical" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Clinical Decision Support</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <MedicationInteractionChecker />
                </div>
                <div>
                  <TreatmentProtocolGenerator />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Patient-Specific Insights</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <PatientAnalyzer />
                </div>
                <div>
                  <PredictiveAnalytics />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Documentation Tools */}
          <TabsContent value="documentation" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Documentation Assistance</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <DocumentAnalyzer />
                </div>
                <div>
                  <ReportGenerator />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Voice & Transcription</h3>
              <VoiceTranscription />
            </div>
          </TabsContent>

          {/* Analysis & Insights Tools */}
          <TabsContent value="analysis" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Patient Analysis</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <SocialDeterminantsAnalyzer />
                </div>
                <div>
                  <RecommendationsGenerator />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Patient Care Tools */}
          <TabsContent value="patient-care" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Care Planning</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <CarePlanGenerator />
                </div>
                <div>
                  <DischargePlanningAssistant />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Patient Communication</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <PatientChat />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Workflow Automation Tools */}
          <TabsContent value="workflow" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Workflow Optimization</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <TaskAutomation />
                </div>
                <div>
                  <AISearch />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  )
}
