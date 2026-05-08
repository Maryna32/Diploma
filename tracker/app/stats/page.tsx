import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { mediaTypeOptions, statusTypeOptions } from "@/lib/translations";
import { BookMarked, TrendingUp, Clock, CheckCircle, Star, Calendar } from "lucide-react";

const mediaTypeLabel = Object.fromEntries(mediaTypeOptions.map((o) => [o.value, o.label]));
const statusTypeLabel = Object.fromEntries(statusTypeOptions.map((o) => [o.value, o.label]));

const mediaTypeColors: Record<string, string> = {
  BOOK: "bg-amber-500",
  MOVIE: "bg-blue-500",
  SERIES: "bg-purple-500",
  COURSE: "bg-green-500",
  PODCAST: "bg-rose-500",
  CUSTOM: "bg-slate-500",
};

const statusColors: Record<string, string> = {
  TO_CONSUME: "bg-slate-400",
  IN_PROGRESS: "bg-blue-400",
  COMPLETED: "bg-green-500",
  DROPPED: "bg-red-400",
};

export default async function StatsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const entries = await prisma.logEntry.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  const total = entries.length;
  const completed = entries.filter((e) => e.status === "COMPLETED").length;
  const inProgress = entries.filter((e) => e.status === "IN_PROGRESS").length;
  const dropped = entries.filter((e) => e.status === "DROPPED").length;
  const planned = entries.filter((e) => e.status === "TO_CONSUME").length;

  const rated = entries.filter((e) => e.rating !== null);
  const avgRating = rated.length > 0
    ? (rated.reduce((sum, e) => sum + (e.rating ?? 0), 0) / rated.length).toFixed(1)
    : null;

  const byType = mediaTypeOptions.map((opt) => ({
    label: opt.label,
    value: opt.value,
    count: entries.filter((e) => e.mediaType === opt.value).length,
  })).filter((t) => t.count > 0);

  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      label: d.toLocaleDateString("uk-UA", { month: "short" }),
      year: d.getFullYear(),
      month: d.getMonth(),
      count: 0,
    };
  });

  entries.forEach((e) => {
    const d = new Date(e.createdAt);
    const m = months.find((mo) => mo.year === d.getFullYear() && mo.month === d.getMonth());
    if (m) m.count++;
  });

  const maxMonthCount = Math.max(...months.map((m) => m.count), 1);

  const favoriteType = byType.sort((a, b) => b.count - a.count)[0];

  const uniqueDays = [...new Set(entries.map((e) =>
    new Date(e.createdAt).toDateString()
  ))].sort();

  let streak = 0;
  let currentStreak = 1;
  for (let i = uniqueDays.length - 1; i > 0; i--) {
    const diff = (new Date(uniqueDays[i]).getTime() - new Date(uniqueDays[i - 1]).getTime()) / 86400000;
    if (diff === 1) currentStreak++;
    else break;
  }
  streak = uniqueDays.length > 0 ? currentStreak : 0;

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4 space-y-4">
      <div className="mb-2">
        <h1 className="text-2xl font-bold">Моя статистика</h1>
      </div>

      {total === 0 ? (
        <div className="border rounded-xl flex flex-col items-center gap-3 py-20 text-muted-foreground">
          <BookMarked className="w-10 h-10 opacity-40" />
          <p className="text-sm">Ще немає записів для аналізу</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: BookMarked, label: "Всього", value: total, color: "text-foreground" },
              { icon: CheckCircle, label: "Завершено", value: completed, color: "text-green-500" },
              { icon: Clock, label: "В процесі", value: inProgress, color: "text-blue-500" },
              { icon: Star, label: "Середня оцінка", value: avgRating ?? "—", color: "text-amber-500" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="border rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <p className="text-2xl font-bold">{value}</p>
                </div>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          <div className="border rounded-xl p-5 space-y-3">
            <h2 className="font-semibold text-sm">Статуси</h2>
            <div className="space-y-2.5">
              {[
                { status: "COMPLETED", count: completed },
                { status: "IN_PROGRESS", count: inProgress },
                { status: "TO_CONSUME", count: planned },
                { status: "DROPPED", count: dropped },
              ].filter((s) => s.count > 0).map(({ status, count }) => (
                <div key={status}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{statusTypeLabel[status]}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${statusColors[status]}`}
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-xl p-5 space-y-3">
            <h2 className="font-semibold text-sm">Типи медіа</h2>
            <div className="space-y-2.5">
              {byType.map(({ label, value, count }) => (
                <div key={value}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${mediaTypeColors[value] ?? "bg-slate-500"}`}
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-semibold text-sm">Активність за останні 6 місяців</h2>
            </div>
            <div className="flex items-end gap-2 h-24">
              {months.map((m) => (
                <div key={`${m.year}-${m.month}`} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end justify-center" style={{ height: "72px" }}>
                    <div
                      className="w-full bg-primary/80 rounded-sm transition-all"
                      style={{ height: `${(m.count / maxMonthCount) * 72}px`, minHeight: m.count > 0 ? "4px" : "0" }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-semibold text-sm">Підсумки</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {favoriteType && (
                <div className="bg-muted/50 rounded-lg px-4 py-3">
                  <p className="text-xs text-muted-foreground">Улюблений тип</p>
                  <p className="font-semibold mt-0.5">{favoriteType.label} · {favoriteType.count} записів</p>
                </div>
              )}
              {streak > 1 && (
                <div className="bg-muted/50 rounded-lg px-4 py-3">
                  <p className="text-xs text-muted-foreground">Серія днів поспіль</p>
                  <p className="font-semibold mt-0.5">{streak} дні підряд</p>
                </div>
              )}
              {completed > 0 && (
                <div className="bg-muted/50 rounded-lg px-4 py-3">
                  <p className="text-xs text-muted-foreground">Відсоток завершених</p>
                  <p className="font-semibold mt-0.5">{Math.round((completed / total) * 100)}% завершено</p>
                </div>
              )}
              {dropped > 0 && (
                <div className="bg-muted/50 rounded-lg px-4 py-3">
                  <p className="text-xs text-muted-foreground">Покинуто</p>
                  <p className="font-semibold mt-0.5">{dropped} записів</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}