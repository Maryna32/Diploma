"use client";

import { useEffect, useState } from "react";

interface BannedProps {
  bannedUntil: string;
  username: string;
}

export default function BannedMessage({ bannedUntil, username }: BannedProps) {
  const [localTime, setLocalTime] = useState("");

  useEffect(() => {
    const raw = bannedUntil.endsWith("Z") ? bannedUntil : bannedUntil + "Z";
    const dt = new Date(raw);

    setLocalTime(
      dt.toLocaleString("uk-UA", {
        timeZone: "Europe/Kyiv",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
  }, [bannedUntil]);

  return (
    <div className="mt-8 p-8 max-w-xl mx-auto text-center bg-red-50 border border-red-200 rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-red-600">
        Ваш акаунт тимчасово заблоковано
      </h1>
      <p className="mb-2">
        Привіт, <strong>{username}</strong>!
      </p>
      <p className="mb-2">
        Ваш акаунт заблоковано до <strong>{localTime}</strong>.
      </p>
      <p className="mb-4 text-sm text-gray-600">
        Якщо у вас є запитання щодо блокування, зверніться до адміністратора.
      </p>
      <a
        href="/"
        className="inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Повернутись на головну
      </a>
    </div>
  );
}
