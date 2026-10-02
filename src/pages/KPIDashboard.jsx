import { useEffect, useState } from "react";
import { getKpiRecords, addKpiRecord, KPI_LEVELS } from "../lib/store";

export default function KPIDashboard() {
  const [records, setRecords] = useState([]);
  const [levelIdx, setLevelIdx] = useState(0);
  const [metric, setMetric] = useState(KPI_LEVELS[0].metrics[0]);
  const [value, setValue] = useState("");

  useEffect(() => { refresh(); }, []);
  function refresh() { getKpiRecords().then(setRecords); }

  async function handleAdd(e) {
    e.preventDefault();
    await addKpiRecord({ level: KPI_LEVELS[levelIdx].level, levelName: KPI_LEVELS[levelIdx].name, metric, value: Number(value) });
    setValue("");
    refresh();
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h2 className="font-display text-2xl text-flame-950 dark:text-white">Digital Evangelism KPI Dashboard</h2>
      <p className="mt-1 text-sm italic text-ink-soft dark:text-flame-200">
        Not "How many watched?" but "What happened after they watched?"
      </p>

      <form onSubmit={handleAdd} className="mt-5 flex flex-col gap-3 rounded-xl border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 p-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="text-xs text-ink-soft dark:text-flame-300">Level</label>
          <select value={levelIdx} onChange={(e) => { setLevelIdx(Number(e.target.value)); setMetric(KPI_LEVELS[Number(e.target.value)].metrics[0]); }}
            className="w-full rounded-md border border-flame-100 dark:border-flame-800 bg-transparent px-3 py-2 text-sm">
            {KPI_LEVELS.map((l, i) => <option key={l.level} value={i}>{l.level}. {l.name}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-xs text-ink-soft dark:text-flame-300">Metric</label>
          <select value={metric} onChange={(e) => setMetric(e.target.value)}
            className="w-full rounded-md border border-flame-100 dark:border-flame-800 bg-transparent px-3 py-2 text-sm">
            {KPI_LEVELS[levelIdx].metrics.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div className="w-28">
          <label className="text-xs text-ink-soft dark:text-flame-300">Value</label>
          <input type="number" value={value} onChange={(e) => setValue(e.target.value)} required
            className="w-full rounded-md border border-flame-100 dark:border-flame-800 bg-transparent px-3 py-2 text-sm" />
        </div>
        <button type="submit" className="rounded-md bg-flame-700 px-4 py-2 text-sm font-medium text-white hover:bg-flame-800">Record</button>
      </form>

      <div className="mt-6 space-y-5">
        {KPI_LEVELS.map((l) => {
          const entries = records.filter((r) => r.level === l.level);
          return (
            <div key={l.level} className="rounded-xl border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 p-4">
              <p className="font-display text-lg text-flame-950 dark:text-white">{l.level}. {l.name}</p>
              {entries.length === 0 ? (
                <p className="mt-2 text-xs text-ink-soft dark:text-flame-300">No records yet.</p>
              ) : (
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {entries.slice(-8).map((r) => (
                    <div key={r.id} className="rounded-md bg-flame-50 dark:bg-flame-950/40 px-3 py-2">
                      <p className="text-lg font-bold text-flame-700 dark:text-gold-500">{r.value}</p>
                      <p className="text-xs text-ink-soft dark:text-flame-300">{r.metric}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
