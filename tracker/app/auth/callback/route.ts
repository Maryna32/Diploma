import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function generateUsername(email: string, userId: string): string {
  const emailPart = email.split("@")[0].toLowerCase();
  const randomSuffix = userId.slice(-4);
  return `${emailPart}_${randomSuffix}`;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    if (data.user) {
      const existingUser = await prisma.user.findUnique({
        where: { id: data.user.id },
      });

      if (!existingUser) {
        const username = generateUsername(data.user.email!, data.user.id);
        await prisma.user.create({
          data: {
            id: data.user.id,
            email: data.user.email!,
            username: username,
            name: data.user.user_metadata?.full_name || null,
            avatarUrl: data.user.user_metadata?.avatar_url || null,
          },
        });
      }
    }
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;
  return NextResponse.redirect(origin);
}
