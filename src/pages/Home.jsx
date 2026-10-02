import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getContentItems, getInquiries, getTasks, getDocuments } from "../lib/store";
import IgniteMark from "../components/IgniteMark";

export default function Home() {
  const { profile } = useAuth();
  const role = profile?.role || "public";
  const [stats, setStats] = useState({ content: 0, inquiries: 0, tasks: 0, docs: 0 });

  useEffect(() => {
    Promise.all([getContentItems(), getInquiries(), getTasks(), getDocuments()]).then(
      ([content, inquiries, tasks, docs]) =>
        setStats({ content: content.length, inquiries: inquiries.length, tasks: tasks.length, docs: docs.length })
    );
  }, []);

  if (role === "public") {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12 text-center">
        <IgniteMark size={56} className="mx-auto" />
        <h1 className="font-display mt-3 text-3xl text-flame-950 dark:text-white">Ignite Hope</h1>
        <p className="text-sm text-ink-soft dark:text-flame-200">Digital Evangelism</p>
        <p className="mt-1.5 text-[11px] tracking-widest text-flame-700/70 dark:text-gold-500/70">VOLTA GHANA MISSION</p>
        <p className="mt-4 text-ink-soft dark:text-flame-200">
          Christ → Scripture → Transformation → Fellowship → Mission.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/request-study" className="rounded-md bg-flame-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-flame-800">
            Request a Bible Study
          </Link>
          <Link to="/give" className="rounded-md border border-flame-700 px-5 py-2.5 text-sm font-medium text-flame-700 dark:text-gold-500 dark:border-gold-500 hover:bg-flame-50 dark:hover:bg-flame-900">
            Give
          </Link>
        </div>
      </div>
    );
  }

  const cards = [
    { label: "Content in pipeline", value: stats.content, to: "/content" },
    { label: "Active Bible study inquiries", value: stats.inquiries, to: "/followup" },
    { label: "Open team tasks", value: stats.tasks, to: "/workspace" },
    { label: "Documents in library", value: stats.docs, to: "/documents" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h2 className="font-display text-2xl text-flame-950 dark:text-white">Welcome, {profile?.name || "there"}</h2>
      <p className="mt-1 text-sm text-ink-soft dark:text-flame-200">Here's where the ministry stands today.</p>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="rounded-xl border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 p-4 hover:border-flame-300">
            <p className="text-2xl font-bold text-flame-700 dark:text-gold-500">{c.value}</p>
            <p className="mt-1 text-xs text-ink-soft dark:text-flame-200">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
