import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { supabaseBrowser, STORAGE_BUCKET } from "@/lib/supabase/client";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");

  let query = supabaseBrowser.from("presentations").select("*").order("created_at", {
    ascending: false,
  });
  if (status === "active" || status === "completed") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ presentations: data });
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const filePath = typeof body?.file_path === "string" ? body.file_path : "";
  const fileType = body?.file_type === "wrld" ? "wrld" : "pptx";
  const duration =
    typeof body?.duration === "number" && body.duration > 0 ? Math.floor(body.duration) : null;

  if (!title || !filePath) {
    return NextResponse.json({ error: "title dan file_path wajib diisi." }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data: publicUrlData } = admin.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);

  const { data, error } = await admin
    .from("presentations")
    .insert({
      title,
      file_path: filePath,
      file_url: publicUrlData.publicUrl,
      file_type: fileType,
      duration,
      status: "active",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ presentation: data });
      }
