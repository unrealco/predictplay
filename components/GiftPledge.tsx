"use client";
import { useState } from "react";

export default function GiftPledge({ marketId }: { marketId: string }) {
  const [note, setNote] = useState("");
  const [capAED, setCap] = useState<number | "">("");

  const submit = async () => {
    const res = await fetch(`/api/markets/${marketId}/gift`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note, capAED: capAED || undefined, userId: "demo-user" })
    });
    const txt = await res.text();
    if (!res.ok) return alert(txt);
    setNote(""); setCap("");
    alert("Pledge recorded.");
  };

  return (
    <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 12, marginTop: 12 }}>
      <h4>Pledge a friendly gift (optional)</h4>
      <input placeholder="e.g., Coffee for the winner" value={note} onChange={e=>setNote(e.target.value)} />
      <input type="number" placeholder="Cap (AED)" value={capAED as any} onChange={e=>setCap(Number(e.target.value)||"")} />
      <button onClick={submit}>Pledge</button>
      <p style={{ fontSize: 12, opacity: 0.7 }}>Note: Off-platform gesture. No payments processed here.</p>
    </div>
  );
}
