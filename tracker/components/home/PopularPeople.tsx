"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Users } from "lucide-react";

interface User {
  id: string;
  username: string;
  name?: string | null;
  avatarUrl?: string | null;
  _count: { followers: number };
}

export default function PopularPeople({ users }: { users: User[] }) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold">Популярні користувачі</h2>
      <div className="border rounded-xl divide-y">
        {users.map((user, i) => (
          <Link
            key={user.id}
            href={`/profile/${user.id}`}
            className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors"
          >
            <span className="text-xs text-muted-foreground w-4 shrink-0">{i + 1}</span>
            <Avatar className="w-8 h-8 shrink-0">
              <AvatarImage src={user.avatarUrl || undefined} />
              <AvatarFallback className="text-xs">
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">@{user.username}</p>
              {user.name && (
                <p className="text-xs text-muted-foreground truncate">{user.name}</p>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Users className="w-3.5 h-3.5" />
              {user._count.followers}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}