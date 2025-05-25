# ComplexCare CRM Database Schema Documentation

## Overview

The ComplexCare CRM system uses a PostgreSQL database hosted on Neon. The database follows a multi-tenant architecture where each tenant has its own isolated data while sharing the same database schema. This document provides a comprehensive overview of the database schema, including tables, relationships, and usage patterns.

## Database Architecture

The database is designed with the following principles:

1. **Multi-tenancy**: All tables include a `tenant_id` column to isolate data between different healthcare organizations
2. **Soft Deletion**: Most tables use a `deleted_at` timestamp for soft deletion rather than permanently removing records
3. **Audit Trails**: Tables include `created_at`, `updated_at`, `created_by`, and `updated_by` fields for comprehensive audit trails
4. **UUID Primary Keys**: All tables use UUID primary keys for better security and distribution
5. **Referential Integrity**: Foreign key constraints ensure data consistency across tables

## Core Tables

### Tenants

The `tenants` table is the foundation of the multi-tenant architecture, storing information about each healthcare organization using the system.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | UUID | Unique identifier | PRIMARY KEY |
| name | TEXT | Organization name | NOT NULL |
| domain | TEXT | Custom domain for the tenant | |
| logo_url | TEXT | URL to the tenant's logo | |
| primary_color | TEXT | Primary brand color | |
| secondary_color | TEXT | Secondary brand color | |
| subscription_plan | TEXT | Subscription plan type | DEFAULT 'basic' |
| subscription_status | TEXT | Status of the subscription | DEFAULT 'active' |
| subscription_start_date | TIMESTAMP | When the subscription started | |
| subscription_end_date | TIMESTAMP | When the subscription ends | |
| max_users | INTEGER | Maximum number of users allowed | DEFAULT 5 |
| created_at | TIMESTAMP | When the tenant was created | DEFAULT NOW() |
| updated_at | TIMESTAMP | When the tenant was last updated | DEFAULT NOW() |
| deleted_at | TIMESTAMP | When the tenant was soft-deleted | NULL |
| status | TEXT | Current status of the tenant | DEFAULT 'active' |

### Users

The `users` table stores information about system users across all tenants.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | UUID | Unique identifier | PRIMARY KEY |
| email | TEXT | User's email address | NOT NULL, UNIQUE |
| name | TEXT | User's full name | |
| role | TEXT | User's system role | DEFAULT 'user' |
| is_active | BOOLEAN | Whether the user is active | DEFAULT TRUE |
| last_login | TIMESTAMP | When the user last logged in | |
| created_at | TIMESTAMP | When the user was created | DEFAULT NOW() |
| updated_at | TIMESTAMP | When the user was last updated | DEFAULT NOW() |

### Tenant Users

The `tenant_users` table maps users to tenants, allowing users to belong to multiple organizations with different roles.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | UUID | Unique identifier | PRIMARY KEY |
| tenant_id | UUID | Reference to the tenant | FOREIGN KEY |
| user_id | UUID | Reference to the user | FOREIGN KEY |
| role | TEXT | User's role within this tenant | DEFAULT 'user' |
| is_primary | BOOLEAN | Whether this is the user's primary tenant | DEFAULT FALSE |
| created_at | TIMESTAMP | When the mapping was created | DEFAULT NOW() |
| updated_at | TIMESTAMP | When the mapping was last updated | DEFAULT NOW() |
| deleted_at | TIMESTAMP | When the mapping was soft-deleted | NULL |

### Patients

The `patients` table stores information about patients under care.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | UUID | Unique identifier | PRIMARY KEY |
| tenant_id | UUID | Reference to the tenant | FOREIGN KEY |
| first_name | TEXT | Patient's first name | NOT NULL |
| last_name | TEXT | Patient's last name | NOT NULL |
| date_of_birth | DATE | Patient's date of birth | |
| gender | TEXT | Patient's gender | |
| nhs_number | TEXT | NHS number (UK healthcare identifier) | |
| contact_number | TEXT | Patient's contact number | |
| email | TEXT | Patient's email address | |
| address | TEXT | Patient's physical address | |
| postcode | TEXT | Patient's postal code | |
| primary_condition | TEXT | Patient's primary medical condition | |
| primary_care_provider | TEXT | Patient's primary care provider | |
| emergency_contact | TEXT | Emergency contact name | |
| emergency_phone | TEXT | Emergency contact phone | |
| gp_name | TEXT | General Practitioner's name | |
| gp_address | TEXT | GP's address | |
| gp_phone | TEXT | GP's phone number | |
| medical_conditions | TEXT | List of medical conditions | |
| allergies | TEXT | List of allergies | |
| medications | TEXT | List of medications | |
| notes | TEXT | General notes about the patient | |
| status | TEXT | Patient's status (active, inactive, discharged) | DEFAULT 'active' |
| is_active | BOOLEAN | Whether the patient is active | DEFAULT TRUE |
| created_at | TIMESTAMP | When the patient was created | DEFAULT NOW() |
| updated_at | TIMESTAMP | When the patient was last updated | DEFAULT NOW() |
| created_by | UUID | User who created the patient | FOREIGN KEY |
| updated_by | UUID | User who last updated the patient | FOREIGN KEY |
| deleted_at | TIMESTAMP | When the patient was soft-deleted | NULL |

