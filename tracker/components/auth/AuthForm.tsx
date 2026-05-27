"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setMessage("");

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: name,
            },
          },
        });
        if (error) throw error;
        setMessage("Перевірте вашу пошту для підтвердження!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        await fetch("/api/auth/create-user", { method: "POST" });
        router.push("/");
        router.refresh();
      }
    } catch (error: any) {
        if (error.message?.toLowerCase().includes("email rate limit exceeded")) {
          setMessage(
            "Забагато спроб реєстрації. Спробуйте ще раз приблизно через годину."
          );
        } 
        
        else if (error.message?.toLowerCase().includes("invalid login credentials")) {
          setMessage(
            "Неправильний логін або пароль."
          );
        }
        else {
          setMessage(error.message || "Сталася помилка");
        }

        setLoading(false);
      } 
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{isSignUp ? "Реєстрація" : "Вхід"}</CardTitle>
        <CardDescription>
          {isSignUp
            ? "Створіть новий акаунт для продовження"
            : "Увійдіть у свій акаунт"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="name">Ім'я</Label>
              <Input
                id="name"
                type="text"
                placeholder="Ваше ім'я"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? "Вхід..."
              : isSignUp
              ? "Зареєструватися"
              : "Увійти"}
          </Button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-center text-muted-foreground">
            {message}
          </p>
        )}

        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage("");
              setName("");
            }}
            disabled={loading}
          >
            {isSignUp
              ? "Вже є акаунт? Увійти"
              : "Немає акаунту? Зареєструватися"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
