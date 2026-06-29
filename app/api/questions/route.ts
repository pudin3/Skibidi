import { NextRequest, NextResponse } from "next/server";
import { supabaseBrowser } from "@/lib/supabase/client";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const presentationId = req.nextUrl.searchParams.get("presentation_id");

  let query = supabaseBrowser
    .from("questions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (presentationId) {
    query = query.eq("presentation_id", presentationId);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ questions: data });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const nama = typeof body?.nama === "string" ? body.nama.trim() : "";
  const kelompok = typeof body?.kelompok === "string" ? body.kelompok.trim() : null;
  const pertanyaan = typeof body?.pertanyaan === "string" ? body.pertanyaan.trim() : "";
  const presentationId = typeof body?.presentation_id === "string" ? body.presentation_id : null;

  if (!nama || !pertanyaan) {
    return NextResponse.json({ error: "Nama dan pertanyaan wajib diisi." }, { status: 400 });
  }
  if (nama.length > 100 || pertanyaan.length > 2000 || (kelompok && kelompok.length > 100)) {
    return NextResponse.json({ error: "Input terlalu panjang." }, { status: 400 });
  }

  const { data, error } = await supabaseBrowser
    .from("questions")
    .insert({
      nama,
      kelompok: kelompok || null,
      pertanyaan,
      presentation_id: presentationId,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ question: data });
}
