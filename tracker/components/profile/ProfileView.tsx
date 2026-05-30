"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowListDialog } from "@/components/profile/FollowListDialog";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { Button } from "@/components/ui/button";
import FollowButton from "@/components/form/FollowButton";

type UserSnippet = {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
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
  user: any;
  logs: Log[];
  likedLogs: Log[];
  followers: UserSnippet[];
  following: UserSnippet[];
  totalLogsCount?: number;
  isOwnProfile?: boolean;

  currentUserId?: string;

  onEdit?: () => void;
};

export default function ProfileView({
  user,
  logs,
  likedLogs,
  followers,
  following,
  currentUserId,
  totalLogsCount,
  isOwnProfile = false,
  onEdit,
}: Props) {
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.username.slice(0, 2).toUpperCase();

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-24 h-24 border-2 border-background shadow-md">
            <AvatarImage src={user.avatarUrl || undefined} />
            <AvatarFallback>
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <p className="text-xl font-semibold">
              {user.name || "Без імені"}
            </p>

            <p className="text-sm text-muted-foreground">
              @{user.username}
            </p>

            {isOwnProfile && (
              <p className="text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>

          {isOwnProfile ? (
            <Button onClick={onEdit}>
              Редагувати профіль
            </Button>
          ) : (
            <FollowButton
              targetUserId={user.id}
              currentUserId={currentUserId}
              initialFollowersCount={followers.length}
            />
          )}
        </div>

        <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
          {user.bio || "Користувач не додав біо."}
        </p>

        <div className="flex gap-6 text-sm">
          <FollowListDialog
            title="Підписники"
            users={followers}
            trigger={
              <button className="hover:opacity-80">
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
              <button className="hover:opacity-80">
                <span className="font-semibold">
                  {following.length}
                </span>{" "}
                <span className="text-muted-foreground">
                  підписок
                </span>
              </button>
            }
          />

          <span>
            <span className="text-muted-foreground">
                Всього{" "}
            </span>

            <span className="font-semibold">
                {totalLogsCount ?? logs.length}
            </span>{" "}

            <span className="text-muted-foreground">
                записів
            </span>
        </span>
        </div>

        <ProfileTabs
          logs={logs}
          likedLogs={likedLogs}
          followers={followers}
          following={following}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
}