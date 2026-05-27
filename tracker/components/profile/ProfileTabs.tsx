"use client";

import { useState } from "react";
import Link from "next/link";

import {
  BookMarked,
  BookOpen,
  Film,
  Tv,
  GraduationCap,
  Mic,
  LayoutGrid,
  Heart,
} from "lucide-react";

import {
  mediaTypeOptions,
  statusTypeOptions,
} from "@/lib/translations";

const mediaTypeLabel = Object.fromEntries(
  mediaTypeOptions.map((o) => [o.value, o.label])
);

const statusTypeLabel = Object.fromEntries(
  statusTypeOptions.map((o) => [o.value, o.label])
);

const mediaTypeIcon: Record<string, React.ReactNode> = {
  BOOK: <BookOpen className="w-3.5 h-3.5" />,
  MOVIE: <Film className="w-3.5 h-3.5" />,
  SERIES: <Tv className="w-3.5 h-3.5" />,
  COURSE: <GraduationCap className="w-3.5 h-3.5" />,
  PODCAST: <Mic className="w-3.5 h-3.5" />,
  CUSTOM: <LayoutGrid className="w-3.5 h-3.5" />,
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

type UserSnippet = {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
};

interface Props {
  logs: Log[];
  likedLogs: Log[];
  followers: UserSnippet[];
  following: UserSnippet[];
  currentUserId?: string;
}

const TABS = [
  { key: "logs", label: "Записи" },
  { key: "liked", label: "Вподобані" },
] as const;

export function ProfileTabs({
  logs,
  likedLogs,
  followers,
  following,
  currentUserId,
}: Props) {
  const [tab, setTab] = useState<"logs" | "liked">("logs");

  return (
    <div className="border rounded-xl overflow-hidden">
      <div className="flex border-b overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-3 text-sm whitespace-nowrap transition-colors ${
              tab === t.key
                ? "font-semibold border-b-2 border-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}

            <span className="ml-1.5 text-xs text-muted-foreground">
              {t.key === "logs" && `(${logs.length})`}
              {t.key === "liked" && `(${likedLogs.length})`}
            </span>
          </button>
        ))}
      </div>

      {tab === "logs" && (
        <LogsList
          logs={logs}
          emptyText="Ще немає публічних записів"
        />
      )}

      {tab === "liked" && (
        <LogsList
          logs={likedLogs}
          emptyText="Ще немає вподобаних записів"
          icon={<Heart className="w-10 h-10 opacity-40" />}
        />
      )}
    </div>
  );
}

function LogsList({
  logs,
  emptyText,
  icon,
}: {
  logs: Log[];
  emptyText: string;
  icon?: React.ReactNode;
}) {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
        {icon ?? <BookMarked className="w-10 h-10 opacity-40" />}
        <p className="text-sm">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {logs.map((log) => (
        <Link
          key={log.id}
          href={`/logs/${log.id}`}
          className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors"
        >
          {log.coverUrl ? (
            <img
              src={log.coverUrl}
              alt={log.title}
              className="w-10 h-14 object-cover rounded-md shrink-0"
            />
          ) : (
            <div className="w-10 h-14 bg-muted rounded-md shrink-0" />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate">
                {log.title}
              </p>

              {log.isPublic === false && (
               <span className="text-xs text-muted-foreground">
                🔒
              </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                {mediaTypeIcon[log.mediaType]}
                {mediaTypeLabel[log.mediaType] ?? log.mediaType}
              </span>

              <span>
                {statusTypeLabel[log.status] ?? log.status}
              </span>

              {log.rating && (
                <span className="flex items-center gap-1">
                  ⭐ {log.rating}/5
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
