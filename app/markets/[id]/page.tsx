import { db } from "@/lib/db";
import VotePanel from "@/components/VotePanel";
import GiftPledge from "@/components/GiftPledge";

export default async function MarketDetail({ params }: { params: { id: string } }) {
  const m = await db.market.findUnique({ where: { id: params.id }, include: { options: true, pledges: true } });
  if (!m) return <div style={{ padding: 16 }}>Not found</div>;
  return (
    <main>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>{m.title}</h1>
      <p style={{ opacity: 0.8, marginTop: 8 }}>{m.description}</p>
      <div style={{ marginTop: 16 }}>
        <VotePanel marketId={m.id} options={m.options.map(o=>({ id: o.id, label: o.label }))} />
        <GiftPledge marketId={m.id} />
      </div>
      <div style={{ marginTop: 24 }}>
        <h3 style={{ fontWeight: 600 }}>Pledges</h3>
        <ul>
          {m.pledges.map(p => (<li key={p.id}>{p.note}{p.capAED?` (cap ${p.capAED} AED)`:''}</li>))}
        </ul>
      </div>
    </main>
  );
}
