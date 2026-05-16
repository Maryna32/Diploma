"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import FollowButton from "./FollowButton";

type User = {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  bio: string | null;
  _count: { followers: number; logEntries: number };
};

interface Props {
  allUsers: User[];
  followingUsers: User[];
  currentUserId?: string;
}

const TABS = [
  { key: "all", label: "Всі" },
  { key: "following", label: "Підписки" },
] as const;

export function CommunityTabs({ allUsers, followingUsers, currentUserId }: Props) {
  const [tab, setTab] = useState<"all" | "following">("all");

  const users = tab === "all" ? allUsers : followingUsers;

  return (
    <div className="space-y-4">
      <div className="flex gap-1 border-b">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm transition-colors border-b-2 -mb-px ${
              tab === t.key
                ? "border-foreground font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
            {t.key === "following" && currentUserId && (
              <span className="ml-1.5 text-xs text-muted-foreground">
                ({followingUsers.length})
              </span>
            )}
          </button>
        ))}
      </div>

      {users.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">
          {tab === "following" ? "Ви ще нікого не підписані." : "Користувачів немає."}
        </p>
      ) : (
        <div className="border rounded-xl divide-y">
          {users.map((u) => (
            <div key={u.id} className="flex items-center gap-3 p-4">
              <Link href={`/profile/${u.id}`} className="shrink-0">
                <Avatar className="w-9 h-9">
                  <AvatarImage src={u.avatarUrl || undefined} />
                  <AvatarFallback className="text-xs">
                    {u.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/profile/${u.id}`} className="hover:underline">
                  <p className="text-sm font-medium">@{u.username}</p>
                </Link>
                {u.name && (
                  <p className="text-xs text-muted-foreground truncate">{u.name}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {u._count.followers} підписників · {u._count.logEntries} записів
                </p>
              </div>

              <FollowButton
                targetUserId={u.id}
                initialFollowersCount={u._count.followers}
                currentUserId={currentUserId}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}