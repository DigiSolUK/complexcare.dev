"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"

interface BodyMapProps {
  selectedAreas?: string[]
  onChange?: (areas: string[]) => void
  readOnly?: boolean
  notes?: string
  onNotesChange?: (notes: string) => void
}

export function BodyMap({ selectedAreas = [], onChange, readOnly = false, notes = "", onNotesChange }: BodyMapProps) {
  const [hoveredArea, setHoveredArea] = useState<string | null>(null)

  const bodyParts = [
    { id: "head", label: "Head", coords: "50,30,70,30,70,50,30,50,30,30" },
    { id: "chest", label: "Chest", coords: "30,50,70,50,70,90,30,90" },
    { id: "abdomen", label: "Abdomen", coords: "30,90,70,90,70,120,30,120" },
    { id: "left_arm", label: "Left Arm", coords: "30,50,20,50,10,90,20,120,30,120,30,90" },
    { id: "right_arm", label: "Right Arm", coords: "70,50,80,50,90,90,80,120,70,120,70,90" },
    { id: "left_leg", label: "Left Leg", coords: "30,120,50,120,50,180,30,180" },
    { id: "right_leg", label: "Right Leg", coords: "50,120,70,120,70,180,50,180" },
    { id: "left_shoulder", label: "Left Shoulder", coords: "30,50,30,60,20,60,20,50" },
    { id: "right_shoulder", label: "Right Shoulder", coords: "70,50,70,60,80,60,80,50" },
    { id: "upper_back", label: "Upper Back", coords: "100,50,140,50,140,90,100,90" },
    { id: "lower_back", label: "Lower Back", coords: "100,90,140,90,140,120,100,120" },
    { id: "buttocks", label: "Buttocks", coords: "100,120,140,120,140,140,100,140" },
    { id: "back_left_leg", label: "Back Left Leg", coords: "100,140,120,140,120,180,100,180" },
    { id: "back_right_leg", label: "Back Right Leg", coords: "120,140,140,140,140,180,120,180" },
  ]

  const handleAreaClick = (areaId: string) => {
    if (readOnly) return

    const newSelectedAreas = selectedAreas.includes(areaId)
      ? selectedAreas.filter((id) => id !== areaId)
      : [...selectedAreas, areaId]

    onChange?.(newSelectedAreas)
  }

  const getAreaColor = (areaId: string) => {
    if (selectedAreas.includes(areaId)) {
      return "#ef4444" // Red for selected areas
    }
    if (hoveredArea === areaId && !readOnly) {
      return "#93c5fd" // Light blue for hover
    }
    return "transparent"
  }

  return (
    <div className="space-y-4">
      <div className="relative mx-auto" style={{ width: "200px", height: "200px" }}>
        <svg viewBox="0 0 150 200" className="w-full h-full">
          {/* Front view body outline */}
          <path
            d="M30,30 L70,30 L70,50 L80,50 L90,90 L80,120 L70,120 L70,180 L50,180 L50,120 L30,120 L20,120 L10,90 L20,50 L30,50 Z"
            fill="none"
            stroke="#888"
            strokeWidth="1"
          />

          {/* Back view body outline */}
          <path
            d="M100,30 L140,30 L140,50 L150,50 L160,90 L150,120 L140,120 L140,180 L120,180 L120,140 L100,140 L100,180 L80,180 L80,120 L90,120 L100,90 L90,50 L100,50 Z"
            fill="none"
            stroke="#888"
            strokeWidth="1"
          />

          {/* Head outlines */}
          <ellipse cx="50" cy="20" rx="20" ry="20" fill="none" stroke="#888" strokeWidth="1" />
          <ellipse cx="120" cy="20" rx="20" ry="20" fill="none" stroke="#888" strokeWidth="1" />

          {/* Interactive areas */}
          {bodyParts.map((part) => (
            <polygon
              key={part.id}
              points={part.coords}
              fill={getAreaColor(part.id)}
              stroke={selectedAreas.includes(part.id) ? "#b91c1c" : "transparent"}
              strokeWidth="1"
              style={{ cursor: readOnly ? "default" : "pointer" }}
              onClick={() => handleAreaClick(part.id)}
              onMouseEnter={() => setHoveredArea(part.id)}
              onMouseLeave={() => setHoveredArea(null)}
              opacity="0.6"
            />
          ))}

          {/* Labels */}
          <text x="50" y="10" textAnchor="middle" fontSize="8">
            Front
          </text>
          <text x="120" y="10" textAnchor="middle" fontSize="8">
            Back
          </text>
        </svg>
      </div>

      {selectedAreas.length > 0 && (
        <div className="text-sm">
          <div className="font-medium mb-1">Selected areas:</div>
          <div className="text-muted-foreground">
            {selectedAreas.map((area) => bodyParts.find((part) => part.id === area)?.label).join(", ")}
          </div>
        </div>
      )}

      {(notes || !readOnly) && (
        <div>
          <div className="font-medium mb-1 text-sm">Notes:</div>
          {readOnly ? (
            <div className="text-sm text-muted-foreground">{notes}</div>
          ) : (
            <Textarea
              value={notes}
              onChange={(e) => onNotesChange?.(e.target.value)}
              placeholder="Add notes about the selected areas..."
              className="h-20"
            />
          )}
        </div>
      )}
    </div>
  )
}
