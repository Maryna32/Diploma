import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        { error: "Користувач не авторизований" },
        { status: 401 }
      );
    }

    const id = Number(params.id);

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: "Невірний ID" },
        { status: 400 }
      );
    }

    const log = await prisma.logEntry.findUnique({
      where: { id },
    });

    if (!log) {
      return NextResponse.json(
        { error: "Запис не знайдено" },
        { status: 404 }
      );
    }

    if (log.userId !== user.id) {
      return NextResponse.json(
        { error: "Нема доступу" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const updatedLog = await prisma.logEntry.update({
      where: { id }, 
      data: {
        ...body,
      },
    });

    return NextResponse.json(updatedLog);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Помилка оновлення запису" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        { error: "Користувач не авторизований" },
        { status: 401 }
      );
    }

    const id = Number(params.id);

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: "Невірний ID" },
        { status: 400 }
      );
    }

    const log = await prisma.logEntry.findUnique({
      where: { id },
    });

    if (!log || log.userId !== user.id) {
      return NextResponse.json(
        { error: "Нема доступу" },
        { status: 403 }
      );
    }

    await prisma.logEntry.delete({
      where: { id }, 
    });

    return NextResponse.json({ message: "Запис видалено" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Помилка видалення запису" },
      { status: 500 }
    );
  }
}