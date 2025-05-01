"use client"

import { FormDescription } from "@/components/ui/form"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { createTenant } from "@/lib/actions/tenant-actions"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Check, CheckCircle2 } from "lucide-react"
import { Slider } from "@/components/ui/slider"

const subscriptionTiers = [
  {
    id: "basic",
    name: "Basic",
    pricePerUserMonthly: 15,
    pricePerUserAnnually: 12,
    description: "Essential features",
    features: ["Patient management", "Basic care planning"],
  },
  {
    id: "professional",
    name: "Professional",
    pricePerUserMonthly: 25,
    pricePerUserAnnually: 20,
    description: "Advanced features",
    features: ["Advanced care planning", "Medication management"],
    recommended: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    pricePerUserMonthly: 40,
    pricePerUserAnnually: 32,
    description: "Comprehensive solution",
    features: ["AI-powered insights", "Custom integrations"],
  },
]

const tenantFormSchema = z.object({
  tenantName: z.string().min(3),
  adminEmail: z.string().email(),
  adminName: z.string().min(2),
  adminPassword: z.string().min(8),
  domain: z.string().optional(),
  subscriptionTier: z.enum(["basic", "professional", "enterprise"]),
  userCount: z.number().min(1),
  billingCycle: z.enum(["monthly", "annually"]),
})

type TenantFormValues = z.infer<typeof tenantFormSchema>

export function CreateTenantForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [isComparisonOpen, setIsComparisonOpen] = useState(false)

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: {
      tenantName: "",
      adminEmail: "",
      adminName: "",
      adminPassword: "",
      domain: "",
      subscriptionTier: "professional",
      userCount: 5,
      billingCycle: "monthly",
    },
  })

  const { watch } = form
  const subscriptionTier = watch("subscriptionTier")
  const userCount = watch("userCount")
  const billingCycle = watch("billingCycle")

  const calculatePrice = () => {
    const selectedTier = subscriptionTiers.find((tier) => tier.id === subscriptionTier)
    if (!selectedTier) return { total: 0, savings: 0 }

    const pricePerUser =
      billingCycle === "monthly" ? selectedTier.pricePerUserMonthly : selectedTier.pricePerUserAnnually
    const total = pricePerUser * userCount * (billingCycle === "monthly" ? 1 : 12)
    const savings = selectedTier.pricePerUserMonthly * userCount * 12 - total

    return { total, savings }
  }

  const price = calculatePrice()

  async function onSubmit(data: TenantFormValues) {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await createTenant({
        name: data.tenantName,
        adminEmail: data.adminEmail,
        adminName: data.adminName,
        adminPassword: data.adminPassword,
        domain: data.domain || undefined,
        subscriptionTier: data.subscriptionTier,
        userCount: data.userCount,
        billingCycle: data.billingCycle,
      })

      if (result.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }

      setSuccess(true)
      form.reset()

      setTimeout(() => {
        const loginTab = document.querySelector('[data-value="login"]') as HTMLElement
        if (loginTab) loginTab.click()
      }, 2000)
    } catch (err) {
      console.error("Tenant creation error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-2 border-primary/10">
      <CardHeader className="pb-2">
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-primary to-accent p-1 rounded-full">
            <div className="bg-background rounded-full p-2">
              <Icons.building className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 border-green-500 text-green-500">
            <AlertDescription>
              Tenant created successfully! You can now log in with your admin credentials.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tenantName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tenant Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Organization Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="yourcompany.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subscriptionTier"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Subscription Tier</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 gap-4 md:grid-cols-3"
                    >
                      {subscriptionTiers.map((tier) => (
                        <div key={tier.id} className="relative">
                          <RadioGroupItem
                            value={tier.id}
                            id={tier.id}
                            className="peer sr-only"
                            aria-labelledby={`${tier.id}-label`}
                          />
                          <label
                            htmlFor={tier.id}
                            id={`${tier.id}-label`}
                            className={`flex flex-col rounded-lg border-2 p-4 hover:bg-accent/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 ${
                              tier.recommended ? "border-primary/50" : "border-border"
                            }`}
                          >
                            {tier.recommended && (
                              <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                                Recommended
                              </div>
                            )}
                            <div className="mb-2 flex items-center justify-between">
                              <p className="text-lg font-semibold">{tier.name}</p>
                              <div className="flex h-5 w-5 items-center justify-center rounded-full border border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground">
                                <CheckCircle2 className="h-4 w-4 text-primary peer-data-[state=checked]:text-primary-foreground" />
                              </div>
                            </div>
                            <div className="mb-2">
                              <span className="text-2xl font-bold">£{tier.pricePerUserMonthly}</span>
                              <span className="text-sm text-muted-foreground"> per user/month</span>
                            </div>
                            <p className="mb-4 text-sm text-muted-foreground">{tier.description}</p>
                            <ul className="mt-auto space-y-2 text-sm">
                              {tier.features.slice(0, 4).map((feature, i) => (
                                <li key={i} className="flex items-center">
                                  <Check className="mr-2 h-4 w-4 text-primary" />
                                  {feature}
                                </li>
                              ))}
                              {tier.features.length > 4 && (
                                <li className="text-xs text-muted-foreground">
                                  +{tier.features.length - 4} more features
                                </li>
                              )}
                            </ul>
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <FormField
                control={form.control}
                name="userCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Users</FormLabel>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">1</span>
                        <span className="text-sm font-medium">{field.value} users</span>
                        <span className="text-sm">50</span>
                      </div>
                      <FormControl>
                        <Slider
                          min={1}
                          max={50}
                          step={1}
                          defaultValue={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                    </div>
                    <FormDescription>Select the number of users who will need access to the system.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-2 pb-1">
              <h3 className="text-sm font-medium">Admin Account Details</h3>
              <p className="text-xs text-muted-foreground">
                These credentials will be used for the tenant admin account.
              </p>
            </div>

            <FormField
              control={form.control}
              name="adminName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="adminEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="admin@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="adminPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Creating Tenant...
                </>
              ) : (
                "Create Tenant"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 border-t px-6 py-4">
        <div className="text-center text-sm text-muted-foreground">
          Need help? Contact{" "}
          <a href="mailto:support@complexcare.dev" className="text-primary underline-offset-4 hover:underline">
            support@complexcare.dev
          </a>
        </div>
      </CardFooter>
    </Card>
  )
}
