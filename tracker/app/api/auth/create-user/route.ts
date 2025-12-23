import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function generateUsername(email: string, userId: string): string {
  const emailPart = email.split("@")[0].toLowerCase();
  const randomSuffix = userId.slice(-4);
  return `${emailPart}_${randomSuffix}`;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (existingUser) {
      return NextResponse.json({ user: existingUser });
    }

    const username = generateUsername(user.email!, user.id);
    const newUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email!,
        username: username,
        name: user.user_metadata?.full_name || null,
        avatarUrl: user.user_metadata?.avatar_url || null,
      },
    });

    return NextResponse.json({ user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
