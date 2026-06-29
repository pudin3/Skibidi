"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function QuestionForm({
  presentationId,
  onSubmitted,
}: {
  presentationId: string | null;
  onSubmitted?: () => void;
}) {
  const [nama, setNama] = useState("");
  const [kelompok, setKelompok] = useState("");
  const [pertanyaan, setPertanyaan] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nama.trim() || !pertanyaan.trim()) {
      toast.error("Nama dan pertanyaan wajib diisi.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama,
          kelompok: kelompok || null,
          pertanyaan,
          presentation_id: presentationId,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal mengirim pertanyaan.");

      toast.success("Pertanyaan terkirim!");
      setPertanyaan("");
      onSubmitted?.();
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-navy-100 bg-white shadow-panel p-5 space-y-4"
    >
      <div>
        <label className="text-sm font-semibold text-navy-700">Nama</label>
        <input
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          maxLength={100}
          required
          placeholder="Nama kamu"
          className="mt-1 w-full rounded-xl border border-navy-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-700/40"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-navy-700">
          Kelompok <span className="text-navy-300 font-normal">(opsional)</span>
        </label>
        <input
          value={kelompok}
          onChange={(e) => setKelompok(e.target.value)}
          maxLength={100}
          placeholder="Misal: Kelompok 3"
          className="mt-1 w-full rounded-xl border border-navy-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-700/40"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-navy-700">Pertanyaan</label>
        <textarea
          value={pertanyaan}
          onChange={(e) => setPertanyaan(e.target.value)}
          maxLength={2000}
          required
          rows={4}
          placeholder="Tulis pertanyaanmu di sini..."
          className="mt-1 w-full rounded-xl border border-navy-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-700/40 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-navy-900 text-white font-display font-semibold py-2.5 disabled:opacity-50 transition-opacity"
      >
        {submitting ? "Mengirim..." : "Kirim Pertanyaan"}
      </button>
    </form>
  );
}
