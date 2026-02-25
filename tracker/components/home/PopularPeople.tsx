"use client";

interface User {
  id: string;
  username: string;
  avatarUrl?: string;
  _count: {
    followers: number;
  };
}

function PopularPeople({ users }: { users: User[] }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Популярні користувачі</h2>

      <div className="grid gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 p-4 border rounded-xl"
          >
            <img
              src={user.avatarUrl || "/avatar-placeholder.png"}
              className="w-12 h-12 rounded-full"
              alt={user.username}
            />

            <div>
              <p className="font-semibold">@{user.username}</p>
              <p className="text-sm text-gray-500">
                Підписників: {user._count.followers}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopularPeople;
