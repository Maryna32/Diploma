import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FollowButton from "@/components/form/FollowButton";
import { BookMarked, BookOpen, Film, Tv, GraduationCap, Mic, LayoutGrid } from "lucide-react";
import { mediaTypeOptions } from "@/lib/translations";
import { createClient } from "@/lib/supabase/server";

interface Props {
  params: { id: string };
}

const mediaTypeLabel = Object.fromEntries(
  mediaTypeOptions.map((o) => [o.value, o.label])
);

const mediaTypeIcon: Record<string, React.ReactNode> = {
  BOOK: <BookOpen className="w-3.5 h-3.5" />,
  MOVIE: <Film className="w-3.5 h-3.5" />,
  SERIES: <Tv className="w-3.5 h-3.5" />,
  COURSE: <GraduationCap className="w-3.5 h-3.5" />,
  PODCAST: <Mic className="w-3.5 h-3.5" />,
  CUSTOM: <LayoutGrid className="w-3.5 h-3.5" />,
};

export default async function UserProfilePage({ params }: Props) {
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
    },
  });

  if (!user) notFound();

  const initials = user.username.slice(0, 2).toUpperCase();
  
  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();
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

      <div className="border rounded-xl">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold">Публічні записи</h2>
        </div>

        {user.logEntries.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
            <BookMarked className="w-10 h-10 opacity-40" />
            <p className="text-sm">Ще немає публічних записів</p>
          </div>
        ) : (
          <div className="divide-y">
            {user.logEntries.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between px-6 py-3.5 hover:bg-muted/40 transition-colors"
              >
                <p className="text-sm font-medium leading-snug">{log.title}</p>
                {log.mediaType && (
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full shrink-0 ml-4">
                    {mediaTypeIcon[log.mediaType]}
                    {mediaTypeLabel[log.mediaType] ?? log.mediaType}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}