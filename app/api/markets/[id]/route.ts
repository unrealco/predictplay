import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_: NextRequest, { params }: { params: { id: string }}) {
  try {
    const market = await db.market.findUnique({ where: { id: params.id }, include: { options: true, votes: true, pledges: true } });
    if (!market) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ market });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
