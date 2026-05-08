import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { targetUserId } = await req.json();

  if (targetUserId === user.id) {
    return NextResponse.json({ error: "Self follow not allowed" }, { status: 400 });
  }

  const existing = await prisma.follows.findUnique({
    where: {
      followerId_followingId: {
        followerId: user.id,
        followingId: targetUserId,
      },
    },
  });

  if (existing) {
    await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: targetUserId,
        },
      },
    });

    return NextResponse.json({ isFollowing: false });
  }

  await prisma.follows.create({
    data: {
      followerId: user.id,
      followingId: targetUserId,
    },
  });

  await prisma.notification.create({
    data: {
      userId: targetUserId,
      actorId: user.id,
      type: "FOLLOW",
    },
  });

  return NextResponse.json({ isFollowing: true });
}