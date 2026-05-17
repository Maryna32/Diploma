"use client";

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
  currentUserId?: string;
}

export function CommunityTabs({ allUsers, currentUserId }: Props) {
  return (
    <div className="space-y-4">
      {allUsers.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">Користувачів немає.</p>
      ) : (
        <div className="border rounded-xl divide-y">
          {allUsers.map((u) => (
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