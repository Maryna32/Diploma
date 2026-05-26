"use client";

import React, { useState } from "react";
import ProfileForm from "@/components/profile/ProfileForm";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

type UserSnippet = {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
};

type User = {
  id: string;
  email: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  bio: string | null;
};

type Props = {
  user: User;
  followers: UserSnippet[];
  following: UserSnippet[];
};

const TABS = [
  { key: "followers", label: "Підписники" },
  { key: "following", label: "Підписки" },
] as const;

export default function ProfilePageClient({ user, followers = [], following = [] }: Props) {
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState<"followers" | "following">("followers");

  const list = tab === "followers" ? followers : following;

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4 space-y-6">
      {!editing ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-24 h-24 border-2 border-background shadow-md">
              {user.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} />
              ) : (
                <AvatarFallback className="text-xl">
                  {user.name
                    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                    : user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="text-xl font-semibold break-words">{user.name || "Без імені"}</p>
              <p className="text-sm font-medium truncate">@{user.username}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground break-words whitespace-pre-wrap">
            {user.bio || "Користувач не додав біо."}
          </p>
          <Button onClick={() => setEditing(true)}>Редагувати профіль</Button>
        </div>
      ) : (
        <ProfileForm user={user} onClose={() => setEditing(false)} />
      )}

      {!editing && (
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
                <span className="ml-1.5 text-xs text-muted-foreground">
                  ({t.key === "followers" ? followers.length : following.length})
                </span>
              </button>
            ))}
          </div>

          {list.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
              {tab === "followers" ? "Ще немає підписників" : "Ще немає підписок"}
            </div>
          ) : (
            <div className="divide-y">
              {list.map((u) => (
                <Link
                  key={u.id}
                  href={`/profile/${u.id}`}
                  className="flex items-center gap-3 px-6 py-3.5 hover:bg-muted/40 transition-colors"
                >
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarImage src={u.avatarUrl || undefined} />
                    <AvatarFallback className="text-xs">
                      {u.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">@{u.username}</p>
                    {u.name && (
                      <p className="text-xs text-muted-foreground truncate">{u.name}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}