"use client";
import { useState } from "react";
import { toggleBan } from "@/app/api/admin/actions";

export default function BanCheckbox({
  userId,
  banned,
}: {
  userId: string;
  banned: boolean;
}) {
  const [checked, setChecked] = useState(banned);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.checked;
    setChecked(newValue);
    await toggleBan(userId, newValue);
  }

  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={handleChange}
      className="w-4 h-4"
    />
  );
}