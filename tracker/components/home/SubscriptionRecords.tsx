import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mediaTypeOptions, statusTypeOptions } from "@/lib/translations";
import Link from "next/link";
import { BookMarked } from "lucide-react";

const mediaTypeLabel = Object.fromEntries(mediaTypeOptions.map((o) => [o.value, o.label]));
const statusTypeLabel = Object.fromEntries(statusTypeOptions.map((o) => [o.value, o.label]));

const mediaTypeColors: Record<string, string> = {
  BOOK:    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  MOVIE:   "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  SERIES:  "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  COURSE:  "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  PODCAST: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  CUSTOM:  "bg-muted text-muted-foreground",
};

const statusTypeColors: Record<string, string> = {
  TO_CONSUME:  "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  COMPLETED:   "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  DROPPED:     "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

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
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Останні записи друзів</h2>
        <div className="flex flex-col items-center gap-3 py-10 text-muted-foreground border rounded-xl">
          <BookMarked className="w-8 h-8 opacity-40" />
          <p className="text-sm">Ви ще ні на кого не підписані</p>
        </div>
      </section>
    );
  }

  const entries = await prisma.logEntry.findMany({
    where: { userId: { in: followingIds }, isPublic: true },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      user: { select: { id: true, username: true, name: true, avatarUrl: true } },
    },
  });

  if (entries.length === 0) {
    return (
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Останні записи друзів</h2>
        <div className="flex flex-col items-center gap-3 py-10 text-muted-foreground border rounded-xl">
          <BookMarked className="w-8 h-8 opacity-40" />
          <p className="text-sm">Ваші друзі ще нічого не додали</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold">Останні записи друзів</h2>
      <div className="border rounded-xl divide-y">
        {entries.map((entry) => {
          const initials = entry.user.username.slice(0, 2).toUpperCase();
          return (
            <div key={entry.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors">
              <Link href={`/profile/${entry.user.id}`} className="shrink-0">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={entry.user.avatarUrl || undefined} />
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1 min-w-0 space-y-1">
                <Link href={`/logs/${entry.id}`}>
                  <p className="text-sm font-medium truncate hover:underline">{entry.title}</p>
                </Link>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Link href={`/profile/${entry.user.id}`}>
                    <span className="text-xs text-muted-foreground hover:underline">@{entry.user.username}</span>
                  </Link>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${mediaTypeColors[entry.mediaType] ?? "bg-muted text-muted-foreground"}`}>
                    {mediaTypeLabel[entry.mediaType] ?? entry.mediaType}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusTypeColors[entry.status] ?? "bg-muted text-muted-foreground"}`}>
                    {statusTypeLabel[entry.status] ?? entry.status}
                  </span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {new Date(entry.createdAt).toLocaleDateString("uk-UA", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}