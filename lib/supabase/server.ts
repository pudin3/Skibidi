import { createClient } from "@supabase/supabase-js";

/**
 * PENTING: file ini hanya boleh di-import dari kode yang berjalan di server
 * (API routes / Server Components / Server Actions). JANGAN pernah import
 * file ini dari Client Component — service_role key akan bocor ke browser.
 */
let cachedClient: ReturnType<typeof createClient<any>> | null = null;

export function getSupabaseAdmin() {
  if (cachedClient) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY atau NEXT_PUBLIC_SUPABASE_URL belum diset di environment variables."
    );
  }

  cachedClient = createClient<any>(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return cachedClient;
}
