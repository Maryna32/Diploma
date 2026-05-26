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
  const [errors, setErrors] = useState<{
      username?: string;
      name?: string;
      bio?: string;
  }>({});
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

    setMessage("");
    const newErrors: typeof errors = {};

    if (username.length < 3 || username.length > 24) {
      newErrors.username = "Username має бути від 3 до 24 символів";
    }

    if (!/^[a-z0-9_]+$/.test(username)) {
      newErrors.username =
        "Тільки малі літери, цифри та підкреслення";
    }

    if (name.length > 40) {
      newErrors.name = "Ім'я не може бути довшим за 40 символів";
    }

    if (bio.length > 500) {
      newErrors.bio = "Біо не може бути довшим за 500 символів";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
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
    setErrors({});
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
            onRemove={() => setAvatarUrl("")}
            initials={getInitials()}
          />

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm">Email</Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm" htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value.toLowerCase());

                if (errors.username) {
                  setErrors((prev) => ({
                    ...prev,
                    username: undefined,
                  }));
                }
              }}
              required
              disabled={loading}
              pattern="[a-z0-9_]+"
              title="Тільки малі літери, цифри та підкреслення"
              minLength={3}
              maxLength={24}
              className={errors.username ? "border-red-500" : ""}
            />
            {errors.username && (
              <p className="text-sm text-red-500">
                {errors.username}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              {username.length}/24 символів
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm">Ім'я</Label>
            <Input
              id="name"
              type="text"
              placeholder="Ваше ім'я"
              value={name}
              onChange={(e) => {
                setName(e.target.value);

                if (errors.name) {
                  setErrors((prev) => ({
                    ...prev,
                    name: undefined,
                  }));
                }
              }}
              disabled={loading}
              maxLength={40}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">
                {errors.name}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              {name.length}/40 символів
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm">Про себе</Label>
            <Textarea
              id="bio"
              placeholder="Розкажіть про себе..."
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);

                if (errors.bio) {
                  setErrors((prev) => ({
                    ...prev,
                    bio: undefined,
                  }));
                }
              }}
              disabled={loading}
              rows={4}
              maxLength={500}
              className={errors.bio ? "border-red-500" : ""}
            />
            {errors.bio && (
              <p className="text-sm text-red-500">
                {errors.bio}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              {bio.length}/500 символів
            </p>
          </div>
          {message && (
          <p
            className={`mt-4 text-sm ${
              message.includes("успішно")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
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
      </CardContent>
    </Card>
  );
}
