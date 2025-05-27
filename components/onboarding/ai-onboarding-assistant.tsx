"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bot, X, Maximize2, Minimize2, MessageSquare } from "lucide-react"
import { useOnboarding } from "@/contexts/onboarding-context"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { cn } from "@/lib/utils"

export function AIOnboardingAssistant() {
  const { steps, currentStepId } = useOnboarding()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Generate contextual help when the current step changes
  useEffect(() => {
    if (currentStepId && !isMinimized) {
      generateContextualHelp()
    }
  }, [currentStepId, isMinimized])

  const generateContextualHelp = async () => {
    if (!currentStepId) return

    setIsLoading(true)

    const currentStep = steps.find((step) => step.id === currentStepId)
    if (!currentStep) {
      setIsLoading(false)
      return
    }

    try {
      const { text } = await generateText({
        model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
        prompt: `You are an AI assistant helping a user set up their healthcare organization in a Complex Care CRM system.
        
The user is currently on the "${currentStep.title}" step of the onboarding process.
This step is about: "${currentStep.description}".

Provide a brief, helpful message (2-3 sentences) that:
1. Welcomes them to this step
2. Explains the importance of this step
3. Offers a quick tip to help them complete it successfully

Keep your response conversational, encouraging, and under 100 words.`,
        maxTokens: 150,
      })

      setMessage(text.trim())
    } catch (error) {
      console.error("Error generating contextual help:", error)
      setMessage("I'm here to help you with your onboarding process. Let me know if you have any questions!")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleOpen = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
    if (!isOpen) {
      generateContextualHelp()
    }
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className={cn("w-80 shadow-lg transition-all duration-200 ease-in-out", isMinimized ? "h-14" : "h-96")}>
          <div className="flex items-center justify-between p-3 border-b bg-primary text-primary-foreground">
            <div className="flex items-center">
              <Bot className="h-5 w-5 mr-2" />
              <span className="font-medium">Setup Assistant</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-primary-foreground hover:bg-primary/90"
                onClick={toggleMinimize}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-primary-foreground hover:bg-primary/90"
                onClick={toggleOpen}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <CardContent className="p-0 h-[calc(100%-48px)] flex flex-col">
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="flex items-start mb-4">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground mr-2 flex-shrink-0">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg rounded-tl-none">
                    {isLoading ? (
                      <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
                        <div className="h-4 bg-muted-foreground/20 rounded w-full"></div>
                        <div className="h-4 bg-muted-foreground/20 rounded w-5/6"></div>
                      </div>
                    ) : (
                      <p className="text-sm">{message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-3 border-t mt-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ask a question..."
                    className="w-full rounded-full border border-input bg-background px-4 py-2 text-sm"
                  />
                  <Button size="sm" className="absolute right-1 top-1 h-6 w-6 rounded-full p-0">
                    <MessageSquare className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ) : (
        <Button onClick={toggleOpen} size="icon" className="h-12 w-12 rounded-full shadow-lg">
          <Bot className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}
