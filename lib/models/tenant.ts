export interface Tenant {
  id: string
  name: string
  domain: string
  logo_url?: string
  primary_color?: string
  secondary_color?: string
  created_at: Date
  updated_at: Date
  status: "active" | "inactive" | "pending"
  pricing_tier_id: string
}

