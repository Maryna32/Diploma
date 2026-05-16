import { prisma } from "@/lib/prisma";
import { ReportsTable } from "@/components/form/ReportsTable";

export default async function ReportsPage() {
  const reports = await prisma.report.findMany({
    include: {
      reporter: { select: { username: true } },
      reportedUser: { select: { id: true, username: true } },
      comment: { select: { content: true, logEntryId: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Скарги</h1>
      <ReportsTable
        reports={reports.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}