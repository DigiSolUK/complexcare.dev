"use client"

import type { CareProfessional } from "@/types/care-professional"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"

interface CareProfessionalCardProps {
  professional: CareProfessional
  onClick?: () => void
}

export function CareProfessionalCard({ professional, onClick }: CareProfessionalCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={professional.avatarUrl} alt={`${professional.first_name} ${professional.last_name}`} />
            <AvatarFallback>{getInitials(`${professional.first_name} ${professional.last_name}`)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">
              {professional.first_name} {professional.last_name}
            </CardTitle>
            <CardDescription className="text-xs">{professional.role}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="truncate">{professional.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <Badge variant={professional.status === "active" ? "success" : "destructive"} className="mt-1">
              {professional.status}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

