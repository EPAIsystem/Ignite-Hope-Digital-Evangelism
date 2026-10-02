import { useState } from "react";
import { submitInquiry } from "../lib/store";

export default function RequestBibleStudy() {
  const [form, setForm] = useState({ name: "", country: "", channel: "WhatsApp", topic: "", time: "", mode: "Individual", language: "" });
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  function update(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    await submitInquiry(form);
    setSubmitted(true);
    setBusy(false);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-md px-6 py-16 text-center">
        <h2 className="font-display text-2xl text-flame-950 dark:text-white">Thank you, {form.name.split(" ")[0]}.</h2>
        <p className="mt-3 text-sm text-ink-soft dark:text-flame-200">
          Your request has been received. A Bible Worker will reach out on {form.channel} soon.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <h2 className="font-display text-2xl text-flame-950 dark:text-white">Request a Personal Bible Study</h2>
      <p className="mt-1 text-sm text-ink-soft dark:text-flame-200">Tell us a little about you, and a real person will follow up personally.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Full name"
          className="w-full rounded-md border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 px-3 py-2 text-sm" />
        <input required value={form.country} onChange={(e) => update("country", e.target.value)} placeholder="Country"
          className="w-full rounded-md border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 px-3 py-2 text-sm" />
        <select value={form.channel} onChange={(e) => update("channel", e.target.value)}
          className="w-full rounded-md border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 px-3 py-2 text-sm">
          {["WhatsApp", "Telegram", "Email", "Phone"].map((c) => <option key={c}>{c}</option>)}
        </select>
        <input value={form.topic} onChange={(e) => update("topic", e.target.value)} placeholder="Topic of interest (optional)"
          className="w-full rounded-md border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 px-3 py-2 text-sm" />
        <input value={form.time} onChange={(e) => update("time", e.target.value)} placeholder="Preferred study time (optional)"
          className="w-full rounded-md border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 px-3 py-2 text-sm" />
        <select value={form.mode} onChange={(e) => update("mode", e.target.value)}
          className="w-full rounded-md border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 px-3 py-2 text-sm">
          <option>Individual</option><option>Group</option>
        </select>
        <input required value={form.language} onChange={(e) => update("language", e.target.value)} placeholder="Language"
          className="w-full rounded-md border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 px-3 py-2 text-sm" />
        <button type="submit" disabled={busy} className="w-full rounded-md bg-flame-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-flame-800 disabled:opacity-50">
          {busy ? "Submitting…" : "Submit request"}
        </button>
      </form>
    </div>
  );
}
