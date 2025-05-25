# ComplexCare CRM Development Guide

## Introduction

This guide provides essential information for developers working on the ComplexCare CRM system. It covers key aspects of the application architecture, development workflows, and best practices.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Architecture Overview](#architecture-overview)
3. [Key Technologies](#key-technologies)
4. [Development Workflow](#development-workflow)
5. [Code Organization](#code-organization)
6. [Routing Structure](#routing-structure)
7. [Database Access](#database-access)
8. [Authentication and Authorization](#authentication-and-authorization)
9. [Error Handling](#error-handling)
10. [Testing](#testing)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Git
- Access to the Vercel project

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/your-org/complexcare-crm.git
   cd complexcare-crm
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn
   \`\`\`

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in the required values (see [Environment Variables](#environment-variables))

4. Start the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

## Architecture Overview

ComplexCare CRM is a multi-tenant healthcare CRM system built with Next.js App Router. It follows a modular architecture with clear separation of concerns:

- **Frontend**: React components with server and client components
- **API**: Next.js API routes and Server Actions
- **Database**: PostgreSQL (Neon) with direct SQL queries
- **Caching**: Redis (Upstash) for performance optimization
- **Storage**: Vercel Blob for file storage
- **AI**: Groq for AI-powered features

## Key Technologies

- **Framework**: Next.js 14+ with App Router
- **UI**: React, Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL via Neon
- **Caching**: Redis via Upstash
- **Authentication**: NextAuth.js with multiple providers
- **Storage**: Vercel Blob
- **AI**: Groq
- **Deployment**: Vercel

## Development Workflow

1. **Feature branches**: Create a branch for each feature or fix
2. **Conventional commits**: Follow conventional commit format
3. **Pull requests**: Submit PRs for review before merging
4. **CI/CD**: Automated testing and preview deployments
5. **Documentation**: Update docs for significant changes

## Code Organization

The codebase is organized as follows:

\`\`\`
/
├── app/               # Next.js App Router pages and layouts
├── components/        # Reusable React components
├── lib/               # Utility functions and services
├── public/            # Static assets
├── scripts/           # Database and maintenance scripts
├── styles/            # Global styles
├── types/             # TypeScript type definitions
└── docs/              # Documentation
\`\`\`

## Routing Structure

The application uses Next.js App Router with route groups for organization. See [Routing Structure](./routing-structure.md) for detailed information.

Key points:
- Route groups (in parentheses) don't affect URL paths
- All patient routes are under the `(dashboard)` route group
- Use the routes helper (`lib/routes.ts`) for navigation

## Database Access

The application uses direct SQL queries to interact with the PostgreSQL database:

\`\`\`typescript
import { executeQuery } from "@/lib/db";

// Example query
const patients = await executeQuery({
  text: "SELECT * FROM patients WHERE tenant_id = $1 LIMIT $2",
  values: [tenantId, limit]
});
\`\`\`

Key database utilities:
- `executeQuery`: For running SQL queries
- `getById`: Fetch a record by ID
- `insert`: Insert new records
- `update`: Update existing records
- `remove`: Delete records

## Authentication and Authorization

The application uses NextAuth.js for authentication with multiple strategies:

- Email/password
- Google OAuth
- Auth0

Authorization is handled through:
- Tenant-based access control
- Role-based permissions
- Feature flags

## Error Handling

The application uses a comprehensive error handling strategy:

1. **Client-side error boundaries**: Prevent entire UI from crashing
2. **Server-side error handling**: Structured error responses
3. **Error logging service**: Captures and stores errors
4. **Diagnostics tools**: Help identify and fix issues

To log errors:
\`\`\`typescript
import { logError } from "@/lib/services/error-logging-service";

try {
  // Code that might fail
} catch (error) {
  await logError({
    message: "Failed to fetch patient data",
    error,
    context: { patientId }
  });
}
\`\`\`

## Testing

The application uses:
- Jest for unit tests
- React Testing Library for component tests
- Playwright for end-to-end tests

Run tests with:
\`\`\`bash
npm run test        # Unit and component tests
npm run test:e2e    # End-to-end tests
\`\`\`

## Deployment

The application is deployed on Vercel:

1. Commits to `main` are automatically deployed to production
2. PRs get preview deployments
3. Environment variables are managed in the Vercel dashboard

## Troubleshooting

If you encounter issues:

1. Check the [Troubleshooting Guide](./troubleshooting-guide.md)
2. Use the built-in diagnostics at `/diagnostics`
3. Review error logs in the admin interface
4. Check Vercel logs for deployment issues

For database issues, use the database diagnostics tools at `/diagnostics/database`.
