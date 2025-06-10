import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

interface DetailItem {
  label: string
  value: React.ReactNode
  badge?: {
    text: string
    variant?: "default" | "secondary" | "destructive" | "outline"
  }
}

interface DetailViewProps {
  title: string
  description?: string
  items: DetailItem[]
  isLoading?: boolean
  columns?: 1 | 2 | 3
}

export function DetailView({ title, description, items, isLoading = false, columns = 1 }: DetailViewProps) {
  const gridClass =
    columns === 1
      ? ""
      : columns === 2
        ? "grid grid-cols-1 md:grid-cols-2 gap-4"
        : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className={gridClass}>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="mb-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className={gridClass}>
            {items.map((item, index) => (
              <div key={index} className="mb-4">
                <div className="text-sm font-medium text-muted-foreground mb-1">{item.label}</div>
                <div className="flex items-center">
                  <div className="font-medium">
                    {item.value || <span className="text-muted-foreground text-sm">Not provided</span>}
                  </div>
                  {item.badge && (
                    <Badge variant={item.badge.variant} className="ml-2">
                      {item.badge.text}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
