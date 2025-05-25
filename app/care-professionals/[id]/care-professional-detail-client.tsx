"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

interface CareProfessional {
  id: string
  name: string
  email: string
  phone: string
  address: string
  specialty: string
  availability: string
  imageUrl: string
}

const CareProfessionalDetailClient = () => {
  const params = useParams()
  const [careProfessional, setCareProfessional] = useState<CareProfessional | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCareProfessional = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/care-professionals/${params.id}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setCareProfessional(data)
      } catch (error) {
        console.error("Could not fetch care professional:", error)
        // Handle error appropriately, e.g., display an error message to the user
      } finally {
        setLoading(false)
      }
    }

    fetchCareProfessional()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (!careProfessional) {
    return <div>Care professional not found.</div>
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Care Professional Details</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={careProfessional.imageUrl || "/placeholder.svg"} alt={careProfessional.name} />
            <AvatarFallback>{careProfessional.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">{careProfessional.name}</h2>
            <p className="text-sm text-muted-foreground">{careProfessional.specialty}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Email: {careProfessional.email}</p>
          <p>Phone: {careProfessional.phone}</p>
          <p>Address: {careProfessional.address}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{careProfessional.availability}</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default CareProfessionalDetailClient
