# ComplexCare CRM Troubleshooting Guide

## Common Issues and Solutions

This guide provides solutions for common issues you might encounter with the ComplexCare CRM system, particularly after integrating new services or making database changes.

## Table of Contents

1. [Environment Variable Issues](#environment-variable-issues)
2. [Database Connection Problems](#database-connection-problems)
3. [Redis Cache Issues](#redis-cache-issues)
4. [Module Import Errors](#module-import-errors)
5. [Blob Storage Problems](#blob-storage-problems)
6. [Authentication Failures](#authentication-failures)
7. [Using the Diagnostics Tool](#using-the-diagnostics-tool)

## Environment Variable Issues

### Client-Side Environment Variable Access

**Problem**: Errors like `NPM_RC cannot be accessed on the client`, `NPM_TOKEN cannot be accessed on the client`, or `NODE_ENV cannot be accessed on the client`.

**Solution**:
1. Use the `env-safe.ts` utility for accessing environment variables
2. Move environment variable access to Server Components or API routes
3. For client-side access, prefix variables with NEXT_PUBLIC_

\`\`\`typescript
// WRONG - Direct access in client component
const apiKey = process.env.API_KEY;

// RIGHT - Use the env-safe utility
import { getEnvSafe } from "@/lib/env-safe";
const apiKey = getEnvSafe({ name: "API_KEY", isClientSafe: false });
\`\`\`

### Missing Environment Variables

**Problem**: Services fail because required environment variables are missing.

**Solution**:
1. Ensure all required variables are set in your Vercel project:
   - DATABASE_URL or production_DATABASE_URL
   - KV_URL and KV_REST_API_TOKEN (for Redis)
   - BLOB_READ_WRITE_TOKEN (for Blob storage)
   - GROQ_API_KEY (for Groq AI)
   - NEXTAUTH_URL and NEXTAUTH_SECRET

## Database Connection Problems

### Connection String Issues

**Problem**: Database operations fail with connection errors.

**Solution**:
1. Verify your Neon database is running
2. Check the DATABASE_URL environment variable
3. Ensure the connection string format is correct
4. Check for IP restrictions or firewall issues

### Schema Issues

**Problem**: Queries fail with "column does not exist" or similar errors.

**Solution**:
1. Run the diagnostics tool at `/diagnostics`
2. Click "Run Fixes" to automatically fix schema issues
3. For manual fixes, run the SQL scripts in the `scripts` directory

## Redis Cache Issues

### Connection Problems

**Problem**: Redis operations fail or the system falls back to mock implementation.

**Solution**:
1. Verify your Upstash integration is active
2. Check KV_URL and KV_REST_API_TOKEN variables
3. Use the diagnostics tool to test Redis connection

### Cache Inconsistency

**Problem**: Stale or incorrect data appears in the application.

**Solution**:
1. Clear the Redis cache using the admin tools
2. Restart the application
3. Verify cache expiration settings

## Module Import Errors

### Path Resolution Failures

**Problem**: Errors like `Unable to resolve specifier '@v0/lib/data'`.

**Solution**:
1. Update import paths in your code:
   - Change `@v0/lib/data` to `@/lib/db`
   - Change `@v0/components` to `@/components`
   - Change `@v0/utils` to `@/lib/utils`
   - See the diagnostics tool for a complete list

### Missing Modules

**Problem**: Imports fail because modules don't exist.

**Solution**:
1. Check that all required packages are installed
2. Verify file paths and directory structure
3. Use the compatibility layer in `lib/fix-module-paths.ts`

## Blob Storage Problems

### Access Token Issues

**Problem**: File uploads or retrievals fail.

**Solution**:
1. Verify BLOB_READ_WRITE_TOKEN is set correctly
2. Check blob URLs for correct format
3. Ensure blob storage is properly configured in Vercel

### File Reference Errors

**Problem**: References to blob URLs that are invalid or inaccessible.

**Solution**:
1. Update file references to use the correct path format
2. Regenerate blob URLs if necessary
3. Check for expired or revoked tokens

## Authentication Failures

### Session Issues

**Problem**: Users are unexpectedly logged out or can't log in.

**Solution**:
1. Verify NEXTAUTH_URL and NEXTAUTH_SECRET are set correctly
2. Check authentication provider configuration
3. Clear browser cookies and try again

### Permission Problems

**Problem**: Users can't access features they should have permission for.

**Solution**:
1. Check user roles and permissions in the database
2. Verify tenant ID configuration
3. Review permission gate components

## Using the Diagnostics Tool

The ComplexCare CRM includes a comprehensive diagnostics tool to help identify and fix issues:

1. Navigate to `/diagnostics` in your application
2. Review the health status of each service
3. Click "Run Fixes" to attempt automatic resolution
4. Follow the recommendations for any remaining issues

For persistent issues, contact support with the diagnostic report.
