"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UploadService } from "@/lib/services/upload-service"
import { Loader2, Upload, X, Check, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onUploadComplete: (url: string) => void
  onUploadError?: (error: string) => void
  folder?: string
  accept?: string
  maxSizeMB?: number
  className?: string
  defaultValue?: string
  label?: string
}

export function FileUpload({
  onUploadComplete,
  onUploadError,
  folder = "avatars",
  accept = "image/jpeg, image/png, image/webp, image/gif",
  maxSizeMB = 5,
  className,
  defaultValue,
  label = "Upload file",
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(defaultValue || null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset states
    setError(null)
    setIsUploading(true)
    setUploadSuccess(false)

    // Validate file
    const validation = UploadService.validateFile(file)
    if (!validation.valid) {
      setError(validation.error || "Invalid file")
      setIsUploading(false)
      if (onUploadError) onUploadError(validation.error || "Invalid file")
      return
    }

    // Create preview
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    try {
      // Upload file
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", folder)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Upload failed")
      }

      const data = await response.json()

      // Show success state briefly
      setUploadSuccess(true)
      setTimeout(() => setUploadSuccess(false), 2000)

      // Call the callback with the URL
      onUploadComplete(data.url)
    } catch (err: any) {
      setError(err.message || "Failed to upload file")
      if (onUploadError) onUploadError(err.message || "Failed to upload file")
    } finally {
      setIsUploading(false)
    }
  }

  const clearFile = () => {
    setPreview(null)
    setError(null)
    setUploadSuccess(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onUploadComplete("")
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor="file-upload">{label}</Label>

      <div className="flex flex-col gap-2">
        {/* Preview area */}
        {preview && (
          <div className="relative w-24 h-24 mb-2">
            <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover rounded-md" />
            <button
              type="button"
              onClick={clearFile}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Upload button and input */}
        <div className="flex items-center gap-2">
          <Input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={cn("flex items-center gap-2", uploadSuccess && "bg-green-50 text-green-600 border-green-200")}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : uploadSuccess ? (
              <>
                <Check className="h-4 w-4" />
                Uploaded
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                {preview ? "Change file" : "Select file"}
              </>
            )}
          </Button>

          {preview && !isUploading && !uploadSuccess && (
            <Button type="button" variant="ghost" size="sm" onClick={clearFile} className="text-muted-foreground">
              Clear
            </Button>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive mt-1">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Help text */}
        <p className="text-xs text-muted-foreground mt-1">
          Accepted formats: JPEG, PNG, WebP, GIF. Max size: {maxSizeMB}MB
        </p>
      </div>
    </div>
  )
}
