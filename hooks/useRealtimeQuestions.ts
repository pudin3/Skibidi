"use client";

import { useCallback, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import type { Question } from "@/lib/types";

export function useRealtimeQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/questions", { cache: "no-store" });
    const json = await res.json();
    if (res.ok) setQuestions(json.questions ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();

    const channel = supabaseBrowser
      .channel("questions-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "questions" }, () =>
        refresh()
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, [refresh]);

  return { questions, loading, refresh };
}
