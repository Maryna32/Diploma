"use server";

import { createClient } from "@/lib/supabase/server";

export async function toggleBan(userId: string, banned: boolean) {
  const supabase = await createClient();

  let bannedUntil: Date | null = null;

  if (banned) {
    const now = new Date();
    bannedUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  }

  await supabase.from("User").update({ bannedUntil }).eq("id", userId);
}
