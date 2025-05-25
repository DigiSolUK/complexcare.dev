"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, AlertTriangle, Check, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface MedicationDetail {
  id: string
  name: string
  type: "VMP" | "AMP"
  supplier?: string
  form?: string
  strength?: string
  unit?: string
  ingredients?: string[]
  url?: string
  snomed?: string
  bnf?: string
  controlledDrugCategory?: string
  blackTriangle?: boolean
  sugarFree?: boolean
  glutenFree?: boolean
  preservativeFree?: boolean
  cautionaryAndAdvisoryLabels?: string[]
}

interface MedicationDetailsProps {
  medicationId: string
  onClose?: () => void
}

export function MedicationDetails({ medicationId, onClose }: MedicationDetailsProps) {
  const [medication, setMedication] = useState<MedicationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMedicationDetails = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/medications/${medicationId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch medication details")
        }

        const data = await response.json()
        setMedication(data)
      } catch (error) {
        console.error("Error fetching medication details:", error)
        setError("Failed to load medication details. Please try again.")
        toast({
          title: "Error",
          description: "Failed to load medication details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (medicationId) {
      fetchMedicationDetails()
    }
  }, [medicationId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Error
          </CardTitle>
          <CardDescription>Failed to load medication details</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (!medication) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medication Not Found</CardTitle>
          <CardDescription>The requested medication could not be found</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{medication.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Badge variant="outline" className="mr-2">
                {medication.type}
              </Badge>
              {medication.supplier && <span>{medication.supplier}</span>}
            </CardDescription>
          </div>
          {medication.url && (
            <Button variant="outline" size="sm" asChild>
              <a href={medication.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                dm+d
              </a>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium">Form</h3>
            <p>{medication.form || "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Strength</h3>
            <p>{medication.strength ? `${medication.strength} ${medication.unit || ""}` : "Not specified"}</p>
          </div>
          {medication.snomed && (
            <div>
              <h3 className="text-sm font-medium">SNOMED CT</h3>
              <p>{medication.snomed}</p>
            </div>
          )}
          {medication.bnf && (
            <div>
              <h3 className="text-sm font-medium">BNF Code</h3>
              <p>{medication.bnf}</p>
            </div>
          )}
        </div>

        {medication.ingredients && medication.ingredients.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Ingredients</h3>
            <ul className="list-disc pl-5">
              {medication.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
        )}

        {medication.cautionaryAndAdvisoryLabels && medication.cautionaryAndAdvisoryLabels.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
              Cautionary and Advisory Labels
            </h3>
            <ul className="list-disc pl-5">
              {medication.cautionaryAndAdvisoryLabels.map((label, index) => (
                <li key={index}>{label}</li>
              ))}
            </ul>
          </div>
        )}

        {(medication.controlledDrugCategory || medication.blackTriangle) && (
          <div>
            <h3 className="text-sm font-medium mb-2">Special Considerations</h3>
            <div className="space-y-2">
              {medication.controlledDrugCategory && (
                <div className="flex items-center">
                  <Badge variant="destructive" className="mr-2">
                    Controlled Drug: {medication.controlledDrugCategory}
                  </Badge>
                </div>
              )}
              {medication.blackTriangle && (
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2 bg-amber-100 text-amber-800 hover:bg-amber-200">
                    ▼ Black Triangle
                  </Badge>
                  <span className="text-sm text-muted-foreground">Subject to additional monitoring</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium mb-2">Properties</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center">
              {medication.sugarFree ? (
                <Check className="h-4 w-4 mr-2 text-green-500" />
              ) : (
                <X className="h-4 w-4 mr-2 text-gray-400" />
              )}
              <span>Sugar Free</span>
            </div>
            <div className="flex items-center">
              {medication.glutenFree ? (
                <Check className="h-4 w-4 mr-2 text-green-500" />
              ) : (
                <X className="h-4 w-4 mr-2 text-gray-400" />
              )}
              <span>Gluten Free</span>
            </div>
            <div className="flex items-center">
              {medication.preservativeFree ? (
                <Check className="h-4 w-4 mr-2 text-green-500" />
              ) : (
                <X className="h-4 w-4 mr-2 text-gray-400" />
              )}
              <span>Preservative Free</span>
            </div>
          </div>
        </div>
      </CardContent>
      {onClose && (
        <CardFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
