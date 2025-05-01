const https = require("https")

// Configuration
const config = {
  baseUrl: "https://complexcare.dev",
  tenantId: "ba367cfe-6de0-4180-9566-1002b75cf82c",
  endpoints: [
    { name: "Public Health Check", path: "/api/public/health" },
    { name: "Public Test", path: "/api/public/test" },
    { name: "Public Patients", path: "/api/public/patients" },
    { name: "Public Appointments", path: "/api/public/appointments" },
    { name: "Public Tasks", path: "/api/public/tasks" },
    { name: "Public Care Professionals", path: "/api/public/care-professionals" },
  ],
}

// Function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, options, (res) => {
      let data = ""

      res.on("data", (chunk) => {
        data += chunk
      })

      res.on("end", () => {
        try {
          // Try to parse as JSON
          const jsonData = JSON.parse(data)
          resolve({ statusCode: res.statusCode, data: jsonData })
        } catch (e) {
          // Return as text if not valid JSON
          resolve({ statusCode: res.statusCode, data: data.substring(0, 100) + "..." })
        }
      })
    })

    req.on("error", (error) => {
      reject(error)
    })

    req.end()
  })
}

// Main function to test API endpoints
async function testPublicApiEndpoints() {
  console.log("🔍 Testing Public API Endpoints")
  console.log("==============================")
  console.log(`Base URL: ${config.baseUrl}`)
  console.log(`Tenant ID: ${config.tenantId}`)
  console.log("")

  let successful = 0
  let failed = 0
  const failedEndpoints = []

  for (const endpoint of config.endpoints) {
    try {
      console.log(`Testing ${endpoint.name} endpoint: ${endpoint.path}`)

      const url = `${config.baseUrl}${endpoint.path}?tenantId=${config.tenantId}`
      const options = {
        headers: {
          "x-tenant-id": config.tenantId,
          "Content-Type": "application/json",
        },
      }

      const response = await makeRequest(url, options)

      if (response.statusCode >= 200 && response.statusCode < 300) {
        console.log(`✅ ${endpoint.name}: Success (${response.statusCode})`)
        console.log(`Response: ${JSON.stringify(response.data).substring(0, 100)}...`)
        successful++
      } else {
        console.log(`❌ ${endpoint.name}: Failed (${response.statusCode})`)
        console.log(`Response: ${JSON.stringify(response.data)}`)
        failed++
        failedEndpoints.push(`${endpoint.name} (${response.statusCode})`)
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: Error`)
      console.log(`${error.message}`)
      failed++
      failedEndpoints.push(`${endpoint.name} (Error: ${error.message})`)
    }

    console.log("------------------------")
  }

  console.log("\nSummary:")
  console.log(`Successful: ${successful}/${config.endpoints.length}`)

  if (failed > 0) {
    console.log("\nFailed endpoints:")
    failedEndpoints.forEach((endpoint) => {
      console.log(`- ${endpoint}`)
    })
  }
}

// Run the tests
testPublicApiEndpoints().catch((error) => {
  console.error("Script failed with error:", error)
})
