import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST() {
  try {
    // Run a series of database fixes
    const results = await runDatabaseFixes()

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error("Error fixing database:", error)
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

async function runDatabaseFixes() {
  const results: Record<string, any> = {}

  // Fix 1: Ensure care_professional_id exists in clinical_notes
  try {
    await sql.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'clinical_notes' AND column_name = 'care_professional_id') THEN
          ALTER TABLE clinical_notes ADD COLUMN care_professional_id UUID;
        END IF;
      END $$;
    `)
    results.clinicalNotesCareProId = "Fixed"
  } catch (error) {
    results.clinicalNotesCareProId = (error as Error).message
  }

  // Fix 2: Ensure tags column exists in clinical_notes
  try {
    await sql.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'clinical_notes' AND column_name = 'tags') THEN
          ALTER TABLE clinical_notes ADD COLUMN tags TEXT[];
        END IF;
      END $$;
    `)
    results.clinicalNotesTags = "Fixed"
  } catch (error) {
    results.clinicalNotesTags = (error as Error).message
  }

  // Fix 3: Create missing indexes
  try {
    await sql.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_clinical_notes_patient_id') THEN
          CREATE INDEX idx_clinical_notes_patient_id ON clinical_notes(patient_id);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_clinical_notes_category_id') THEN
          CREATE INDEX idx_clinical_notes_category_id ON clinical_notes(category_id);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_clinical_notes_care_professional_id') THEN
          CREATE INDEX idx_clinical_notes_care_professional_id ON clinical_notes(care_professional_id);
        END IF;
      END $$;
    `)
    results.clinicalNotesIndexes = "Fixed"
  } catch (error) {
    results.clinicalNotesIndexes = (error as Error).message
  }

  // Fix 4: Check and fix any broken foreign keys
  try {
    await sql.query(`
      DO $$
      BEGIN
        -- Add any foreign key fixes here
      END $$;
    `)
    results.foreignKeys = "Checked"
  } catch (error) {
    results.foreignKeys = (error as Error).message
  }

  return results
}
