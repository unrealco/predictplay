"use client";
import Link from "next/link";

export default function MarketCard({ market }: { market: any }) {
  const { id, title, description, closesAt, options } = market;

  const formattedDate = new Date(closesAt).toLocaleString();

  return (
    <div className="border rounded-2xl p-4 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        <span className="text-xs text-gray-500">
          Closes: {formattedDate}
        </span>
      </div>
      <p className="text-sm opacity-70 mb-3">{description}</p>

      <div className="flex gap-2 flex-wrap">
        {options.map((o: any) => (
          <div
            key={o.id}
            className="border rounded-xl px-3 py-1 text-sm bg-gray-50"
          >
            {o.label}
          </div>
        ))}
      </div>

      <div className="mt-3">
        <Link
          href={`/markets/${id}`}
          className="inline-block text-blue-600 hover:underline text-sm"
        >
          View & Vote →
        </Link>
      </div>
    </div>
  );
}
