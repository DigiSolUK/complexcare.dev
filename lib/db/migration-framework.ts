import { neon } from "@neondatabase/serverless"
import { createHash } from "crypto"
import fs from "fs/promises"
import path from "path"

export interface Migration {
  id: string
  name: string
  timestamp: number
  checksum: string
  up: (sql: ReturnType<typeof neon>) => Promise<void>
  down: (sql: ReturnType<typeof neon>) => Promise<void>
}

export interface MigrationRecord {
  id: string
  name: string
  checksum: string
  executed_at: Date
  execution_time_ms: number
  rolled_back: boolean
  rolled_back_at?: Date
}

export class MigrationRunner {
  private sql: ReturnType<typeof neon>
  private migrationsPath: string

  constructor(databaseUrl: string, migrationsPath = "migrations") {
    this.sql = neon(databaseUrl)
    this.migrationsPath = migrationsPath
  }

  /**
   * Ensures the migrations table exists
   */
  async ensureMigrationsTable(): Promise<void> {
    await this.sql`
      CREATE TABLE IF NOT EXISTS _migrations (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        checksum VARCHAR(64) NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        execution_time_ms INTEGER NOT NULL,
        rolled_back BOOLEAN DEFAULT FALSE,
        rolled_back_at TIMESTAMP WITH TIME ZONE,
        UNIQUE(name)
      )
    `

    // Create migration locks table
    await this.sql`
      CREATE TABLE IF NOT EXISTS _migration_locks (
        id INTEGER PRIMARY KEY DEFAULT 1,
        locked BOOLEAN DEFAULT FALSE,
        locked_at TIMESTAMP WITH TIME ZONE,
        locked_by VARCHAR(255),
        CONSTRAINT single_row CHECK (id = 1)
      )
    `

    // Insert initial lock row if it doesn't exist
    await this.sql`
      INSERT INTO _migration_locks (id, locked) 
      VALUES (1, FALSE) 
      ON CONFLICT (id) DO NOTHING
    `
  }

  /**
   * Acquires a migration lock to prevent concurrent migrations
   */
  async acquireLock(identifier: string): Promise<boolean> {
    const result = await this.sql`
      UPDATE _migration_locks 
      SET locked = TRUE, locked_at = CURRENT_TIMESTAMP, locked_by = ${identifier}
      WHERE id = 1 AND locked = FALSE
      RETURNING locked
    `

    return result.length > 0
  }

  /**
   * Releases the migration lock
   */
  async releaseLock(): Promise<void> {
    await this.sql`
      UPDATE _migration_locks 
      SET locked = FALSE, locked_at = NULL, locked_by = NULL
      WHERE id = 1
    `
  }

  /**
   * Gets all executed migrations
   */
  async getExecutedMigrations(): Promise<MigrationRecord[]> {
    const result = await this.sql`
      SELECT * FROM _migrations 
      WHERE rolled_back = FALSE 
      ORDER BY executed_at ASC
    `

    return result as MigrationRecord[]
  }

  /**
   * Loads all migration files
   */
  async loadMigrations(): Promise<Migration[]> {
    const migrations: Migration[] = []
    const migrationFiles = await fs.readdir(this.migrationsPath)

    const sortedFiles = migrationFiles.filter((file) => file.endsWith(".ts") || file.endsWith(".js")).sort()

    for (const file of sortedFiles) {
      const filePath = path.join(this.migrationsPath, file)
      const migration = await import(filePath)

      // Extract timestamp and name from filename (e.g., "001_create_users_table.ts")
      const match = file.match(/^(\d+)_(.+)\.(ts|js)$/)
      if (!match) {
        console.warn(`Skipping invalid migration filename: ${file}`)
        continue
      }

      const [, timestamp, name] = match
      const content = await fs.readFile(filePath, "utf-8")
      const checksum = createHash("sha256").update(content).digest("hex")

      migrations.push({
        id: `${timestamp}_${name}`,
        name,
        timestamp: Number.parseInt(timestamp),
        checksum,
        up: migration.up,
        down: migration.down,
      })
    }

    return migrations
  }

  /**
   * Gets pending migrations
   */
  async getPendingMigrations(): Promise<Migration[]> {
    const executed = await this.getExecutedMigrations()
    const executedIds = new Set(executed.map((m) => m.id))
    const allMigrations = await this.loadMigrations()

    return allMigrations.filter((m) => !executedIds.has(m.id))
  }

