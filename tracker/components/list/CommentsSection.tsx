"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

type CommentUser = {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
};

type Comment = {
  id: number;
  content: string;
  createdAt: string;
  user: CommentUser;
};

interface Props {
  logEntryId: number;
  initialComments: Comment[];
  currentUserId?: string;
}

export function CommentsSection({ logEntryId, initialComments, currentUserId }: Props) {
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!content.trim()) return;
    setLoading(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logEntryId, content }),
    });
    if (res.ok) {
      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]);
      setContent("");
    }
    setLoading(false);
  }

  return (
    <div className="border rounded-xl p-6 space-y-5">
      <h2 className="font-semibold text-sm">Коментарі ({comments.length})</h2>

      {comments.length === 0 && (
        <p className="text-sm text-muted-foreground">Поки що коментарів немає.</p>
      )}

      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <Link href={`/profile/${c.user.id}`}>
              <Avatar className="w-7 h-7 shrink-0">
                <AvatarImage src={c.user.avatarUrl || undefined} />
                <AvatarFallback className="text-xs">
                  {c.user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="space-y-0.5">
              <Link
                href={`/profile/${c.user.id}`}
                className="text-xs font-medium hover:underline"
              >
                @{c.user.username}
              </Link>
              <p className="text-sm leading-relaxed">{c.content}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(c.createdAt).toLocaleDateString("uk-UA", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {currentUserId && (
        <div className="space-y-2 pt-2 border-t">
          <Textarea
            placeholder="Написати коментар..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
            className="resize-none text-sm"
          />
          <Button size="sm" onClick={handleSubmit} disabled={loading || !content.trim()}>
            {loading ? "Надсилання..." : "Надіслати"}
          </Button>
        </div>
      )}
    </div>
  );
}