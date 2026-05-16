"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Flag } from "lucide-react";

const EMOJIS = ["❤️", "👍", "👎", "😂", "😮", "🤷‍♀️"];

type ReactionGroup = { emoji: string; count: number; reacted: boolean };

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
  reactions: ReactionGroup[];
};

interface Props {
  logEntryId: number;
  initialComments: Comment[];
  currentUserId?: string;
}

export function CommentsSection({ logEntryId, initialComments, currentUserId }: Props) {
  const [comments, setComments] = useState(
    initialComments.map((c) => ({ ...c, reactions: c.reactions ?? [] }))
  );
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const [reportTarget, setReportTarget] = useState<{ commentId: number; userId: string } | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [reportSent, setReportSent] = useState(false);

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
      setComments((prev) => [
        ...prev,
        { ...newComment, createdAt: newComment.createdAt, reactions: [] },
      ]);
      setContent("");
    }
    setLoading(false);
  }

  async function handleReaction(commentId: number, emoji: string) {
    if (!currentUserId) return;
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c;
        const existing = c.reactions.find((r) => r.emoji === emoji);
        let reactions: ReactionGroup[];
        if (existing?.reacted) {
          reactions = c.reactions
            .map((r) => r.emoji === emoji ? { ...r, count: r.count - 1, reacted: false } : r)
            .filter((r) => r.count > 0);
        } else if (existing) {
          reactions = c.reactions.map((r) =>
            r.emoji === emoji ? { ...r, count: r.count + 1, reacted: true } : r
          );
        } else {
          reactions = [...c.reactions, { emoji, count: 1, reacted: true }];
        }
        return { ...c, reactions };
      })
    );
    await fetch("/api/reactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId, emoji }),
    });
  }

  async function handleReport() {
    if (!reportTarget || !reportReason.trim()) return;
    setReportLoading(true);
    await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reportedUserId: reportTarget.userId,
        commentId: reportTarget.commentId,
        reason: reportReason.trim(),
      }),
    });
    setReportLoading(false);
    setReportSent(true);
  }

  function closeReport() {
    setReportTarget(null);
    setReportReason("");
    setReportSent(false);
  }

  return (
    <>
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
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/profile/${c.user.id}`}
                    className="text-xs font-medium hover:underline"
                  >
                    @{c.user.username}
                  </Link>
                  {currentUserId && currentUserId !== c.user.id && (
                    <button
                      onClick={() => setReportTarget({ commentId: c.id, userId: c.user.id })}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      title="Поскаржитись"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-sm leading-relaxed">{c.content}</p>
                <div className="flex flex-wrap items-center gap-1">
                  {c.reactions.map((r) => (
                    <button
                      key={r.emoji}
                      onClick={() => handleReaction(c.id, r.emoji)}
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
                      onSelect={(emoji) => handleReaction(c.id, emoji)}
                      reactedEmojis={c.reactions.filter((r) => r.reacted).map((r) => r.emoji)}
                    />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(c.createdAt).toLocaleDateString("uk-UA", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {currentUserId ? (
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
        ) : (
          <p className="text-xs text-muted-foreground border-t pt-3">
            <Link href="/auth" className="underline hover:text-foreground">Увійдіть</Link>, щоб залишити коментар.
          </p>
        )}
      </div>

      <Dialog open={!!reportTarget} onOpenChange={(o) => !o && closeReport()}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Скарга на коментар</DialogTitle>
          </DialogHeader>
          {reportSent ? (
            <p className="text-sm text-muted-foreground py-2">
              Дякуємо! Скаргу отримано та буде розглянуто.
            </p>
          ) : (
            <>
              <Textarea
                placeholder="Опишіть причину скарги..."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                rows={3}
                className="resize-none text-sm"
              />
              <DialogFooter>
                <Button variant="ghost" size="sm" onClick={closeReport}>
                  Скасувати
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleReport}
                  disabled={reportLoading || !reportReason.trim()}
                >
                  {reportLoading ? "Надсилання..." : "Надіслати"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function EmojiPicker({
  onSelect,
  reactedEmojis,
}: {
  onSelect: (emoji: string) => void;
  reactedEmojis: string[];
}) {
  const [open, setOpen] = useState(false);
  const available = EMOJIS.filter((e) => !reactedEmojis.includes(e));
  if (available.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-xs px-2 py-0.5 rounded-full border border-dashed border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground/60 transition-colors"
      >
        +
      </button>
      {open && (
        <div className="absolute bottom-full mb-1 left-0 flex gap-1 bg-popover border rounded-lg p-1.5 shadow-md z-10">
          {available.map((e) => (
            <button
              key={e}
              onClick={() => { onSelect(e); setOpen(false); }}
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