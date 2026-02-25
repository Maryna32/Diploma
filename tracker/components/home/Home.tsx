import PopularLogs from "./PopularLogs";
import PopularPeople from "./PopularPeople";
import SubscriptionRecords from "./SubscriptionRecords";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

async function getRecomendationData() {
  const headersList = headers();
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const host = headersList.get("host");

  const res = await fetch(`${protocol}://${host}/api/recomendations`, {
    cache: "no-store",
  });

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
  return (
    <div className="min-h-screen px-4 py-8">
      {user && <SubscriptionRecords />}
      <PopularLogs logs={data.popularLogs} />
      <PopularPeople users={data.popularUsers} />
    </div>
  );
}
