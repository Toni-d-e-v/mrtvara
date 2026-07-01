"use client";

import { useState } from "react";

type TabKey = "tijek" | "postave" | "statistika";

const TABS: { key: TabKey; label: string }[] = [
  { key: "tijek", label: "Tijek" },
  { key: "postave", label: "Postave" },
  { key: "statistika", label: "Statistika" },
];

export default function MatchTabs({
  tijek,
  postave,
  statistika,
}: {
  tijek: React.ReactNode;
  postave: React.ReactNode;
  statistika: React.ReactNode;
}) {
  const [tab, setTab] = useState<TabKey>("tijek");

  const panel =
    tab === "tijek" ? tijek : tab === "postave" ? postave : statistika;

  return (
    <div className="space-y-4">
      <div className="flex border-b border-border">
        {TABS.map(({ key, label }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="relative flex-1 py-2.5 text-sm font-semibold transition-colors"
              style={{ color: active ? "var(--accent)" : "var(--muted)" }}
            >
              {label}
              {active && (
                <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-accent" />
              )}
            </button>
          );
        })}
      </div>
      <div>{panel}</div>
    </div>
  );
}
