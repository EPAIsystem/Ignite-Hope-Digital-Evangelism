import { useState } from "react";
import { recordDonationIntent } from "../lib/store";

const PRESET_AMOUNTS = [20, 50, 100, 250, 500];

export default function Donations() {
  const [frequency, setFrequency] = useState("once");
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const finalAmount = customAmount ? Number(customAmount) : amount;

  async function handleSubmit(e) {
    e.preventDefault();
    await recordDonationIntent({ frequency, amount: finalAmount, currency: "GHS", name, email });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-md px-6 py-16 text-center">
        <h2 className="font-display text-2xl text-flame-950 dark:text-white">Thank you{name ? `, ${name.split(" ")[0]}` : ""}.</h2>
        <p className="mt-3 text-sm text-ink-soft dark:text-flame-200">
          Your {frequency === "monthly" ? "monthly" : "one-time"} gift of GHS {finalAmount} has been noted. Payment
          processing is being finalized — our team will be in touch to complete it securely.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <h2 className="font-display text-2xl text-flame-950 dark:text-white">Give to Ignite Hope</h2>
      <p className="mt-1 text-sm text-ink-soft dark:text-flame-200">
        Every gift carries the gospel one step further into the digital mission field.
      </p>

      <div className="mt-6 flex rounded-md border border-flame-100 dark:border-flame-800 overflow-hidden text-sm">
        <button onClick={() => setFrequency("once")} className={`flex-1 py-2.5 ${frequency === "once" ? "bg-flame-900 text-white" : "bg-white dark:bg-flame-900/40"}`}>One time</button>
        <button onClick={() => setFrequency("monthly")} className={`flex-1 py-2.5 ${frequency === "monthly" ? "bg-flame-900 text-white" : "bg-white dark:bg-flame-900/40"}`}>Monthly</button>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {PRESET_AMOUNTS.map((a) => (
          <button key={a} onClick={() => { setAmount(a); setCustomAmount(""); }}
            className={`rounded-md border px-2 py-2 text-sm font-medium ${amount === a && !customAmount ? "border-flame-700 bg-flame-50 dark:bg-flame-900 text-flame-700 dark:text-gold-500" : "border-flame-100 dark:border-flame-800 text-ink dark:text-flame-100"}`}>
            GHS {a}
          </button>
        ))}
      </div>
      <input type="number" value={customAmount} onChange={(e) => setCustomAmount(e.target.value)} placeholder="Or enter a custom amount (GHS)"
        className="mt-3 w-full rounded-md border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 px-3 py-2 text-sm" />

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name (optional)"
          className="w-full rounded-md border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 px-3 py-2 text-sm" />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (for your receipt)"
          className="w-full rounded-md border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 px-3 py-2 text-sm" />
        <button type="submit" className="w-full rounded-md bg-flame-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-flame-800">
          Give GHS {finalAmount}{frequency === "monthly" ? " / month" : ""}
        </button>
        <p className="text-center text-xs text-ink-soft dark:text-flame-300">
          Secure payment processing is being connected. Your gift intent is saved now — you won't be
          charged until that's live and confirmed with you.
        </p>
      </form>
    </div>
  );
}
