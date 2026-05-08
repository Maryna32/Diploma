import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { logEntryId, commentId, emoji } = await req.json();

  const where = logEntryId
    ? { userId_logEntryId_emoji: { userId: user.id, logEntryId, emoji } }
    : { userId_commentId_emoji: { userId: user.id, commentId, emoji } };

  const existing = await prisma.reaction.findUnique({ where });

  if (existing) {
    await prisma.reaction.delete({ where });
    return NextResponse.json({ action: "removed" });
  }

  await prisma.reaction.create({
    data: { userId: user.id, logEntryId: logEntryId ?? null, commentId: commentId ?? null, emoji },
  });

  return NextResponse.json({ action: "added" });
}