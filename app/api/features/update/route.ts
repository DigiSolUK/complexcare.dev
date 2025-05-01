import type { NextRequest } from "next/server"
import { z } from "zod"

const requestSchema = z.object({
  tenantId: z.string().uuid().optional(),
  features: z.array(z.string()),
})

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    //
\
Let's update the tenant schema to include features:
