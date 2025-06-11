### Database Setup

Before running the application, you need to set up your database schema and seed initial data.

1.  **Ensure your environment variables are configured:** Make sure `DATABASE_URL` (or `production_DATABASE_URL`) is correctly set in your Vercel project settings.
2.  **Run the database setup script:**
    \`\`\`bash
    npm run db:setup
    \`\`\`
    This script will create all necessary tables and seed default data. You should only need to run this once per environment.
