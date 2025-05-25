import { tenantQuery, tenantInsert, tenantUpdate, tenantDelete } from "@/lib/db-utils"
import { logActivity } from "./activity-log-service"

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
  // Log activity for viewing patient documents
  await logActivity({
    tenantId,
    activityType: "documents_viewed",
    description: `Patient documents viewed`,
    patientId,
  })

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

  if (documents.length > 0) {
    const document = documents[0]

    // Log activity for viewing a specific document
    if (document.patient_id) {
      await logActivity({
        tenantId,
        activityType: "document_viewed",
        description: `Document viewed: ${document.title}`,
        patientId: document.patient_id,
        metadata: {
          documentId,
          documentTitle: document.title,
          documentType: document.file_type,
          category: document.category,
        },
      })
    }
  }

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

  const newDocument = documents[0]

  // Log activity for creating a document
  if (documentData.patient_id) {
    await logActivity({
      tenantId,
      activityType: "document_uploaded",
      description: `Document uploaded: ${documentData.title}`,
      patientId: documentData.patient_id,
      userId,
      metadata: {
        documentId: newDocument.id,
        documentTitle: documentData.title,
        documentType: documentData.file_type,
        fileSize: documentData.file_size,
        category: documentData.category,
      },
    })
  }

  return newDocument
}

// Update a document
export async function updateDocument(
  tenantId: string,
  documentId: string,
  documentData: Partial<Document>,
  userId: string,
): Promise<Document | null> {
  // Get original document data for comparison
  const originalDocument = await getDocumentById(tenantId, documentId)
  if (!originalDocument) return null

  const now = new Date().toISOString()
  const documents = await tenantUpdate<Document>(tenantId, "documents", documentId, {
    ...documentData,
    updated_at: now,
    updated_by: userId,
  })

  if (documents.length > 0) {
    const updatedDocument = documents[0]

    // Determine which fields were updated
    const updatedFields = []
    if (documentData.title && documentData.title !== originalDocument.title) updatedFields.push("title")
    if (documentData.description && documentData.description !== originalDocument.description)
      updatedFields.push("description")
    if (documentData.category && documentData.category !== originalDocument.category) updatedFields.push("category")
    if (documentData.tags && JSON.stringify(documentData.tags) !== JSON.stringify(originalDocument.tags))
      updatedFields.push("tags")
    if (documentData.status && documentData.status !== originalDocument.status) updatedFields.push("status")

    // Log activity for updating a document
    if (updatedDocument.patient_id) {
      await logActivity({
        tenantId,
        activityType: "document_updated",
        description: `Document updated: ${updatedDocument.title}`,
        patientId: updatedDocument.patient_id,
        userId,
        metadata: {
          documentId,
          documentTitle: updatedDocument.title,
          updatedFields,
        },
      })
    }
  }

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

  if (documents.length > 0) {
    const archivedDocument = documents[0]

    // Log activity for archiving a document
    if (archivedDocument.patient_id) {
      await logActivity({
        tenantId,
        activityType: "document_archived",
        description: `Document archived: ${archivedDocument.title}`,
        patientId: archivedDocument.patient_id,
        userId,
        metadata: {
          documentId,
          documentTitle: archivedDocument.title,
        },
      })
    }
  }

  return documents.length > 0 ? documents[0] : null
}

// Delete a document
export async function deleteDocument(tenantId: string, documentId: string, userId?: string): Promise<Document | null> {
  // Get document details before deletion
  const document = await getDocumentById(tenantId, documentId)
  if (!document) return null

  const documents = await tenantDelete<Document>(tenantId, "documents", documentId)

  if (documents.length > 0 && document.patient_id) {
    // Log activity for deleting a document
    await logActivity({
      tenantId,
      activityType: "document_deleted",
      description: `Document deleted: ${document.title}`,
      patientId: document.patient_id,
      userId,
      metadata: {
        documentId,
        documentTitle: document.title,
        documentType: document.file_type,
      },
    })
  }

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
