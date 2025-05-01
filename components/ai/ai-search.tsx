"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, SearchIcon } from "lucide-react"

export function AISearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<string[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call to AI-powered search
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock search results
      const mockResults = [
        "Patient John Smith - Diabetes Management Plan",
        "Medication: Metformin 500mg twice daily",
        "Appointment: John Smith - Follow-up with Dr. Johnson",
      ]

      setResults(mockResults)
    } catch (error) {
      console.error("Error performing AI-enhanced search:", error)
      setError("An error occurred while performing the search")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SearchIcon className="h-5 w-5" />
          AI-Enhanced Search
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search with natural language..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </Button>
          </div>

          {error && <div className="text-red-500">{error}</div>}

          {results && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Search Results:</h3>
              <ul className="list-disc pl-5">
                {results.map((result, index) => (
                  <li key={index} className="text-sm">
                    {result}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
