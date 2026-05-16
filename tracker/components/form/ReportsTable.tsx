"use client";

import { useState } from "react";
import { toggleBan } from "@/app/api/admin/actions";

type Report = {
  id: number;
  reason: string;
  status: string;
  createdAt: string;
  reporter: { username: string };
  reportedUser: { id: string; username: string };
  comment: { content: string; logEntryId: number } | null;
};

const statusLabel: Record<string, string> = {
  PENDING: "Очікує",
  REVIEWED: "Розглянуто",
  REJECTED: "Відхилено",
};

const statusColor: Record<string, string> = {
  PENDING: "text-yellow-600 dark:text-yellow-400",
  REVIEWED: "text-green-600 dark:text-green-400",
  REJECTED: "text-muted-foreground",
};

export function ReportsTable({ reports: initial }: { reports: Report[] }) {
  const [reports, setReports] = useState(initial);
  const [loading, setLoading] = useState<number | null>(null);

  async function handleBan(reportId: number, userId: string) {
    setLoading(reportId);
    await toggleBan(userId, true);
    await updateStatus(reportId, "REVIEWED");
    setLoading(null);
  }

  async function updateStatus(reportId: number, status: string) {
    await fetch(`/api/admin/reports/${reportId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status } : r))
    );
  }

  const pending = reports.filter((r) => r.status === "PENDING");
  const rest = reports.filter((r) => r.status !== "PENDING");

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">
          Нові скарги ({pending.length})
        </h2>
        <ReportList reports={pending} loading={loading} onBan={handleBan} onReject={(id) => updateStatus(id, "REJECTED")} />
      </section>

      {rest.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">
            Оброблені ({rest.length})
          </h2>
          <ReportList reports={rest} loading={loading} onBan={handleBan} onReject={(id) => updateStatus(id, "REJECTED")} />
        </section>
      )}
    </div>
  );
}

function ReportList({
  reports,
  loading,
  onBan,
  onReject,
}: {
  reports: Report[];
  loading: number | null;
  onBan: (reportId: number, userId: string) => void;
  onReject: (reportId: number) => void;
}) {
  if (reports.length === 0)
    return <p className="text-sm text-muted-foreground">Немає скарг.</p>;

  return (
    <div className="border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted text-left">
            <th className="p-3 font-medium">Від</th>
            <th className="p-3 font-medium">На кого</th>
            <th className="p-3 font-medium">Причина</th>
            <th className="p-3 font-medium">Коментар</th>
            <th className="p-3 font-medium">Дата</th>
            <th className="p-3 font-medium">Статус</th>
            <th className="p-3 font-medium">Дії</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id} className="border-t hover:bg-muted/30 transition-colors">
              <td className="p-3 text-muted-foreground">@{r.reporter.username}</td>
              <td className="p-3 font-medium">@{r.reportedUser.username}</td>
              <td className="p-3 max-w-[150px] truncate" title={r.reason}>{r.reason}</td>
              <td className="p-3 max-w-[150px] truncate text-muted-foreground">
                {r.comment ? (
                  <a
                    href={`/logs/${r.comment.logEntryId}`}
                    className="hover:underline hover:text-foreground transition-colors"
                    title={r.comment.content}
                  >
                    {r.comment.content}
                  </a>
                ) : "—"}
              </td>
              <td className="p-3 text-muted-foreground whitespace-nowrap">
                {new Date(r.createdAt).toLocaleDateString("uk-UA")}
              </td>
              <td className={`p-3 text-xs font-medium ${statusColor[r.status]}`}>
                {statusLabel[r.status]}
              </td>
              <td className="p-3">
                {r.status === "PENDING" ? (
                  <div className="flex gap-1.5 flex-wrap">
                    <button
                      onClick={() => onBan(r.id, r.reportedUser.id)}
                      disabled={loading === r.id}
                      className="text-xs px-2 py-1 bg-destructive text-destructive-foreground rounded hover:opacity-90 disabled:opacity-50 transition-opacity"
                    >
                      Заблокувати
                    </button>
                    <button
                      onClick={() => onReject(r.id)}
                      disabled={loading === r.id}
                      className="text-xs px-2 py-1 border rounded hover:bg-muted disabled:opacity-50 transition-colors"
                    >
                      Відхилити
                    </button>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-xs">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}