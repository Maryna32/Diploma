import { prisma } from "@/lib/prisma";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { MessageSquare, Star } from "lucide-react";
import { mediaTypeOptions } from "@/lib/translations";

export const dynamic = "force-dynamic";

const mediaTypeLabel = Object.fromEntries(
  mediaTypeOptions.map((o) => [o.value, o.label])
);

export default async function TrendsPage() {
  const [popularLogs, latestLogs] = await Promise.all([
    prisma.logEntry.findMany({
      where: { isPublic: true },
      include: {
        _count: { select: { comments: true } },
        user: { select: { id: true, username: true, avatarUrl: true } },
      },
      orderBy: { comments: { _count: "desc" } },
      take: 5,
    }),
    prisma.logEntry.findMany({
      where: { isPublic: true },
      include: {
        user: { select: { id: true, username: true, avatarUrl: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 space-y-8">
      <h1 className="text-2xl font-bold">Тренди</h1>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Популярні записи</h2>
        <div className="border rounded-xl divide-y">
          {popularLogs.map((log, i) => (
            <Link
              key={log.id}
              href={`/logs/${log.id}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors"
            >
              <span className="text-xs text-muted-foreground w-4 shrink-0 text-center">
                {i + 1}
              </span>
              {log.coverUrl ? (
                <img
                  src={log.coverUrl}
                  alt={log.title}
                  className="w-9 h-12 object-cover rounded shrink-0"
                />
              ) : (
                <div className="w-9 h-12 bg-muted rounded shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{log.title}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Avatar className="w-4 h-4">
                    <AvatarImage src={log.user.avatarUrl || undefined} />
                    <AvatarFallback className="text-[9px]">
                      {log.user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground truncate">
                    @{log.user.username} · {mediaTypeLabel[log.mediaType] ?? log.mediaType}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                {log.rating != null && (
                  <div className="flex items-center gap-0.5 text-xs text-yellow-500">
                    <Star className="w-3 h-3 fill-yellow-500" />
                    <span>{log.rating}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {log._count.comments}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Нові записи</h2>
        <div className="border rounded-xl divide-y">
          {latestLogs.map((log) => (
            <Link
              key={log.id}
              href={`/logs/${log.id}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors"
            >
              {log.coverUrl ? (
                <img
                  src={log.coverUrl}
                  alt={log.title}
                  className="w-9 h-12 object-cover rounded shrink-0"
                />
              ) : (
                <div className="w-9 h-12 bg-muted rounded shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{log.title}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Avatar className="w-4 h-4">
                    <AvatarImage src={log.user.avatarUrl || undefined} />
                    <AvatarFallback className="text-[9px]">
                      {log.user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground truncate">
                    @{log.user.username} · {mediaTypeLabel[log.mediaType] ?? log.mediaType}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                {log.rating != null && (
                  <div className="flex items-center gap-0.5 text-xs text-yellow-500">
                    <Star className="w-3 h-3 fill-yellow-500" />
                    <span>{log.rating}</span>
                  </div>
                )}
                <span className="text-xs text-muted-foreground">
                  {new Date(log.createdAt).toLocaleDateString("uk-UA", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}