### Care Professionals

The `care_professionals` table stores information about healthcare providers.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | UUID | Unique identifier | PRIMARY KEY |
| tenant_id | UUID | Reference to the tenant | FOREIGN KEY |
| first_name | TEXT | Professional's first name | NOT NULL |
| last_name | TEXT | Professional's last name | NOT NULL |
| title | TEXT | Professional title (Dr., Nurse, etc.) | |
| email | TEXT | Professional's email address | |
| phone_number | TEXT | Professional's contact number | |
| role | TEXT | Professional's role | |
| specialization | TEXT | Area of specialization | |
| qualifications | TEXT | Professional qualifications | |
| is_active | BOOLEAN | Whether the professional is active | DEFAULT TRUE |
| address | TEXT | Professional's address | |
| postcode | TEXT | Professional's postal code | |
| notes | TEXT | General notes | |
| emergency_contact_relationship | TEXT | Emergency contact relationship | |
| created_at | TIMESTAMP | When the record was created | DEFAULT NOW() |
| updated_at | TIMESTAMP | When the record was last updated | DEFAULT NOW() |
| created_by | UUID | User who created the record | FOREIGN KEY |
| updated_by | UUID | User who last updated the record | FOREIGN KEY |

### Credentials

The `credentials` table stores professional credentials and certifications.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | UUID | Unique identifier | PRIMARY KEY |
| tenant_id | UUID | Reference to the tenant | FOREIGN KEY |
| care_professional_id | UUID | Reference to the care professional | FOREIGN KEY |
| credential_type | TEXT | Type of credential | NOT NULL |
| credential_name | TEXT | Name of the credential | NOT NULL |
| issuing_authority | TEXT | Authority that issued the credential | |
| credential_number | TEXT | Unique number of the credential | |
| issue_date | DATE | When the credential was issued | |
| expiry_date | DATE | When the credential expires | |
| verification_status | TEXT | Status of verification | DEFAULT 'pending' |
| verification_date | TIMESTAMP | When the credential was verified | |
| verified_by | UUID | User who verified the credential | FOREIGN KEY |
| notes | TEXT | Notes about the credential | |
| compliance_status | TEXT | Compliance status | DEFAULT 'unknown' |
| created_at | TIMESTAMP | When the record was created | DEFAULT NOW() |
| updated_at | TIMESTAMP | When the record was last updated | DEFAULT NOW() |

### Appointments

The `appointments` table tracks scheduled appointments.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | UUID | Unique identifier | PRIMARY KEY |
| tenant_id | UUID | Reference to the tenant | FOREIGN KEY |
| patient_id | UUID | Reference to the patient | FOREIGN KEY |
| care_professional_id | UUID | Reference to the care professional | FOREIGN KEY |
| appointment_date | DATE | Date of the appointment | NOT NULL |
| appointment_time | TIME | Time of the appointment | NOT NULL |
| end_time | TIME | End time of the appointment | |
| duration_minutes | INTEGER | Duration in minutes | DEFAULT 60 |
| status | TEXT | Status of the appointment | DEFAULT 'scheduled' |
| appointment_type | TEXT | Type of appointment | |
| location | TEXT | Location of the appointment | |
| notes | TEXT | Notes about the appointment | |
| created_at | TIMESTAMP | When the record was created | DEFAULT NOW() |
| updated_at | TIMESTAMP | When the record was last updated | DEFAULT NOW() |
| cancelled_at | TIMESTAMP | When the appointment was cancelled | NULL |
| cancelled_by | UUID | User who cancelled the appointment | FOREIGN KEY |
| cancellation_reason | TEXT | Reason for cancellation | |