  /**
   * Runs a single migration
   */
  async runMigration(migration: Migration, dryRun = false): Promise<void> {
    console.log(`Running migration: ${migration.id}`)

    if (dryRun) {
      console.log(`[DRY RUN] Would execute migration: ${migration.id}`)
      return
    }

    const startTime = Date.now()

    try {
      // Start transaction
      await this.sql`BEGIN`

      // Run the migration
      await migration.up(this.sql)

      // Record the migration
      await this.sql`
        INSERT INTO _migrations (id, name, checksum, execution_time_ms)
        VALUES (${migration.id}, ${migration.name}, ${migration.checksum}, ${Date.now() - startTime})
      `

      // Commit transaction
      await this.sql`COMMIT`

      console.log(`✓ Migration ${migration.id} completed in ${Date.now() - startTime}ms`)
    } catch (error) {
      // Rollback transaction
      await this.sql`ROLLBACK`
      throw new Error(`Migration ${migration.id} failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Runs all pending migrations
   */
  async runPendingMigrations(dryRun = false): Promise<void> {
    await this.ensureMigrationsTable()

    const lockId = `migration_${Date.now()}_${process.pid}`
    const lockAcquired = await this.acquireLock(lockId)

    if (!lockAcquired) {
      throw new Error("Could not acquire migration lock. Another migration may be in progress.")
    }

    try {
      const pending = await this.getPendingMigrations()

      if (pending.length === 0) {
        console.log("No pending migrations")
        return
      }

      console.log(`Found ${pending.length} pending migrations`)

      for (const migration of pending) {
        await this.runMigration(migration, dryRun)
      }

      if (!dryRun) {
        console.log(`✓ All migrations completed successfully`)
      }
    } finally {
      await this.releaseLock()
    }
  }

  /**
   * Rolls back the last migration
   */
  async rollbackLastMigration(dryRun = false): Promise<void> {
    await this.ensureMigrationsTable()

    const lockId = `rollback_${Date.now()}_${process.pid}`
    const lockAcquired = await this.acquireLock(lockId)

    if (!lockAcquired) {
      throw new Error("Could not acquire migration lock. Another migration may be in progress.")
    }

    try {
      const executed = await this.getExecutedMigrations()

      if (executed.length === 0) {
        console.log("No migrations to rollback")
        return
      }

      const lastMigration = executed[executed.length - 1]
      const allMigrations = await this.loadMigrations()
      const migration = allMigrations.find((m) => m.id === lastMigration.id)

      if (!migration) {
        throw new Error(`Migration file not found for ${lastMigration.id}`)
      }

      console.log(`Rolling back migration: ${migration.id}`)

      if (dryRun) {
        console.log(`[DRY RUN] Would rollback migration: ${migration.id}`)
        return
      }

      try {
        // Start transaction
        await this.sql`BEGIN`

        // Run the down migration
        await migration.down(this.sql)

        // Mark as rolled back
        await this.sql`
          UPDATE _migrations 
          SET rolled_back = TRUE, rolled_back_at = CURRENT_TIMESTAMP
          WHERE id = ${migration.id}
        `

        // Commit transaction
        await this.sql`COMMIT`

        console.log(`✓ Rolled back migration ${migration.id}`)
      } catch (error) {
        // Rollback transaction
        await this.sql`ROLLBACK`
        throw new Error(`Rollback of ${migration.id} failed: ${error instanceof Error ? error.message : String(error)}`)
      }
    } finally {
      await this.releaseLock()
    }
  }

  /**
   * Gets migration status
   */
  async getStatus(): Promise<{
    executed: MigrationRecord[]
    pending: Migration[]
    locked: boolean
  }> {
    await this.ensureMigrationsTable()

    const executed = await this.getExecutedMigrations()
    const pending = await this.getPendingMigrations()

    const lockStatus = await this.sql`
      SELECT locked, locked_at, locked_by 
      FROM _migration_locks 
      WHERE id = 1
    `

    return {
      executed,
      pending,
      locked: lockStatus[0]?.locked || false,
    }
  }

  /**
   * Validates migration checksums
   */
  async validateChecksums(): Promise<{ valid: boolean; mismatches: string[] }> {
    const executed = await this.getExecutedMigrations()
    const allMigrations = await this.loadMigrations()
    const mismatches: string[] = []

    for (const executedMigration of executed) {
      const currentMigration = allMigrations.find((m) => m.id === executedMigration.id)

      if (!currentMigration) {
        mismatches.push(`Migration ${executedMigration.id} exists in database but not in files`)
        continue
      }

      if (currentMigration.checksum !== executedMigration.checksum) {
        mismatches.push(`Migration ${executedMigration.id} has been modified after execution`)
      }
    }

    return {
      valid: mismatches.length === 0,
      mismatches,
    }
  }
}

/**
 * Creates a new migration file
 */
export async function createMigration(name: string, migrationsPath = "migrations"): Promise<string> {
  const timestamp = Date.now()
  const fileName = `${timestamp}_${name.toLowerCase().replace(/\s+/g, "_")}.ts`
  const filePath = path.join(migrationsPath, fileName)

  const template = `import { type NeonDatabase } from "@neondatabase/serverless"

export async function up(sql: NeonDatabase): Promise<void> {
  // Add your migration code here
  await sql\`
    -- Your SQL goes here
  \`
}

export async function down(sql: NeonDatabase): Promise<void> {
  // Add your rollback code here
  await sql\`
    -- Your rollback SQL goes here
  \`
}
`

  await fs.mkdir(migrationsPath, { recursive: true })
  await fs.writeFile(filePath, template)

  return filePath
}
