-- Add new medical history columns to the patients table
DO $$
BEGIN
    -- Add medical_history (JSONB)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'medical_history') THEN
        ALTER TABLE patients ADD COLUMN medical_history JSONB;
        RAISE NOTICE 'Column medical_history added to patients table.';
    ELSE
        RAISE NOTICE 'Column medical_history already exists in patients table.';
    END IF;

    -- Add allergies (TEXT[])
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'allergies') THEN
        ALTER TABLE patients ADD COLUMN allergies TEXT[];
        RAISE NOTICE 'Column allergies added to patients table.';
    ELSE
        RAISE NOTICE 'Column allergies already exists in patients table.';
    END IF;

    -- Add chronic_conditions (TEXT[])
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'chronic_conditions') THEN
        ALTER TABLE patients ADD COLUMN chronic_conditions TEXT[];
        RAISE NOTICE 'Column chronic_conditions added to patients table.';
    ELSE
        RAISE NOTICE 'Column chronic_conditions already exists in patients table.';
    END IF;

    -- Add past_surgeries (TEXT[])
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'past_surgeries') THEN
        ALTER TABLE patients ADD COLUMN past_surgeries TEXT[];
        RAISE NOTICE 'Column past_surgeries added to patients table.';
    ELSE
        RAISE NOTICE 'Column past_surgeries already exists in patients table.';
    END IF;

    -- Add family_medical_history (JSONB)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'family_medical_history') THEN
        ALTER TABLE patients ADD COLUMN family_medical_history JSONB;
        RAISE NOTICE 'Column family_medical_history added to patients table.';
    ELSE
        RAISE NOTICE 'Column family_medical_history already exists in patients table.';
    END IF;

    -- Add immunizations (TEXT[])
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'immunizations') THEN
        ALTER TABLE patients ADD COLUMN immunizations TEXT[];
        RAISE NOTICE 'Column immunizations added to patients table.';
    ELSE
        RAISE NOTICE 'Column immunizations already exists in patients table.';
    END IF;

END $$;
