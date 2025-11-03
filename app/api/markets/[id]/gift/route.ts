import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { giftSchema } from "@/lib/zod";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const parsed = giftSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const { note, capAED, userId } = body as { note: string; capAED?: number; userId: string };

    await db.user.upsert({ where: { id: userId }, update: {}, create: { id: userId, name: "Demo" } });

    const pledge = await db.giftPledge.create({ data: { userId, marketId: params.id, note, capAED } });
    return NextResponse.json({ pledge });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
