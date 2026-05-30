import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FollowButton from "@/components/form/FollowButton";
import { createClient } from "@/lib/supabase/server";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { FollowListDialog } from "@/components/profile/FollowListDialog";

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
      reactions: {
        where: {
          logEntryId: {
            not: null,
          },
        },
        include: {
          logEntry: true,
        },
      },
    },
  });

  if (!user) notFound();

  const initials = user.username.slice(0, 2).toUpperCase();
  const followers = user.followers.map((f) => f.follower);
  const following = user.following.map((f) => f.following);
  const likedLogs = user.reactions
    .map((r) => r.logEntry)
    .filter((log): log is NonNullable<typeof log> => !!log)
    .filter((log) => log.isPublic);

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

          <p className="text-sm text-muted-foreground">
            @{user.username}
          </p>
        </div>

        {user.bio ? (
          <p className="text-sm mb-4">{user.bio}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic mb-4">
            Користувач не додав біо.
          </p>
        )}

        <div className="flex gap-6 text-sm">
          <FollowListDialog
            title="Підписники"
            users={followers}
            trigger={
              <button className="hover:opacity-80 transition">
                <span className="font-semibold">
                  {followers.length}
                </span>{" "}
                <span className="text-muted-foreground">
                  підписників
                </span>
              </button>
            }
          />

          <FollowListDialog
            title="Підписки"
            users={following}
            trigger={
              <button className="hover:opacity-80 transition">
                <span className="font-semibold">
                  {following.length}
                </span>{" "}
                <span className="text-muted-foreground">
                  підписок
                </span>
              </button>
            }
          />

          <span>
            <span className="font-semibold">
              {user.logEntries.length}
            </span>{" "}
            <span className="text-muted-foreground">
              записів
            </span>
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
      likedLogs={likedLogs.map((l) => ({
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