"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DebugSession() {
  const { data: session, status } = useSession()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Debug</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <strong>Status:</strong> {status}
          </p>
          <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-auto max-h-96">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}
