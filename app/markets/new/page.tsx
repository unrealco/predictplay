"use client";
import { useState } from "react";

export default function CreateMarket() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [closesAt, setClosesAt] = useState("");
  const [options, setOptions] = useState(["YES", "NO"]);

  const submit = async () => {
    try {
      const res = await fetch("/api/markets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category, closesAt, options })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ? JSON.stringify(data.error) : "Failed");
      window.location.href = `/markets/${data.market.id}`;
    } catch (e:any) { alert(e.message || "Error"); }
  };

  return (
    <main>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Create Market</h1>
      <div style={{ display: "grid", gap: 8, maxWidth: 640 }}>
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <input placeholder="Category" value={category} onChange={e=>setCategory(e.target.value)} />
        <input type="datetime-local" value={closesAt} onChange={e=>setClosesAt(e.target.value)} />
        <div>
          <label>Options (comma separated):</label>
          <input value={options.join(",")} onChange={e=>setOptions(e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} />
        </div>
        <button onClick={submit}>Create</button>
      </div>
    </main>
  );
}
