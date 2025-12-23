"use client";

import React, { useState } from "react";
import ProfileForm from "@/components/profile/ProfileForm";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
};

export default function ProfilePageClient({ user }: Props) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      {!editing ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-24 h-24 border-2 border-background shadow-md">
              {user.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} />
              ) : (
                <AvatarFallback className="text-xl">
                  {user.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                    : user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="text-xl font-semibold">
                {user.name || "Без імені"}
              </p>
              <p className="text-muted-foreground">@{user.username}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            {user.bio || "Користувач не додав біо."}
          </p>

          <Button onClick={() => setEditing(true)}>Редагувати профіль</Button>
        </div>
      ) : (
        <ProfileForm
          user={user}
          onClose={() => {
            setEditing(false);
          }}
        />
      )}
    </div>
  );
}
