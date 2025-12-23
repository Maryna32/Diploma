"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import AvatarUpload from "./AvatarUpload";

type User = {
  id: string;
  email: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  bio: string | null;
};

type ProfileFormProps = {
  user: User;
  onClose?: () => void;
};

export default function ProfileForm({ user, onClose }: ProfileFormProps) {
  const [username, setUsername] = useState(user.username);
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    setUsername(user.username);
    setName(user.name || "");
    setBio(user.bio || "");
    setAvatarUrl(user.avatarUrl || "");
  }, [user]);

  const noChanges =
    username === user.username &&
    name === (user.name || "") &&
    bio === (user.bio || "") &&
    avatarUrl === (user.avatarUrl || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (noChanges) {
      setMessage("Змін немає — зберігати нічого");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          name,
          bio,
          avatarUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Помилка оновлення профілю");
      }

      setMessage("Профіль успішно оновлено!");

      router.refresh();

      if (onClose) onClose();
    } catch (error: any) {
      setMessage(error.message || "Сталася помилка");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setUsername(user.username);
    setName(user.name || "");
    setBio(user.bio || "");
    setAvatarUrl(user.avatarUrl || "");
    setMessage("");
    if (onClose) onClose();
  };

  const getInitials = () => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Редагувати профіль</CardTitle>
        <CardDescription>
          Оновіть свою інформацію та налаштування
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <AvatarUpload
            currentUrl={avatarUrl}
            onUpload={(url) => setAvatarUrl(url)}
            initials={getInitials()}
          />

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              required
              disabled={loading}
              pattern="[a-z0-9_]+"
              title="Тільки малі літери, цифри та підкреслення"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Ім'я</Label>
            <Input
              id="name"
              type="text"
              placeholder="Ваше ім'я"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Про себе</Label>
            <Textarea
              id="bio"
              placeholder="Розкажіть про себе..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={loading}
              rows={4}
              maxLength={500}
            />
            <p className="text-sm text-muted-foreground">
              {bio.length}/500 символів
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1"
              disabled={loading || noChanges}
            >
              {loading ? "Збереження..." : "Зберегти зміни"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-32"
              onClick={handleCancel}
              disabled={loading}
            >
              Скасувати
            </Button>
          </div>
        </form>

        {message && (
          <p className="mt-4 text-sm text-center text-muted-foreground">
            {message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
