"use client";

import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";

type UserResult = {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
};

type LogResult = {
  id: number;
  title: string;
  mediaType: string;
  user: { username: string };
};

function NavSearch() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserResult[]>([]);
  const [logs, setLogs] = useState<LogResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  const isUserSearch = query.startsWith("@");
  const searchTerm = isUserSearch ? query.slice(1) : query;

  useEffect(() => {
    if (searchTerm.length < 2) {
      setUsers([]);
      setLogs([]);
      setOpen(false);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      const type = isUserSearch ? "users" : "logs";
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}&type=${type}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users ?? []);
        setLogs(data.logs ?? []);
        setOpen(true);
      }
      setLoading(false);
    }, 300);
  }, [query]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect() {
    setQuery("");
    setOpen(false);
  }

  const hasResults = users.length > 0 || logs.length > 0;

  return (
    <div className="flex-1 justify-center px-4 sm:px-6 hidden md:flex" ref={ref}>
      <div className="relative w-full max-w-lg">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Пошук записів або користувачів..."
          className="w-full pl-10 h-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => hasResults && setOpen(true)}
        />

        {open && (
          <div className="absolute top-full mt-1 w-full bg-popover border rounded-xl shadow-lg z-50 overflow-hidden">
            {loading && (
              <p className="text-xs text-muted-foreground px-4 py-3">Пошук...</p>
            )}

            {!loading && !hasResults && (
              <p className="text-xs text-muted-foreground px-4 py-3">Нічого не знайдено</p>
            )}

            {!loading && users.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground px-4 pt-3 pb-1 font-medium">Користувачі</p>
                {users.map((u) => (
                  <Link
                    key={u.id}
                    href={`/profile/${u.id}`}
                    onClick={handleSelect}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors"
                  >
                    <Avatar className="w-7 h-7 shrink-0">
                      <AvatarImage src={u.avatarUrl || undefined} />
                      <AvatarFallback className="text-xs">
                        {u.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">@{u.username}</p>
                      {u.name && <p className="text-xs text-muted-foreground truncate">{u.name}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!loading && logs.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground px-4 pt-3 pb-1 font-medium">Записи</p>
                {logs.map((l) => (
                  <Link
                    key={l.id}
                    href={`/logs/${l.id}`}
                    onClick={handleSelect}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors"
                  >
                    <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{l.title}</p>
                      <p className="text-xs text-muted-foreground">@{l.user.username}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default NavSearch;