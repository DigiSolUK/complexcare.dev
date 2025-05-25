"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { updateAuth0User } from "@/lib/actions/auth0-actions"

// Define the form schema with Zod
const userFormSchema = z.object({
  // Basic Information
  email: z.string().email({ message: "Please enter a valid email address" }).optional(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" })
    .optional()
    .or(z.literal("")),

  // Profile Information
  name: z.string().optional().or(z.literal("")),
  given_name: z.string().optional().or(z.literal("")),
  family_name: z.string().optional().or(z.literal("")),
  nickname: z.string().optional().or(z.literal("")),
  picture: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),

  // Account Settings
  email_verified: z.boolean().optional(),
  verify_email: z.boolean().optional(),
  blocked: z.boolean().optional(),

  // Metadata
  user_metadata: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => {
        if (!val) return true
        try {
          JSON.parse(val)
          return true
        } catch (e) {
          return false
        }
      },
      { message: "User metadata must be valid JSON" },
    ),
  app_metadata: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => {
        if (!val) return true
        try {
          JSON.parse(val)
          return true
        } catch (e) {
          return false
        }
      },
      { message: "App metadata must be valid JSON" },
    ),
})

type UserFormValues = z.infer<typeof userFormSchema>

interface EditAuth0UserFormProps {
  user: any
  onSuccess?: () => void
  onCancel?: () => void
}

export function EditAuth0UserForm({ user, onSuccess, onCancel }: EditAuth0UserFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize the form with user data
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: user.email || "",
      password: "",
      name: user.name || "",
      given_name: user.given_name || "",
      family_name: user.family_name || "",
      nickname: user.nickname || "",
      picture: user.picture || "",
      email_verified: user.email_verified || false,
      verify_email: false,
      blocked: user.blocked || false,
      user_metadata: user.user_metadata ? JSON.stringify(user.user_metadata, null, 2) : "",
      app_metadata: user.app_metadata ? JSON.stringify(user.app_metadata, null, 2) : "",
    },
  })

  async function onSubmit(data: UserFormValues) {
    setIsSubmitting(true)

    try {
      // Process metadata
      const processedData = { ...data }

      if (processedData.user_metadata) {
        try {
          processedData.user_metadata = JSON.parse(processedData.user_metadata)
        } catch (e) {
          // This shouldn't happen due to validation, but just in case
          toast({
            title: "Invalid JSON",
            description: "User metadata contains invalid JSON",
            variant: "destructive",
          })
          setIsSubmitting(false)
          return
        }
      }

      if (processedData.app_metadata) {
        try {
          processedData.app_metadata = JSON.parse(processedData.app_metadata)
        } catch (e) {
          toast({
            title: "Invalid JSON",
            description: "App metadata contains invalid JSON",
            variant: "destructive",
          })
          setIsSubmitting(false)
          return
        }
      }

      // Remove empty string values to avoid overwriting with empty strings
      Object.keys(processedData).forEach((key) => {
        if (processedData[key as keyof UserFormValues] === "") {
          delete processedData[key as keyof UserFormValues]
        }
      })

      // If password is empty, remove it
      if (!processedData.password) {
        delete processedData.password
      }

      await updateAuth0User(user.user_id, processedData)

      toast({
        title: "User Updated",
        description: `User ${user.email} has been updated successfully.`,
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/superadmin/auth0")
        router.refresh()
      }
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to update user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Update the user's basic account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="user@example.com" {...field} />
                      </FormControl>
                      <FormDescription>The user's email address</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="New password" {...field} />
                      </FormControl>
                      <FormDescription>Leave blank to keep the current password</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Information Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update the user's profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="given_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="family_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="nickname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nickname</FormLabel>
                      <FormControl>
                        <Input placeholder="Johnny" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="picture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Picture URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/avatar.jpg" {...field} />
                      </FormControl>
                      <FormDescription>URL to the user's profile picture</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage account verification and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="email_verified"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Email Verified</FormLabel>
                        <FormDescription>Mark the user's email as verified</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="verify_email"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Send Verification Email</FormLabel>
                        <FormDescription>Send a verification email to the user</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="blocked"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Block User</FormLabel>
                        <FormDescription>Prevent the user from logging in</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Metadata Tab */}
          <TabsContent value="metadata">
            <Card>
              <CardHeader>
                <CardTitle>User Metadata</CardTitle>
                <CardDescription>Custom metadata for the user</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="user_metadata"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Metadata (JSON)</FormLabel>
                      <FormControl>
                        <Textarea placeholder='{ "key": "value" }' className="font-mono h-32" {...field} />
                      </FormControl>
                      <FormDescription>Custom user metadata (can be modified by the user)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="app_metadata"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>App Metadata (JSON)</FormLabel>
                      <FormControl>
                        <Textarea placeholder='{ "key": "value" }' className="font-mono h-32" {...field} />
                      </FormControl>
                      <FormDescription>Application metadata (cannot be modified by the user)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update User"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
