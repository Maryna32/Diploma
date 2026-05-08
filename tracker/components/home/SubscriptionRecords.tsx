import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mediaTypeOptions, statusTypeOptions } from "@/lib/translations";
import Link from "next/link";
import { BookMarked } from "lucide-react";


const mediaTypeLabel = Object.fromEntries(
  mediaTypeOptions.map((o) => [o.value, o.label])
);
const statusTypeLabel = Object.fromEntries(
  statusTypeOptions.map((o) => [o.value, o.label])
);

export default async function SubscriptionRecords() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const following = await prisma.follows.findMany({
    where: { followerId: user.id },
    select: { followingId: true },
  });

  const followingIds = following.map((f) => f.followingId);

  if (followingIds.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Останні записи друзів</h2>
        <div className="flex flex-col items-center gap-3 py-10 text-muted-foreground border rounded-xl">
          <BookMarked className="w-8 h-8 opacity-40" />
          <p className="text-sm">Ви ще ні на кого не підписані</p>
        </div>
      </div>
    );
  }

  const entries = await prisma.logEntry.findMany({
    where: {
      userId: { in: followingIds },
      isPublic: true,
    },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
  });

  if (entries.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Останні записи друзів</h2>
        <div className="flex flex-col items-center gap-3 py-10 text-muted-foreground border rounded-xl">
          <BookMarked className="w-8 h-8 opacity-40" />
          <p className="text-sm">Ваші друзі ще нічого не додали</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Останні записи друзів</h2>
      <div className="border rounded-xl divide-y">
        {entries.map((entry) => {
          const initials = entry.user.username.slice(0, 2).toUpperCase();
          return (
            <div key={entry.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/40 transition-colors">
              <Link href={`/profile/${entry.user.id}`}>
                <Avatar className="w-9 h-9 shrink-0">
                  <AvatarImage src={entry.user.avatarUrl || undefined} />
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/logs/${entry.id}`}>
                  <p className="text-sm font-medium truncate hover:underline">{entry.title}</p>
                </Link>
                <p className="text-xs text-muted-foreground">
                  <Link href={`/profile/${entry.user.id}`} className="hover:underline">
                    @{entry.user.username}
                  </Link>
                  {" · "}
                  {mediaTypeLabel[entry.mediaType] ?? entry.mediaType}
                </p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {statusTypeLabel[entry.status] ?? entry.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}