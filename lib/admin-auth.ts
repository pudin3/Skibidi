import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 jam

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET belum diset di environment variables.");
  }
  return secret;
}

function getAdminPassword() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("ADMIN_PASSWORD belum diset di environment variables.");
  }
  return password;
}

/** Token statis yang ditaruh di cookie httpOnly setelah login berhasil. */
export function buildSessionToken(): string {
  return createHmac("sha256", getSecret()).update("memori-admin-session").digest("hex");
}

export function isCorrectPassword(candidate: string): boolean {
  const expected = Buffer.from(getAdminPassword());
  const given = Buffer.from(candidate || "");
  if (expected.length !== given.length) return false;
  return timingSafeEqual(expected, given);
}

export function isValidSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  let expected: Buffer;
  let given: Buffer;
  try {
    expected = Buffer.from(buildSessionToken());
    given = Buffer.from(token);
  } catch {
    return false;
  }
  if (expected.length !== given.length) return false;
  return timingSafeEqual(expected, given);
}

export function isAdminRequest(req: { cookies: { get(name: string): { value: string } | undefined } }): boolean {
  return isValidSessionToken(req.cookies.get(ADMIN_COOKIE_NAME)?.value);
}

export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
};
