import { prisma } from "@/lib/prisma";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { MessageSquare, Clock, TrendingUp } from "lucide-react";
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

      {/* Популярні записи */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <TrendingUp className="w-4 h-4" />
          Популярні записи
        </div>
        <div className="border rounded-xl divide-y">
          {popularLogs.map((log, i) => (
            <Link
              key={log.id}
              href={`/logs/${log.id}`}
              className="flex items-center gap-3 p-3 hover:bg-muted/40 transition-colors"
            >
              <span className="text-xs text-muted-foreground w-4 shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{log.title}</p>
                <p className="text-xs text-muted-foreground">
                  {mediaTypeLabel[log.mediaType] ?? log.mediaType}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                <MessageSquare className="w-3.5 h-3.5" />
                {log._count.comments}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Нові записи */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Clock className="w-4 h-4" />
          Нові записи
        </div>
        <div className="border rounded-xl divide-y">
          {latestLogs.map((log) => (
            <Link
              key={log.id}
              href={`/logs/${log.id}`}
              className="flex items-center gap-3 p-3 hover:bg-muted/40 transition-colors"
            >
              <Avatar className="w-7 h-7 shrink-0">
                <AvatarImage src={log.user.avatarUrl || undefined} />
                <AvatarFallback className="text-xs">
                  {log.user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{log.title}</p>
                <p className="text-xs text-muted-foreground">
                  @{log.user.username} · {mediaTypeLabel[log.mediaType] ?? log.mediaType}
                </p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {new Date(log.createdAt).toLocaleDateString("uk-UA", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}