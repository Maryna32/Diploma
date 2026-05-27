"use client";

import { useState } from "react";

const EMOJIS = ["❤️", "💔", "👍", "👎"];

type ReactionGroup = {
  emoji: string;
  count: number;
  reacted: boolean;
};

interface Props {
  logEntryId: number;
  currentUserId?: string;
  initialReactions: ReactionGroup[];
}

export function PostReactions({
  logEntryId,
  currentUserId,
  initialReactions,
}: Props) {
  const [reactions, setReactions] = useState(initialReactions);

  async function handleReaction(emoji: string) {
    if (!currentUserId) return;

    setReactions((prev) => {
      const existing = prev.find((r) => r.emoji === emoji);

      if (existing?.reacted) {
        return prev
          .map((r) =>
            r.emoji === emoji
              ? { ...r, count: r.count - 1, reacted: false }
              : r
          )
          .filter((r) => r.count > 0);
      }

      if (existing) {
        return prev.map((r) =>
          r.emoji === emoji
            ? { ...r, count: r.count + 1, reacted: true }
            : r
        );
      }

      return [...prev, { emoji, count: 1, reacted: true }];
    });

    await fetch("/api/reactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        logEntryId,
        emoji,
      }),
    });
  }

  const reactedEmojis = reactions
    .filter((r) => r.reacted)
    .map((r) => r.emoji);

  const available = EMOJIS.filter((e) => !reactedEmojis.includes(e));

  return (
    <div className="flex flex-wrap items-center gap-2">
      {reactions.map((r) => (
        <button
          key={r.emoji}
          onClick={() => handleReaction(r.emoji)}
          className={`text-xs px-2 py-1 rounded-full border transition-colors ${
            r.reacted
              ? "bg-primary/10 border-primary/30"
              : "bg-muted hover:border-muted-foreground/30"
          }`}
        >
          {r.emoji} {r.count}
        </button>
      ))}

      {currentUserId && available.length > 0 && (
        <div className="flex gap-1">
          {available.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              className="text-base hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}