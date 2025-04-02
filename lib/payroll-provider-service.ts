import { sql } from "@/lib/db"

export type PayrollProvider = {
  id: string
  tenant_id: string
  name: string
  provider_type: string
  api_endpoint?: string
  api_key_id?: string
  config: Record<string, any>
  is_active: boolean
  created_at: string
  updated_at: string
}

export type PayrollSubmission = {
  id: string
  tenant_id: string
  provider_id: string
  submission_date: string
  pay_period_start: string
  pay_period_end: string
  status: "draft" | "submitted" | "processed" | "error"
  error_message?: string
  submission_data: Record<string, any>
  response_data?: Record<string, any>
  created_at: string
  updated_at: string
}

export async function getPayrollProviders() {
  // In a real app, this would fetch from the database
  // We're using mock data for now
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

  return [
    {
      id: "pp1",
      name: "Sage Payroll",
      type: "sage",
      status: "active",
      createdAt: "2023-09-15T10:30:00Z",
    },
    {
      id: "pp2",
      name: "Xero Integration",
      type: "xero",
      status: "active",
      createdAt: "2023-08-22T14:15:00Z",
    },
    {
      id: "pp3",
      name: "QuickBooks Payroll",
      type: "quickbooks",
      status: "inactive",
      createdAt: "2023-07-10T09:45:00Z",
    },
  ]
}

export async function getPayrollProvider(tenantId: string, id: string) {
  try {
    const [provider] = await sql`
      SELECT * FROM payroll_providers
      WHERE tenant_id = ${tenantId} AND id = ${id}
    `
    return { provider, error: null }
  } catch (error) {
    console.error("Error fetching payroll provider:", error)
    return { provider: null, error: "Failed to fetch payroll provider" }
  }
}

export async function createPayrollProvider(data: any) {
  // In a real app, this would save to the database
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

  return {
    id: Math.random().toString(36).substring(2, 11),
    ...data,
    status: "active",
    createdAt: new Date().toISOString(),
  }
}

export async function updatePayrollProvider(id: string, data: any) {
  // In a real app, this would update the database
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

  return {
    id,
    ...data,
    updatedAt: new Date().toISOString(),
  }
}

export async function deletePayrollProvider(id: string) {
  // In a real app, this would delete from the database
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

  return { success: true }
}

export async function submitPayrollToProvider(
  tenantId: string,
  providerId: string,
  payPeriodStart: string,
  payPeriodEnd: string,
  payrollData: any,
) {
  try {
    // First, create a submission record
    const [submission] = await sql`
      INSERT INTO payroll_submissions (
        tenant_id, provider_id, pay_period_start, pay_period_end,
        status, submission_data
      ) VALUES (
        ${tenantId}, ${providerId}, ${payPeriodStart}, ${payPeriodEnd},
        'draft', ${JSON.stringify(payrollData)}
      )
      RETURNING *
    `

    // Get provider details
    const { provider } = await getPayrollProvider(tenantId, providerId)
    if (!provider) {
      throw new Error("Payroll provider not found")
    }

    // In a real implementation, this would make an API call to the provider
    // For now, we'll simulate a successful submission
    const responseData = {
      submission_id: `${provider.provider_type}-${Date.now()}`,
      status: "accepted",
      timestamp: new Date().toISOString(),
    }

    // Update the submission with the response
    const [updatedSubmission] = await sql`
      UPDATE payroll_submissions
      SET 
        status = 'submitted',
        response_data = ${JSON.stringify(responseData)},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${submission.id}
      RETURNING *
    `

    return { submission: updatedSubmission, error: null }
  } catch (error) {
    console.error("Error submitting payroll to provider:", error)
    return { submission: null, error: "Failed to submit payroll to provider" }
  }
}

export async function getPayrollSubmissions(tenantId: string, providerId?: string) {
  try {
    let query = sql`
      SELECT s.*, p.name as provider_name
      FROM payroll_submissions s
      JOIN payroll_providers p ON s.provider_id = p.id
      WHERE s.tenant_id = ${tenantId}
    `

    if (providerId) {
      query = sql`${query} AND s.provider_id = ${providerId}`
    }

    query = sql`${query} ORDER BY s.submission_date DESC`

    const submissions = await query
    return { submissions, error: null }
  } catch (error) {
    console.error("Error fetching payroll submissions:", error)
    return { submissions: [], error: "Failed to fetch payroll submissions" }
  }
}

