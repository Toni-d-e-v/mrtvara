import { ImageResponse } from "next/og";
import { anonClient } from "@/lib/supabase/public";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Mrtvara Liga — LIQUI MOLY vs FORMULA";

export default async function Image() {
  const supabase = anonClient();
  const { data: goals } = await supabase.from("goals").select("match_id, team");

  const perMatch = new Map<string, { s: number; b: number }>();
  for (const g of goals ?? []) {
    const e = perMatch.get(g.match_id) ?? { s: 0, b: 0 };
    if (g.team === "SPID") e.s++;
    else e.b++;
    perMatch.set(g.match_id, e);
  }
  let spidWins = 0;
  let beloWins = 0;
  for (const { s, b } of perMatch.values()) {
    if (s > b) spidWins++;
    else if (b > s) beloWins++;
  }

  const chip = (color: string, mono: string) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 130,
        height: 130,
        borderRadius: 26,
        background: color,
        color: "#fff",
        fontSize: 60,
        fontWeight: 800,
      }}
    >
      {mono}
    </div>
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0c10",
          color: "#f2f4f8",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 14,
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 8,
            color: "#9aa3b2",
            marginBottom: 40,
          }}
        >
          MRTVARA <span style={{ color: "#4c8dff" }}>LIGA</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 50 }}>
          {chip("#2f6bff", "LM")}
          <div style={{ display: "flex", fontSize: 130, fontWeight: 800 }}>
            <span style={{ color: "#2f6bff" }}>{spidWins}</span>
            <span style={{ color: "#6b7385", margin: "0 22px" }}>:</span>
            <span style={{ color: "#e23744" }}>{beloWins}</span>
          </div>
          {chip("#e23744", "F")}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#9aa3b2", marginTop: 40, letterSpacing: 4 }}>
          OMJER POBJEDA SVIH VREMENA
        </div>
      </div>
    ),
    size,
  );
}
