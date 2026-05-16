import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { logEntryId, content } = await req.json();

  if (!logEntryId || !content?.trim()) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const log = await prisma.logEntry.findUnique({ where: { id: logEntryId } });
  if (!log || !log.isPublic) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const comment = await prisma.comment.create({
  data: { userId: user.id, logEntryId, content: content.trim() },
  include: {
    user: { select: { id: true, username: true, name: true, avatarUrl: true } },
    logEntry: { select: { userId: true } }, 
  },
});


  if (comment.logEntry.userId !== user.id) {
    await prisma.notification.create({
      data: {
        userId: comment.logEntry.userId, 
        actorId: user.id,             
        type: "COMMENT",
        logEntryId,
      },
    });
  }

  return NextResponse.json(comment, { status: 201 });
}