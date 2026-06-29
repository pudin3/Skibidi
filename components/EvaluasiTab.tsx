"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import type { Presentation } from "@/lib/types";
import PptxViewer from "./PptxViewer";
import ModelViewer from "./ModelViewer";
import { ListSkeleton } from "./Skeletons";
import { cn } from "@/lib/utils";

export default function EvaluasiTab({
  completed,
  loading,
}: {
  completed: Presentation[];
  loading: boolean;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (loading) return <ListSkeleton rows={4} />;

  if (completed.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-navy-300/50 py-16 px-6 text-center">
        <p className="font-display font-semibold text-navy-700">Arsip masih kosong</p>
        <p className="text-sm text-navy-500 mt-1">
          Materi yang sesi presentasinya sudah berakhir akan tersimpan di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in">
      {completed.map((p) => {
        const open = openId === p.id;
        return (
          <div key={p.id} className="rounded-2xl border border-navy-100 bg-white shadow-sm overflow-hidden">
            <button
              onClick={() => setOpenId(open ? null : p.id)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
            >
              <div>
                <p className="font-display font-semibold text-navy-900 text-sm">{p.title}</p>
                <p className="text-xs text-navy-400 mt-0.5">
                  {format(new Date(p.created_at), "d MMMM yyyy", { locale: idLocale })} ·{" "}
                  {p.file_type === "pptx" ? "Slide" : "Model 3D"}
                </p>
              </div>
              <span
                className={cn(
                  "text-navy-400 transition-transform shrink-0",
                  open && "rotate-180"
                )}
              >
                ▾
              </span>
            </button>
            {open && (
              <div className="px-4 pb-4">
                {p.file_type === "pptx" ? (
                  <PptxViewer fileUrl={p.file_url} title={p.title} />
                ) : (
                  <ModelViewer fileUrl={p.file_url} title={p.title} />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
