import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { mediaTypeOptions, statusTypeOptions } from "@/lib/translations";
import { CalendarDays, Star } from "lucide-react";
import { CommentsSection } from "@/components/list/CommentsSection";
import { Reactions } from "@/components/list/Reactions";

export const dynamic = "force-dynamic"
const mediaTypeLabel = Object.fromEntries(mediaTypeOptions.map((o) => [o.value, o.label]));
const statusTypeLabel = Object.fromEntries(statusTypeOptions.map((o) => [o.value, o.label]));

interface Props {
  params: { id: string };
}

export default async function LogDetailsPage({ params }: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const id = Number(params.id);
  if (isNaN(id)) notFound();

  const log = await prisma.logEntry.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, username: true, name: true, avatarUrl: true },
      },
      reactions: true,
      comments: {                  
        include: {
          user: { select: { id: true, username: true, name: true, avatarUrl: true } },
          reactions: true, 
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!log) notFound();

  const isOwner = user?.id === log.userId;

  if (!log.isPublic && !isOwner) {
    notFound();
  }

  const initials = log.user.username.slice(0, 2).toUpperCase();

  const groupedReactions = Object.values(
    (log.reactions ?? []).reduce((acc, r) => {
      if (!acc[r.emoji]) {
        acc[r.emoji] = {
          emoji: r.emoji,
          count: 0,
          reacted: false,
        };
      }

      acc[r.emoji].count++;

      if (r.userId === user?.id) {
        acc[r.emoji].reacted = true;
      }

      return acc;
    }, {} as Record<string, { emoji: string; count: number; reacted: boolean }>)
  );

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4 space-y-4">
      <div className="border rounded-xl overflow-hidden">
        {log.coverUrl ? (
          <div className="relative h-48 bg-muted overflow-hidden">
            <img
              src={log.coverUrl}
              alt={log.title}
              className="w-full h-full object-cover blur-xl scale-110 opacity-60"
            />
            <img
              src={log.coverUrl}
              alt={log.title}
              className="absolute inset-0 m-auto h-40 w-auto object-contain drop-shadow-xl"
            />
          </div>
        ) : (
          <div className="h-24 bg-muted" />
        )}

        <div className="p-6 space-y-5">
          <Link href={`/profile/${log.user.id}`} className="flex items-center gap-2.5 w-fit">
            <Avatar className="w-8 h-8">
              <AvatarImage src={log.user.avatarUrl || undefined} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              @{log.user.username}
            </span>
          </Link>

          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold leading-tight break-words">
              {log.title}
            </h1>

            {user?.id === log.userId && (
              <Link
                href={`/edit-log/${log.id}`}
                className="shrink-0 rounded-md border px-2.5 py-1 text-xs hover:bg-muted transition-colors"
              >
                Редагувати
              </Link>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground">
              {mediaTypeLabel[log.mediaType] ?? log.mediaType}
            </span>
            <span className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground">
              {statusTypeLabel[log.status] ?? log.status}
            </span>
            {log.rating && (
              <span className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground flex items-center gap-1">
                <Star className="w-3 h-3" />
                {log.rating}/5
              </span>
            )}
          </div>

          {log.notes && (
            <div className="border rounded-lg p-4 bg-muted/30">
              <p className="text-sm leading-relaxed">{log.notes}</p>
            </div>
          )}
          <Reactions
              logEntryId={log.id}
              currentUserId={user?.id}
              initialReactions={groupedReactions}
              emojis={["❤️", "💔","🔥", "👍", "👎"]}
            />
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
            <CalendarDays className="w-3.5 h-3.5" />
            {new Date(log.createdAt).toLocaleDateString("uk-UA", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </div>
      <CommentsSection                                 
        logEntryId={log.id}
        currentUserId={user?.id}
        initialComments={log.comments.map((c) => ({
          ...c,
          createdAt: c.createdAt.toISOString(),
          reactions: Object.values(
            (c.reactions ?? []).reduce((acc, r) => {
              if (!acc[r.emoji]) acc[r.emoji] = { emoji: r.emoji, count: 0, reacted: false };
              acc[r.emoji].count++;
              if (r.userId === user?.id) acc[r.emoji].reacted = true;
              return acc;
            }, {} as Record<string, { emoji: string; count: number; reacted: boolean }>)
          ),
        }))}
      />
    </div>
  );
}