"use client";

import { toggleBan } from "@/app/api/admin/route";

export default function BanCheckbox({
  userId,
  banned,
}: {
  userId: string;
  banned: boolean;
}) {
  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    await toggleBan(userId, e.target.checked);
  }

  return (
    <input
      type="checkbox"
      defaultChecked={banned}
      onChange={handleChange}
      className="w-4 h-4"
    />
  );
}
