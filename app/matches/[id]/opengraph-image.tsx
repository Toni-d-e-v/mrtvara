import { ImageResponse } from "next/og";
import { anonClient } from "@/lib/supabase/public";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Mrtvara Liga — rezultat utakmice";

function fmt(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}.`;
}

function TeamSide({
  name,
  color,
  mono,
}: {
  name: string;
  color: string;
  mono: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, width: 340 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 150,
          height: 150,
          borderRadius: 30,
          background: color,
          color: "#fff",
          fontSize: 72,
          fontWeight: 800,
        }}
      >
        {mono}
      </div>
      <div style={{ fontSize: 40, fontWeight: 800, color, letterSpacing: 2 }}>
        {name}
      </div>
    </div>
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const { id } = await params;
  const supabase = anonClient();

  const { data: match } = await supabase
    .from("matches")
    .select("match_date")
    .eq("id", id)
    .maybeSingle();
  const { data: goals } = await supabase
    .from("goals")
    .select("team")
    .eq("match_id", id);

  const spid = (goals ?? []).filter((g) => g.team === "SPID").length;
  const belo = (goals ?? []).filter((g) => g.team === "BELO").length;

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
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 6,
            color: "#9aa3b2",
            marginBottom: 24,
          }}
        >
          MRTVARA <span style={{ color: "#4c8dff" }}>LIGA</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <TeamSide name="LIQUI MOLY" color="#2f6bff" mono="LM" />
          <div style={{ display: "flex", alignItems: "center", fontSize: 150, fontWeight: 800 }}>
            <span>{spid}</span>
            <span style={{ color: "#6b7385", margin: "0 24px" }}>:</span>
            <span>{belo}</span>
          </div>
          <TeamSide name="FORMULA" color="#e23744" mono="F" />
        </div>

        <div style={{ display: "flex", fontSize: 30, color: "#9aa3b2", marginTop: 36 }}>
          {match ? fmt(match.match_date) : "Vječiti derbi"}
        </div>
      </div>
    ),
    size,
  );
}
