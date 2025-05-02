"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, X } from "lucide-react"

interface FormErrorBoundaryProps {
  children: React.ReactNode
  onReset?: () => void
}

interface FormErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class FormErrorBoundaryClass extends React.Component<FormErrorBoundaryProps, FormErrorBoundaryState> {
  constructor(props: FormErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Form submission error:", error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Form Error</AlertTitle>
            <AlertDescription>
              {this.state.error?.message || "An error occurred while submitting the form."}
            </AlertDescription>
            <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={this.handleReset}>
              <X className="h-4 w-4" />
            </Button>
          </Alert>
          {this.props.children}
        </>
      )
    }

    return this.props.children
  }
}

export function FormErrorBoundary(props: FormErrorBoundaryProps) {
  const [key, setKey] = useState(0)

  const handleReset = () => {
    setKey((prev) => prev + 1)
    if (props.onReset) {
      props.onReset()
    }
  }

  return <FormErrorBoundaryClass key={key} {...props} onReset={handleReset} />
}
