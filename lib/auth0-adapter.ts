// This file provides adapter functions for Auth0 integration
// to match the imports used in locked files

// Mock getSession function to match the import in the API routes
export function getSession() {
  return Promise.resolve({
    user: {
      sub: "mock-user-id",
      name: "Mock User",
      email: "mock@example.com",
      org_id: process.env.DEFAULT_TENANT_ID,
    },
  })
}

// Mock Auth0 provider to match the import in the auth route
const Auth0 = {
  id: "auth0",
  name: "Auth0",
  type: "oauth",
  wellKnown: `https://${process.env.AUTH0_ISSUER_BASE_URL}/.well-known/openid-configuration`,
  authorization: { params: { scope: "openid email profile" } },
  idToken: true,
  checks: ["pkce", "state"],
  profile(profile: any) {
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
      image: profile.picture,
    }
  },
}

// Export as default to match the import in the auth route
export default Auth0
