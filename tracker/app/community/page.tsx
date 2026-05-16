import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { CommunityTabs } from "@/components/form/CommunityTabs";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const allUsers = await prisma.user.findMany({
    include: {
      _count: { select: { followers: true, logEntries: true } },
    },
    orderBy: { followers: { _count: "desc" } },
    take: 20,
  });

  const followingIds = user
    ? (await prisma.follows.findMany({
        where: { followerId: user.id },
        select: { followingId: true },
      })).map((f) => f.followingId)
    : [];

  const followingUsers = allUsers.filter((u) => followingIds.includes(u.id));

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Спільнота</h1>
      <CommunityTabs
        allUsers={allUsers}
        followingUsers={followingUsers}
        currentUserId={user?.id}
      />
    </div>
  );
}