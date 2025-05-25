"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Mail, Link, Shield, Copy, Check } from "lucide-react"
import { sendPasswordResetEmail, forcePasswordReset, generatePasswordResetLink } from "@/lib/actions/auth0-actions"

interface PasswordResetDialogProps {
  user: {
    user_id: string
    email: string
    name?: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PasswordResetDialog({ user, open, onOpenChange }: PasswordResetDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [resetLink, setResetLink] = useState<string | null>(null)
  const [linkCopied, setLinkCopied] = useState(false)

  const handleSendResetEmail = async () => {
    setIsLoading(true)
    try {
      const result = await sendPasswordResetEmail(user.user_id)
      toast({
        title: "Password reset email sent",
        description: `A password reset email has been sent to ${result.email}`,
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleForceReset = async () => {
    setIsLoading(true)
    try {
      await forcePasswordReset(user.user_id)
      toast({
        title: "Password reset required",
        description: "The user will be required to reset their password on next login",
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateLink = async () => {
    setIsLoading(true)
    try {
      const result = await generatePasswordResetLink(user.user_id)
      setResetLink(result.resetLink)
      toast({
        title: "Reset link generated",
        description: `Link expires in ${result.expiresIn}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = async () => {
    if (resetLink) {
      await navigator.clipboard.writeText(resetLink)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
      toast({
        title: "Link copied",
        description: "Password reset link copied to clipboard",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Password Reset Options</DialogTitle>
          <DialogDescription>Choose how to handle password reset for {user.name || user.email}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email">Send Email</TabsTrigger>
            <TabsTrigger value="link">Generate Link</TabsTrigger>
            <TabsTrigger value="force">Force Reset</TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Send Reset Email
                </CardTitle>
                <CardDescription>Send a password reset email directly to the user</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertDescription>
                    An email will be sent to <strong>{user.email}</strong> with instructions to reset their password.
                    The link will expire in 5 days.
                  </AlertDescription>
                </Alert>
                <Button onClick={handleSendResetEmail} disabled={isLoading} className="w-full">
                  {isLoading ? "Sending..." : "Send Password Reset Email"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="link">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Generate Reset Link
                </CardTitle>
                <CardDescription>Generate a one-time password reset link to share with the user</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!resetLink ? (
                  <>
                    <Alert>
                      <AlertDescription>
                        Generate a password reset link that you can manually share with the user. The link will expire
                        in 24 hours.
                      </AlertDescription>
                    </Alert>
                    <Button onClick={handleGenerateLink} disabled={isLoading} className="w-full">
                      {isLoading ? "Generating..." : "Generate Reset Link"}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>Password Reset Link</Label>
                      <div className="flex gap-2">
                        <Input value={resetLink} readOnly className="font-mono text-xs" />
                        <Button size="icon" variant="outline" onClick={handleCopyLink} className="shrink-0">
                          {linkCopied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <Alert>
                      <AlertDescription>
                        This link expires in 24 hours and can only be used once. Share it securely with the user.
                      </AlertDescription>
                    </Alert>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="force">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Force Password Reset
                </CardTitle>
                <CardDescription>Require the user to reset their password on next login</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertDescription>
                    The user will be prompted to reset their password the next time they attempt to log in. They will
                    not be able to access the application until they complete the password reset.
                  </AlertDescription>
                </Alert>
                <Button onClick={handleForceReset} disabled={isLoading} variant="destructive" className="w-full">
                  {isLoading ? "Processing..." : "Force Password Reset on Next Login"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
