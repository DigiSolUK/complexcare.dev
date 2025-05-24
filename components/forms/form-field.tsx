"use client"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { DatePicker } from "@/components/ui/date-picker"
import type { Control } from "react-hook-form"

interface Option {
  value: string
  label: string
}

interface FormFieldProps {
  control: Control<any>
  name: string
  label: string
  placeholder?: string
  description?: string
  type?: "text" | "email" | "password" | "number" | "textarea" | "checkbox" | "radio" | "select" | "switch" | "date"
  options?: Option[]
  disabled?: boolean
  required?: boolean
}

export function FormFieldComponent({
  control,
  name,
  label,
  placeholder,
  description,
  type = "text",
  options = [],
  disabled = false,
  required = false,
}: FormFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            {type === "text" || type === "email" || type === "password" || type === "number" ? (
              <Input
                {...field}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                value={field.value || ""}
                onChange={(e) => {
                  if (type === "number") {
                    field.onChange(e.target.value === "" ? "" : Number(e.target.value))
                  } else {
                    field.onChange(e.target.value)
                  }
                }}
              />
            ) : type === "textarea" ? (
              <Textarea {...field} placeholder={placeholder} disabled={disabled} value={field.value || ""} />
            ) : type === "checkbox" ? (
              <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={disabled} />
            ) : type === "radio" ? (
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
                {options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`${name}-${option.value}`} />
                    <label htmlFor={`${name}-${option.value}`}>{option.label}</label>
                  </div>
                ))}
              </RadioGroup>
            ) : type === "select" ? (
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : type === "switch" ? (
              <Switch checked={field.value} onCheckedChange={field.onChange} disabled={disabled} />
            ) : type === "date" ? (
              <DatePicker
                date={field.value ? new Date(field.value) : undefined}
                setDate={(date) => field.onChange(date)}
                disabled={disabled}
              />
            ) : null}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
