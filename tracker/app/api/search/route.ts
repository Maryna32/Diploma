import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  const type = req.nextUrl.searchParams.get("type");

  if (!q || q.length < 2) return NextResponse.json({ users: [], logs: [] });

  if (type === "users") {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: q, mode: "insensitive" } },
          { name: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, username: true, name: true, avatarUrl: true },
      take: 5,
    });
    return NextResponse.json({ users, logs: [] });
  }

  const logs = await prisma.logEntry.findMany({
    where: {
      isPublic: true,
      title: { contains: q, mode: "insensitive" },
    },
    select: {
      id: true,
      title: true,
      mediaType: true,
      user: { select: { username: true } },
    },
    take: 5,
  });

  return NextResponse.json({ users: [], logs });
}