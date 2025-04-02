import { executeQuery } from "@/lib/db"
import fs from "fs"
import path from "path"
import { neon } from "@neondatabase/serverless"

// Migration function to create or update database schema
export async function migrateDatabase(): Promise<void> {
  try {
    console.log("Starting database migration...")

    // Create tenants table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS tenants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        domain VARCHAR(255) UNIQUE,
        settings JSONB DEFAULT '{}',
        features TEXT[] DEFAULT '{}',
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `)

    // Create users table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        auth0_id VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        picture VARCHAR(1024),
        default_tenant_id UUID REFERENCES tenants(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `)

    // Create user_roles table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS user_roles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        tenant_id UUID REFERENCES tenants(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, role, tenant_id)
      )
    `)

    // Create patients table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS patients (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID REFERENCES tenants(id),
        nhs_number VARCHAR(10) UNIQUE,
        title VARCHAR(10),
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        date_of_birth DATE NOT NULL,
        gender VARCHAR(50) NOT NULL,
        address_line1 VARCHAR(255),
        address_line2 VARCHAR(255),
        city VARCHAR(255),
        county VARCHAR(255),
        postcode VARCHAR(10),
        phone VARCHAR(20),
        email VARCHAR(255),
        emergency_contact_name VARCHAR(255),
        emergency_contact_phone VARCHAR(20),
        emergency_contact_relationship VARCHAR(50),
        gp_name VARCHAR(255),
        gp_practice VARCHAR(255),
        gp_phone VARCHAR(20),
        status VARCHAR(50) DEFAULT 'active',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_by VARCHAR(255),
        updated_by VARCHAR(255)
      )
    `)

    // Create care_plans table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS care_plans (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID REFERENCES tenants(id),
        patient_id UUID REFERENCES patients(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        start_date DATE NOT NULL,
        end_date DATE,
        status VARCHAR(50) DEFAULT 'draft',
        goals TEXT,
        interventions TEXT,
        review_frequency VARCHAR(50),
        next_review_date DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_by VARCHAR(255),
        updated_by VARCHAR(255)
      )
    `)

    // Create appointments table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS appointments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID REFERENCES tenants(id),
        patient_id UUID REFERENCES patients(id),
        care_professional_id VARCHAR(255),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        start_time TIMESTAMP WITH TIME ZONE NOT NULL,
        end_time TIMESTAMP WITH TIME ZONE NOT NULL,
        location VARCHAR(255),
        status VARCHAR(50) DEFAULT 'scheduled',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_by VARCHAR(255)
      )
    `)

    // Create medications table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS medications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID REFERENCES tenants(id),
        patient_id UUID REFERENCES patients(id),
        name VARCHAR(255) NOT NULL,
        dosage VARCHAR(255) NOT NULL,
        frequency VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE,
        instructions TEXT,
        prescribed_by VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_by VARCHAR(255)
      )
    `)

    // Create documents table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID REFERENCES tenants(id),
        patient_id UUID REFERENCES patients(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        file_path VARCHAR(1024) NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        file_size INTEGER NOT NULL,
        category VARCHAR(50),
        tags TEXT[],
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_by VARCHAR(255)
      )
    `)

    // Create compliance_policies table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS compliance_policies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID REFERENCES tenants(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        content TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        version VARCHAR(50) NOT NULL,
        effective_date DATE NOT NULL,
        review_date DATE,
        last_reviewed_date DATE,
        status VARCHAR(50) DEFAULT 'draft',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_by VARCHAR(255)
      )
    `)

    // Create compliance_training table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS compliance_training (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID REFERENCES tenants(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        content TEXT,
        category VARCHAR(50) NOT NULL,
        duration_minutes INTEGER,
        frequency_months INTEGER,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_by VARCHAR(255)
      )
    `)

    // Create compliance_training_completion table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS compliance_training_completion (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID REFERENCES tenants(id),
        training_id UUID REFERENCES compliance_training(id),
        user_id VARCHAR(255) NOT NULL,
        completion_date DATE NOT NULL,
        expiry_date DATE,
        status VARCHAR(50) DEFAULT 'completed',
        score INTEGER,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `)

    // Create compliance_risk_assessments table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS compliance_risk_assessments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID REFERENCES tenants(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(50) NOT NULL,
        risk_level VARCHAR(50) NOT NULL,
        likelihood INTEGER NOT NULL,
        impact INTEGER NOT NULL,
        mitigation_plan TEXT,
        status VARCHAR(50) DEFAULT 'Identified',
        review_date DATE,
        assigned_to VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_by VARCHAR(255)
      )
    `)

    // Create compliance_audit_logs table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS compliance_audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID REFERENCES tenants(id),
        user_id VARCHAR(255),
        action VARCHAR(255) NOT NULL,
        entity_type VARCHAR(50) NOT NULL,
        entity_id VARCHAR(255),
        details JSONB,
        ip_address VARCHAR(50),
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `)

    // Create jobs table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS jobs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID REFERENCES tenants(id),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        requirements TEXT,
        responsibilities TEXT,
        location VARCHAR(255),
        salary_range VARCHAR(100),
        employment_type VARCHAR(50),
        department VARCHAR(100),
        status VARCHAR(50) DEFAULT 'draft',
        published_date DATE,
        closing_date DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_by VARCHAR(255)
      )
    `)

    // Create job_applications table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS job_applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID REFERENCES tenants(id),
        job_id UUID REFERENCES jobs(id),
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        resume_url VARCHAR(1024),
        cover_letter TEXT,
        status VARCHAR(50) DEFAULT 'received',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `)

    // Create todos table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS todos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID REFERENCES tenants(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        priority VARCHAR(50) DEFAULT 'medium',
        due_date DATE,
        assigned_to VARCHAR(255),
        related_to_type VARCHAR(50),
        related_to_id VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_by VARCHAR(255)
      )
    `)

    console.log("Database migration completed successfully")
  } catch (error) {
    console.error("Error during database migration:", error)
    throw error
  }
}

