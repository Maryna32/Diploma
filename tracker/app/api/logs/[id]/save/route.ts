import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const logId = Number(params.id);

  const existing = await prisma.savedLog.findUnique({
    where: {
      userId_logEntryId: {
        userId: user.id,
        logEntryId: logId,
      },
    },
  });

  if (existing) {
    await prisma.savedLog.delete({
      where: {
        userId_logEntryId: {
          userId: user.id,
          logEntryId: logId,
        },
      },
    });

    return NextResponse.json({
      saved: false,
    });
  }

  await prisma.savedLog.create({
    data: {
      userId: user.id,
      logEntryId: logId,
    },
  });

  return NextResponse.json({
    saved: true,
  });
}