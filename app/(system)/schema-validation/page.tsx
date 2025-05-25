import { SchemaValidationPanel } from "@/components/admin/schema-validation-panel"

export default function SchemaValidationPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Database Schema Validation</h1>
      <p className="text-muted-foreground mb-8">
        Validate the database schema against the expected models defined in the application code. This helps identify
        mismatches that could cause runtime errors.
      </p>

      <SchemaValidationPanel />

      <div className="mt-8 bg-slate-50 p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">About Schema Validation</h2>
        <p className="mb-4">
          Schema validation compares the actual database structure with the expected structure defined in the
          application code. This helps prevent issues where code expects database structures that don't exist or have
          changed.
        </p>

        <h3 className="text-lg font-medium mt-6 mb-2">Types of Mismatches</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Missing Table:</strong> A table defined in the code doesn't exist in the database.
          </li>
          <li>
            <strong>Missing Column:</strong> A column defined in the code doesn't exist in the database table.
          </li>
          <li>
            <strong>Type Mismatch:</strong> A column's data type in the database doesn't match the expected type.
          </li>
          <li>
            <strong>Constraint Mismatch:</strong> Constraints like NOT NULL don't match between code and database.
          </li>
        </ul>

        <h3 className="text-lg font-medium mt-6 mb-2">When to Run Validation</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>After deploying code changes that modify data models</li>
          <li>After running database migrations</li>
          <li>When investigating unexpected application errors</li>
          <li>As part of regular system health checks</li>
        </ul>
      </div>
    </div>
  )
}
