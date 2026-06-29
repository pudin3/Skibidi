"use client";

import { cn } from "@/lib/utils";
import type { MainTab } from "@/lib/types";

interface TabDef {
  id: MainTab;
  label: string;
}

export default function TabNav({
  tabs,
  active,
  onChange,
}: {
  tabs: TabDef[];
  active: MainTab;
  onChange: (tab: MainTab) => void;
}) {
  const activeIndex = Math.max(0, tabs.findIndex((t) => t.id === active));

  return (
    <div className="sticky top-0 z-30 bg-paper/90 backdrop-blur-sm pt-4 pb-3 px-4">
      <div
        className="relative grid bg-navy-100 rounded-full p-1 max-w-md mx-auto"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
      >
        <div
          className="absolute top-1 bottom-1 rounded-full bg-navy-900 shadow-panel transition-transform duration-300 ease-out"
          style={{
            width: `calc(${100 / tabs.length}% - 4px)`,
            transform: `translateX(calc(${activeIndex * 100}% + ${activeIndex * 4}px))`,
          }}
        />
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative z-10 py-2 text-sm font-display font-semibold tracking-wide rounded-full transition-colors",
              active === tab.id ? "text-white" : "text-navy-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
