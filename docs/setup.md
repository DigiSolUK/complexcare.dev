# Setup and Configuration

This document outlines the setup and configuration process for the application.

## Prerequisites

*   Node.js (version >= 18)
*   npm or yarn package manager
*   A code editor (e.g., VS Code, Sublime Text)

## Installation

1.  Clone the repository:

    \`\`\`bash
    git clone <repository_url>
    \`\`\`

2.  Navigate to the project directory:

    \`\`\`bash
    cd <project_directory>
    \`\`\`

3.  Install dependencies:

    \`\`\`bash
    npm install  # or yarn install
    \`\`\`

## Environment Variables

Create a `.env.local` file in the root directory and configure the following environment variables:

\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DATABASE_URL=your_database_connection_string
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
\`\`\`

*   `NEXT_PUBLIC_API_URL`: The base URL for the API endpoints.
*   `DATABASE_URL`: The connection string for your database.
*   `NEXTAUTH_SECRET`: A secret key used for encrypting the NextAuth.js JWT.  Generate a strong, random string.
*   `NEXTAUTH_URL`: The URL of your application.

## Database Setup

1.  Configure your database connection in the `.env.local` file.
2.  Run database migrations:

    \`\`\`bash
    npx prisma migrate dev
    \`\`\`

## Authentication and Authorization

The system uses Stack Auth for authentication. Middleware (in `middleware.ts`) is used for routing and access control. Public routes are explicitly defined and are processed *before* any authentication checks to prevent unnecessary session lookups or redirects.

## Running the Application

1.  Start the development server:

    \`\`\`bash
    npm run dev  # or yarn dev
    \`\`\`

2.  Open your browser and navigate to `http://localhost:3000`.

## Middleware Configuration

The `middleware.ts` file handles route protection and redirection. Public paths are defined in `publicPaths` array and are excluded from authentication checks. Unauthenticated access to protected routes (like `/dashboard` or `/superadmin`) will redirect to `/login`. Role-based access control is enforced for routes like `/superadmin`.
