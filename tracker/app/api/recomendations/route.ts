import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const popularUsers = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            followers: true,
          },
        },
      },
      orderBy: {
        followers: {
          _count: "desc",
        },
      },
      take: 5,
    });

    const popularLogs = await prisma.logEntry.findMany({
      where: {
        isPublic: true,
      },
      include: {
        _count: {
          select: {
            comments: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        comments: {
          _count: "desc",
        },
      },
      take: 5,
    });

    const latestLogs = await prisma.logEntry.findMany({
      where: {
        isPublic: true,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return NextResponse.json({
      popularUsers,
      popularLogs,
      latestLogs,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Помилка завантаження рекомендацій" },
      { status: 500 },
    );
  }
}
