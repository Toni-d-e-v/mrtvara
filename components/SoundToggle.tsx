"use client";

import { useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isMuted, setMuted, subscribeMuted, playGoalSound } from "@/lib/sound";

export default function SoundToggle() {
  const muted = useSyncExternalStore(
    subscribeMuted,
    () => isMuted(),
    () => false,
  );

  function toggle() {
    const next = !muted;
    setMuted(next);
    if (!next) playGoalSound(); // kratki preview kad uključiš zvuk
  }

  return (
    <button
      onClick={toggle}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-border-strong hover:text-foreground"
      aria-label={muted ? "Uključi zvuk" : "Isključi zvuk"}
    >
      {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
    </button>
  );
}
