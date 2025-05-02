import { neon } from "@neondatabase/serverless"
import { logError } from "./error-logging-service"
import { DEFAULT_TENANT_ID } from "../tenant"

export interface Office365Integration {
  id: string
  tenant_id: string
  client_id: string
  client_secret: string
  tenant_name: string // Office 365 tenant name
  redirect_uri: string
  scopes: string[]
  is_enabled: boolean
  created_at: Date
  updated_at: Date
}

export interface Office365Token {
  id: string
  tenant_id: string
  user_id: string
  access_token: string
  refresh_token: string
  expires_at: Date
  scopes: string[]
  created_at: Date
  updated_at: Date
}

export class Office365IntegrationService {
  /**
   * Get Office 365 integration settings for a tenant
   */
  static async getIntegrationSettings(tenantId: string): Promise<Office365Integration | null> {
    try {
      const sql = neon(process.env.DATABASE_URL || "")
      const result = await sql`
        SELECT * FROM office365_integration 
        WHERE tenant_id = ${tenantId}
        LIMIT 1
      `
      return result.length > 0 ? result[0] : null
    } catch (error) {
      logError({
        message: `Error fetching Office 365 integration settings: ${error}`,
        stack: (error as Error).stack,
        componentPath: "lib/services/office365-integration-service.ts:getIntegrationSettings",
        severity: "medium",
      })
      return null
    }
  }

  /**
   * Save or update Office 365 integration settings
   */
  static async saveIntegrationSettings(settings: Partial<Office365Integration>): Promise<Office365Integration | null> {
    try {
      const sql = neon(process.env.DATABASE_URL || "")

      // Check if settings already exist for this tenant
      const existingSettings = await this.getIntegrationSettings(settings.tenant_id || DEFAULT_TENANT_ID)

      if (existingSettings) {
        // Update existing settings
        const result = await sql`
          UPDATE office365_integration
          SET 
            client_id = ${settings.client_id ?? existingSettings.client_id},
            client_secret = ${settings.client_secret ?? existingSettings.client_secret},
            tenant_name = ${settings.tenant_name ?? existingSettings.tenant_name},
            redirect_uri = ${settings.redirect_uri ?? existingSettings.redirect_uri},
            scopes = ${settings.scopes ? JSON.stringify(settings.scopes) : existingSettings.scopes},
            is_enabled = ${settings.is_enabled ?? existingSettings.is_enabled},
            updated_at = NOW()
          WHERE id = ${existingSettings.id}
          RETURNING *
        `
        return result[0]
      } else {
        // Create new settings
        const result = await sql`
          INSERT INTO office365_integration (
            tenant_id, 
            client_id, 
            client_secret, 
            tenant_name, 
            redirect_uri, 
            scopes, 
            is_enabled,
            created_at,
            updated_at
          ) VALUES (
            ${settings.tenant_id || DEFAULT_TENANT_ID},
            ${settings.client_id},
            ${settings.client_secret},
            ${settings.tenant_name},
            ${settings.redirect_uri},
            ${settings.scopes ? JSON.stringify(settings.scopes) : JSON.stringify(["Mail.Read", "Mail.Send", "Calendars.ReadWrite"])},
            ${settings.is_enabled || false},
            NOW(),
            NOW()
          )
          RETURNING *
        `
        return result[0]
      }
    } catch (error) {
      logError({
        message: `Error saving Office 365 integration settings: ${error}`,
        stack: (error as Error).stack,
        componentPath: "lib/services/office365-integration-service.ts:saveIntegrationSettings",
        severity: "high",
      })
      return null
    }
  }

