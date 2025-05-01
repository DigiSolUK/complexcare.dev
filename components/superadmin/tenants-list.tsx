"use client"

import { useState, useEffect } from "react"

interface Tenant {
  id: string
  name: string
  domain: string
  status: "active" | "suspended" | "pending"
  userCount: number
  createdAt: string
}

export function TenantsList() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await fetch('/api/superadmin/tenants')
