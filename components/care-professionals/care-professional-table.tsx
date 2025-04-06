import type { CareProfessional } from "@/types/care-professional"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"

interface CareProfessionalTableProps {
  professionals: CareProfessional[]
}

export function CareProfessionalTable({ professionals }: CareProfessionalTableProps) {
  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
  }

  // If no professionals, show empty state
  if (!professionals || professionals.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No care professionals found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Specialization</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Employment</th>
            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {professionals.map((professional) => {
            const fullName = `${professional.first_name} ${professional.last_name}`

            return (
              <tr key={professional.id} className="border-b hover:bg-muted/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={
                          professional.avatarUrl ||
                          `https://ui-avatars.com/api/?name=${professional.first_name}+${professional.last_name}&background=random`
                        }
                        alt={fullName}
                      />
                      <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
                    </Avatar>
                    <Link href={`/care-professionals/${professional.id}`} className="font-medium hover:underline">
                      {fullName}
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-3">{professional.role}</td>
                <td className="px-4 py-3">
                  {professional.specialization && professional.specialization.length > 0
                    ? professional.specialization.join(", ")
                    : "-"}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={professional.status === "active" ? "default" : "outline"}>
                    {professional.status.charAt(0).toUpperCase() + professional.status.slice(1)}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

