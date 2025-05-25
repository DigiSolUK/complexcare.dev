# Error Handling System

This document describes the error handling system implemented in the ComplexCare CRM application.

## Overview

The error handling system is designed to:

1. Provide consistent error handling across the application
2. Capture detailed error information for debugging
3. Present user-friendly error messages
4. Enable easy error tracking and analysis
5. Support automatic error recovery where possible

## Components

### Error Logging

The system logs errors to both the console (in development) and to a database table for later analysis. Each error log includes:

- Error message
- Error stack trace
- Error level (error, warning, info)
- Component where the error occurred
- Route where the error occurred
- Timestamp
- Additional context information

### Error Boundaries

React Error Boundaries are used to catch and handle errors in the component tree. The system includes:

- `ErrorBoundaryWrapper`: A component that can be used to wrap any part of the application
- `withErrorBoundary`: A higher-order component (HOC) for wrapping individual components

### API Error Handling

API routes use a consistent error handling approach:

- `ApiError`: A custom error class for API-specific errors
- `handleApiError`: A utility function for consistent API error responses
- `ApiErrors`: Factory functions for common API error types (not found, unauthorized, etc.)

### Error Display

The system includes components for displaying errors to users:

- `ErrorDisplay`: A component for displaying errors with retry and home navigation options
- Custom error pages for different error types (404, 500, etc.)

## Usage Examples

### Wrapping a Component with Error Boundary

\`\`\`tsx
import { ErrorBoundaryWrapper } from '@/lib/error-handling/error-boundary-wrapper';

function MyComponent() {
  return (
    <ErrorBoundaryWrapper
      component="MyComponent"
      fallback={<div>Something went wrong in this component</div>}
    >
      {/* Component content */}
    </ErrorBoundaryWrapper>
  );
}
\`\`\`

### Using the HOC Pattern

\`\`\`tsx
import { withErrorBoundary } from '@/lib/error-handling/error-boundary-wrapper';

function MyComponent() {
  // Component implementation
}

export default withErrorBoundary(MyComponent, {
  fallback: <div>Something went wrong</div>
});
\`\`\`

### Logging Errors

\`\`\`tsx
import { logError } from '@/lib/error-handling/error-logger';

try {
  // Some operation that might fail
} catch (error) {
  logError(error instanceof Error ? error : new Error(String(error)), {
    component: 'MyComponent',
    action: 'fetchData',
    input: { id: '123' }
  });
}
\`\`\`

### API Error Handling

\`\`\`tsx
import { handleApiError, ApiErrors } from '@/lib/error-handling/api-error-handler';

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    
    if (!id) {
      throw ApiErrors.badRequest('Missing id parameter');
    }
    
    const item = await getItemById(id);
    
    if (!item) {
      throw ApiErrors.notFound(`Item with id ${id} not found`);
    }
    
    return NextResponse.json(item);
  } catch (error) {
    return handleApiError(error, req);
  }
}
\`\`\`

### Displaying Errors

\`\`\`tsx
import { ErrorDisplay } from '@/components/error-handling/error-display';

function MyComponent() {
  const [error, setError] = useState<Error | null>(null);
  
  const fetchData = async () => {
    try {
      // Fetch data
    } catch (error) {
      setError(error instanceof Error ? error : new Error(String(error)));
    }
  };
  
  if (error) {
    return (
      <ErrorDisplay
        error={error}
        retry={fetchData}
        title="Failed to load data"
        message="We couldn't load the data you requested. Please try again."
      />
    );
  }
  
  // Normal component rendering
}
\`\`\`

## Error Logs Dashboard

The system includes an error logs dashboard at `/diagnostics/error-logs` that allows administrators to:

1. View all logged errors
2. Filter errors by level, component, route, and date range
3. Delete individual errors or clear all errors
4. Analyze error trends

## Automatic Error Recovery

The system includes an API endpoint at `/api/diagnostics/fix-errors` that can attempt to automatically fix common errors:

1. Database connection issues
2. Missing database tables
3. Environment variable issues
4. Module resolution issues

## Best Practices

1. **Use Error Boundaries**: Wrap important sections of your application with error boundaries to prevent the entire app from crashing.
2. **Log Detailed Context**: Always include relevant context when logging errors to make debugging easier.
3. **User-Friendly Messages**: Display user-friendly error messages that suggest possible solutions.
4. **Graceful Degradation**: Design components to gracefully degrade when errors occur.
5. **Monitor Error Trends**: Regularly review the error logs dashboard to identify recurring issues.
