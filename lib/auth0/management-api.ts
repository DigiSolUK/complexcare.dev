import { ManagementClient } from "auth0"

// Cache the management client instance
let managementClient: ManagementClient | null = null

export default function getManagementClient(): ManagementClient {
  if (managementClient) {
    return managementClient
  }

  // Check for required environment variables
  const domain = process.env.AUTH0_ISSUER_BASE_URL?.replace(/^https?:\/\//, "") || ""
  const clientId = process.env.AUTH0_CLIENT_ID
  const clientSecret = process.env.AUTH0_CLIENT_SECRET

  if (!domain || !clientId || !clientSecret) {
    throw new Error("Missing required Auth0 environment variables")
  }

  // Create a new management client
  managementClient = new ManagementClient({
    domain,
    clientId,
    clientSecret,
    scope: "read:users update:users delete:users create:users read:roles create:roles",
  })

  return managementClient
}
