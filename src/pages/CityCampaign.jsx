import { useEffect, useState } from "react";
import { getCampaigns, addCampaign, updateCampaign } from "../lib/store";

const STAGES = ["Planning", "Digital Buildup", "Public Meetings", "Local Church Handoff", "Completed"];

export default function CityCampaign() {
  const [campaigns, setCampaigns] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Ghana");
  const [date, setDate] = useState("");

  useEffect(() => { refresh(); }, []);
  function refresh() { getCampaigns().then(setCampaigns); }

  async function handleAdd(e) {
    e.preventDefault();
    await addCampaign({ city, country, date });
    setCity(""); setDate("");
    setShowForm(false);
    refresh();
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-flame-950 dark:text-white">City Campaign</h2>
        <button onClick={() => setShowForm((s) => !s)} className="rounded-md bg-flame-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-flame-800">
          {showForm ? "Cancel" : "+ New campaign"}
        </button>
      </div>
      <p className="mt-1 text-sm text-ink-soft dark:text-flame-200">
        Ho first, then onward — per Part XIX of the Blueprint.
      </p>

      {showForm && (
        <form onSubmit={handleAdd} className="mt-4 space-y-3 rounded-xl border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 p-4">
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Host city (e.g. Ho)" required
            className="w-full rounded-md border border-flame-100 dark:border-flame-800 bg-transparent px-3 py-2 text-sm" />
          <div className="flex flex-col gap-3 sm:flex-row">
            <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" required
              className="flex-1 rounded-md border border-flame-100 dark:border-flame-800 bg-transparent px-3 py-2 text-sm" />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="flex-1 rounded-md border border-flame-100 dark:border-flame-800 bg-transparent px-3 py-2 text-sm" />
          </div>
          <button type="submit" className="rounded-md bg-flame-700 px-4 py-2 text-sm font-medium text-white hover:bg-flame-800">Add campaign</button>
        </form>
      )}

      <div className="mt-5 space-y-3">
        {campaigns.map((c) => (
          <div key={c.id} className="rounded-xl border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-lg text-ink dark:text-white">{c.city}, {c.country}</p>
                {c.date && <p className="text-xs text-ink-soft dark:text-flame-300">{new Date(c.date).toLocaleDateString()}</p>}
              </div>
              <select value={c.stage} onChange={(e) => updateCampaign(c.id, { stage: e.target.value }).then(refresh)}
                className="rounded-md border border-flame-100 dark:border-flame-800 bg-transparent px-2 py-1 text-xs">
                {STAGES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        ))}
        {campaigns.length === 0 && (
          <p className="rounded-md border border-dashed border-flame-100 dark:border-flame-800 px-4 py-8 text-center text-sm text-ink-soft dark:text-flame-300">
            No campaigns planned yet — Ho is the natural first entry.
          </p>
        )}
      </div>
    </div>
  );
}