export async function getPayrollSubmission(tenantId: string, id: string) {
  try {
    const [submission] = await sql`
      SELECT s.*, p.name as provider_name, p.provider_type
      FROM payroll_submissions s
      JOIN payroll_providers p ON s.provider_id = p.id
      WHERE s.tenant_id = ${tenantId} AND s.id = ${id}
    `
    return { submission, error: null }
  } catch (error) {
    console.error("Error fetching payroll submission:", error)
    return { submission: null, error: "Failed to fetch payroll submission" }
  }
}

// Utility function to format payroll data for different providers
export function formatPayrollData(provider: PayrollProvider, payrollData: any[]) {
  switch (provider.provider_type) {
    case "sage":
      return formatForSage(payrollData, provider.config)
    case "xero":
      return formatForXero(payrollData, provider.config)
    case "quickbooks":
      return formatForQuickBooks(payrollData, provider.config)
    case "csv":
      return formatForCSV(payrollData, provider.config)
    default:
      return payrollData
  }
}

function formatForSage(payrollData: any[], config: Record<string, any>) {
  // Format data according to Sage Payroll API requirements
  return payrollData.map((item) => ({
    EmployeeID: item.user_id,
    PayPeriodStart: item.pay_period_start,
    PayPeriodEnd: item.pay_period_end,
    RegularHours: item.basic_hours,
    OvertimeHours: item.overtime_hours,
    SickHours: item.sick_hours,
    HolidayHours: item.holiday_hours,
    BasicPay: item.basic_pay,
    OvertimePay: item.overtime_pay,
    SickPay: item.sick_pay,
    HolidayPay: item.holiday_pay,
    Bonus: item.bonus,
    Deductions: item.deductions,
    TotalPay: item.total_pay,
    // Add any Sage-specific fields from config
    ...config.additionalFields,
  }))
}

function formatForXero(payrollData: any[], config: Record<string, any>) {
  // Format data according to Xero Payroll API requirements
  return payrollData.map((item) => ({
    EmployeeID: item.user_id,
    StartDate: item.pay_period_start,
    EndDate: item.pay_period_end,
    Hours: {
      Ordinary: item.basic_hours,
      Overtime: item.overtime_hours,
      Sick: item.sick_hours,
      Holiday: item.holiday_hours,
    },
    Earnings: {
      Ordinary: item.basic_pay,
      Overtime: item.overtime_pay,
      Sick: item.sick_pay,
      Holiday: item.holiday_pay,
      Bonus: item.bonus,
    },
    Deductions: item.deductions,
    NetPay: item.total_pay,
    // Add any Xero-specific fields from config
    ...config.additionalFields,
  }))
}

function formatForQuickBooks(payrollData: any[], config: Record<string, any>) {
  // Format data according to QuickBooks Payroll API requirements
  return payrollData.map((item) => ({
    Employee: {
      Id: item.user_id,
    },
    PayPeriod: {
      StartDate: item.pay_period_start,
      EndDate: item.pay_period_end,
    },
    RegularPay: {
      Hours: item.basic_hours,
      Rate: config.hourlyRate || 0,
      Amount: item.basic_pay,
    },
    OvertimePay: {
      Hours: item.overtime_hours,
      Rate: (config.hourlyRate || 0) * 1.5,
      Amount: item.overtime_pay,
    },
    SickPay: {
      Hours: item.sick_hours,
      Amount: item.sick_pay,
    },
    HolidayPay: {
      Hours: item.holiday_hours,
      Amount: item.holiday_pay,
    },
    Bonus: item.bonus,
    Deductions: item.deductions,
    NetPay: item.total_pay,
    // Add any QuickBooks-specific fields from config
    ...config.additionalFields,
  }))
}

function formatForCSV(payrollData: any[], config: Record<string, any>) {
  // Format data for CSV export
  // This would typically return an array of objects with consistent keys
  // that could be easily converted to CSV
  return payrollData.map((item) => ({
    EmployeeID: item.user_id,
    EmployeeName: item.user_name,
    PayPeriodStart: item.pay_period_start,
    PayPeriodEnd: item.pay_period_end,
    BasicHours: item.basic_hours,
    OvertimeHours: item.overtime_hours,
    SickHours: item.sick_hours,
    HolidayHours: item.holiday_hours,
    BasicPay: item.basic_pay,
    OvertimePay: item.overtime_pay,
    SickPay: item.sick_pay,
    HolidayPay: item.holiday_pay,
    Bonus: item.bonus,
    Deductions: item.deductions,
    TotalPay: item.total_pay,
    // Add any CSV-specific fields from config
    ...config.additionalFields,
  }))
}

