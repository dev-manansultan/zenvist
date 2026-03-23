import { createClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";

export function createSupabaseServiceClient() {
  if (!env.supabaseServiceRoleKey) {
    throw new Error("Missing required environment variable: SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(env.supabaseUrl!, env.supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
