"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Error() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
        <p className="mb-6 text-gray-600">
          We apologize for the inconvenience. Please try again or contact support if the problem persists.
        </p>
        <div className="space-y-4">
          <Button onClick={() => window.location.reload()} variant="destructive">
            Try Again
          </Button>
          <div>
            <Link href="/" className="inline-block text-sm text-blue-600 hover:underline">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
