import PopularLogs from "./PopularLogs";
import PopularPeople from "./PopularPeople";
import SubscriptionRecords from "./SubscriptionRecords";
import { headers } from "next/headers";

async function getRecomendationData() {
  const headersList = headers();
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const host = headersList.get("host");
  const res = await fetch(`${protocol}://${host}/api/recomendations`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch recommendations");
  return res.json();
}

export default async function Home() {
  const data = await getRecomendationData();

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        <SubscriptionRecords />
        <div className="space-y-6">
          <PopularLogs logs={data.popularLogs} />
          <PopularPeople users={data.popularUsers} />
        </div>
      </div>
    </div>
  );
}