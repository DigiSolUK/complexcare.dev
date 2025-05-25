-- Check if credentials table exists
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'credentials'
    ) THEN
        -- Check if compliance_status column already exists
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'credentials' 
            AND column_name = 'compliance_status'
        ) THEN
            -- Add compliance_status column
            ALTER TABLE credentials 
            ADD COLUMN compliance_status VARCHAR(50);

            -- Set default values based on existing status column if it exists
            IF EXISTS (
                SELECT FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'credentials' 
                AND column_name = 'status'
            ) THEN
                UPDATE credentials 
                SET compliance_status = 
                    CASE 
                        WHEN status = 'active' AND (expiry_date IS NULL OR expiry_date > CURRENT_DATE) THEN 'compliant'
                        WHEN status = 'expired' OR (expiry_date IS NOT NULL AND expiry_date <= CURRENT_DATE) THEN 'non_compliant'
                        WHEN status = 'pending' THEN 'pending'
                        ELSE 'unknown'
                    END;
            ELSE
                -- If no status column, set all to 'unknown'
                UPDATE credentials 
                SET compliance_status = 'unknown';
            END IF;

            -- Add a comment to the column
            COMMENT ON COLUMN credentials.compliance_status IS 'Compliance status of the credential: compliant, non_compliant, pending, or unknown';
            
            RAISE NOTICE 'Added compliance_status column to credentials table';
        ELSE
            RAISE NOTICE 'compliance_status column already exists in credentials table';
        END IF;
    ELSE
        RAISE NOTICE 'credentials table does not exist';
    END IF;
END $$;
