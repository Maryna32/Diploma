"use client";

import { useEffect, useState } from "react";
import LogCard from "./LogCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { mediaTypeOptions } from "@/lib/translations";
import { LogEntry } from "@/lib/generated/prisma";

type LogView = Omit<LogEntry, "id" | "createdAt" | "updatedAt"> & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export default function MyLogList() {
  const router = useRouter();
  const [logs, setLogs] = useState<LogView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | LogEntry["mediaType"]>(
    "all",
  );

  const handleEdit = (id: string) => {
  router.push(`/edit-log/${id}`);
};

const handleDelete = async (id: string) => {
  const confirmed = confirm("Ви дійсно хочете видалити запис?");
  if (!confirmed) return;

  try {
    const response = await fetch(`/api/logs/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Не вдалося видалити запис");
    }

    setLogs((prev) => prev.filter((log) => log.id !== id));
  } catch (err) {
    alert("Помилка при видаленні запису");
  }
};

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/logs");

      if (!response.ok) {
        throw new Error("Не вдалося завантажити записи");
      }

      const data: LogEntry[] = await response.json();

      const formatted: LogView[] = data.map((log) => ({
        ...log,
        id: String(log.id),
        createdAt: new Date(log.createdAt).toISOString(),
        updatedAt: new Date(log.updatedAt).toISOString(),
      }));

      setLogs(formatted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка завантаження");
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs =
    activeTab === "all"
      ? logs
      : logs.filter((log) => log.mediaType === activeTab);

  if (loading) {
    return <p className="text-gray-500">Завантаження...</p>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchLogs}>Спробувати знову</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Мій журнал</h1>
          <Button onClick={() => router.push("/add-log")}>Додати запис</Button>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">У вас ще немає записів</p>
            <Button onClick={() => router.push("/add-log")}>
              Створити перший запис
            </Button>
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === "all"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                Всі ({logs.length})
              </button>
              {mediaTypeOptions.map((option) => {
                const count = logs.filter(
                  (log) => log.mediaType === option.value,
                ).length;
                if (count === 0) return null;
                return (
                  <button
                    key={option.value}
                    onClick={() => setActiveTab(option.value)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                      activeTab === option.value
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {option.label} ({count})
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLogs.map((log) => (
                <LogCard key={log.id} log={log} onEdit={handleEdit} onDelete={handleDelete}/>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
