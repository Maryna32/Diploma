import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username, name, bio, avatarUrl } = await request.json();

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: username.toLowerCase(),
          NOT: { id: user.id },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Username вже зайнятий" },
          { status: 400 },
        );
      }
    }

    if (dbUser.avatarUrl && dbUser.avatarUrl !== avatarUrl) {
      const path = dbUser.avatarUrl.split("/avatars/")[1];

      if (path) {
        await supabase.storage.from("avatars").remove([path]);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        username: username?.toLowerCase(),
        name: name || null,
        bio: bio || null,
        avatarUrl: avatarUrl || null,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
