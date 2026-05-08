"use client";

import Link from "next/link";

interface Log {
  id: number;
  title: string;
  user: {
    username: string;
  };
}

export default function PopularLogs({ logs }: { logs: Log[] }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Популярні записи</h2>

      {logs.map((log) => (
        <Link key={log.id} href={`/logs/${log.id}`}>
          <div className="border p-4 rounded-xl mb-2 hover:bg-muted transition cursor-pointer">
            <p className="font-semibold">{log.title}</p>
            <p className="text-sm text-gray-500">Автор: @{log.user.username}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
