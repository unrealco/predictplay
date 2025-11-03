"use client";
import { useState } from "react";

export default function VotePanel({ marketId, options }: { marketId: string; options: { id: string; label: string }[] }) {
  const [amount, setAmount] = useState<number>(10);
  const [optionId, setOptionId] = useState<string>(options?.[0]?.id || "");
  const [userId, setUserId] = useState<string>("demo-user"); // no-auth: a demo id
  const [loading, setLoading] = useState<boolean>(false);

  const submit = async () => {
    if (!optionId) return alert("Please select an option.");
    try {
      setLoading(true);
      const res = await fetch(`/api/markets/${marketId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, optionId, userId })
      });
      const ct = res.headers.get("content-type") || "";
      const text = await res.text();
      if (!res.ok) {
        console.error("vote error", res.status, ct, text.slice(0,200));
        alert(text || `Error ${res.status}`);
        return;
      }
      alert("Vote submitted!");
    } catch (e:any) {
      console.error(e);
      alert(e.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 12 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {options.map(o => (
          <button key={o.id}
            style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #ccc", fontWeight: optionId===o.id?700:400 }}
            onClick={()=>setOptionId(o.id)}>{o.label}</button>
        ))}
      </div>
      <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
        <input type="number" value={amount} min={1} max={1000} onChange={e=>setAmount(Number(e.target.value)||0)} />
        <button disabled={loading} onClick={submit}>{loading? "Voting..." : "Vote"}</button>
      </div>
    </div>
  );
}
