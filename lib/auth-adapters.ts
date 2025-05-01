// This file provides adapter functions for Auth0 integration
// to match the imports used in locked files

import { getSession as getAuth0Session } from "@auth0/nextjs-auth0"

// Re-export getSession with the same signature
export function getSession(...args: Parameters<typeof getAuth0Session>) {
  return getAuth0Session(...args)
}
const Auth0 = (config: any) => {
  return {
    id: "auth0",
    name: "Auth0",
    type: "oauth",
    wellKnown: `https://${config.issuer}/.well-known/openid-configuration`,
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
    ...config,
  }
}

export default Auth0
