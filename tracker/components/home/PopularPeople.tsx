"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

interface User {
  id: string;
  username: string;
  avatarUrl?: string;
  _count: {
    followers: number;
  };
}

function PopularPeople({ users }: { users: User[] }) {
  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Популярні користувачі</h2>

      <div className="grid gap-4">
        {users.map((user) => (
          <Link key={user.id} href={`/profile/${user.id}`}>
            <div className="flex items-center gap-3 p-4 border rounded-xl hover:bg-muted transition cursor-pointer">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.avatarUrl || undefined} />
                <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
              </Avatar>

              <div>
                <p className="font-semibold">@{user.username}</p>
                <p className="text-sm text-gray-500">
                  Підписників: {user._count.followers}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default PopularPeople;
