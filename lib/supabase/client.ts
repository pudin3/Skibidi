import { createClient } from "@supabase/supabase-js";

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!rawUrl || !rawKey) {
  console.warn(
    "Supabase env vars belum diset. Cek NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY."
  );
}

// createClient() melempar exception kalau diberi string kosong/URL tidak valid
// (bukan cuma warning) — itu bisa bikin SELURUH halaman gagal render kalau env
// var belum terbaca. Pakai fallback URL berformat valid supaya app tetap jalan
// dan errornya kelihatan jelas di Network tab / response API, bukan blank page.
const supabaseUrl = rawUrl && rawUrl.startsWith("http") ? rawUrl : "https://placeholder.supabase.co";
const supabaseAnonKey = rawKey || "placeholder-anon-key";

/**
 * Client ini dipakai di browser (Client Components). Hanya boleh melakukan
 * SELECT presentations/questions dan INSERT questions — sesuai RLS policy.
 */
export const supabaseBrowser = createClient<any>(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: { eventsPerSecond: 5 },
  },
});

export const STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_STORAGE_BUCKET || "presentations";