### Clinical Notes

The `clinical_notes` table stores clinical documentation.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | UUID | Unique identifier | PRIMARY KEY |
| tenant_id | UUID | Reference to the tenant | FOREIGN KEY |
| patient_id | UUID | Reference to the patient | FOREIGN KEY |
| author_id | UUID | Reference to the author | FOREIGN KEY |
| category_id | UUID | Reference to the note category | FOREIGN KEY |
| title | TEXT | Title of the note | NOT NULL |
| content | TEXT | Content of the note | NOT NULL |
| is_private | BOOLEAN | Whether the note is private | DEFAULT FALSE |
| is_important | BOOLEAN | Whether the note is important | DEFAULT FALSE |
| tags | TEXT[] | Array of tags | |
| follow_up_date | DATE | Date for follow-up | NULL |
| follow_up_notes | TEXT | Notes for follow-up | NULL |
| created_at | TIMESTAMP | When the note was created | DEFAULT NOW() |
| updated_at | TIMESTAMP | When the note was last updated | DEFAULT NOW() |
| is_deleted | BOOLEAN | Whether the note is deleted | DEFAULT FALSE |
| deleted_at | TIMESTAMP | When the note was deleted | NULL |
| deleted_by | UUID | User who deleted the note | FOREIGN KEY |

### Clinical Note Categories

The `clinical_note_categories` table defines categories for clinical notes.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | UUID | Unique identifier | PRIMARY KEY |
| tenant_id | UUID | Reference to the tenant | FOREIGN KEY |
| name | TEXT | Name of the category | NOT NULL |
| description | TEXT | Description of the category | |
| color | TEXT | Color code for the category | |
| icon | TEXT | Icon for the category | |
| created_at | TIMESTAMP | When the category was created | DEFAULT NOW() |
| updated_at | TIMESTAMP | When the category was last updated | DEFAULT NOW() |

### Tasks

The `tasks` table tracks tasks and to-dos.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | UUID | Unique identifier | PRIMARY KEY |
| tenant_id | UUID | Reference to the tenant | FOREIGN KEY |
| title | TEXT | Title of the task | NOT NULL |
| description | TEXT | Description of the task | |
| status | TEXT | Status of the task | DEFAULT 'pending' |
| priority | TEXT | Priority of the task | DEFAULT 'medium' |
| due_date | DATE | Due date of the task | |
| assigned_to | UUID | User assigned to the task | FOREIGN KEY |
| created_by | UUID | User who created the task | FOREIGN KEY |
| related_to_id | UUID | ID of related entity | |
| related_to_type | TEXT | Type of related entity | |
| created_at | TIMESTAMP | When the task was created | DEFAULT NOW() |
| updated_at | TIMESTAMP | When the task was last updated | DEFAULT NOW() |
| completed_at | TIMESTAMP | When the task was completed | NULL |
| completed_by | UUID | User who completed the task | FOREIGN KEY |

### Care Plans

The `care_plans` table stores patient care plans.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | UUID | Unique identifier | PRIMARY KEY |
| tenant_id | UUID | Reference to the tenant | FOREIGN KEY |
| patient_id | UUID | Reference to the patient | FOREIGN KEY |
| title | TEXT | Title of the care plan | NOT NULL |
| description | TEXT | Description of the care plan | |
| start_date | DATE | Start date of the care plan | |
| end_date | DATE | End date of the care plan | |
| status | TEXT | Status of the care plan | DEFAULT 'active' |
| goals | TEXT | Goals of the care plan | |
| interventions | TEXT | Interventions in the care plan | |
| review_date | DATE | Date for review | |
| assigned_to | UUID | Care professional assigned | FOREIGN KEY |
| created_at | TIMESTAMP | When the care plan was created | DEFAULT NOW() |
| updated_at | TIMESTAMP | When the care plan was last updated | DEFAULT NOW() |
| created_by | UUID | User who created the care plan | FOREIGN KEY |
| updated_by | UUID | User who last updated the care plan | FOREIGN KEY |

### Medications

