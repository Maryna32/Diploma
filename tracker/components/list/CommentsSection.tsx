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
import { Flag, X } from "lucide-react";
import { Reactions, type ReactionGroup } from "./Reactions";

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


  async function handleDelete(commentId: number) {
    const res = await fetch(`/api/comments/${commentId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  }

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
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/profile/${c.user.id}`}
                    className="text-xs font-medium hover:underline"
                  >
                    @{c.user.username}
                  </Link>
                  <div className="flex items-center gap-1">
                    {currentUserId === c.user.id ? (
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        title="Видалити коментар"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    ) : currentUserId ? (
                      <button
                        onClick={() =>
                          setReportTarget({
                            commentId: c.id,
                            userId: c.user.id,
                          })
                        }
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        title="Поскаржитись"
                      >
                        <Flag className="w-3.5 h-3.5" />
                      </button>
                    ) : null}
                  </div>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words overflow-hidden">
                  {c.content}
                  </p>
                <Reactions
                    commentId={c.id}
                    currentUserId={currentUserId}
                    initialReactions={c.reactions}
                    emojis={["❤️", "👍", "👎", "😂", "😮", "🤷‍♀️"]}
                  />
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
              maxLength={500}
              placeholder="Написати коментар..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={2}
              className="resize-none text-sm min-h-[80px] max-h-[200px] overflow-y-auto"
            />
            <div className="text-xs text-muted-foreground text-right">
              {content.length}/500
            </div>
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