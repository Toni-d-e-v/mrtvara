import { createClient } from "@supabase/supabase-js";

/**
 * Lagani anon klijent za javno čitanje bez kolačića (OG slike, metadata).
 */
export function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
