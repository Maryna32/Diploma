import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        { error: "Користувач не авторизований" },
        { status: 401 },
      );
    }

    const body = await req.json();

    const { title, mediaType, status, rating, notes, isPublic, coverUrl } =
      body;

    const log = await prisma.logEntry.create({
      data: {
        title,
        mediaType,
        status,
        rating,
        notes,
        isPublic,
        coverUrl,
        userId: user.id,
      },
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Помилка створення запису" },
      { status: 500 },
    );
  }
}
