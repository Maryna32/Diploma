import { createClient } from "@/lib/supabase/server";

export default async function ReportsPage() {
  const supabase = await createClient();

  const { data: reports, error } = await supabase.from("Report").select(`
      id,
      reason,
      status,
      createdAt,
      reporter:User!Report_reporterId_fkey(username),
      reportedUser:User!Report_reportedUserId_fkey(username)
    `);

  if (error) {
    return <div>Помилка: {error.message}</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Скарги</h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="p-3">Хто поскаржився</th>
            <th className="p-3">На кого</th>
            <th className="p-3">Причина</th>
            <th className="p-3">Дата</th>
            <th className="p-3">Дії</th>
          </tr>
        </thead>

        <tbody>
          {reports?.map((r) => (
            <tr key={r.id}>
              <td className="p-3">{r.reporter?.[0]?.username}</td>
              <td className="p-3">{r.reportedUser?.[0]?.username}</td>
              <td className="p-3">{r.reason}</td>
              <td className="p-3">{r.createdAt}</td>
              <td className="p-3">
                <button className="text-red-500">Заблокувати</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
