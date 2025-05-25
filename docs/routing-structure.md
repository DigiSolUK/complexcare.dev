# ComplexCare CRM Routing Structure

## Overview

This document outlines the routing structure of the ComplexCare CRM application, which is built using Next.js App Router. Understanding this structure is essential for developers working on the application to ensure consistent navigation and avoid routing conflicts.

## Table of Contents

1. [Route Groups](#route-groups)
2. [Application Structure](#application-structure)
3. [Patient Routes](#patient-routes)
4. [Using the Routes Helper](#using-the-routes-helper)
5. [Best Practices](#best-practices)
6. [Common Issues and Solutions](#common-issues-and-solutions)

## Route Groups

Next.js App Router supports route groups, which are denoted by parentheses in folder names, e.g., `(dashboard)`. Key points about route groups:

- Route groups **do not affect the URL path** - they are purely organizational
- They allow for shared layouts across related routes
- They help organize the application into logical sections

The ComplexCare CRM uses the following main route groups:

| Route Group | Purpose | Layout Features |
|-------------|---------|-----------------|
| `(dashboard)` | Main application area for authenticated users | Sidebar, header, user menu |
| `(marketing)` | Public-facing pages | Marketing header, footer |
| `(auth)` | Authentication-related pages | Minimal layout |
| `(superadmin)` | Super administrator functions | Admin sidebar, header |
| `(system)` | System diagnostics and maintenance | Minimal layout with admin controls |

## Application Structure

The application follows this high-level structure:

\`\`\`
app/
├── (auth)/
│   ├── login/
│   └── live-login/
├── (dashboard)/
│   ├── dashboard/
│   ├── patients/
│   ├── care-professionals/
│   ├── appointments/
│   ├── care-plans/
│   └── ...
├── (marketing)/
│   ├── page.tsx (home)
│   ├── features/
│   ├── pricing/
│   └── ...
├── (superadmin)/
│   ├── superadmin/
│   └── ...
├── (system)/
│   ├── diagnostics/
│   └── ...
├── api/
│   └── ...
└── layout.tsx (root layout)
\`\`\`

## Patient Routes

Patient-related routes have been reorganized to ensure all patient pages are under the dashboard layout. All patient routes are now located in the `(dashboard)` route group:

\`\`\`
app/
├── (dashboard)/
│   ├── patients/
│   │   ├── page.tsx (patient list)
│   │   ├── loading.tsx
│   │   ├── [id]/
│   │   │   ├── page.tsx (patient details)
│   │   │   ├── medications/
│   │   │   └── ...
│   │   └── cached/
│   │       └── page.tsx (cached patient list)
\`\`\`

### Important Notes:

- The standalone `app/patients/page.tsx` route has been removed to avoid conflicts
- All patient detail pages are now under `app/(dashboard)/patients/[id]/`
- This ensures consistent layout and navigation for all patient-related pages

## Using the Routes Helper

To maintain consistency and avoid hardcoded paths, the application includes a routes helper at `lib/routes.ts`. Always use this helper when creating links or navigating programmatically:

\`\`\`typescript
import { routes } from "@/lib/routes";

// Instead of hardcoding:
// <Link href="/patients/123">Patient Details</Link>

// Use the routes helper:
<Link href={routes.patients.details("123")}>Patient Details</Link>
\`\`\`

Benefits of using the routes helper:
- Centralized route definitions
- Type safety for route parameters
- Easier refactoring if routes change
- Prevents routing conflicts

## Best Practices

1. **Always use route groups for organizational purposes only**
   - Remember they don't affect the URL structure

2. **Avoid duplicate routes across different route groups**
   - E.g., don't create both `(dashboard)/patients/page.tsx` and `patients/page.tsx`

3. **Use the routes helper for all navigation**
   - Avoid hardcoding URLs in components

4. **Keep related pages together**
   - Group pages that share a layout or are functionally related

5. **Use loading.tsx and error.tsx at appropriate levels**
   - Place them at the level where they make the most sense

## Common Issues and Solutions

### Conflicting Routes

**Problem**: Routes from different groups resolve to the same URL path.

**Solution**: Ensure each URL path is unique by:
- Using only one route group for a specific path
- Moving conflicting routes to different paths
- Deleting redundant routes

### Missing Layouts

**Problem**: Pages don't inherit the expected layout.

**Solution**: 
- Ensure the page is in the correct route group
- Check that layout.tsx exists in the route group
- Verify the layout component is properly implemented

### Navigation Issues

**Problem**: Links navigate to incorrect or non-existent routes.

**Solution**:
- Use the routes helper instead of hardcoded paths
- Check for typos in route names or parameters
- Verify the route exists in the correct location

## Conclusion

Following these guidelines will help maintain a clean and conflict-free routing structure in the ComplexCare CRM. If you need to make significant changes to the routing structure, be sure to update this documentation and communicate the changes to the development team.
