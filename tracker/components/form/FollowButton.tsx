"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function FollowButton({
  targetUserId,
  initialFollowersCount,
  currentUserId,
}: {
  targetUserId: string;
  initialFollowersCount: number;
  currentUserId?: string;
}) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`/api/follow/check?targetUserId=${targetUserId}`);
        if (!res.ok) return;
        const data = await res.json();
        setIsFollowing(!!data.isFollowing);
      } catch (err) {
        console.error("Follow check error:", err);
      }
    };
    check();
  }, [targetUserId]);

  const toggle = async () => {
    setLoading(true);
    const newIsFollowing = !isFollowing;
    setIsFollowing(newIsFollowing);
    setFollowersCount((prev) => newIsFollowing ? prev + 1 : prev - 1);

    try {
      const res = await fetch("/api/follow/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId }),
      });

      if (!res.ok) {
        setIsFollowing(!newIsFollowing);
        setFollowersCount((prev) => newIsFollowing ? prev - 1 : prev + 1);
        console.error(await res.text());
        return;
      }

      const data = await res.json();
      setIsFollowing(data.isFollowing);
    } catch (err) {
      setIsFollowing(!newIsFollowing);
      setFollowersCount((prev) => newIsFollowing ? prev - 1 : prev + 1);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (currentUserId === targetUserId) return null;

  if (!currentUserId) {
    return (
      <Button size="sm" variant="outline" disabled>
        Підписатися
      </Button>
    );
  }

  return (
  <Button
    onClick={toggle}
    disabled={loading}
    variant={isFollowing ? "outline" : "default"}
    size="sm"
  >
    {isFollowing ? "Відписатися" : "Підписатися"}
  </Button>
  );
}