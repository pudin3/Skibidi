import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { STORAGE_BUCKET } from "@/lib/supabase/client";

export const runtime = "nodejs";

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_").slice(-120);
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const filename = typeof body?.filename === "string" ? body.filename : "";
  const fileType = body?.fileType === "wrld" ? "wrld" : "pptx";

  if (!filename) {
    return NextResponse.json({ error: "filename wajib diisi." }, { status: 400 });
  }

  const path = `${fileType}/${Date.now()}-${sanitizeFilename(filename)}`;

  try {
    const { data, error } = await getSupabaseAdmin()
      .storage.from(STORAGE_BUCKET)
      .createSignedUploadUrl(path);

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "Gagal membuat signed URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error." }, { status: 500 });
  }
}