export async function runMigrations() {
  try {
    const sql = neon(process.env.DATABASE_URL)

    // Create migrations table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Get executed migrations
    const executedMigrations = await sql`SELECT name FROM migrations`
    const executedMigrationNames = executedMigrations.map((m) => m.name)

    // Get all migration files
    const migrationsDir = path.join(process.cwd(), "lib", "db", "migrations")
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort() // Ensure migrations run in alphabetical order

    // Run migrations that haven't been executed yet
    for (const file of migrationFiles) {
      if (!executedMigrationNames.includes(file)) {
        console.log(`Running migration: ${file}`)
        const migrationContent = fs.readFileSync(path.join(migrationsDir, file), "utf8")

        // Execute migration
        await sql.unsafe(migrationContent)

        // Record migration
        await sql`INSERT INTO migrations (name) VALUES (${file})`

        console.log(`Migration completed: ${file}`)
      }
    }

    return { success: true, message: "Migrations completed successfully" }
  } catch (error) {
    console.error("Error running migrations:", error)
    return { success: false, error: (error as Error).message }
  }
}

// Seed default data for a new tenant
export async function seedTenantData(tenantId: string, tenantName: string, adminUserId: string): Promise<void> {
  try {
    console.log(`Seeding data for tenant: ${tenantName} (${tenantId})`)

    // Create default compliance policies
    const policyCategories = [
      "Data Protection",
      "Health & Safety",
      "Infection Control",
      "Medication Management",
      "Safeguarding",
    ]

    for (const category of policyCategories) {
      await executeQuery(
        `
        INSERT INTO compliance_policies (
          tenant_id, 
          title, 
          description, 
          content, 
          category, 
          version, 
          effective_date, 
          status, 
          created_by, 
          updated_by
        ) VALUES (
          $1, 
          $2, 
          $3, 
          $4, 
          $5, 
          '1.0', 
          CURRENT_DATE, 
          'draft', 
          $6, 
          $6
        )
      `,
        [
          tenantId,
          `${category} Policy`,
          `Default ${category} policy for ${tenantName}`,
          `# ${category} Policy\n\nThis is a default policy template for ${category}. Please customize this content according to your organization's requirements.`,
          category,
          adminUserId,
        ],
      )
    }

    // Create default training modules
    const trainingCategories = [
      "Data Protection",
      "Health & Safety",
      "Infection Control",
      "Medication Management",
      "Safeguarding",
      "Fire Safety",
    ]

    for (const category of trainingCategories) {
      await executeQuery(
        `
        INSERT INTO compliance_training (
          tenant_id, 
          title, 
          description, 
          category, 
          duration_minutes, 
          frequency_months, 
          status, 
          created_by, 
          updated_by
        ) VALUES (
          $1, 
          $2, 
          $3, 
          $4, 
          60, 
          12, 
          'active', 
          $5, 
          $5
        )
      `,
        [tenantId, `${category} Training`, `Mandatory ${category} training for all staff`, category, adminUserId],
      )
    }

    // Create default risk assessments
    const riskCategories = [
      "Data Protection",
      "Health & Safety",
      "Infection Control",
      "Medication Management",
      "Safeguarding",
    ]
    const riskLevels = ["Low", "Medium", "High"]

    for (let i = 0; i < riskCategories.length; i++) {
      const category = riskCategories[i]
      const riskLevel = riskLevels[i % riskLevels.length]
      const likelihood = riskLevel === "Low" ? 1 : riskLevel === "Medium" ? 2 : 3
      const impact = riskLevel === "Low" ? 1 : riskLevel === "Medium" ? 2 : 3

      await executeQuery(
        `
        INSERT INTO compliance_risk_assessments (
          tenant_id, 
          title, 
          description, 
          category, 
          risk_level, 
          likelihood, 
          impact, 
          status, 
          created_by, 
          updated_by
        ) VALUES (
          $1, 
          $2, 
          $3, 
          $4, 
          $5, 
          $6, 
          $7, 
          'Identified', 
          $8, 
          $8
        )
      `,
        [
          tenantId,
          `${category} Risk`,
          `Default ${category} risk assessment for ${tenantName}`,
          category,
          riskLevel,
          likelihood,
          impact,
          adminUserId,
        ],
      )
    }

    console.log(`Seeding completed for tenant: ${tenantName} (${tenantId})`)
  } catch (error) {
    console.error(`Error seeding tenant data for ${tenantName} (${tenantId}):`, error)
    throw error
  }
}

