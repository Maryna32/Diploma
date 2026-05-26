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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const cleanUsername = body.username?.trim().toLowerCase();
    const cleanName = body.name?.trim();
    const cleanBio = body.bio?.trim();

    const avatarUrl = body.avatarUrl;

    if (
      !cleanUsername ||
      cleanUsername.length < 3 ||
      cleanUsername.length > 24
    ) {
      return NextResponse.json(
        {
          error: "Username має бути від 3 до 24 символів",
        },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9_]+$/.test(cleanUsername)) {
      return NextResponse.json(
        {
          error:
            "Username може містити тільки малі літери, цифри та _",
        },
        { status: 400 }
      );
    }

    if (cleanName && cleanName.length > 40) {
      return NextResponse.json(
        {
          error: "Ім'я не може бути довшим за 40 символів",
        },
        { status: 400 }
      );
    }

    if (cleanBio && cleanBio.length > 500) {
      return NextResponse.json(
        {
          error: "Біо не може бути довшим за 500 символів",
        },
        { status: 400 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        username: cleanUsername,
        NOT: {
          id: user.id,
        },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "Username вже зайнятий",
        },
        { status: 400 }
      );
    }

    if (dbUser.avatarUrl && dbUser.avatarUrl !== avatarUrl) {
      const path = dbUser.avatarUrl.split("/avatars/")[1];

      if (path) {
        await supabase.storage
          .from("avatars")
          .remove([path]);
      }
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        username: cleanUsername,
        name: cleanName || null,
        bio: cleanBio || null,
        avatarUrl: avatarUrl || null,
      },
    });

    return NextResponse.json({
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);

    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}