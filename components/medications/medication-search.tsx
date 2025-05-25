"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

interface MedicationOption {
  value: string
  label: string
  type: "VMP" | "AMP"
  supplier?: string
}

interface MedicationSearchProps {
  onSelect: (medication: MedicationOption) => void
  placeholder?: string
  className?: string
  defaultValue?: string
}

export function MedicationSearch({
  onSelect,
  placeholder = "Search medications...",
  className,
  defaultValue,
}: MedicationSearchProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [medications, setMedications] = useState<MedicationOption[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedMedication, setSelectedMedication] = useState<MedicationOption | null>(null)

  // Fetch medications when search term changes
  useEffect(() => {
    const fetchMedications = async () => {
      if (searchTerm.length < 3) {
        setMedications([])
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/medications/search?term=${encodeURIComponent(searchTerm)}`)

        if (!response.ok) {
          throw new Error("Failed to fetch medications")
        }

        const data = await response.json()
        setMedications(data)
      } catch (error) {
        console.error("Error fetching medications:", error)
        toast({
          title: "Error",
          description: "Failed to fetch medications. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchMedications, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  // Fetch medication details if defaultValue is provided
  useEffect(() => {
    const fetchMedicationDetails = async () => {
      if (!defaultValue) return

      setLoading(true)
      try {
        const response = await fetch(`/api/medications/${defaultValue}`)

        if (!response.ok) {
          throw new Error("Failed to fetch medication details")
        }

        const data = await response.json()
        setSelectedMedication({
          value: data.id,
          label: data.name,
          type: data.type,
          supplier: data.supplier,
        })
      } catch (error) {
        console.error("Error fetching medication details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMedicationDetails()
  }, [defaultValue])

  const handleSelect = (medication: MedicationOption) => {
    setSelectedMedication(medication)
    setOpen(false)
    onSelect(medication)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : selectedMedication ? (
            <div className="flex items-center gap-2 text-left">
              <span className="truncate">{selectedMedication.label}</span>
              <Badge variant="outline" className="ml-2">
                {selectedMedication.type}
              </Badge>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search medications..." value={searchTerm} onValueChange={setSearchTerm} />
          {loading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
          {!loading && (
            <CommandList>
              <CommandEmpty>
                {searchTerm.length < 3 ? "Type at least 3 characters to search" : "No medications found"}
              </CommandEmpty>
              <CommandGroup heading="Virtual Medicinal Products (Generic)">
                {medications
                  .filter((med) => med.type === "VMP")
                  .map((medication) => (
                    <CommandItem
                      key={medication.value}
                      value={medication.value}
                      onSelect={() => handleSelect(medication)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedMedication?.value === medication.value ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <div className="flex flex-col">
                        <span>{medication.label}</span>
                        <span className="text-xs text-muted-foreground">Generic</span>
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandGroup heading="Actual Medicinal Products (Branded)">
                {medications
                  .filter((med) => med.type === "AMP")
                  .map((medication) => (
                    <CommandItem
                      key={medication.value}
                      value={medication.value}
                      onSelect={() => handleSelect(medication)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedMedication?.value === medication.value ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <div className="flex flex-col">
                        <span>{medication.label}</span>
                        <span className="text-xs text-muted-foreground">{medication.supplier}</span>
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
