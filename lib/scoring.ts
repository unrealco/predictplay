import { db } from "./db";

export async function resolveMarket(marketId: string, resolution: "YES" | "NO" | "CANCELLED") {
  const market = await db.market.findUnique({ where: { id: marketId }, include: { votes: true, options: true } });
  if (!market) throw new Error("Market not found");
  if (market.resolution) throw new Error("Already resolved");

  const winnerOption = market.options.find(o => o.label.toUpperCase() === resolution);

  await db.$transaction(async (tx) => {
    await tx.market.update({ where: { id: marketId }, data: { resolution, resolvedAt: new Date() } });

    if (resolution === "CANCELLED") {
      for (const v of market.votes) {
        await tx.user.update({ where: { id: v.userId }, data: { credits: { increment: v.amount } } });
        await tx.creditTx.create({ data: { userId: v.userId, delta: v.amount, reason: `Refund: ${market.title}` } });
      }
      return;
    }

    if (!winnerOption) throw new Error("Winner option not found");

    const poolWinner = market.votes.filter(v => v.optionId === winnerOption.id);
    const totalWinner = poolWinner.reduce((a, b) => a + b.amount, 0);
    const totalAll = market.votes.reduce((a, b) => a + b.amount, 0);

    for (const v of poolWinner) {
      const share = v.amount / (totalWinner || 1);
      const payout = Math.floor(share * totalAll);
      await tx.user.update({ where: { id: v.userId }, data: { credits: { increment: payout } } });
      await tx.creditTx.create({ data: { userId: v.userId, delta: payout, reason: `Payout: ${market.title}` } });
    }
  });
}
