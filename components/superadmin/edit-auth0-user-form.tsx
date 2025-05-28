"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useEffect, useState } from "react"
import type { User } from "@auth0/auth0-react"
import { Key } from "lucide-react"
import { PasswordResetDialog } from "./password-reset-dialog"

interface EditAuth0UserFormProps {
  user: User<any, any>
  onUpdate: (data: z.infer<typeof formSchema>) => void
}

const formSchema = z.object({
  email: z.string().email(),
  given_name: z.string().min(2, {
    message: "First Name must be at least 2 characters.",
  }),
  family_name: z.string().min(2, {
    message: "Last Name must be at least 2 characters.",
  }),
  connection: z.string(),
  password: z.string().optional(),
  verify_email: z.boolean().optional(),
})

export function EditAuth0UserForm({ user, onUpdate }: EditAuth0UserFormProps) {
  const [isPasswordResetDialogOpen, setIsPasswordResetDialogOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user.email || "",
      given_name: user.given_name || "",
      family_name: user.family_name || "",
      connection: user.identities?.[0]?.connection || "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    onUpdate(values)
  }

  useEffect(() => {
    form.reset({
      email: user.email || "",
      given_name: user.given_name || "",
      family_name: user.family_name || "",
      connection: user.identities?.[0]?.connection || "",
    })
  }, [user])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit User</CardTitle>
        <CardDescription>Make changes to the user profile here.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="Email" {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="given_name">First Name</Label>
              <Input id="given_name" placeholder="First Name" {...form.register("given_name")} />
              {form.formState.errors.given_name && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.given_name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="family_name">Last Name</Label>
              <Input id="family_name" placeholder="Last Name" {...form.register("family_name")} />
              {form.formState.errors.family_name && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.family_name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="connection">Connection</Label>
              <Input id="connection" placeholder="Connection" {...form.register("connection")} disabled />
            </div>

            <div className="grid gap-2">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label htmlFor="password">New Password (leave blank to keep current)</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    {...form.register("password")}
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.password.message}</p>
                  )}
                </div>
                <Button type="button" variant="outline" onClick={() => setIsPasswordResetDialogOpen(true)}>
                  <Key className="mr-2 h-4 w-4" />
                  Reset Options
                </Button>
              </div>
            </div>

            <Button type="submit">Update User</Button>
          </form>
        </Form>
      </CardContent>
      {/* Password Reset Dialog */}
      <PasswordResetDialog user={user} open={isPasswordResetDialogOpen} onOpenChange={setIsPasswordResetDialogOpen} />
    </Card>
  )
}
