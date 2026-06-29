"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import type { FileType, Presentation } from "@/lib/types";
import { supabaseBrowser, STORAGE_BUCKET } from "@/lib/supabase/client";
import { useRealtimeQuestions } from "@/hooks/useRealtimeQuestions";
import { cn } from "@/lib/utils";

export default function AdminPanel({
  presentations,
  onChanged,
  onClose,
  onLogout,
}: {
  presentations: Presentation[];
  onChanged: () => void;
  onClose: () => void;
  onLogout: () => void;
}) {
  const [tab, setTab] = useState<"upload" | "kelola" | "pertanyaan">("upload");
  const [title, setTitle] = useState("");
  const [fileType, setFileType] = useState<FileType>("pptx");
  const [duration, setDuration] = useState(10);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { questions, refresh: refreshQuestions } = useRealtimeQuestions();

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !file) {
      toast.error("Judul dan file wajib diisi.");
      return;
    }
    setUploading(true);
    try {
      const signRes = await fetch("/api/upload/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, fileType }),
      });
      const signJson = await signRes.json();
      if (!signRes.ok) throw new Error(signJson.error || "Gagal menyiapkan upload.");

      const { error: uploadError } = await supabaseBrowser.storage
        .from(STORAGE_BUCKET)
        .uploadToSignedUrl(signJson.path, signJson.token, file);
      if (uploadError) throw new Error(uploadError.message);

      const createRes = await fetch("/api/presentations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          file_path: signJson.path,
          file_type: fileType,
          duration,
        }),
      });
      const createJson = await createRes.json();
      if (!createRes.ok) throw new Error(createJson.error || "Gagal menyimpan data.");

      toast.success("Materi berhasil diupload!");
      setTitle("");
      setFile(null);
      onChanged();
      setTab("kelola");
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setUploading(false);
    }
  }

  async function patchPresentation(id: string, body: Record<string, unknown>) {
    const res = await fetch(`/api/presentations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.error || "Gagal memperbarui.");
      return;
    }
    onChanged();
  }

  async function deletePresentation(id: string) {
    if (!confirm("Hapus materi ini? File juga akan dihapus dari storage.")) return;
    const res = await fetch(`/api/presentations/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.error || "Gagal menghapus.");
      return;
    }
    toast.success("Materi dihapus.");
    onChanged();
  }

  async function deleteQuestion(id: string) {
    const res = await fetch(`/api/questions/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Gagal menghapus pertanyaan.");
      return;
    }
    refreshQuestions();
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-paper animate-fade-in">
      <header className="bg-navy-950 px-5 py-4 flex items-center justify-between shrink-0">
        <h1 className="text-white font-display font-bold">Panel Admin</h1>
        <div className="flex items-center gap-3">
          <button onClick={onLogout} className="text-navy-300 text-xs underline">
            Keluar
          </button>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white/10 text-white flex items-center justify-center"
            aria-label="Tutup panel admin"
          >
            ✕
          </button>
        </div>
      </header>

      <nav className="flex border-b border-navy-100 bg-white shrink-0">
        {[
          { id: "upload", label: "Upload" },
          { id: "kelola", label: "Kelola Sesi" },
          { id: "pertanyaan", label: `Pertanyaan (${questions.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={cn(
              "flex-1 py-3 text-sm font-display font-semibold",
              tab === t.id ? "text-navy-900 border-b-2 border-navy-900" : "text-navy-300"
            )}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        {tab === "upload" && (
          <form onSubmit={handleUpload} className="space-y-4 max-w-md">
            <div>
              <label className="text-sm font-semibold text-navy-700">Judul materi</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-xl border border-navy-100 px-3 py-2.5 text-sm"
                placeholder="Misal: Kelompok 1 - Fotosintesis"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-navy-700">Tipe file</label>
              <div className="mt-1 flex gap-2">
                {(["pptx", "wrld"] as FileType[]).map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setFileType(t)}
                    className={cn(
                      "flex-1 rounded-xl border py-2 text-sm font-semibold",
                      fileType === t
                        ? "border-navy-900 bg-navy-900 text-white"
                        : "border-navy-100 text-navy-500"
                    )}
                  >
                    {t === "pptx" ? "Slide (PPTX)" : "Model 3D (WRLD)"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-navy-700">Durasi sesi (menit)</label>
              <input
                type="number"
                min={1}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-navy-100 px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-navy-700">File</label>
              <input
                type="file"
                accept={fileType === "pptx" ? ".pptx" : ".glb,.gltf"}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="mt-1 w-full text-sm"
              />
              {fileType === "wrld" && (
                <p className="text-xs text-navy-400 mt-1">
                  Gunakan format .glb / .gltf agar bisa dirender di model 3D viewer.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full rounded-xl bg-navy-900 text-white font-display font-semibold py-2.5 disabled:opacity-50"
            >
              {uploading ? "Mengupload..." : "Upload & Tampilkan"}
            </button>
          </form>
        )}

        {tab === "kelola" && (
          <div className="space-y-3 max-w-md">
            {presentations.length === 0 && (
              <p className="text-sm text-navy-400 text-center py-10">Belum ada materi.</p>
            )}
            {presentations.map((p) => (
              <div key={p.id} className="rounded-xl border border-navy-100 bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-navy-900 text-sm">{p.title}</p>
                  <span
                    className={cn(
                      "text-xs font-semibold rounded-full px-2 py-0.5",
                      p.status === "active"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-navy-100 text-navy-500"
                    )}
                  >
                    {p.status === "active" ? "Aktif" : "Selesai"}
                  </span>
                </div>
                <p className="text-xs text-navy-400 mt-1">
                  {p.duration ?? "-"} menit ·{" "}
                  {format(new Date(p.created_at), "d MMM yyyy, HH:mm", { locale: idLocale })}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {p.status === "active" && !p.session_start && (
                    <button
                      onClick={() => patchPresentation(p.id, { action: "start", duration: p.duration })}
                      className="text-xs font-semibold rounded-lg bg-navy-900 text-white px-3 py-1.5"
                    >
                      Mulai Sesi
                    </button>
                  )}
                  {p.status === "active" && p.session_start && (
                    <button
                      onClick={() => patchPresentation(p.id, { action: "stop" })}
                      className="text-xs font-semibold rounded-lg bg-brass-dark text-white px-3 py-1.5"
                    >
                      Hentikan Sekarang
                    </button>
                  )}
                  {p.status === "completed" && (
                    <button
                      onClick={() => patchPresentation(p.id, { action: "reactivate" })}
                      className="text-xs font-semibold rounded-lg border border-navy-200 text-navy-700 px-3 py-1.5"
                    >
                      Aktifkan Lagi
                    </button>
                  )}
                  <button
                    onClick={() => deletePresentation(p.id)}
                    className="text-xs font-semibold rounded-lg border border-red-200 text-red-500 px-3 py-1.5"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "pertanyaan" && (
          <div className="space-y-3 max-w-md">
            {questions.length === 0 && (
              <p className="text-sm text-navy-400 text-center py-10">Belum ada pertanyaan.</p>
            )}
            {questions.map((q) => (
              <div key={q.id} className="rounded-xl border border-navy-100 bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-navy-900 text-sm">
                      {q.nama}
                      {q.kelompok && <span className="text-navy-400 font-normal"> · {q.kelompok}</span>}
                    </p>
                    <p className="text-sm text-navy-700 mt-1">{q.pertanyaan}</p>
                  </div>
                  <button
                    onClick={() => deleteQuestion(q.id)}
                    className="text-xs text-red-400 shrink-0"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
