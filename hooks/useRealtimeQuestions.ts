"use client";

import { useCallback, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import type { Question } from "@/lib/types";

export function useRealtimeQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [instanceId] = useState(() => Math.random().toString(36).slice(2));

  const refresh = useCallback(async () => {
    const res = await fetch("/api/questions", { cache: "no-store" });
    const json = await res.json();
    if (res.ok) setQuestions(json.questions ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();

    const channel = supabaseBrowser
      .channel(`questions-changes-${instanceId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "questions" }, () =>
        refresh()
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, instanceId]);

  return { questions, loading, refresh };
}
