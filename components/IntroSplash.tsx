"use client";

import { useEffect, useRef, useState } from "react";
import { playIntroTheme, unlockAudio } from "@/lib/sound";

/**
 * Uvodna špica — logo dumancic.dev pada na udarac i presijava se.
 * Ide jednom po sesiji: skripta u layoutu ubaci <style id="intro-on"> prije
 * prvog paint-a pa se sadržaj aplikacije ne vidi ispod; bez tog stila je
 * `.intro` skriven.
 *
 * Špica čeka klik jer preglednici ne daju zvuk prije geste korisnika — tako
 * slika i zvuk uvijek krenu zajedno.
 */

const EXIT_AT = 7200;
const EXIT_AT_REDUCED = 1800;
const FADE = 720;

export default function IntroSplash() {
  const [phase, setPhase] = useState<"gate" | "playing" | "out">("gate");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const stopAudio = useRef<() => void>(() => {});

  useEffect(() => {
    const list = timers.current;
    return () => {
      list.forEach(clearTimeout);
      stopAudio.current();
    };
  }, []);

  const start = () => {
    if (phase !== "gate") return;

    unlockAudio();
    stopAudio.current = playIntroTheme();
    setPhase("playing");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timers.current.push(
      setTimeout(() => {
        setPhase("out");
        timers.current.push(
          setTimeout(() => document.getElementById("intro-on")?.remove(), FADE),
        );
      }, reduced ? EXIT_AT_REDUCED : EXIT_AT),
    );
  };

  return (
    <div
      className={`intro${phase === "playing" ? " is-playing" : ""}${
        phase === "out" ? " is-playing is-out" : ""
      }`}
    >
      <link rel="preload" as="image" href="/dumancic.svg" />

      <p className="intro-sign">
        <span className="intro-credit">Omogućeno od strane</span>
        <span className="intro-logo" role="img" aria-label="dumancic.dev" />
      </p>

      {phase === "gate" && (
        <button type="button" className="intro-gate" onClick={start} autoFocus>
          <span className="intro-gate-label">Klikni za start</span>
        </button>
      )}
    </div>
  );
}
