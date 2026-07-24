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
      <div className="segmented">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            data-active={tab === key}
            aria-pressed={tab === key}
          >
            {label}
          </button>
        ))}
      </div>
      <div>{panel}</div>
    </div>
  );
}
