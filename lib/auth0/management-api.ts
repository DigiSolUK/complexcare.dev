import { ManagementClient } from "auth0-js"

// Initialize the Auth0 Management API client
const getManagementClient = () => {
  const domain = process.env.AUTH0_ISSUER_BASE_URL?.replace("https://", "") || ""
  const clientId = process.env.AUTH0_CLIENT_ID || ""
  const clientSecret = process.env.AUTH0_CLIENT_SECRET || ""

  if (!domain || !clientId || !clientSecret) {
    throw new Error("Auth0 configuration is missing. Please check your environment variables.")
  }

  return new ManagementClient({
    domain,
    clientId,
    clientSecret,
    scope: "read:users update:users delete:users create:users read:user_idp_tokens read:logs",
  })
}

export default getManagementClient
