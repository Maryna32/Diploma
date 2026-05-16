import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { uk } from "date-fns/locale";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      logEntry: { select: { id: true, title: true } },
    },
  });

  const actorIds = [...new Set(notifications.map((n) => n.actorId).filter(Boolean))] as string[];
  const actors = await prisma.user.findMany({
    where: { id: { in: actorIds } },
    select: { id: true, username: true, avatarUrl: true },
  });
  const actorMap = Object.fromEntries(actors.map((a) => [a.id, a]));

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Сповіщення</h1>

      {notifications.length === 0 ? (
        <p className="text-muted-foreground text-sm">Немає сповіщень</p>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const actor = n.actorId ? actorMap[n.actorId] : null;

            return (
              <div
                key={n.id}
                className={`flex items-start gap-3 p-4 border rounded-xl transition-colors ${
                  n.isRead ? "opacity-60" : "bg-muted/30"
                }`}
              >
                <span className="text-lg shrink-0">
                  {n.type === "FOLLOW" ? "👤" : "💬"}
                </span>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <p className="text-sm">
                    {actor && (
                      <Link
                        href={`/profile/${actor.id}`}
                        className="font-medium hover:underline"
                      >
                        @{actor.username}
                      </Link>
                    )}{" "}
                    {n.type === "FOLLOW" && "підписався на вас"}
                    {n.type === "COMMENT" && (
                      <>
                        прокоментував запис{" "}
                        {n.logEntry && (
                          <Link
                            href={`/logs/${n.logEntry.id}`}
                            className="font-medium hover:underline truncate"
                          >
                            «{n.logEntry.title}»
                          </Link>
                        )}
                      </>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(n.createdAt), {
                      addSuffix: true,
                      locale: uk,
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}