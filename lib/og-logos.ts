import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Team } from "@/lib/types";

const FILES: Record<Team, string> = {
  SPID: "liqui-moly.png",
  BELO: "formula.png",
};

export type OgLogos = Partial<Record<Team, string>>;

let cached: OgLogos | null = null;

/**
 * Loga ekipa kao data-URI. `next/og` ne može učitati relativne putanje pa se
 * PNG-ovi iz /public ubacuju inline. Ako čitanje ne uspije, kartica pada natrag
 * na monogram (vidi pozivatelje).
 */
export async function ogLogos(): Promise<OgLogos> {
  if (cached) return cached;

  const out: OgLogos = {};
  await Promise.all(
    (Object.keys(FILES) as Team[]).map(async (team) => {
      try {
        const buf = await readFile(
          path.join(process.cwd(), "public", "logos", FILES[team]),
        );
        out[team] = `data:image/png;base64,${buf.toString("base64")}`;
      } catch {
        // logo nedostupan — preskoči
      }
    }),
  );

  cached = out;
  return out;
}
