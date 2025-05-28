"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { createAuth0User } from "@/lib/actions/auth0-actions"

interface Connection {
  id: string
  name: string
  strategy: string
}

const userSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  connection: z.string({ required_error: "Please select a connection" }),
  name: z.string().optional(),
  given_name: z.string().optional(),
  family_name: z.string().optional(),
  nickname: z.string().optional(),
  picture: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  email_verified: z.boolean().default(false),
  verify_email: z.boolean().default(true),
  blocked: z.boolean().default(false),
  user_metadata: z.string().optional().or(z.literal("")),
  app_metadata: z.string().optional().or(z.literal("")),
})

type UserFormValues = z.infer<typeof userSchema>

interface CreateAuth0UserFormProps {
  connections: Connection[]
}

export function CreateAuth0UserForm({ connections }: CreateAuth0UserFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      password: "",
      connection: connections.length > 0 ? connections[0].name : "",
      name: "",
      given_name: "",
      family_name: "",
      nickname: "",
      picture: "",
      email_verified: false,
      verify_email: true,
      blocked: false,
      user_metadata: "",
      app_metadata: "",
    },
  })

  const onSubmit = async (data: UserFormValues) => {
    setIsSubmitting(true)
    try {
      // Parse JSON metadata if provided
      const user_metadata = data.user_metadata ? JSON.parse(data.user_metadata) : undefined
      const app_metadata = data.app_metadata ? JSON.parse(data.app_metadata) : undefined

      // Create user
      await createAuth0User({
        ...data,
        user_metadata,
        app_metadata,
      })

      toast.success("User created successfully")
      router.push("/superadmin/auth0")
    } catch (error) {
      console.error("Error creating user:", error)
      toast.error(`Failed to create user: ${(error as Error).message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the basic information for the new user.</CardDescription>
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
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormDescription>
                    Password must be at least 8 characters and include uppercase, lowercase, number, and special
                    character.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="connection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Connection</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a connection" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {connections.map((connection) => (
                        <SelectItem key={connection.id} value={connection.name}>
                          {connection.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>The Auth0 connection to use for this user.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Enter the profile information for the new user.</CardDescription>
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Configure account settings for the new user.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email_verified"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Email Verified</FormLabel>
                    <FormDescription>
                      Mark the user's email as verified. This bypasses email verification.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="verify_email"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Send Verification Email</FormLabel>
                    <FormDescription>Send a verification email to the user after creation.</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="blocked"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Blocked</FormLabel>
                    <FormDescription>Block the user from logging in.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
            <CardDescription>Add custom metadata for the user (optional).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="user_metadata"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Metadata (JSON)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='{"preferred_color": "blue", "language": "en"}'
                      className="font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    User metadata can be read and modified by the user. Enter valid JSON.
                  </FormDescription>
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
                    <Textarea placeholder='{"plan": "premium", "roles": ["editor"]}' className="font-mono" {...field} />
                  </FormControl>
                  <FormDescription>
                    App metadata can only be read and modified by the application. Enter valid JSON.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.push("/superadmin/auth0")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create User"}
          </Button>
        </CardFooter>
      </form>
    </Form>
  )
}
