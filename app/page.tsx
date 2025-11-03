import { db } from "@/lib/db";
import MarketCard from "@/components/MarketCard";

export default async function Home() {
  const markets = await db.market.findMany({
    orderBy: { createdAt: "desc" },
    include: { options: true },
  });

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Trending Markets</h1>

      {markets.length === 0 && (
        <p className="opacity-60">No markets yet. Be the first to create one!</p>
      )}

      <div className="flex flex-col gap-4">
        {markets.map((m) => (
          <MarketCard key={m.id} market={m} />
        ))}
      </div>
    </main>
  );
}
