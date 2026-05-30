import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileView from "@/components/profile/ProfileView";

interface Props {
  params: {
    id: string;
  };
}

export default async function UserProfilePage({ params }: Props) {
  const supabase = await createClient();

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const user = await prisma.user.findUnique({
    where: {
      id: params.id,
    },
    include: {
      _count: {
        select: {
          logEntries: true,
        },
      },

      logEntries: {
        where: {
          isPublic: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },

      followers: {
        include: {
          follower: {
            select: {
              id: true,
              username: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      },

      following: {
        include: {
          following: {
            select: {
              id: true,
              username: true,
              name: true,
              avatarUrl: true,
            },
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

  if (!user) {
    notFound();
  }

  const followers = user.followers.map((f) => f.follower);
  const following = user.following.map((f) => f.following);

  const likedLogs = user.reactions
    .map((r) => r.logEntry)
    .filter((log): log is NonNullable<typeof log> => !!log)
    .filter((log) => log.isPublic);

  return (
    <ProfileView
      user={user}
      followers={followers}
      following={following}
      currentUserId={currentUser?.id}
      totalLogsCount={user._count.logEntries}
      savedLogs={[]}
      likedLogs={likedLogs.map((l) => ({
        ...l,
        createdAt: l.createdAt.toISOString(),
        updatedAt: l.updatedAt.toISOString(),
      }))}
      logs={user.logEntries.map((l) => ({
        ...l,
        createdAt: l.createdAt.toISOString(),
        updatedAt: l.updatedAt.toISOString(),
      }))}
    />
  );
}