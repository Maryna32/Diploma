import PopularLogs from "./PopularLogs";
import PopularPeople from "./PopularPeople";
import SubscriptionRecords from "./SubscriptionRecords";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { Button } from "../ui/button";
import Link from "next/link";

async function getRecomendationData() {
  const headersList = headers();

  const protocol =
    headersList.get("x-forwarded-proto") || "http";

  const host = headersList.get("host");

  const res = await fetch(
    `${protocol}://${host}/api/recomendations`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch recommendations");
  }

  return res.json();
}

export default async function Home() {
  const data = await getRecomendationData();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuth = !!user;

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">

      {!isAuth && (
        <div className="mb-8 rounded-2xl border bg-muted/20 px-6 py-5 text-center space-y-2 mx-auto">
          <h1 className="text-2xl font-bold tracking-tight">
            Відстежуй свої інтереси
          </h1>

          <p className="text-sm text-muted-foreground">
            Фільми, книги, серіали, курси та багато іншого
          </p>

          <div className="pt-2">
            <Link href="/auth">
              <Button size="sm">
                Почати
              </Button>
            </Link>
          </div>
        </div>
      )}

      <div
        className={
          isAuth
            ? "grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start"
            : "max-w-2xl mx-auto space-y-6"
        }
      >
        {isAuth && <SubscriptionRecords />}

        <div className="space-y-6">
          <PopularLogs logs={data.popularLogs} />
          <PopularPeople users={data.popularUsers} />
        </div>
      </div>
    </div>
  );
}