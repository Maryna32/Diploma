"use client";

import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

type UserSnippet = {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
};

interface Props {
  title: string;
  users: UserSnippet[];
  trigger: React.ReactNode;
}

export function FollowListDialog({
  title,
  users,
  trigger,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {users.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Нічого немає
          </div>
        ) : (
          <div className="max-h-[420px] overflow-y-auto">
            {users.map((u) => (
              <Link
                key={u.id}
                href={`/profile/${u.id}`}
                className="flex items-center gap-3 px-6 py-3 hover:bg-muted/40 transition-colors"
              >
                <Avatar className="w-9 h-9">
                  <AvatarImage src={u.avatarUrl || undefined} />
                  <AvatarFallback className="text-xs">
                    {u.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    @{u.username}
                  </p>

                  {u.name && (
                    <p className="text-xs text-muted-foreground truncate">
                      {u.name}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}