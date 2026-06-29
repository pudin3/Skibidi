import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase env vars belum diset. Cek NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY."
  );
}

/**
 * Client ini dipakai di browser (Client Components). Hanya boleh melakukan
 * SELECT presentations/questions dan INSERT questions — sesuai RLS policy.
 */
export const supabaseBrowser = createClient(
  supabaseUrl ?? "",
  supabaseAnonKey ?? "",
  {
    realtime: {
      params: { eventsPerSecond: 5 },
    },
  }
);

export const STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_STORAGE_BUCKET || "presentations";
