"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface CareProfessional {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  role: string
  specialization: string
  employment_status: string
  is_active: boolean
  avatar_url: string
}

export default function CareProfessionalsPage() {
  const [careProfessionals, setCareProfessionals] = useState<CareProfessional[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function fetchCareProfessionals() {
      try {
        setLoading(true)
        const response = await fetch("/api/care-professionals")

        if (!response.ok) {
          throw new Error(`Failed to fetch care professionals: ${response.status}`)
        }

        const data = await response.json()
        setCareProfessionals(data)
      } catch (err) {
        console.error("Error fetching care professionals:", err)
        setError("Failed to load care professionals. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchCareProfessionals()
  }, [])

  const filteredCareProfessionals = careProfessionals.filter((cp) => {
    const fullName = `${cp.first_name} ${cp.last_name}`.toLowerCase()
    const searchLower = searchTerm.toLowerCase()
    return (
      fullName.includes(searchLower) ||
      cp.role.toLowerCase().includes(searchLower) ||
      cp.specialization.toLowerCase().includes(searchLower) ||
      cp.email.toLowerCase().includes(searchLower)
    )
  })

  if (loading) {
    return <CareProfessionalsSkeleton />
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Care Professionals</h1>
          <p className="text-muted-foreground">Manage and view all care professionals in the system</p>
        </div>
        <div className="w-full md:w-auto flex gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search care professionals..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>Add New</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCareProfessionals.length > 0 ? (
          filteredCareProfessionals.map((cp) => (
            <Link href={`/care-professionals/${cp.id}`} key={cp.id}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={cp.avatar_url || "/placeholder.svg"} alt={`${cp.first_name} ${cp.last_name}`} />
                      <AvatarFallback>{`${cp.first_name.charAt(0)}${cp.last_name.charAt(0)}`}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {cp.first_name} {cp.last_name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{cp.role}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Email: </span>
                      {cp.email}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Phone: </span>
                      {cp.phone}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Specialization: </span>
                      {cp.specialization}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={cp.is_active ? "default" : "secondary"}>
                        {cp.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">{cp.employment_status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p>No care professionals found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function CareProfessionalsSkeleton() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="h-full">
              <CardHeader className="pb-2">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
