"use client";

import React, { useState } from "react";
import ProfileForm from "@/components/profile/ProfileForm";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowListDialog } from "@/components/profile/FollowListDialog";
import { ProfileTabs } from "@/components/profile/ProfileTabs";

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

type Log = {
  id: number;
  title: string;
  mediaType: string;
  status: string;
  rating?: number | null;
  coverUrl?: string | null;
  isPublic?: boolean;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  user: User;
  logs: Log[];
  likedLogs: Log[];
  followers: UserSnippet[];
  following: UserSnippet[];
};


export default function ProfilePageClient({
  user,
  logs = [],
  likedLogs = [],
  followers = [],
  following = [],
}: Props) {
  const [editing, setEditing] = useState(false);

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
        <>
          <div className="flex gap-6 text-sm">
            <FollowListDialog
              title="Підписники"
              users={followers}
              trigger={
                <button className="hover:opacity-80 transition">
                  <span className="font-semibold">
                    {followers.length}
                  </span>{" "}
                  <span className="text-muted-foreground">
                    підписників
                  </span>
                </button>
              }
            />

            <FollowListDialog
              title="Підписки"
              users={following}
              trigger={
                <button className="hover:opacity-80 transition">
                  <span className="font-semibold">
                    {following.length}
                  </span>{" "}
                  <span className="text-muted-foreground">
                    підписок
                  </span>
                </button>
              }
            />
          </div>

          <ProfileTabs
            logs={logs}
            likedLogs={likedLogs}
            followers={followers}
            following={following}
            currentUserId={user.id}
          />
        </>
      
      )}
    </div>
  );
}