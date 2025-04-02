"use client"

export function AuthStatus() {
  // In demo mode, we're always "authenticated"
  return (
    <div>
      <p>Demo Mode: Always Authenticated</p>
      <pre className="bg-gray-100 p-2 rounded mt-2 text-xs overflow-auto">
        {JSON.stringify({ user: { name: "Demo User", email: "demo@complexcare.dev" } }, null, 2)}
      </pre>
    </div>
  )
}

