"use client"

import type React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect } from "react"

const featuresSchema = z.object({
  enabledFeatures: z.array(z.string()).min(1, {
    message: "Select at least one feature.",
  }),
})

type FeaturesValues = z.infer<typeof featuresSchema>

interface FeaturesStepProps {
  data: any
  updateData: (data: Partial<FeaturesValues>) => void
}

export const FeaturesStep: React.FC<FeaturesStepProps> = ({ data, updateData }) => {
  const form = useForm<FeaturesValues>({
    resolver: zodResolver(featuresSchema),
    defaultValues: {
      enabledFeatures: data.enabledFeatures || [],
    },
    mode: "onChange",
  })

  useEffect(() => {
    form.reset({ enabledFeatures: data.enabledFeatures || [] })
  }, [data])

  useEffect(() => {
    if (form.formState.isValid) {
      updateData(form.getValues())
    }
  }, [form.formState.isValid, form.getValues, updateData])

  const features = [
    {
      label: "CRM",
      value: "crm",
      description: "Manage customer relationships and interactions.",
    },
    {
      label: "Billing",
      value: "billing",
      description: "Handle invoicing, payments, and subscriptions.",
    },
    {
      label: "Analytics",
      value: "analytics",
      description: "Track key metrics and gain insights into your business.",
    },
  ]

  return (
    <Form {...form}>
      <form className="space-y-8">
        <FormField
          control={form.control}
          name="enabledFeatures"
          render={() => (
            <FormItem>
              <FormLabel>Enabled Features</FormLabel>
              <FormDescription>Select the features you want to enable for this tenant.</FormDescription>
              <div className="flex flex-col space-y-2">
                {features.map((feature) => (
                  <FormField
                    key={feature.value}
                    control={form.control}
                    name="enabledFeatures"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={feature.value}
                          className="flex flex-row items-center space-x-3 space-y-0 rounded-md border border-muted p-4 shadow-sm"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(feature.value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, feature.value])
                                  : field.onChange(field.value?.filter((value) => value !== feature.value))
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-medium leading-none">{feature.label}</FormLabel>
                            <FormDescription>{feature.description}</FormDescription>
                          </div>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
