"use client";

import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import type { Presentation } from "@/lib/types";
import { useCountdown } from "@/hooks/useCountdown";
import PptxViewer from "./PptxViewer";
import ModelViewer from "./ModelViewer";
import CountdownBadge from "./CountdownBadge";
import { ViewerSkeleton } from "./Skeletons";

export default function MateriTab({
  active,
  loading,
  onExpired,
}: {
  active: Presentation | null;
  loading: boolean;
  onExpired: () => void;
}) {
  const handledRef = useRef(false);

  const { remaining, hasSession } = useCountdown(active, async () => {
    if (!active || handledRef.current) return;
    handledRef.current = true;
    try {
      await fetch(`/api/presentations/${active.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete" }),
      });
    } finally {
      toast("Waktu presentasi sudah selesai. Materi dipindah ke tab Evaluasi.", {
        icon: "⏰",
      });
      onExpired();
    }
  });

  useEffect(() => {
    handledRef.current = false;
  }, [active?.id]);

  if (loading) return <ViewerSkeleton />;

  if (!active) {
    return (
      <div className="rounded-2xl border border-dashed border-navy-300/50 py-16 px-6 text-center">
        <p className="font-display font-semibold text-navy-700">Belum ada materi aktif</p>
        <p className="text-sm text-navy-500 mt-1">
          Materi akan muncul di sini begitu admin membagikannya.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display font-bold text-lg text-navy-900 truncate">{active.title}</h2>
        {hasSession && <CountdownBadge seconds={remaining} urgent={remaining <= 60} />}
      </div>

      {active.file_type === "pptx" ? (
        <PptxViewer fileUrl={active.file_url} title={active.title} />
      ) : (
        <ModelViewer fileUrl={active.file_url} title={active.title} />
      )}
    </div>
  );
}
