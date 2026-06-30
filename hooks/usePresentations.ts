"use client";

import { useCallback, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import type { Presentation } from "@/lib/types";

export function usePresentations() {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  // ID unik per komponen yang memakai hook ini, supaya nama channel realtime
  // tidak bentrok kalau hook ini dipanggil dari lebih dari satu komponen
  // sekaligus (misal halaman utama & tombol admin yang selalu aktif).
  const [instanceId] = useState(() => Math.random().toString(36).slice(2));

  const refresh = useCallback(async () => {
    const res = await fetch("/api/presentations", { cache: "no-store" });
    const json = await res.json();
    if (res.ok) setPresentations(json.presentations ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();

    const channel = supabaseBrowser
      .channel(`presentations-changes-${instanceId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "presentations" },
        () => refresh()
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, instanceId]);

  const active = presentations.find((p) => p.status === "active") ?? null;
  const completed = presentations.filter((p) => p.status === "completed");

  return { presentations, active, completed, loading, refresh };
}
