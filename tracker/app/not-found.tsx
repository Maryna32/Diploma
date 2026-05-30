import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold">404</h1>

      <p className="mt-4 text-muted-foreground">
        Сторінку не знайдено
      </p>

      <Button asChild className="mt-6">
        <Link href="/">На головну</Link>
      </Button>
    </div>
  );
}