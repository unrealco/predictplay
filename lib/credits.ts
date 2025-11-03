import { db } from "./db";

export async function adjustCredits(userId: string, delta: number, reason: string) {
  await db.$transaction([
    db.user.update({ where: { id: userId }, data: { credits: { increment: delta } } }),
    db.creditTx.create({ data: { userId, delta, reason } }),
  ]);
}

export async function canSpend(userId: string, amount: number) {
  const u = await db.user.findUnique({ where: { id: userId }, select: { credits: true } });
  return (u?.credits ?? 0) >= amount;
}
