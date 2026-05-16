"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";
import { mediaTypeOptions } from "@/lib/translations";

const mediaTypeLabel = Object.fromEntries(
  mediaTypeOptions.map((o) => [o.value, o.label])
);

interface Log {
  id: number;
  title: string;
  mediaType: string;
  coverUrl?: string | null;
  _count: { comments: number };
  user: { id: string; username: string; avatarUrl?: string | null };
}

export default function PopularLogs({ logs }: { logs: Log[] }) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold">Популярні записи</h2>
      <div className="border rounded-xl divide-y">
        {logs.map((log) => (
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
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <MessageSquare className="w-3.5 h-3.5" />
              {log._count.comments}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}