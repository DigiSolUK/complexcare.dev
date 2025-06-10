# Database Connection Setup Guide

This guide provides instructions for setting up and configuring database connections for the ComplexCare CRM system.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Options](#database-options)
3. [Environment Variables](#environment-variables)
4. [Local Development Setup](#local-development-setup)
5. [Production Setup](#production-setup)
6. [Testing Your Connection](#testing-your-connection)
7. [Database Schema Initialization](#database-schema-initialization)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

Before setting up the database connection, ensure you have:

- Access to a PostgreSQL database (version 12 or higher recommended)
- Database credentials (username, password, host, port, database name)
- Appropriate permissions to create tables and indexes

## Database Options

ComplexCare CRM supports the following database options:

1. **Neon PostgreSQL** (Recommended for production)
   - Serverless PostgreSQL with automatic scaling
   - Built-in connection pooling
   - Branching capabilities for development/testing

2. **Local PostgreSQL**
   - Good for development and testing
   - Requires local installation and configuration

3. **Other PostgreSQL-compatible databases**
   - Amazon RDS
   - Google Cloud SQL
   - Azure Database for PostgreSQL

## Environment Variables

The application uses environment variables to configure database connections. At least one of the following environment variables must be set:

| Variable Name | Description | Example |
|---------------|-------------|---------|
| `DATABASE_URL` | Primary database connection string | `postgresql://username:password@hostname:port/database` |
| `POSTGRES_URL` | Alternative database connection string | `postgresql://username:password@hostname:port/database` |
| `AUTH_DATABASE_URL` | Database for authentication (can be the same as primary) | `postgresql://username:password@hostname:port/database` |

For Neon database specifically, you can use the connection string provided in the Neon dashboard, which typically looks like:

\`\`\`
postgresql://[user]:[password]@[neon-hostname]/[database]
\`\`\`

## Local Development Setup

### Option 1: Using Docker

1. Install Docker and Docker Compose
2. Create a `docker-compose.yml` file in your project root:

\`\`\`yaml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: complexcare
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
\`\`\`

3. Start the database:

\`\`\`bash
docker-compose up -d
\`\`\`

4. Set your environment variable in `.env.local`:

\`\`\`
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/complexcare
\`\`\`

### Option 2: Local PostgreSQL Installation

1. Install PostgreSQL on your machine
2. Create a database:

\`\`\`sql
CREATE DATABASE complexcare;
\`\`\`

3. Set your environment variable in `.env.local`:

\`\`\`
DATABASE_URL=postgresql://yourusername:yourpassword@localhost:5432/complexcare
\`\`\`

## Production Setup

### Using Neon PostgreSQL

1. Sign up for a Neon account at [neon.tech](https://neon.tech)
2. Create a new project
3. Create a database within your project
4. Get your connection string from the Neon dashboard
5. Add the connection string to your environment variables in your hosting platform (e.g., Vercel)

\`\`\`
DATABASE_URL=postgresql://[user]:[password]@[neon-hostname]/[database]
\`\`\`

### Connection Pooling

For production environments, it's recommended to use connection pooling. Neon provides this capability out of the box.

If you're using the connection string directly from Neon, it should already include the pooling configuration. If not, you can modify your connection string to use the pooler endpoint:

\`\`\`
postgresql://[user]:[password]@[pooler-hostname]/[database]?sslmode=require&pgbouncer=true
\`\`\`

## Testing Your Connection

You can test your database connection using the built-in diagnostics:

1. Navigate to `/diagnostics/database` in your application
2. Check the connection status and details
3. If there are any issues, the page will display relevant error messages

Alternatively, you can use the command line:

\`\`\`bash
# Using psql
psql "your-connection-string"

# Or using a script to test the connection
node scripts/test-db-connection.js
\`\`\`

## Database Schema Initialization

After setting up your database connection, you need to initialize the schema:

1. Run the migration scripts:

\`\`\`bash
# Using the built-in migration tool
npm run db:migrate

# Or manually
psql -f scripts/schema.sql "your-connection-string"
\`\`\`

2. Seed initial data (optional):

\`\`\`bash
npm run db:seed
\`\`\`

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if the database server is running
   - Verify the hostname and port are correct
   - Ensure network connectivity (firewalls, VPNs, etc.)

2. **Authentication Failed**
   - Verify username and password
   - Check if the user has appropriate permissions

3. **Database Does Not Exist**
   - Create the database if it doesn't exist
   - Check the database name in your connection string

4. **SSL Required**
   - Add `?sslmode=require` to your connection string
   - For local development, you might need to set `?sslmode=disable`

5. **Connection Pooling Issues**
   - Check if you're exceeding connection limits
   - Verify pooling configuration

### Diagnostic Queries

You can run these queries to diagnose issues:

\`\`\`sql
-- Check database version
SELECT version();

-- Check current connections
SELECT count(*) FROM pg_stat_activity;

-- Check table existence
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
\`\`\`

### Getting Help

If you continue to experience issues with your database connection:

1. Check the application logs for detailed error messages
2. Review the error page at `/error` for connection diagnostics
3. Contact your database provider's support
4. Reach out to the ComplexCare CRM support team

## Next Steps

After successfully setting up your database connection:

1. Configure user authentication
2. Set up tenant management
3. Configure feature flags and permissions
4. Explore the application's functionality

For more information, refer to the [ComplexCare CRM Documentation](./index.md).
