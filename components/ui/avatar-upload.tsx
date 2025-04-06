"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { getInitials } from "@/lib/utils"

interface AvatarUploadProps {
  name: string
  avatarUrl?: string
  onAvatarChange: (url: string) => void
}

export function AvatarUpload({ name, avatarUrl, onAvatarChange }: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(avatarUrl)

  // In a real app, this would upload to a storage service
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreviewUrl(result)
        onAvatarChange(result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Avatar className="h-24 w-24">
        <AvatarImage src={previewUrl} alt={name} />
        <AvatarFallback className="text-lg">{getInitials(name)}</AvatarFallback>
      </Avatar>
      <div className="relative">
        <Button variant="outline" size="sm" className="flex items-center gap-1" type="button">
          <Upload className="h-4 w-4" />
          <span>Upload</span>
        </Button>
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleFileChange}
        />
      </div>
    </div>
  )
}

