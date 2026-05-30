"use client";

import { Bookmark } from "lucide-react";
import { useState } from "react";

interface Props {
  logId: number;
  initialSaved: boolean;
}

export default function SaveButton({
  logId,
  initialSaved,
}: Props) {
  const [saved, setSaved] = useState(initialSaved);

  async function toggleSave() {
    const res = await fetch(
      `/api/logs/${logId}/save`,
      {
        method: "PATCH",
      }
    );

    const data = await res.json();

    setSaved(data.saved);
  }

  return (
    <button
      onClick={toggleSave}
      className="flex items-center gap-2 text-sm"
    >
      <Bookmark
        className={`w-4 h-4 ${
          saved ? "fill-current" : ""
        }`}
      />

      {saved
        ? "Збережено"
        : "Зберегти"}
    </button>
  );
}