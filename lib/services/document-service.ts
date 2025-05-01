import { tenantQuery, tenantInsert, tenantUpdate, tenantDelete } from "@/lib/db-utils"

export type Document = {
  id: string
  tenant_id: string
  patient_id: string | null
  title: string
  description: string | null
  file_path: string
  file_type: string
  file_size: number
  category: string | null
  tags: string[] | null
  status: "active" | "archived"
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
}

// Get all documents for a tenant
export async function getDocuments(tenantId: string): Promise<Document[]> {
  return tenantQuery<Document>(tenantId, `SELECT * FROM documents ORDER BY created_at DESC`)
}

// Get documents for a patient
export async function getDocumentsForPatient(tenantId: string, patientId: string): Promise<Document[]> {
  return tenantQuery<Document>(tenantId, `SELECT * FROM documents WHERE patient_id = $1 ORDER BY created_at DESC`, [
    patientId,
  ])
}

// Get documents by category
export async function getDocumentsByCategory(tenantId: string, category: string): Promise<Document[]> {
  return tenantQuery<Document>(tenantId, `SELECT * FROM documents WHERE category = $1 ORDER BY created_at DESC`, [
    category,
  ])
}

// Get a document by ID
export async function getDocumentById(tenantId: string, documentId: string): Promise<Document | null> {
  const documents = await tenantQuery<Document>(tenantId, `SELECT * FROM documents WHERE id = $1`, [documentId])
  return documents.length > 0 ? documents[0] : null
}

// Create a new document
export async function createDocument(
  tenantId: string,
  documentData: Omit<Document, "id" | "tenant_id" | "created_at" | "updated_at">,
  userId: string,
): Promise<Document> {
  const now = new Date().toISOString()
  const documents = await tenantInsert<Document>(tenantId, "documents", {
    ...documentData,
    created_at: now,
    updated_at: now,
    created_by: userId,
    updated_by: userId,
  })
  return documents[0]
}

// Update a document
export async function updateDocument(
  tenantId: string,
  documentId: string,
  documentData: Partial<Document>,
  userId: string,
): Promise<Document | null> {
  const now = new Date().toISOString()
  const documents = await tenantUpdate<Document>(tenantId, "documents", documentId, {
    ...documentData,
    updated_at: now,
    updated_by: userId,
  })
  return documents.length > 0 ? documents[0] : null
}

// Archive a document
export async function archiveDocument(tenantId: string, documentId: string, userId: string): Promise<Document | null> {
  const now = new Date().toISOString()
  const documents = await tenantUpdate<Document>(tenantId, "documents", documentId, {
    status: "archived",
    updated_at: now,
    updated_by: userId,
  })
  return documents.length > 0 ? documents[0] : null
}

// Delete a document
export async function deleteDocument(tenantId: string, documentId: string): Promise<Document | null> {
  const documents = await tenantDelete<Document>(tenantId, "documents", documentId)
  return documents.length > 0 ? documents[0] : null
}

// Search documents
export async function searchDocuments(tenantId: string, searchTerm: string): Promise<Document[]> {
  return tenantQuery<Document>(
    tenantId,
    `SELECT * FROM documents 
     WHERE title ILIKE $1 
     OR description ILIKE $1 
     ORDER BY created_at DESC`,
    [`%${searchTerm}%`],
  )
}
