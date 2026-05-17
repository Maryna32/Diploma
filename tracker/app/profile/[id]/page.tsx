import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FollowButton from "@/components/form/FollowButton";
import { createClient } from "@/lib/supabase/server";
import { ProfileTabs } from "@/components/profile/ProfileTabs";

interface Props {
  params: { id: string };
}

export default async function UserProfilePage({ params }: Props) {
  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          logEntries: true,
        },
      },
      logEntries: {
        where: { isPublic: true },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      followers: {
        include: {
          follower: {
            select: { id: true, username: true, name: true, avatarUrl: true },
          },
        },
      },
      following: {
        include: {
          following: {
            select: { id: true, username: true, name: true, avatarUrl: true },
          },
        },
      },
    },
  });

  if (!user) notFound();

  const initials = user.username.slice(0, 2).toUpperCase();
  const followers = user.followers.map((f) => f.follower);
  const following = user.following.map((f) => f.following);

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4 space-y-4">
      <div className="border rounded-xl overflow-hidden">
        <div className="h-28 bg-muted" />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <Avatar className="w-20 h-20 border-4 border-background text-lg">
              <AvatarImage src={user.avatarUrl || undefined} />
              <AvatarFallback className="text-base font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="mb-1">
              <FollowButton
                targetUserId={user.id}
                initialFollowersCount={user._count.followers}
                currentUserId={currentUser?.id}
              />
            </div>
          </div>

          <div className="mb-3">
            <h1 className="text-xl font-semibold leading-tight">
              {user.name || user.username}
            </h1>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>

          {user.bio ? (
            <p className="text-sm mb-4">{user.bio}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic mb-4">
              Користувач не додав біо.
            </p>
          )}

          <div className="flex gap-5 text-sm">
            <span>
              <span className="font-semibold">{user._count.followers}</span>{" "}
              <span className="text-muted-foreground">підписників</span>
            </span>
            <span>
              <span className="font-semibold">{user._count.following}</span>{" "}
              <span className="text-muted-foreground">підписок</span>
            </span>
            <span>
              <span className="font-semibold">{user._count.logEntries}</span>{" "}
              <span className="text-muted-foreground">записів</span>
            </span>
          </div>
        </div>
      </div>

      <ProfileTabs
        logs={user.logEntries.map((l) => ({
          ...l,
          createdAt: l.createdAt.toISOString(),
          updatedAt: l.updatedAt.toISOString(),
        }))}
        followers={followers}
        following={following}
        currentUserId={currentUser?.id}
      />
    </div>
  );
}