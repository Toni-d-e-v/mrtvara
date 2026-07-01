"use client";

import { useEffect, useRef, useState } from "react";

function prefersReduced() {
  return (
    typeof window !== "undefined" &&
    (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false)
  );
}

export default function AnimatedScore({ value }: { value: number }) {
  const [reduced] = useState(prefersReduced);
  const [display, setDisplay] = useState(reduced ? value : 0);
  const fromRef = useRef(reduced ? value : 0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) return;
    const from = fromRef.current;
    if (from === value) return;
    const duration = 500;
    let start: number | null = null;

    const tick = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = value;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, reduced]);

  return <span className="tabular-nums">{reduced ? value : display}</span>;
}
