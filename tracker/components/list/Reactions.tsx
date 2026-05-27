"use client";

import { useState } from "react";

const DEFAULT_EMOJIS = ["❤️", "👍"];

export type ReactionGroup = {
  emoji: string;
  count: number;
  reacted: boolean;
};

interface Props {
  initialReactions: ReactionGroup[];
  currentUserId?: string;

  logEntryId?: number;
  commentId?: number;

  emojis?: string[];
}

export function Reactions({
  initialReactions,
  currentUserId,
  logEntryId,
  commentId,
  emojis = DEFAULT_EMOJIS,
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
        commentId,
        emoji,
      }),
    });
  }

  const reactedEmojis = reactions
    .filter((r) => r.reacted)
    .map((r) => r.emoji);

  const available = emojis.filter(
    (e) => !reactedEmojis.includes(e)
  );

  return (
    <div className="flex flex-wrap items-center gap-1">
      {reactions.map((r) => (
        <button
          key={r.emoji}
          onClick={() => handleReaction(r.emoji)}
          className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
            r.reacted
              ? "bg-primary/10 border-primary/30 text-foreground"
              : "bg-muted border-transparent text-muted-foreground hover:border-muted-foreground/30"
          }`}
        >
          {r.emoji} {r.count}
        </button>
      ))}

      {currentUserId && (
        <EmojiPicker
          onSelect={handleReaction}
          reactedEmojis={reactedEmojis}
          emojis={emojis}
        />
      )}
    </div>
  );
}

function EmojiPicker({
  onSelect,
  reactedEmojis,
  emojis,
}: {
  onSelect: (emoji: string) => void;
  reactedEmojis: string[];
  emojis: string[];
}) {
  const [open, setOpen] = useState(false);

  const available = emojis.filter(
    (e) => !reactedEmojis.includes(e)
  );

  if (available.length === 0) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-xs px-2 py-0.5 rounded-full border border-dashed border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground/60 transition-colors"
      >
        +
      </button>

      {open && (
        <div className="absolute bottom-full mb-1 left-0 flex gap-1 bg-popover border rounded-lg p-1.5 shadow-md z-10">
          {available.map((e) => (
            <button
              type="button"
              key={e}
              onClick={() => {
                onSelect(e);
                setOpen(false);
              }}
              className="text-base hover:scale-125 transition-transform"
            >
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}