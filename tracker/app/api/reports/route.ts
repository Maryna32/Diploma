import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { reportedUserId, commentId, reason } = await req.json();

  if (!reportedUserId || !reason?.trim()) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  await prisma.report.create({
    data: {
      reporterId: user.id,
      reportedUserId,
      commentId: commentId ?? null,
      reason: reason.trim(),
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}