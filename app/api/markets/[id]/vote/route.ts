import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { voteSchema } from "@/lib/zod";
import { adjustCredits } from "@/lib/credits";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const parsed = voteSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const { amount, optionId, userId } = body as { amount: number; optionId: string; userId: string };

    const market = await db.market.findUnique({ where: { id: params.id }, include: { options: true } });
    if (!market) return NextResponse.json({ error: "Market not found" }, { status: 404 });
    if (market.resolution) return NextResponse.json({ error: "Already resolved" }, { status: 400 });
    if (new Date(market.closesAt) < new Date()) return NextResponse.json({ error: "Voting closed" }, { status: 400 });

    // ensure user exists (no-auth mode: create demo user silently)
    await db.user.upsert({ where: { id: userId }, update: {}, create: { id: userId, name: "Demo" } });

    const option = await db.option.findUnique({ where: { id: optionId } });
    if (!option || option.marketId !== params.id) return NextResponse.json({ error: "Invalid option" }, { status: 400 });

    // Simple credit check
    const u = await db.user.findUnique({ where: { id: userId }, select: { credits: true } });
    if ((u?.credits ?? 0) < amount) return NextResponse.json({ error: "Insufficient credits" }, { status: 400 });

    await db.$transaction([
      db.vote.create({ data: { userId, marketId: params.id, optionId, amount } }),
      db.user.update({ where: { id: userId }, data: { credits: { decrement: amount } } }),
      db.creditTx.create({ data: { userId, delta: -amount, reason: `Vote on ${market.title}` } }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
