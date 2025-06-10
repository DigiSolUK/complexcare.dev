import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <div className="h-6 w-32 animate-pulse rounded-md bg-gray-200"></div>
          <div className="h-4 w-48 animate-pulse rounded-md bg-gray-200"></div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
          <div className="mt-4 h-4 w-24 animate-pulse rounded-md bg-gray-200"></div>
        </CardContent>
      </Card>
    </div>
  )
}
