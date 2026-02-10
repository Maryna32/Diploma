import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: users, error } = await supabase
    .from("User")
    .select("id, email, username, role");

  if (error) {
    return (
      <div className="p-8 text-red-500">
        Помилка завантаження даних: {error.message}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Панель адміністратора</h1>

      <div className="border rounded-lg overflow-hidden bg-card">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="p-4 border-b">Username</th>
              <th className="p-4 border-b">Email</th>
              <th className="p-4 border-b">Роль</th>
              <th className="p-4 border-b">Заблокувати обліковий запис</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u.id} className="hover:bg-muted/50 transition-colors">
                <td className="p-4 border-b">{u.username}</td>
                <td className="p-4 border-b">{u.email}</td>
                <td className="p-4 border-b text-sm font-mono uppercase">
                  {u.role}
                </td>
                <td className="p-4 border-b text-center">
                  <div className="flex justify-center items-center">
                    <input type="checkbox" className="w-4 h-4" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
