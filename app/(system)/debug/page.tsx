export default function DebugPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">System Diagnostics</h1>

        <div className="space-y-6">
          <div className="p-4 bg-gray-100 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Environment Information</h2>
            <p className="text-sm text-gray-600">Next.js Environment: {process.env.NODE_ENV}</p>
          </div>

          <div className="p-4 bg-gray-100 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Auth Status</h2>
            <p className="text-sm text-gray-600">This is a static page that doesn't check authentication status.</p>
          </div>

          <div className="p-4 bg-gray-100 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Database Connection</h2>
            <p className="text-sm text-gray-600">Database connection status is not checked on this static page.</p>
          </div>
        </div>

        <div className="mt-6">
          <a href="/" className="inline-block px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors">
            Return Home
          </a>
        </div>
      </div>
    </div>
  )
}
