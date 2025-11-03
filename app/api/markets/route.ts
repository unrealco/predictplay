import { z } from "zod";

const createMarketSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
  category: z.string().optional(),
  closesAt: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        const parsed = new Date(val);
        if (!isNaN(parsed.getTime())) return parsed;
      }
      return val;
    },
    z.date()
  ),
  options: z.array(z.string().min(1)),
});
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAllowed } from "@/lib/moderation";

export async function GET() {
  try {
    const markets = await db.market.findMany({ orderBy: { createdAt: "desc" }, include: { options: true } });
    return NextResponse.json({ markets });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createMarketSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const { title, description, category, closesAt, options } = parsed.data;
    if (!isAllowed(title, description)) return NextResponse.json({ error: "Disallowed content" }, { status: 400 });

    const market = await db.market.create({
  data: {
    title: title || "Untitled",
    description: description || "",
    category: category ?? "General", // ✅ fallback if undefined
    closesAt: closesAt ? new Date(closesAt) : new Date(), // ✅ fallback for date
    options: { create: options.map((label: string) => ({ label })) },
  },
});

    return NextResponse.json({ market });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