The `medications` table tracks patient medications.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | UUID | Unique identifier | PRIMARY KEY |
| tenant_id | UUID | Reference to the tenant | FOREIGN KEY |
| patient_id | UUID | Reference to the patient | FOREIGN KEY |
| name | TEXT | Name of the medication | NOT NULL |
| dosage | TEXT | Dosage of the medication | |
| frequency | TEXT | Frequency of administration | |
| start_date | DATE | Start date of the medication | |
| end_date | DATE | End date of the medication | |
| prescriber | TEXT | Prescriber of the medication | |
| notes | TEXT | Notes about the medication | |
| is_active | BOOLEAN | Whether the medication is active | DEFAULT TRUE |
| created_at | TIMESTAMP | When the record was created | DEFAULT NOW() |
| updated_at | TIMESTAMP | When the record was last updated | DEFAULT NOW() |
| created_by | UUID | User who created the record | FOREIGN KEY |
| updated_by | UUID | User who last updated the record | FOREIGN KEY |

### Invoices

The `invoices` table tracks billing and invoices.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | UUID | Unique identifier | PRIMARY KEY |
| tenant_id | UUID | Reference to the tenant | FOREIGN KEY |
| patient_id | UUID | Reference to the patient | FOREIGN KEY |
| invoice_number | TEXT | Invoice number | NOT NULL |
| issue_date | DATE | Date the invoice was issued | NOT NULL |
| due_date | DATE | Date the invoice is due | NOT NULL |
| total_amount | DECIMAL(10, 2) | Total amount of the invoice | NOT NULL |
| status | TEXT | Status of the invoice | DEFAULT 'draft' |
| notes | TEXT | Notes about the invoice | |
| created_at | TIMESTAMP | When the invoice was created | DEFAULT NOW() |
| updated_at | TIMESTAMP | When the invoice was last updated | DEFAULT NOW() |
| created_by | UUID | User who created the invoice | FOREIGN KEY |
| updated_by | UUID | User who last updated the invoice | FOREIGN KEY |
| amount | DECIMAL(10, 2) | Amount of the invoice | NOT NULL |

### Invoice Items

The `invoice_items` table stores line items for invoices.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | UUID | Unique identifier | PRIMARY KEY |
| invoice_id | UUID | Reference to the invoice | FOREIGN KEY |
| description | TEXT | Description of the item | NOT NULL |
| quantity | INTEGER | Quantity of the item | NOT NULL |
| unit_price | DECIMAL(10, 2) | Unit price of the item | NOT NULL |
| total_price | DECIMAL(10, 2) | Total price of the item | NOT NULL |
| created_at | TIMESTAMP | When the item was created | DEFAULT NOW() |
| updated_at | TIMESTAMP | When the item was last updated | DEFAULT NOW() |

### Activity Logs

The `activity_logs` table tracks user activity for audit purposes.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | UUID | Unique identifier | PRIMARY KEY |
| tenant_id | UUID | Reference to the tenant | FOREIGN KEY |
| user_id | UUID | Reference to the user | FOREIGN KEY |
| patient_id | UUID | Reference to the patient | FOREIGN KEY |
| activity_type | TEXT | Type of activity | NOT NULL |
| description | TEXT | Description of the activity | NOT NULL |
| metadata | JSONB | Additional metadata | |
| created_at | TIMESTAMP | When the activity occurred | DEFAULT NOW() |

### Documents

The `documents` table stores uploaded documents.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | UUID | Unique identifier | PRIMARY KEY |
| tenant_id | UUID | Reference to the tenant | FOREIGN KEY |
| patient_id | UUID | Reference to the patient | FOREIGN KEY |
| title | TEXT | Title of the document | NOT NULL |
| description | TEXT | Description of the document | |
| file_path | TEXT | Path to the file | NOT NULL |
| file_type | TEXT | Type of the file | NOT NULL |
| file_size | INTEGER | Size of the file in bytes | NOT NULL |
| category | TEXT | Category of the document | |
| tags | TEXT[] | Array of tags | |
| status | TEXT | Status of the document | DEFAULT 'active' |
| created_at | TIMESTAMP | When the document was created | DEFAULT NOW() |
| updated_at | TIMESTAMP | When the document was last updated | DEFAULT NOW() |
| created_by | UUID | User who created the document | FOREIGN KEY |
| updated_by | UUID | User who last updated the document | FOREIGN KEY |

## Entity Relationship Diagram

Below is a simplified entity-relationship diagram showing the main tables and their relationships:

