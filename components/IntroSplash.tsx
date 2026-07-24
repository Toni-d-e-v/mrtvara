"use client";

import { useEffect, useRef, useState } from "react";
import { audioBlocked, playIntroTheme, unlockAudio } from "@/lib/sound";

/**
 * Uvodna špica — logo dumancic.dev pada na udarac i presijava se.
 * Ide jednom po sesiji: skripta u layoutu ubaci <style id="intro-on"> prije
 * prvog paint-a pa CSS animacija ne čeka hidraciju; bez tog stila `.intro` je
 * skriven. Ovdje se sinkronizira zvuk i kraj špice.
 *
 * Zvuk: preglednici ne daju pustiti audio prije prve geste korisnika. Tema je
 * zakazana odmah i čeka otključavanje, a dok je blokirana pokazuje se poziv na
 * dodir. U instaliranoj PWA (standalone) zvuk najčešće krene sam.
 */

/** ms od početka; prati vremena u globals.css i lib/sound.ts */
const EXIT_AT = 7200;
const EXIT_AT_REDUCED = 1800;
const FADE = 720;

declare global {
  interface Window {
    __introT0?: number;
  }
}

const GESTURES = ["pointerdown", "touchstart", "keydown"] as const;

export default function IntroSplash() {
  const [out, setOut] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const leave = useRef<() => void>(() => {});

  useEffect(() => {
    const style = document.getElementById("intro-on");
    if (!style) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const since = () => performance.now() - (window.__introT0 ?? performance.now());
    const stopAudio = playIntroTheme(since() / 1000);

    leave.current = () => {
      leave.current = () => {};
      // Zvuk se ne prekida — rep akorda se ugasi sam.
      setOut(true);
      timers.push(setTimeout(() => style.remove(), FADE));
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const exitAt = reduced ? EXIT_AT_REDUCED : EXIT_AT;
    timers.push(setTimeout(() => leave.current(), Math.max(0, exitAt - since())));

    const onGesture = () => {
      unlockAudio();
      setBlocked(false);
    };
    for (const g of GESTURES) window.addEventListener(g, onGesture, { once: true });
    timers.push(setTimeout(() => setBlocked(audioBlocked()), 350));

    return () => {
      timers.forEach(clearTimeout);
      stopAudio();
      for (const g of GESTURES) window.removeEventListener(g, onGesture);
    };
  }, []);

  return (
    <div className={`intro${out ? " is-out" : ""}`}>
      <link rel="preload" as="image" href="/dumancic.svg" />

      <p className="intro-sign">
        <span className="intro-credit">Omogućeno od strane</span>
        <span className="intro-logo" role="img" aria-label="dumancic.dev" />
      </p>

      {blocked && <span className="intro-hint">Dodirni za zvuk</span>}
    </div>
  );
}
