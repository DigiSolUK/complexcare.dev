-- Set search path to public to ensure we're working in the default schema
SET search_path TO public;

-- Define the hardcoded IDs and email for clarity and reusability
DO $$
DECLARE
    default_tenant_id UUID := 'ba367cfe-6de0-4180-9566-1002b75cf82c';
    default_admin_user_id UUID := 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
    default_admin_email TEXT := 'admin@example.com';
BEGIN
    -- Step 1: Clean up existing data that might conflict with our hardcoded IDs or email
    -- Delete from dependent tables first to avoid foreign key violations.
    -- We need to consider both the hardcoded ID and the email for existing users.

    -- Delete tenant_users entries linked to the admin email or hardcoded ID
    DELETE FROM tenant_users
    WHERE user_id IN (SELECT id FROM users WHERE email = default_admin_email OR id = default_admin_user_id);

    -- Delete care_professionals entries linked to the admin email or hardcoded ID
    DELETE FROM care_professionals
    WHERE email = default_admin_email OR id = default_admin_user_id;

    -- Delete the user record itself, targeting by email or hardcoded ID
    DELETE FROM users
    WHERE email = default_admin_email OR id = default_admin_user_id;

    -- Delete the tenant record if it exists with the hardcoded ID
    DELETE FROM tenants WHERE id = default_tenant_id;

    -- Step 2: Insert the default tenant
    INSERT INTO tenants (id, name, slug, domain, status, subscription_tier)
    VALUES (
        default_tenant_id,
        'Default ComplexCare CRM Tenant',
        'default-tenant',
        'default.complexcarecrm.com',
        'active',
        'premium'
    )
    ON CONFLICT (id) DO NOTHING; -- Should not conflict after explicit delete

    -- Step 3: Insert the default admin user
    INSERT INTO users (id, tenant_id, email, name, role)
    VALUES (
        default_admin_user_id,
        default_tenant_id,
        default_admin_email,
        'Admin User',
        'admin'
    )
    ON CONFLICT (id) DO NOTHING; -- Should not conflict after explicit delete

    -- Step 4: Establish the tenant_users relationship for the default admin user
    INSERT INTO tenant_users (tenant_id, user_id, role, is_primary)
    VALUES (
        default_tenant_id,
        default_admin_user_id,
        'admin',
        TRUE
    )
    ON CONFLICT (tenant_id, user_id) DO NOTHING; -- Should not conflict after explicit delete

    -- Step 5: Optional: Add a care professional entry for the admin user if they are also a care professional
    INSERT INTO care_professionals (id, tenant_id, first_name, last_name, email, role, is_active)
    VALUES (
        default_admin_user_id, -- Using the same ID as the admin user for simplicity
        default_tenant_id,
        'Admin',
        'Professional',
        default_admin_email,
        'Care Professional',
        TRUE
    )
    ON CONFLICT (id) DO NOTHING; -- Should not conflict after explicit delete

END $$;
