import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfilePageClient from "./ProfilePageClient";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) redirect("/auth");

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
  });

  if (!user) redirect("/auth");

  return <ProfilePageClient user={user} />;
}
