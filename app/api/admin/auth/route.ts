import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_COOKIE_OPTIONS,
  buildSessionToken,
  isCorrectPassword,
  isValidSessionToken,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return NextResponse.json({ isAdmin: isValidSessionToken(token) });
}

export async function POST(req: NextRequest) {
  let password = "";
  try {
    const body = await req.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  if (!isCorrectPassword(password)) {
    return NextResponse.json({ error: "Password salah." }, { status: 401 });
  }

  const res = NextResponse.json({ isAdmin: true });
  res.cookies.set(ADMIN_COOKIE_NAME, buildSessionToken(), ADMIN_COOKIE_OPTIONS);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ isAdmin: false });
  res.cookies.set(ADMIN_COOKIE_NAME, "", { ...ADMIN_COOKIE_OPTIONS, maxAge: 0 });
  return res;
}
