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
      className="chip press h-9 w-9 justify-center px-0"
      aria-label={muted ? "Uključi zvuk" : "Isključi zvuk"}
    >
      {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </button>
  );
}
