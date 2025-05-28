import { sql } from "@/lib/db-manager"
import { DEFAULT_TENANT_ID } from "@/lib/constants"

export interface AnalyticsMetric {
  id: string
  name: string
  value: number
  previousValue?: number
  change?: number
  changePercentage?: number
  trend?: "up" | "down" | "stable"
}

export interface TimeSeriesData {
  date: string
  value: number
  [key: string]: any
}

export interface PredictionData {
  actual: TimeSeriesData[]
  predicted: TimeSeriesData[]
  confidence?: {
    upper: TimeSeriesData[]
    lower: TimeSeriesData[]
  }
}

export const analyticsService = {
  // Get key performance indicators
  async getKPIs(tenantId: string = DEFAULT_TENANT_ID): Promise<AnalyticsMetric[]> {
    try {
      // Total patients
      const totalPatientsResult = await sql`
        SELECT COUNT(*) as count FROM patients
        WHERE tenant_id = ${tenantId}
      `
      const totalPatients = Number.parseInt(totalPatientsResult[0]?.count || "0")

      // Previous month total patients
      const previousMonthPatientsResult = await sql`
        SELECT COUNT(*) as count FROM patients
        WHERE tenant_id = ${tenantId}
        AND created_at < NOW() - INTERVAL '1 month'
      `
      const previousMonthPatients = Number.parseInt(previousMonthPatientsResult[0]?.count || "0")

      // New patients this month
      const newPatientsThisMonth = totalPatients - previousMonthPatients

      // Appointment completion rate
      const appointmentStatsResult = await sql`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
        FROM appointments
        WHERE tenant_id = ${tenantId}
        AND scheduled_date >= NOW() - INTERVAL '30 days'
      `
      const appointmentTotal = Number.parseInt(appointmentStatsResult[0]?.total || "0")
      const appointmentCompleted = Number.parseInt(appointmentStatsResult[0]?.completed || "0")
      const completionRate = appointmentTotal > 0 ? (appointmentCompleted / appointmentTotal) * 100 : 0

      // Previous month completion rate
      const prevAppointmentStatsResult = await sql`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
        FROM appointments
        WHERE tenant_id = ${tenantId}
        AND scheduled_date >= NOW() - INTERVAL '60 days'
        AND scheduled_date < NOW() - INTERVAL '30 days'
      `
      const prevAppointmentTotal = Number.parseInt(prevAppointmentStatsResult[0]?.total || "0")
      const prevAppointmentCompleted = Number.parseInt(prevAppointmentStatsResult[0]?.completed || "0")
      const prevCompletionRate = prevAppointmentTotal > 0 ? (prevAppointmentCompleted / prevAppointmentTotal) * 100 : 0

      // Average care plan adherence
      const adherenceResult = await sql`
        SELECT AVG(adherence_percentage) as avg_adherence
        FROM care_plan_reviews
        WHERE tenant_id = ${tenantId}
        AND review_date >= NOW() - INTERVAL '30 days'
      `
      const adherenceRate = Number.parseFloat(adherenceResult[0]?.avg_adherence || "0")

      // Previous month adherence
      const prevAdherenceResult = await sql`
        SELECT AVG(adherence_percentage) as avg_adherence
        FROM care_plan_reviews
        WHERE tenant_id = ${tenantId}
        AND review_date >= NOW() - INTERVAL '60 days'
        AND review_date < NOW() - INTERVAL '30 days'
      `
      const prevAdherenceRate = Number.parseFloat(prevAdherenceResult[0]?.avg_adherence || "0")

      // Clinical notes per patient
      const notesResult = await sql`
        SELECT 
          COUNT(cn.id) as note_count,
          COUNT(DISTINCT cn.patient_id) as patient_count
        FROM clinical_notes cn
        WHERE cn.tenant_id = ${tenantId}
        AND cn.created_at >= NOW() - INTERVAL '30 days'
      `
      const noteCount = Number.parseInt(notesResult[0]?.note_count || "0")
      const patientCount = Number.parseInt(notesResult[0]?.patient_count || "0")
      const notesPerPatient = patientCount > 0 ? noteCount / patientCount : 0

      // Previous month notes per patient
      const prevNotesResult = await sql`
        SELECT 
          COUNT(cn.id) as note_count,
          COUNT(DISTINCT cn.patient_id) as patient_count
        FROM clinical_notes cn
        WHERE cn.tenant_id = ${tenantId}
        AND cn.created_at >= NOW() - INTERVAL '60 days'
        AND cn.created_at < NOW() - INTERVAL '30 days'
      `
      const prevNoteCount = Number.parseInt(prevNotesResult[0]?.note_count || "0")
      const prevPatientCount = Number.parseInt(prevNotesResult[0]?.patient_count || "0")
      const prevNotesPerPatient = prevPatientCount > 0 ? prevNoteCount / prevPatientCount : 0

      return [
        {
          id: "total-patients",
          name: "Total Patients",
          value: totalPatients,
          previousValue: previousMonthPatients,
          change: newPatientsThisMonth,
          changePercentage: previousMonthPatients > 0 ? (newPatientsThisMonth / previousMonthPatients) * 100 : 0,
          trend: newPatientsThisMonth > 0 ? "up" : newPatientsThisMonth < 0 ? "down" : "stable",
        },
        {
          id: "appointment-completion",
          name: "Appointment Completion",
          value: completionRate,
          previousValue: prevCompletionRate,
          change: completionRate - prevCompletionRate,
          changePercentage:
            prevCompletionRate > 0 ? ((completionRate - prevCompletionRate) / prevCompletionRate) * 100 : 0,
          trend: completionRate > prevCompletionRate ? "up" : completionRate < prevCompletionRate ? "down" : "stable",
        },
        {
          id: "care-plan-adherence",
          name: "Care Plan Adherence",
          value: adherenceRate,
          previousValue: prevAdherenceRate,
          change: adherenceRate - prevAdherenceRate,
          changePercentage: prevAdherenceRate > 0 ? ((adherenceRate - prevAdherenceRate) / prevAdherenceRate) * 100 : 0,
          trend: adherenceRate > prevAdherenceRate ? "up" : adherenceRate < prevAdherenceRate ? "down" : "stable",
        },
        {
          id: "notes-per-patient",
          name: "Notes Per Patient",
          value: notesPerPatient,
          previousValue: prevNotesPerPatient,
          change: notesPerPatient - prevNotesPerPatient,
          changePercentage:
            prevNotesPerPatient > 0 ? ((notesPerPatient - prevNotesPerPatient) / prevNotesPerPatient) * 100 : 0,
          trend:
            notesPerPatient > prevNotesPerPatient ? "up" : notesPerPatient < prevNotesPerPatient ? "down" : "stable",
        },
      ]
    } catch (error) {
      console.error("Error fetching KPIs:", error)
      return []
    }
  },

  // Get patient demographics
  async getPatientDemographics(tenantId: string = DEFAULT_TENANT_ID): Promise<any> {
    try {
      // Age distribution
      const ageDistributionResult = await sql`
        SELECT 
          CASE 
            WHEN EXTRACT(YEAR FROM AGE(NOW(), date_of_birth)) < 18 THEN 'Under 18'
            WHEN EXTRACT(YEAR FROM AGE(NOW(), date_of_birth)) BETWEEN 18 AND 30 THEN '18-30'
            WHEN EXTRACT(YEAR FROM AGE(NOW(), date_of_birth)) BETWEEN 31 AND 45 THEN '31-45'
            WHEN EXTRACT(YEAR FROM AGE(NOW(), date_of_birth)) BETWEEN 46 AND 60 THEN '46-60'
            WHEN EXTRACT(YEAR FROM AGE(NOW(), date_of_birth)) BETWEEN 61 AND 75 THEN '61-75'
            ELSE 'Over 75'
          END as age_group,
          COUNT(*) as count
        FROM patients
        WHERE tenant_id = ${tenantId}
        GROUP BY age_group
        ORDER BY age_group
      `

      // Gender distribution
      const genderDistributionResult = await sql`
        SELECT 
          gender,
          COUNT(*) as count
        FROM patients
        WHERE tenant_id = ${tenantId}
        GROUP BY gender
      `

      // Location distribution (top 5)
      const locationDistributionResult = await sql`
        SELECT 
          city,
          COUNT(*) as count
        FROM patients
        WHERE tenant_id = ${tenantId}
        GROUP BY city
        ORDER BY count DESC
        LIMIT 5
      `

      return {
        ageDistribution: ageDistributionResult,
        genderDistribution: genderDistributionResult,
        locationDistribution: locationDistributionResult,
      }
    } catch (error) {
      console.error("Error fetching patient demographics:", error)
      return {
        ageDistribution: [],
        genderDistribution: [],
        locationDistribution: [],
      }
    }
  },

  // Get appointment trends
  async getAppointmentTrends(
    period: "daily" | "weekly" | "monthly" = "weekly",
    tenantId: string = DEFAULT_TENANT_ID,
  ): Promise<TimeSeriesData[]> {
    try {
      let dateFormat = "YYYY-MM-DD"
      let dateGroup = "DATE(scheduled_date)"
      let dateInterval = "1 day"

      if (period === "weekly") {
        dateFormat = "YYYY-WW"
        dateGroup = "DATE_TRUNC('week', scheduled_date)"
        dateInterval = "1 week"
      } else if (period === "monthly") {
        dateFormat = "YYYY-MM"
        dateGroup = "DATE_TRUNC('month', scheduled_date)"
        dateInterval = "1 month"
      }

      const result = await sql`
        SELECT 
          TO_CHAR(${dateGroup}, ${dateFormat}) as date,
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
          COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
          COUNT(CASE WHEN status = 'no_show' THEN 1 END) as no_show
        FROM appointments
        WHERE tenant_id = ${tenantId}
        AND scheduled_date >= NOW() - INTERVAL '12 months'
        GROUP BY date
        ORDER BY date
      `

      return result.map((row) => ({
        date: row.date,
        total: Number.parseInt(row.total),
        completed: Number.parseInt(row.completed),
        cancelled: Number.parseInt(row.cancelled),
        no_show: Number.parseInt(row.no_show),
        completion_rate: row.total > 0 ? (row.completed / row.total) * 100 : 0,
      }))
    } catch (error) {
      console.error("Error fetching appointment trends:", error)
      return []
    }
  },

  // Get care quality metrics
  async getCareQualityMetrics(tenantId: string = DEFAULT_TENANT_ID): Promise<any> {
    try {
      // Average care plan adherence over time
      const adherenceTrendResult = await sql`
        SELECT 
          TO_CHAR(DATE_TRUNC('month', review_date), 'YYYY-MM') as month,
          AVG(adherence_percentage) as adherence
        FROM care_plan_reviews
        WHERE tenant_id = ${tenantId}
        AND review_date >= NOW() - INTERVAL '12 months'
        GROUP BY month
        ORDER BY month
      `

      // Readmission rates
      const readmissionRateResult = await sql`
        SELECT 
          TO_CHAR(DATE_TRUNC('month', admission_date), 'YYYY-MM') as month,
          COUNT(*) as total_admissions,
          COUNT(CASE WHEN is_readmission = true THEN 1 END) as readmissions
        FROM medical_history
        WHERE tenant_id = ${tenantId}
        AND type = 'hospital_admission'
        AND admission_date >= NOW() - INTERVAL '12 months'
        GROUP BY month
        ORDER BY month
      `

      // Medication adherence
      const medicationAdherenceResult = await sql`
        SELECT 
          TO_CHAR(DATE_TRUNC('month', date), 'YYYY-MM') as month,
          AVG(adherence_percentage) as adherence
        FROM medication_administrations
        WHERE tenant_id = ${tenantId}
        AND date >= NOW() - INTERVAL '12 months'
        GROUP BY month
        ORDER BY month
      `

      return {
        adherenceTrend: adherenceTrendResult.map((row) => ({
          date: row.month,
          value: Number.parseFloat(row.adherence),
        })),
        readmissionRate: readmissionRateResult.map((row) => ({
          date: row.month,
          total: Number.parseInt(row.total_admissions),
          readmissions: Number.parseInt(row.readmissions),
          rate: row.total_admissions > 0 ? (row.readmissions / row.total_admissions) * 100 : 0,
        })),
        medicationAdherence: medicationAdherenceResult.map((row) => ({
          date: row.month,
          value: Number.parseFloat(row.adherence),
        })),
      }
    } catch (error) {
      console.error("Error fetching care quality metrics:", error)
      return {
        adherenceTrend: [],
        readmissionRate: [],
        medicationAdherence: [],
      }
    }
  },

  // Get staff performance metrics
  async getStaffPerformanceMetrics(tenantId: string = DEFAULT_TENANT_ID): Promise<any> {
    try {
      // Patient load by care professional
      const patientLoadResult = await sql`
        SELECT 
          cp.id,
          cp.name,
          COUNT(DISTINCT pa.patient_id) as patient_count
        FROM care_professionals cp
        LEFT JOIN patient_assignments pa ON cp.id = pa.care_professional_id AND pa.tenant_id = cp.tenant_id
        WHERE cp.tenant_id = ${tenantId}
        GROUP BY cp.id, cp.name
        ORDER BY patient_count DESC
      `

      // Appointment completion rate by care professional
      const appointmentCompletionResult = await sql`
        SELECT 
          cp.id,
          cp.name,
          COUNT(a.id) as total_appointments,
          COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completed_appointments
        FROM care_professionals cp
        LEFT JOIN appointments a ON cp.id = a.care_professional_id AND a.tenant_id = cp.tenant_id
        WHERE cp.tenant_id = ${tenantId}
        AND a.scheduled_date >= NOW() - INTERVAL '30 days'
        GROUP BY cp.id, cp.name
        ORDER BY total_appointments DESC
      `

      // Documentation timeliness
      const documentationTimelinessResult = await sql`
        SELECT 
          cp.id,
          cp.name,
          AVG(EXTRACT(EPOCH FROM (cn.created_at - a.end_time)) / 3600) as avg_documentation_hours
        FROM care_professionals cp
        JOIN appointments a ON cp.id = a.care_professional_id AND a.tenant_id = cp.tenant_id
        JOIN clinical_notes cn ON a.id = cn.appointment_id AND cn.tenant_id = cp.tenant_id
        WHERE cp.tenant_id = ${tenantId}
        AND a.status = 'completed'
        AND a.end_time IS NOT NULL
        AND a.scheduled_date >= NOW() - INTERVAL '30 days'
        GROUP BY cp.id, cp.name
        ORDER BY avg_documentation_hours
      `

      return {
        patientLoad: patientLoadResult,
        appointmentCompletion: appointmentCompletionResult.map((row) => ({
          id: row.id,
          name: row.name,
          total: Number.parseInt(row.total_appointments),
          completed: Number.parseInt(row.completed_appointments),
          rate: row.total_appointments > 0 ? (row.completed_appointments / row.total_appointments) * 100 : 0,
        })),
        documentationTimeliness: documentationTimelinessResult,
      }
    } catch (error) {
      console.error("Error fetching staff performance metrics:", error)
      return {
        patientLoad: [],
        appointmentCompletion: [],
        documentationTimeliness: [],
      }
    }
  },

  // Get predictive analytics
  async getPredictiveAnalytics(tenantId: string = DEFAULT_TENANT_ID): Promise<any> {
    try {
      // In a real implementation, this would use machine learning models
      // For this example, we'll simulate predictions based on historical data

      // Patient growth prediction
      const patientGrowthResult = await sql`
        SELECT 
          TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') as month,
          COUNT(*) as new_patients
        FROM patients
        WHERE tenant_id = ${tenantId}
        AND created_at >= NOW() - INTERVAL '12 months'
        GROUP BY month
        ORDER BY month
      `

      // Simple linear regression to predict next 3 months
      const patientGrowthData = patientGrowthResult.map((row) => ({
        date: row.month,
        value: Number.parseInt(row.new_patients),
      }))

      // Simulate predictions (in a real app, use actual ML models)
      const lastThreeMonths = patientGrowthData.slice(-3)
      const avgGrowthRate =
        lastThreeMonths.length > 1
          ? (lastThreeMonths[lastThreeMonths.length - 1].value - lastThreeMonths[0].value) /
            (lastThreeMonths.length - 1)
          : 0

      const lastDate = new Date(patientGrowthData[patientGrowthData.length - 1].date + "-01")
      const predictedGrowth = []

      for (let i = 1; i <= 3; i++) {
        const nextMonth = new Date(lastDate)
        nextMonth.setMonth(lastDate.getMonth() + i)

        const lastValue = i === 1 ? patientGrowthData[patientGrowthData.length - 1].value : predictedGrowth[i - 2].value

        predictedGrowth.push({
          date: nextMonth.toISOString().substring(0, 7),
          value: Math.max(0, Math.round(lastValue + avgGrowthRate)),
        })
      }

      // Readmission risk prediction
      // In a real app, this would use a trained model based on patient data
      const highRiskPatientsResult = await sql`
        SELECT 
          p.id,
          p.name,
          COUNT(mh.id) as admission_count
        FROM patients p
        JOIN medical_history mh ON p.id = mh.patient_id AND mh.tenant_id = p.tenant_id
        WHERE p.tenant_id = ${tenantId}
        AND mh.type = 'hospital_admission'
        AND mh.date >= NOW() - INTERVAL '6 months'
        GROUP BY p.id, p.name
        HAVING COUNT(mh.id) >= 2
        ORDER BY admission_count DESC
        LIMIT 10
      `

      return {
        patientGrowth: {
          actual: patientGrowthData,
          predicted: predictedGrowth,
          confidence: {
            upper: predictedGrowth.map((item) => ({ ...item, value: Math.round(item.value * 1.2) })),
            lower: predictedGrowth.map((item) => ({ ...item, value: Math.round(item.value * 0.8) })),
          },
        },
        highRiskPatients: highRiskPatientsResult,
      }
    } catch (error) {
      console.error("Error generating predictive analytics:", error)
      return {
        patientGrowth: {
          actual: [],
          predicted: [],
          confidence: { upper: [], lower: [] },
        },
        highRiskPatients: [],
      }
    }
  },

  // Get financial analytics
  async getFinancialAnalytics(tenantId: string = DEFAULT_TENANT_ID): Promise<any> {
    try {
      // Revenue trends
      const revenueTrendResult = await sql`
        SELECT 
          TO_CHAR(DATE_TRUNC('month', date), 'YYYY-MM') as month,
          SUM(amount) as revenue
        FROM invoices
        WHERE tenant_id = ${tenantId}
        AND date >= NOW() - INTERVAL '12 months'
        GROUP BY month
        ORDER BY month
      `

      // Revenue by service type
      const revenueByServiceResult = await sql`
        SELECT 
          ii.service_type,
          SUM(ii.amount) as revenue
        FROM invoice_items ii
        JOIN invoices i ON ii.invoice_id = i.id AND ii.tenant_id = i.tenant_id
        WHERE ii.tenant_id = ${tenantId}
        AND i.date >= NOW() - INTERVAL '3 months'
        GROUP BY ii.service_type
        ORDER BY revenue DESC
      `

      // Outstanding invoices
      const outstandingInvoicesResult = await sql`
        SELECT 
          SUM(amount) as total_outstanding
        FROM invoices
        WHERE tenant_id = ${tenantId}
        AND status = 'unpaid'
      `

      // Payment velocity (average days to payment)
      const paymentVelocityResult = await sql`
        SELECT 
          AVG(EXTRACT(EPOCH FROM (paid_date - date)) / 86400) as avg_days_to_payment
        FROM invoices
        WHERE tenant_id = ${tenantId}
        AND status = 'paid'
        AND date >= NOW() - INTERVAL '6 months'
      `

      return {
        revenueTrend: revenueTrendResult.map((row) => ({
          date: row.month,
          value: Number.parseFloat(row.revenue),
        })),
        revenueByService: revenueByServiceResult,
        outstandingInvoices: Number.parseFloat(outstandingInvoicesResult[0]?.total_outstanding || "0"),
        paymentVelocity: Number.parseFloat(paymentVelocityResult[0]?.avg_days_to_payment || "0"),
      }
    } catch (error) {
      console.error("Error fetching financial analytics:", error)
      return {
        revenueTrend: [],
        revenueByService: [],
        outstandingInvoices: 0,
        paymentVelocity: 0,
      }
    }
  },
}