  /**
   * Store a user's OAuth token
   */
  static async storeUserToken(token: Partial<Office365Token>): Promise<Office365Token | null> {
    try {
      const sql = neon(process.env.DATABASE_URL || "")

      // Check if token already exists for this user
      const existingToken = await sql`
        SELECT * FROM office365_tokens
        WHERE tenant_id = ${token.tenant_id || DEFAULT_TENANT_ID} AND user_id = ${token.user_id}
        LIMIT 1
      `

      if (existingToken.length > 0) {
        // Update existing token
        const result = await sql`
          UPDATE office365_tokens
          SET 
            access_token = ${token.access_token},
            refresh_token = ${token.refresh_token || existingToken[0].refresh_token},
            expires_at = ${token.expires_at},
            scopes = ${token.scopes ? JSON.stringify(token.scopes) : existingToken[0].scopes},
            updated_at = NOW()
          WHERE id = ${existingToken[0].id}
          RETURNING *
        `
        return result[0]
      } else {
        // Create new token
        const result = await sql`
          INSERT INTO office365_tokens (
            tenant_id,
            user_id,
            access_token,
            refresh_token,
            expires_at,
            scopes,
            created_at,
            updated_at
          ) VALUES (
            ${token.tenant_id || DEFAULT_TENANT_ID},
            ${token.user_id},
            ${token.access_token},
            ${token.refresh_token},
            ${token.expires_at},
            ${token.scopes ? JSON.stringify(token.scopes) : JSON.stringify([])},
            NOW(),
            NOW()
          )
          RETURNING *
        `
        return result[0]
      }
    } catch (error) {
      logError({
        message: `Error storing Office 365 token: ${error}`,
        stack: (error as Error).stack,
        componentPath: "lib/services/office365-integration-service.ts:storeUserToken",
        severity: "medium",
      })
      return null
    }
  }

  /**
   * Get a user's OAuth token
   */
  static async getUserToken(userId: string, tenantId: string): Promise<Office365Token | null> {
    try {
      const sql = neon(process.env.DATABASE_URL || "")
      const result = await sql`
        SELECT * FROM office365_tokens
        WHERE user_id = ${userId} AND tenant_id = ${tenantId}
        LIMIT 1
      `
      return result.length > 0 ? result[0] : null
    } catch (error) {
      logError({
        message: `Error fetching Office 365 token: ${error}`,
        stack: (error as Error).stack,
        componentPath: "lib/services/office365-integration-service.ts:getUserToken",
        severity: "medium",
      })
      return null
    }
  }

  /**
   * Check if a token is expired and needs refreshing
   */
  static isTokenExpired(token: Office365Token): boolean {
    const now = new Date()
    const expiresAt = new Date(token.expires_at)

    // Consider token expired if it expires in less than 5 minutes
    return expiresAt.getTime() - now.getTime() < 5 * 60 * 1000
  }

  /**
   * Generate the OAuth authorization URL
   */
  static async getAuthorizationUrl(tenantId: string, state: string): Promise<string | null> {
    try {
      const settings = await this.getIntegrationSettings(tenantId)

      if (!settings || !settings.is_enabled) {
        return null
      }

      const scopes = Array.isArray(settings.scopes) ? settings.scopes : JSON.parse(settings.scopes as unknown as string)

      const authUrl = new URL(`https://login.microsoftonline.com/${settings.tenant_name}/oauth2/v2.0/authorize`)
      authUrl.searchParams.append("client_id", settings.client_id)
      authUrl.searchParams.append("response_type", "code")
      authUrl.searchParams.append("redirect_uri", settings.redirect_uri)
      authUrl.searchParams.append("scope", scopes.join(" "))
      authUrl.searchParams.append("response_mode", "query")
      authUrl.searchParams.append("state", state)

      return authUrl.toString()
    } catch (error) {
      logError({
        message: `Error generating Office 365 authorization URL: ${error}`,
        stack: (error as Error).stack,
        componentPath: "lib/services/office365-integration-service.ts:getAuthorizationUrl",
        severity: "medium",
      })
      return null
    }
  }
}

// Export functions for use in API routes
export async function getOffice365IntegrationSettings(tenantId: string) {
  return Office365IntegrationService.getIntegrationSettings(tenantId)
}

export async function saveOffice365IntegrationSettings(settings: Partial<Office365Integration>) {
  return Office365IntegrationService.saveIntegrationSettings(settings)
}

export async function storeOffice365UserToken(token: Partial<Office365Token>) {
  return Office365IntegrationService.storeUserToken(token)
}

export async function getOffice365UserToken(userId: string, tenantId: string) {
  return Office365IntegrationService.getUserToken(userId, tenantId)
}

export async function isOffice365TokenExpired(token: Office365Token) {
  return Office365IntegrationService.isTokenExpired(token)
}

export async function getOffice365AuthorizationUrl(tenantId: string, state: string) {
  return Office365IntegrationService.getAuthorizationUrl(tenantId, state)
}
