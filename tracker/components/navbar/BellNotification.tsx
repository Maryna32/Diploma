"use client";

import { Bell, X } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Notification = {
  id: string;
  isRead: boolean;
  type: "FOLLOW" | "COMMENT";
};

export default function BellNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const res = await fetch("/api/notifications");
    if (!res.ok) return;
    setNotifications(await res.json());
  };

  const unread = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id: string) => {
    await fetch(`/api/notifications/${id}/read`, {
      method: "PATCH",
    });

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const deleteNotification = async (id: string) => {
    await fetch(`/api/notifications/${id}`, {
      method: "DELETE",
    });

    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type: string) => {
    if (type === "FOLLOW") return "👤";
    if (type === "COMMENT") return "💬";
    return "🔔";
  };

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((p) => !p)}
        className="relative"
      >
        <Bell className="w-5 h-5" />

        {unread > 0 && (
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-lg p-3 z-50">
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold">Сповіщення</p>

            <button
              onClick={() => router.push("/notifications")}
              className="text-xs text-blue-500"
            >
              Всі
            </button>
          </div>

          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">Немає сповіщень</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-center justify-between gap-2 p-2 rounded hover:bg-gray-100 ${
                    n.isRead ? "text-gray-500" : "font-medium"
                  }`}
                >
                  <div
                    onClick={() => markAsRead(n.id)}
                    className="flex gap-2 cursor-pointer flex-1"
                  >
                    <span>{getIcon(n.type)}</span>

                    <span className="text-sm">
                      {n.type === "FOLLOW" && "На вас підписались"}
                      {n.type === "COMMENT" && "Новий коментар"}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteNotification(n.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}