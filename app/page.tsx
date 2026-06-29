"use client";

import { useEffect, useMemo, useState } from "react";
import type { MainTab } from "@/lib/types";
import { usePresentations } from "@/hooks/usePresentations";
import TabNav from "@/components/TabNav";
import MateriTab from "@/components/MateriTab";
import TanyaTab from "@/components/TanyaTab";
import EvaluasiTab from "@/components/EvaluasiTab";

export default function Home() {
  const { active, completed, loading, refresh } = usePresentations();
  const [tab, setTab] = useState<MainTab>("materi");

  const tabs = useMemo(() => {
    const base: { id: MainTab; label: string }[] = [
      { id: "materi", label: "Materi" },
      { id: "tanya", label: "Tanya" },
    ];
    if (completed.length > 0) base.push({ id: "evaluasi", label: "Evaluasi" });
    return base;
  }, [completed.length]);

  useEffect(() => {
    if (!tabs.some((t) => t.id === tab)) setTab("materi");
  }, [tabs, tab]);

  function handleExpired() {
    refresh();
    setTab("tanya");
  }

  return (
    <div className="min-h-screen pb-10">
      <header className="px-5 pt-8 pb-2 max-w-md mx-auto text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-brass-dark uppercase">
          Sesi Presentasi
        </p>
        <h1 className="font-display font-extrabold text-2xl text-navy-950 mt-1">
          Memori Presentasi
        </h1>
      </header>

      <TabNav tabs={tabs} active={tab} onChange={setTab} />

      <main className="px-4 pt-2 max-w-md mx-auto">
        {tab === "materi" && (
          <MateriTab active={active} loading={loading} onExpired={handleExpired} />
        )}
        {tab === "tanya" && <TanyaTab presentationId={active?.id ?? null} />}
        {tab === "evaluasi" && <EvaluasiTab completed={completed} loading={loading} />}
      </main>
    </div>
  );
                                 }