\`\`\`mermaid
erDiagram
    TENANTS ||--o{ TENANT_USERS : has
    TENANTS ||--o{ PATIENTS : has
    TENANTS ||--o{ CARE_PROFESSIONALS : has
    TENANTS ||--o{ APPOINTMENTS : has
    TENANTS ||--o{ CLINICAL_NOTES : has
    TENANTS ||--o{ TASKS : has
    TENANTS ||--o{ CARE_PLANS : has
    TENANTS ||--o{ MEDICATIONS : has
    TENANTS ||--o{ INVOICES : has
    TENANTS ||--o{ ACTIVITY_LOGS : has
    TENANTS ||--o{ DOCUMENTS : has
    
    USERS ||--o{ TENANT_USERS : belongs_to
    USERS ||--o{ CLINICAL_NOTES : authors
    USERS ||--o{ TASKS : creates
    USERS ||--o{ TASKS : assigned
    USERS ||--o{ ACTIVITY_LOGS : performs
    
    PATIENTS ||--o{ APPOINTMENTS : has
    PATIENTS ||--o{ CLINICAL_NOTES : has
    PATIENTS ||--o{ CARE_PLANS : has
    PATIENTS ||--o{ MEDICATIONS : takes
    PATIENTS ||--o{ INVOICES : billed
    PATIENTS ||--o{ DOCUMENTS : has
    
    CARE_PROFESSIONALS ||--o{ APPOINTMENTS : conducts
    CARE_PROFESSIONALS ||--o{ CREDENTIALS : has
    CARE_PROFESSIONALS ||--o{ CARE_PLANS : manages
    
    CLINICAL_NOTE_CATEGORIES ||--o{ CLINICAL_NOTES : categorizes
    
    INVOICES ||--o{ INVOICE_ITEMS : contains
\`\`\`

## Common Queries

### Patient Management

\`\`\`sql
-- Get all active patients for a tenant
SELECT * FROM patients
WHERE tenant_id = '${tenantId}'
AND is_active = true
AND deleted_at IS NULL
ORDER BY last_name, first_name;

-- Search patients by name or NHS number
SELECT * FROM patients
WHERE tenant_id = '${tenantId}'
AND (
  LOWER(first_name) LIKE LOWER('%${searchTerm}%') OR
  LOWER(last_name) LIKE LOWER('%${searchTerm}%') OR
  nhs_number LIKE '%${searchTerm}%'
)
AND deleted_at IS NULL
ORDER BY last_name, first_name;

-- Get patient with recent clinical notes
SELECT 
  p.*,
  (
    SELECT COUNT(*) FROM clinical_notes cn
    WHERE cn.patient_id = p.id
    AND cn.created_at > NOW() - INTERVAL '30 days'
  ) as recent_notes_count
FROM patients p
WHERE p.tenant_id = '${tenantId}'
AND p.deleted_at IS NULL
ORDER BY recent_notes_count DESC, p.last_name, p.first_name;
\`\`\`

### Appointment Management

\`\`\`sql
-- Get upcoming appointments for a specific date range
SELECT 
  a.*,
  CONCAT(p.first_name, ' ', p.last_name) as patient_name,
  CONCAT(cp.first_name, ' ', cp.last_name) as provider_name
FROM appointments a
JOIN patients p ON a.patient_id = p.id
JOIN care_professionals cp ON a.care_professional_id = cp.id
WHERE a.tenant_id = '${tenantId}'
AND a.appointment_date BETWEEN '${startDate}' AND '${endDate}'
ORDER BY a.appointment_date, a.appointment_time;

-- Get appointments for a specific patient
SELECT 
  a.*,
  CONCAT(cp.first_name, ' ', cp.last_name) as provider_name
FROM appointments a
JOIN care_professionals cp ON a.care_professional_id = cp.id
WHERE a.tenant_id = '${tenantId}'
AND a.patient_id = '${patientId}'
ORDER BY a.appointment_date DESC, a.appointment_time DESC;

-- Get appointments for a specific provider
SELECT 
  a.*,
  CONCAT(p.first_name, ' ', p.last_name) as patient_name
FROM appointments a
JOIN patients p ON a.patient_id = p.id
WHERE a.tenant_id = '${tenantId}'
AND a.care_professional_id = '${providerId}'
ORDER BY a.appointment_date, a.appointment_time;
\`\`\`

### Clinical Notes

\`\`\`sql
-- Get clinical notes for a patient
SELECT 
  cn.*,
  cnc.name as category_name,
  cnc.color as category_color,
  CONCAT(u.first_name, ' ', u.last_name) as author_name
FROM clinical_notes cn
LEFT JOIN clinical_note_categories cnc ON cn.category_id = cnc.id
LEFT JOIN users u ON cn.author_id = u.id
WHERE cn.tenant_id = '${tenantId}'
AND cn.patient_id = '${patientId}'
AND cn.is_deleted = false
ORDER BY cn.created_at DESC;

-- Get important clinical notes requiring follow-up
SELECT 
  cn.*,
  CONCAT(p.first_name, ' ', p.last_name) as patient_name,
  cnc.name as category_name
FROM clinical_notes cn
JOIN patients p ON cn.patient_id = p.id
LEFT JOIN clinical_note_categories cnc ON cn.category_id = cnc.id
WHERE cn.tenant_id = '${tenantId}'
AND cn.is_important = true
AND cn.follow_up_date IS NOT NULL
AND cn.follow_up_date <= CURRENT_DATE + INTERVAL '7 days'
AND cn.is_deleted = false
ORDER BY cn.follow_up_date;
\`\`\`

### Tasks and Reminders

\`\`\`sql
-- Get tasks assigned to a user
SELECT 
  t.*,
  CASE
    WHEN t.related_to_type = 'patient' THEN (
      SELECT CONCAT(first_name, ' ', last_name)
      FROM patients
      WHERE id = t.related_to_id
    )
    ELSE NULL
  END as related_to_name
FROM tasks t
WHERE t.tenant_id = '${tenantId}'
AND t.assigned_to = '${userId}'
AND t.status != 'completed'
ORDER BY 
  CASE 
    WHEN t.priority = 'high' THEN 1
    WHEN t.priority = 'medium' THEN 2
    ELSE 3
  END,
  t.due_date;

-- Get overdue tasks
SELECT 
  t.*,
  CONCAT(u.first_name, ' ', u.last_name) as assigned_to_name
FROM tasks t
LEFT JOIN users u ON t.assigned_to = u.id
WHERE t.tenant_id = '${tenantId}'
AND t.status != 'completed'
AND t.due_date < CURRENT_DATE
ORDER BY t.due_date;
\`\`\`

### Compliance and Credentials

\`\`\`sql
-- Get expiring credentials
SELECT 
  c.*,
  CONCAT(cp.first_name, ' ', cp.last_name) as professional_name
FROM credentials c
JOIN care_professionals cp ON c.care_professional_id = cp.id
WHERE c.tenant_id = '${tenantId}'
AND c.expiry_date IS NOT NULL
AND c.expiry_date <= CURRENT_DATE + INTERVAL '90 days'
ORDER BY c.expiry_date;

-- Get compliance status by professional
SELECT 
  cp.id,
  CONCAT(cp.first_name, ' ', cp.last_name) as name,
  cp.role,
  COUNT(c.id) as total_credentials,
  COUNT(CASE WHEN c.compliance_status = 'compliant' THEN 1 END) as compliant_count,
  ROUND(
    COUNT(CASE WHEN c.compliance_status = 'compliant' THEN 1 END)::numeric / 
    NULLIF(COUNT(c.id), 0)::numeric * 100
  ) as compliance_percentage
FROM care_professionals cp
LEFT JOIN credentials c ON cp.id = c.care_professional_id
WHERE cp.tenant_id = '${tenantId}'
AND cp.is_active = true
GROUP BY cp.id, cp.first_name, cp.last_name, cp.role
ORDER BY compliance_percentage DESC;
\`\`\`

### Invoicing and Finances

\`\`\`sql
-- Get outstanding invoices
SELECT 
  i.*,
  CONCAT(p.first_name, ' ', p.last_name) as patient_name,
  (
    SELECT SUM(total_price) 
    FROM invoice_items 
    WHERE invoice_id = i.id
  ) as calculated_total
FROM invoices i
JOIN patients p ON i.patient_id = p.id
WHERE i.tenant_id = '${tenantId}'
AND i.status IN ('draft', 'pending', 'overdue')
ORDER BY 
  CASE 
    WHEN i.status = 'overdue' THEN 1
    WHEN i.status = 'pending' THEN 2
    ELSE 3
  END,
  i.due_date;

-- Get invoice with items
SELECT 
  i.*,
  CONCAT(p.first_name, ' ', p.last_name) as patient_name,
  json_agg(
    json_build_object(
      'id', ii.id,
      'description', ii.description,
      'quantity', ii.quantity,
      'unit_price', ii.unit_price,
      'total_price', ii.total_price
    )
  ) as items
FROM invoices i
JOIN patients p ON i.patient_id = p.id
LEFT JOIN invoice_items ii ON i.id = ii.invoice_id
WHERE i.tenant_id = '${tenantId}'
AND i.id = '${invoiceId}'
GROUP BY i.id, p.first_name, p.last_name;
\`\`\`

### Activity and Audit Logs

\`\`\`sql
-- Get recent activity for a patient
SELECT 
  al.*,
  CONCAT(u.first_name, ' ', u.last_name) as user_name
FROM activity_logs al
LEFT JOIN users u ON al.user_id = u.id
WHERE al.tenant_id = '${tenantId}'
AND al.patient_id = '${patientId}'
ORDER BY al.created_at DESC
LIMIT 50;

-- Get login activity
SELECT 
  al.*,
  CONCAT(u.first_name, ' ', u.last_name) as user_name
FROM activity_logs al
JOIN users u ON al.user_id = u.id
WHERE al.tenant_id = '${tenantId}'
AND al.activity_type = 'login'
ORDER BY al.created_at DESC
LIMIT 100;
\`\`\`

## Best Practices

### Working with the Database

1. **Always Include Tenant ID**: Every query should include the tenant_id to maintain data isolation
2. **Use Parameterized Queries**: Always use parameterized queries to prevent SQL injection
3. **Soft Deletion**: Use soft deletion (setting deleted_at) rather than DELETE statements
4. **Transactions**: Use transactions for operations that modify multiple tables
5. **Limit Result Sets**: Always limit the number of rows returned to prevent performance issues
6. **Include Created/Updated By**: Set created_by and updated_by fields to maintain audit trails
7. **Check Permissions**: Verify user permissions before executing database operations
8. **Handle NULL Values**: Always handle NULL values appropriately in queries and application code
9. **Use Indexes**: Create appropriate indexes for frequently queried columns
10. **Regular Backups**: Ensure regular database backups are configured

### Schema Migrations

1. **Idempotent Migrations**: Design migrations to be idempotent (can be run multiple times without issues)
2. **Check Before Altering**: Always check if tables/columns exist before creating or altering them
3. **Backward Compatibility**: Maintain backward compatibility when possible
4. **Transaction Wrapping**: Wrap migrations in transactions to ensure atomicity
5. **Version Control**: Keep all migration scripts in version control
6. **Testing**: Test migrations in a staging environment before applying to production
7. **Backup Before Migration**: Always create a backup before running migrations
8. **Documentation**: Document all schema changes and their purpose

## Maintenance Tasks

### Regular Maintenance

1. **Vacuum Analysis**: Run VACUUM ANALYZE regularly to optimize performance
2. **Index Maintenance**: Rebuild indexes periodically to prevent fragmentation
3. **Statistics Updates**: Update database statistics to improve query planning
4. **Disk Space Monitoring**: Monitor disk space usage and growth trends
5. **Connection Pool Tuning**: Adjust connection pool settings based on usage patterns

### Performance Optimization

1. **Query Analysis**: Regularly analyze slow queries using pg_stat_statements
2. **Execution Plans**: Review execution plans for complex queries
3. **Partitioning**: Consider partitioning large tables by tenant_id or date
4. **Caching**: Implement appropriate caching strategies for frequently accessed data
5. **Read Replicas**: Use read replicas for reporting and analytics queries

## Schema Evolution

As the ComplexCare CRM system evolves, follow these guidelines for schema changes:

1. **Additive Changes**: Prefer additive changes (adding tables/columns) over destructive ones
2. **Default Values**: Provide sensible default values for new columns
3. **Nullable Columns**: Make new columns nullable unless absolutely necessary
4. **Phased Migrations**: For complex changes, use a phased approach:
   - Add new structures
   - Migrate data
   - Update application code
   - Remove old structures
5. **Communication**: Communicate schema changes to all developers and stakeholders
6. **Documentation Updates**: Update this documentation after schema changes

## Automated Schema Documentation

This documentation can be automatically updated using the `scripts/generate-schema-docs.ts` script, which connects to the database and generates an updated Markdown file based on the current schema.
\`\`\`

Now, let's create a script to automatically generate updated schema documentation:
