# Clinical Notes Module Documentation

## Overview
The Clinical Notes module is a comprehensive system for managing patient clinical documentation in the Complex Care CRM. It provides healthcare professionals with tools to create, organize, search, and manage clinical notes efficiently.

## Features

### 1. Note Categories
- Customizable categories with colors and icons
- Default categories: General, Assessment, Medication, Treatment
- Active/inactive status management

### 2. Note Templates
- Pre-defined templates for common note types
- Category-specific templates
- Default templates for quick note creation

### 3. Advanced Search
- Full-text search across title and content
- Filter by category, care professional, date range
- Support for draft and confidential note filtering

### 4. File Attachments
- Upload documents, images, and other files
- Secure storage using Vercel Blob
- File type and size validation

### 5. Security Features
- Confidential note marking
- Draft/published status
- Audit trail with created/updated timestamps

### 6. Print Support
- Formatted print view for clinical notes
- Include patient and provider information
- Professional layout for medical records

## Database Schema

### Tables
1. **clinical_note_categories** - Note categorization
2. **clinical_note_templates** - Reusable note templates
3. **clinical_notes** - Main notes table
4. **clinical_note_attachments** - File attachments

### Key Fields
- `tenant_id` - Multi-tenant support
- `patient_id` - Patient association
- `care_professional_id` - Provider association
- `is_confidential` - Security flag
- `is_draft` - Publication status
- `tags` - Flexible tagging system

## API Endpoints

### Notes
- `GET /api/clinical-notes` - List all notes
- `POST /api/clinical-notes` - Create new note
- `PUT /api/clinical-notes/[id]` - Update note
- `DELETE /api/clinical-notes/[id]` - Delete note

### Search
- `GET /api/clinical-notes/search` - Advanced search with filters

### Categories
- `GET /api/clinical-notes/categories` - List categories
- `POST /api/clinical-notes/categories` - Create category

### Templates
- `GET /api/clinical-notes/templates` - List templates
- `POST /api/clinical-notes/templates` - Create template

### Attachments
- `POST /api/clinical-notes/attachments` - Upload attachment
- `DELETE /api/clinical-notes/attachments` - Delete attachment

## Usage Examples

### Creating a Note
\`\`\`typescript
const note = await createClinicalNote({
  patient_id: "patient-uuid",
  category_id: "category-uuid",
  title: "Initial Assessment",
  content: "Patient assessment details...",
  is_confidential: false,
  is_draft: false,
  tags: ["assessment", "initial"]
})
\`\`\`

### Searching Notes
\`\`\`typescript
const results = await searchClinicalNotes({
  searchTerm: "medication",
  categoryId: "medication-category-id",
  startDate: "2024-01-01",
  endDate: "2024-12-31"
})
\`\`\`

## Security Considerations
1. All notes are tenant-scoped
2. Confidential notes require special permissions
3. File uploads are validated and scanned
4. Audit trail maintained for all operations

## Future Enhancements
1. AI-powered note summarization
2. Voice-to-text note creation
3. Integration with external EHR systems
4. Advanced analytics and reporting
