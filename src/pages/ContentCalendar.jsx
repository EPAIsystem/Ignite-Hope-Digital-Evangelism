import { useEffect, useState } from "react";
import { getContentItems, addContentItem, updateContentItem, deleteContentItem, CONTENT_PILLARS, LADDER_LEVELS, CONTENT_STATUSES } from "../lib/store";

export default function ContentCalendar() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [topic, setTopic] = useState("");
  const [pillar, setPillar] = useState(CONTENT_PILLARS[0]);
  const [ladder, setLadder] = useState(LADDER_LEVELS[0]);
  const [owner, setOwner] = useState("");

  useEffect(() => { refresh(); }, []);
  function refresh() { getContentItems().then(setItems); }

  async function handleAdd(e) {
    e.preventDefault();
    await addContentItem({ topic, pillar, ladder, owner });
    setTopic(""); setOwner("");
    setShowForm(false);
    refresh();
  }

  const visible = filter === "All" ? items : items.filter((i) => i.status === filter);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-flame-950 dark:text-white">Content Calendar</h2>
        <button onClick={() => setShowForm((s) => !s)} className="rounded-md bg-flame-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-flame-800">
          {showForm ? "Cancel" : "+ New content"}
        </button>
      </div>
      <p className="mt-1 text-sm text-ink-soft dark:text-flame-200">Topic → Pillar → Ladder Level → Status, per the Content Creation SOP.</p>

      {showForm && (
        <form onSubmit={handleAdd} className="mt-4 space-y-3 rounded-xl border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 p-4">
          <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic / working title" required
            className="w-full rounded-md border border-flame-100 dark:border-flame-800 bg-transparent px-3 py-2 text-sm" />
          <div className="flex flex-col gap-3 sm:flex-row">
            <select value={pillar} onChange={(e) => setPillar(e.target.value)} className="flex-1 rounded-md border border-flame-100 dark:border-flame-800 bg-transparent px-3 py-2 text-sm">
              {CONTENT_PILLARS.map((p) => <option key={p}>{p}</option>)}
            </select>
            <select value={ladder} onChange={(e) => setLadder(e.target.value)} className="flex-1 rounded-md border border-flame-100 dark:border-flame-800 bg-transparent px-3 py-2 text-sm">
              {LADDER_LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          <input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="Owner (optional)"
            className="w-full rounded-md border border-flame-100 dark:border-flame-800 bg-transparent px-3 py-2 text-sm" />
          <button type="submit" className="rounded-md bg-flame-700 px-4 py-2 text-sm font-medium text-white hover:bg-flame-800">Add to calendar</button>
        </form>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {["All", ...CONTENT_STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-xs ${filter === s ? "bg-flame-900 text-white" : "border border-flame-100 dark:border-flame-800 text-ink-soft dark:text-flame-200"}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {visible.map((i) => (
          <div key={i.id} className="rounded-lg border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-ink dark:text-white">{i.topic}</p>
                <p className="text-xs text-ink-soft dark:text-flame-300">{i.pillar} · {i.ladder}{i.owner ? ` · ${i.owner}` : ""}</p>
              </div>
              <button onClick={() => deleteContentItem(i.id).then(refresh)} className="shrink-0 text-xs text-red-600 hover:underline">Remove</button>
            </div>
            <select value={i.status} onChange={(e) => updateContentItem(i.id, { status: e.target.value }).then(refresh)}
              className="mt-2 rounded-md border border-flame-100 dark:border-flame-800 bg-transparent px-2 py-1 text-xs">
              {CONTENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        ))}
        {visible.length === 0 && (
          <p className="rounded-md border border-dashed border-flame-100 dark:border-flame-800 px-4 py-8 text-center text-sm text-ink-soft dark:text-flame-300">Nothing here yet.</p>
        )}
      </div>
    </div>
  );
}
