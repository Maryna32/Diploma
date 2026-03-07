import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Адмін панель</h1>

      <div className="flex gap-6">
        <Link
          href="/admin/users"
          className="p-6 border rounded-lg hover:bg-muted"
        >
          Користувачі
        </Link>

        <Link
          href="/admin/reports"
          className="p-6 border rounded-lg hover:bg-muted"
        >
          Скарги
        </Link>
      </div>
    </div>
  );
}
