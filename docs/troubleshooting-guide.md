# Troubleshooting Guide - Complex Care CRM

## Common Issues and Solutions

### 1. Database Connection Issues

**Symptoms:**
- "Database connection failed" errors
- Queries timing out
- Missing data in the application

**Solutions:**
1. Check environment variables:
   - Ensure `DATABASE_URL` or `production_DATABASE_URL` is set
   - Verify the connection string format: `postgresql://user:password@host/database?sslmode=require`

2. Run the diagnostics tool:
   \`\`\`bash
   Navigate to /diagnostics in your browser
   Click "Run Fixes" to attempt automatic resolution
   \`\`\`

3. Manual fix:
   \`\`\`sql
   -- Check database connectivity
   SELECT NOW();
   \`\`\`

### 2. Redis/Caching Issues

**Symptoms:**
- Slow performance
- "Redis connection failed" errors
- Cache not working

**Solutions:**
1. Verify Upstash integration:
   - Check `KV_URL` and `KV_REST_API_TOKEN` are set
   - These should be automatically set by the Upstash integration

2. Test Redis connection:
   \`\`\`typescript
   // In your code
   import { redis } from "@/lib/redis/client"
   await redis.ping() // Should return "PONG"
   \`\`\`

### 3. Authentication Issues

**Symptoms:**
- Cannot log in
- Session not persisting
- "Unauthorized" errors

**Solutions:**
1. Check NextAuth configuration:
   - Verify `NEXTAUTH_URL` matches your deployment URL
   - Ensure `NEXTAUTH_SECRET` is set (generate with `openssl rand -base64 32`)

2. Database tables:
   - Run the fix script from /diagnostics
   - Verify users, accounts, and sessions tables exist

### 4. File Upload Issues

**Symptoms:**
- Cannot upload files
- "Blob storage check failed" errors

**Solutions:**
1. Verify Blob integration:
   - Check `BLOB_READ_WRITE_TOKEN` is set
   - Should be automatically configured by Vercel Blob integration

### 5. AI Features Not Working

**Symptoms:**
- AI features disabled
- "Groq API key not configured" errors

**Solutions:**
1. Set up Groq API:
   - Ensure `GROQ_API_KEY` is set in environment variables
   - Verify the key is valid and has proper permissions

## Running Diagnostics

1. Navigate to `/diagnostics` in your application
2. Review the system health status
3. Click "Run Fixes" to attempt automatic resolution
4. Check the "Fix Results" tab for outcomes
5. Follow recommendations in the "Recommendations" tab

## Environment Variables Checklist

Required variables:
- [ ] `DATABASE_URL` or `production_DATABASE_URL`
- [ ] `NEXTAUTH_URL`
- [ ] `NEXTAUTH_SECRET`
- [ ] `KV_URL` (from Upstash)
- [ ] `KV_REST_API_TOKEN` (from Upstash)
- [ ] `BLOB_READ_WRITE_TOKEN` (from Vercel Blob)
- [ ] `GROQ_API_KEY` (for AI features)

## Contact Support

If issues persist after following this guide:
1. Check the error logs in Vercel dashboard
2. Run the diagnostics tool and save the results
3. Contact support with the diagnostic report
