import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export default async function NotificationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Сповіщення</h1>

      {notifications.length === 0 ? (
        <p className="text-gray-500">Немає сповіщень</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 border rounded ${
                n.isRead ? "opacity-60" : "font-medium"
              }`}
            >
              {n.type === "FOLLOW" && "👤 На вас підписались"}
              {n.type === "COMMENT" && "💬 Новий коментар"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}