export interface CareProfessional {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  role: string
  specialization?: string[]
  qualifications?: string[]
  status: string
  tenant_id: string
  avatarUrl?: string
  created_at: string
  updated_at: string
}

