import type { Presentation } from "./types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Sisa waktu sesi presentasi, dalam detik. 0 atau kurang berarti sudah habis. */
export function remainingSeconds(p: Pick<Presentation, "session_start" | "duration">): number {
  if (!p.session_start || !p.duration) return Infinity; // sesi belum dimulai / tanpa durasi
  const startMs = new Date(p.session_start).getTime();
  const endMs = startMs + p.duration * 60_000;
  return Math.floor((endMs - Date.now()) / 1000);
}

export function formatCountdown(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds)) return "--:--";
  const s = Math.max(0, totalSeconds);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function googleDocsViewerUrl(fileUrl: string): string {
  return `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
}
