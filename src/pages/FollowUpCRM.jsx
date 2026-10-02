import { useEffect, useState } from "react";
import { getInquiries, updateInquiry, logContactAttempt, FOLLOWUP_STATUSES } from "../lib/store";

export default function FollowUpCRM() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("All");
  const [noteDraft, setNoteDraft] = useState({});
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { refresh(); }, []);
  function refresh() { getInquiries().then(setItems); }

  const visible = filter === "All" ? items : items.filter((i) => i.status === filter);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h2 className="font-display text-2xl text-flame-950 dark:text-white">Follow-Up CRM</h2>
      <p className="mt-1 text-sm text-ink-soft dark:text-flame-200">
        Every Bible Study Request, tracked through all ten statuses — nothing sits un-advanced without a reason.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <button onClick={() => setFilter("All")} className={`rounded-full px-3 py-1 text-xs ${filter === "All" ? "bg-flame-900 text-white" : "border border-flame-100 dark:border-flame-800 text-ink-soft dark:text-flame-200"}`}>All</button>
        {FOLLOWUP_STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-xs ${filter === s ? "bg-flame-900 text-white" : "border border-flame-100 dark:border-flame-800 text-ink-soft dark:text-flame-200"}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {visible.map((item) => {
          const isOpen = expanded === item.id;
          return (
            <div key={item.id} className="rounded-xl border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink dark:text-white">{item.name}</p>
                  <p className="text-xs text-ink-soft dark:text-flame-300">
                    {item.country} · {item.channel}{item.topic ? ` · ${item.topic}` : ""}
                  </p>
                </div>
                <select value={item.status} onChange={(e) => updateInquiry(item.id, { status: e.target.value }).then(refresh)}
                  className="shrink-0 rounded-md border border-flame-100 dark:border-flame-800 bg-transparent px-2 py-1 text-xs">
                  {FOLLOWUP_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              <button onClick={() => setExpanded(isOpen ? null : item.id)} className="mt-2 text-xs font-medium text-flame-700 dark:text-gold-500 hover:underline">
                {isOpen ? "Hide contact log ▲" : `Contact log (${item.contactLog?.length || 0}) ▼`}
              </button>

              {isOpen && (
                <div className="mt-3 space-y-2 rounded-lg bg-flame-50 dark:bg-flame-950/40 p-3">
                  {(item.contactLog || []).map((log, idx) => (
                    <p key={idx} className="text-xs text-ink-soft dark:text-flame-300">
                      <span className="font-medium text-ink dark:text-flame-100">{new Date(log.date).toLocaleDateString()}:</span> {log.note}
                    </p>
                  ))}
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    await logContactAttempt(item.id, noteDraft[item.id] || "");
                    setNoteDraft((d) => ({ ...d, [item.id]: "" }));
                    refresh();
                  }} className="flex gap-2">
                    <input value={noteDraft[item.id] || ""} onChange={(e) => setNoteDraft((d) => ({ ...d, [item.id]: e.target.value }))}
                      placeholder="Log a contact attempt..." className="flex-1 rounded-md border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900 px-2 py-1 text-xs" />
                    <button type="submit" className="rounded-md bg-flame-700 px-3 py-1 text-xs text-white hover:bg-flame-800">Log</button>
                  </form>
                </div>
              )}
            </div>
          );
        })}
        {visible.length === 0 && (
          <p className="rounded-md border border-dashed border-flame-100 dark:border-flame-800 px-4 py-8 text-center text-sm text-ink-soft dark:text-flame-300">No inquiries here yet.</p>
        )}
      </div>
    </div>
  );
}
