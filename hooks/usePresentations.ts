"use client";

import { useCallback, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import type { Presentation } from "@/lib/types";

export function usePresentations() {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/presentations", { cache: "no-store" });
    const json = await res.json();
    if (res.ok) setPresentations(json.presentations ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();

    const channel = supabaseBrowser
      .channel("presentations-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "presentations" },
        () => refresh()
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, [refresh]);

  const active = presentations.find((p) => p.status === "active") ?? null;
  const completed = presentations.filter((p) => p.status === "completed");

  return { presentations, active, completed, loading, refresh };
}
