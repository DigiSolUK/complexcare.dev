import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type StatusVariant = "default" | "success" | "warning" | "danger" | "info" | "neutral"

interface StatusBadgeProps {
  status: string
  variant?: StatusVariant
  className?: string
  statusMap?: Record<string, StatusVariant>
}

export function StatusBadge({ status, variant, className, statusMap }: StatusBadgeProps) {
  // Default status mapping if not provided
  const defaultStatusMap: Record<string, StatusVariant> = {
    active: "success",
    inactive: "neutral",
    pending: "warning",
    completed: "success",
    cancelled: "danger",
    overdue: "danger",
    approved: "success",
    rejected: "danger",
    draft: "neutral",
    published: "success",
    archived: "neutral",
    high: "danger",
    medium: "warning",
    low: "info",
  }

  // Use provided status map or default
  const finalStatusMap = statusMap || defaultStatusMap

  // Determine variant based on status if not explicitly provided
  const statusVariant = variant || finalStatusMap[status.toLowerCase()] || "default"

  // Map variant to Tailwind classes
  const variantClasses = {
    default: "bg-primary/10 text-primary border-primary/20",
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    danger: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
    neutral: "bg-gray-100 text-gray-800 border-gray-200",
  }

  return (
    <Badge variant="outline" className={cn(variantClasses[statusVariant], className)}>
      {status}
    </Badge>
  )
}
