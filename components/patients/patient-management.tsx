"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DataGrid, type GridColDef, type GridValueGetterParams } from "@mui/x-data-grid"
import { Button, Box, Typography, TextField, InputAdornment, IconButton } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import { useTenant } from "@/contexts"

interface Patient {
  id: number
  firstName: string
  lastName: string
  age: number
  email: string
  phone: string
}

const PatientManagement = () => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const { tenantId } = useTenant()

  useEffect(() => {
    // Fetch patients from API based on tenantId
    const fetchPatients = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/patients?tenantId=${tenantId}`)
        const data: Patient[] = await response.json()
        setPatients(data)
      } catch (error) {
        console.error("Error fetching patients:", error)
      }
    }

    fetchPatients()
  }, [tenantId])

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "firstName", headerName: "First name", width: 130 },
    { field: "lastName", headerName: "Last name", width: 130 },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 90,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
    },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (params: GridValueGetterParams) => `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    },
  ]

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredPatients = patients.filter((patient) => {
    const searchStr = `${patient.firstName} ${patient.lastName} ${patient.email} ${patient.phone}`.toLowerCase()
    return searchStr.includes(searchTerm.toLowerCase())
  })

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Patient Management
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <TextField
          label="Search Patients"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" startIcon={<AddIcon />}>
          Add Patient
        </Button>
      </Box>

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={filteredPatients}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
        />
      </div>
    </Box>
  )
}

export default PatientManagement
