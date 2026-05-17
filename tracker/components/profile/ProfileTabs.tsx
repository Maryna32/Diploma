"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FollowButton from "@/components/form/FollowButton";
import {
  BookMarked, BookOpen, Film, Tv,
  GraduationCap, Mic, LayoutGrid,
} from "lucide-react";
import { mediaTypeOptions } from "@/lib/translations";

const mediaTypeLabel = Object.fromEntries(
  mediaTypeOptions.map((o) => [o.value, o.label])
);

const mediaTypeIcon: Record<string, React.ReactNode> = {
  BOOK:    <BookOpen className="w-3.5 h-3.5" />,
  MOVIE:   <Film className="w-3.5 h-3.5" />,
  SERIES:  <Tv className="w-3.5 h-3.5" />,
  COURSE:  <GraduationCap className="w-3.5 h-3.5" />,
  PODCAST: <Mic className="w-3.5 h-3.5" />,
  CUSTOM:  <LayoutGrid className="w-3.5 h-3.5" />,
};

type Log = {
  id: number;
  title: string;
  mediaType: string;
  createdAt: string;
  updatedAt: string;
};

type UserSnippet = {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
};

interface Props {
  logs: Log[];
  followers: UserSnippet[];
  following: UserSnippet[];
  currentUserId?: string;
}

const TABS = [
  { key: "logs", label: "Записи" },
  { key: "followers", label: "Підписники" },
  { key: "following", label: "Підписки" },
] as const;

export function ProfileTabs({ logs, followers, following, currentUserId }: Props) {
  const [tab, setTab] = useState<"logs" | "followers" | "following">("logs");

  return (
    <div className="border rounded-xl overflow-hidden">
      <div className="flex border-b">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-3 text-sm transition-colors ${
              tab === t.key
                ? "font-semibold border-b-2 border-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
            {t.key === "followers" && (
              <span className="ml-1.5 text-xs text-muted-foreground">({followers.length})</span>
            )}
            {t.key === "following" && (
              <span className="ml-1.5 text-xs text-muted-foreground">({following.length})</span>
            )}
            {t.key === "logs" && (
              <span className="ml-1.5 text-xs text-muted-foreground">({logs.length})</span>
            )}
          </button>
        ))}
      </div>

      {tab === "logs" && (
        logs.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
            <BookMarked className="w-10 h-10 opacity-40" />
            <p className="text-sm">Ще немає публічних записів</p>
          </div>
        ) : (
          <div className="divide-y">
            {logs.map((log) => (
              <Link
                key={log.id}
                href={`/logs/${log.id}`}
                className="flex items-center justify-between px-6 py-3.5 hover:bg-muted/40 transition-colors"
              >
                <p className="text-sm font-medium leading-snug">{log.title}</p>
                {log.mediaType && (
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full shrink-0 ml-4">
                    {mediaTypeIcon[log.mediaType]}
                    {mediaTypeLabel[log.mediaType] ?? log.mediaType}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )
      )}

      {tab === "followers" && (
        followers.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
            <p className="text-sm">Ще немає підписників</p>
          </div>
        ) : (
          <div className="divide-y">
            {followers.map((u) => (
              <UserRow key={u.id} user={u} currentUserId={currentUserId} />
            ))}
          </div>
        )
      )}

      {tab === "following" && (
        following.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
            <p className="text-sm">Ще немає підписок</p>
          </div>
        ) : (
          <div className="divide-y">
            {following.map((u) => (
              <UserRow key={u.id} user={u} currentUserId={currentUserId} />
            ))}
          </div>
        )
      )}
    </div>
  );
}

function UserRow({ user, currentUserId }: { user: UserSnippet; currentUserId?: string }) {
  return (
    <div className="flex items-center gap-3 px-6 py-3.5">
      <Link href={`/profile/${user.id}`} className="shrink-0">
        <Avatar className="w-8 h-8">
          <AvatarImage src={user.avatarUrl || undefined} />
          <AvatarFallback className="text-xs">
            {user.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/profile/${user.id}`} className="hover:underline">
          <p className="text-sm font-medium">@{user.username}</p>
        </Link>
        {user.name && (
          <p className="text-xs text-muted-foreground truncate">{user.name}</p>
        )}
      </div>
      <FollowButton
        targetUserId={user.id}
        initialFollowersCount={0}
        currentUserId={currentUserId}
      />
    </div>
  );
}