/**
 * Service for handling file uploads
 */
export const UploadService = {
  /**
   * Uploads a file to the server
   *
   * @param file The file to upload
   * @param folder Optional folder path
   * @returns The URL of the uploaded file
   */
  async uploadFile(file: File, folder = "avatars"): Promise<string> {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", folder)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to upload file")
      }

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error("Upload service error:", error)
      throw error
    }
  },

  /**
   * Validates a file before upload
   *
   * @param file The file to validate
   * @returns Object with validation result
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are supported.",
      }
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: "File too large. Maximum size is 5MB.",
      }
    }

    return { valid: true }
  },

  /**
   * Gets the file extension from a file name
   *
   * @param fileName The file name
   * @returns The file extension
   */
  getFileExtension(fileName: string): string {
    return fileName.split(".").pop() || ""
  },

  /**
   * Formats a file size in bytes to a human-readable string
   *
   * @param bytes The file size in bytes
   * @returns Formatted file size string
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  },
}
