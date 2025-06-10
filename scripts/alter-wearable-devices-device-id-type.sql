-- This script alters the wearable_devices table to change device_id to VARCHAR
-- It also updates the wearable_readings table to reference the new type.

-- Step 1: Drop foreign key constraint from wearable_readings if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'wearable_readings_device_id_fkey') THEN
        ALTER TABLE wearable_readings DROP CONSTRAINT wearable_readings_device_id_fkey;
    END IF;
END
$$;

-- Step 2: Alter the column type in wearable_devices
ALTER TABLE wearable_devices
ALTER COLUMN device_id TYPE VARCHAR(255);

-- Step 3: Recreate foreign key constraint in wearable_readings with the new type
ALTER TABLE wearable_readings
ADD CONSTRAINT wearable_readings_device_id_fkey
FOREIGN KEY (device_id) REFERENCES wearable_devices(device_id);
