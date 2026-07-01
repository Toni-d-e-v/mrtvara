import { createClient } from "@/lib/supabase/server";

/**
 * Returns true only if the current request is an authenticated admin
 * (a member of public.admins). Reads the caller's own admins row — the
 * "admins_self_read" RLS policy exposes only that row. RLS on the data
 * tables is the real enforcement layer; this only shows/hides admin UI.
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return false;

  const { data } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  return Boolean(data);
}
