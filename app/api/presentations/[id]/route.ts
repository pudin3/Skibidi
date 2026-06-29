import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

interface Params {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const body = await req.json().catch(() => null);
  const action = body?.action;
  const admin = getSupabaseAdmin();

  // Siapa pun boleh memicu transisi active -> completed, TAPI server selalu
  // mengecek ulang waktunya sendiri terhadap session_start + duration, jadi
  // tidak bisa dipalsukan dari client untuk mengakhiri sesi orang lain lebih cepat.
  if (action === "complete") {
    const { data: current, error: fetchError } = await admin
      .from("presentations")
      .select("*")
      .eq("id", params.id)
      .single();

    if (fetchError || !current) {
      return NextResponse.json({ error: "Presentasi tidak ditemukan." }, { status: 404 });
    }
    if (current.status !== "active" || !current.session_start || !current.duration) {
      return NextResponse.json({ presentation: current });
    }

    const endsAt = new Date(current.session_start).getTime() + current.duration * 60_000;
    if (Date.now() < endsAt - 2000) {
      return NextResponse.json({ error: "Sesi belum selesai." }, { status: 409 });
    }

    const { data, error } = await admin
      .from("presentations")
      .update({ status: "completed" })
      .eq("id", params.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ presentation: data });
  }

  // Semua aksi lain (mulai sesi, ubah durasi, batalkan) khusus admin.
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const update: Record<string, unknown> = {};

  if (action === "start") {
    const duration = typeof body?.duration === "number" && body.duration > 0 ? Math.floor(body.duration) : null;
    if (!duration) {
      return NextResponse.json({ error: "duration wajib diisi untuk memulai sesi." }, { status: 400 });
    }
    update.duration = duration;
    update.session_start = new Date().toISOString();
    update.status = "active";
  } else if (action === "stop") {
    update.status = "completed";
  } else if (action === "reactivate") {
    update.status = "active";
    update.session_start = null;
  } else {
    return NextResponse.json({ error: "action tidak dikenali." }, { status: 400 });
  }

  const { data, error } = await admin
    .from("presentations")
    .update(update)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ presentation: data });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  const { data: current } = await admin
    .from("presentations")
    .select("file_path")
    .eq("id", params.id)
    .single();

  if (current?.file_path) {
    await admin.storage.from(process.env.NEXT_PUBLIC_STORAGE_BUCKET || "presentations").remove([
      current.file_path,
    ]);
  }

  const { error } = await admin.from("presentations").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
