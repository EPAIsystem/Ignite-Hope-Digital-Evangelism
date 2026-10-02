import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getDocuments, addDocument, deleteDocument, DOC_CATEGORIES, seedStandardLibrary } from "../lib/store";

export default function DocumentLibrary() {
  const { profile } = useAuth();
  const canManage = ["admin", "director"].includes(profile?.role);
  const [docs, setDocs] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(DOC_CATEGORIES[0]);
  const [url, setUrl] = useState("");
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  useEffect(() => { refresh(); }, []);
  function refresh() { getDocuments().then(setDocs); }

  async function handleAdd(e) {
    e.preventDefault();
    await addDocument({ title, category, url });
    setTitle(""); setUrl("");
    setShowForm(false);
    refresh();
  }

  async function handleSeed() {
    setSeeding(true);
    const added = await seedStandardLibrary();
    setSeedMsg(added > 0 ? `Added ${added} document${added === 1 ? "" : "s"}.` : "Already up to date.");
    setSeeding(false);
    refresh();
  }

  const visible = filter === "All" ? docs : docs.filter((d) => d.category === filter);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-flame-950 dark:text-white">Document Library</h2>
        {canManage && (
          <button onClick={() => setShowForm((s) => !s)} className="rounded-md bg-flame-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-flame-800">
            {showForm ? "Cancel" : "+ Add document"}
          </button>
        )}
      </div>
      <p className="mt-1 text-sm text-ink-soft dark:text-flame-200">
        The Master Blueprint, all 20 implementation documents, and anything added since.
      </p>

      {canManage && docs.length === 0 && (
        <div className="mt-4 rounded-xl border border-dashed border-flame-300 dark:border-flame-800 bg-flame-50 dark:bg-flame-900/40 p-4">
          <p className="text-sm text-ink dark:text-flame-100">
            Library is empty. Load the Blueprint and all 20 implementation documents in one tap —
            each one deep-links to its exact page in the compiled PDF.
          </p>
          <button onClick={handleSeed} disabled={seeding}
            className="mt-2 rounded-md bg-flame-700 px-4 py-2 text-xs font-medium text-white hover:bg-flame-800 disabled:opacity-50">
            {seeding ? "Loading…" : "Load standard library (21 documents)"}
          </button>
          {seedMsg && <p className="mt-2 text-xs text-flame-700 dark:text-gold-500">{seedMsg}</p>}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAdd} className="mt-4 space-y-3 rounded-xl border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 p-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Document title" required
            className="w-full rounded-md border border-flame-100 dark:border-flame-800 bg-transparent px-3 py-2 text-sm" />
          <div className="flex flex-col gap-3 sm:flex-row">
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="rounded-md border border-flame-100 dark:border-flame-800 bg-transparent px-3 py-2 text-sm">
              {DOC_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Link to the file (Drive, site, etc.)" required
              className="flex-1 rounded-md border border-flame-100 dark:border-flame-800 bg-transparent px-3 py-2 text-sm" />
          </div>
          <button type="submit" className="rounded-md bg-flame-700 px-4 py-2 text-sm font-medium text-white hover:bg-flame-800">Save</button>
        </form>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {["All", ...DOC_CATEGORIES].map((c) => (
          <button key={c} onClick={() => setFilter(c)}
            className={`rounded-full px-3 py-1 text-xs ${filter === c ? "bg-flame-900 text-white" : "border border-flame-100 dark:border-flame-800 text-ink-soft dark:text-flame-200"}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {visible.map((d) => (
          <div key={d.id} className="flex items-center justify-between rounded-lg border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 px-4 py-3">
            <div>
              <a href={d.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-flame-800 dark:text-gold-500 hover:underline">{d.title}</a>
              <p className="text-xs text-ink-soft dark:text-flame-300">{d.category}</p>
            </div>
            {canManage && (
              <button onClick={() => deleteDocument(d.id).then(refresh)} className="text-xs text-red-600 hover:underline">Remove</button>
            )}
          </div>
        ))}
        {visible.length === 0 && (
          <p className="rounded-md border border-dashed border-flame-100 dark:border-flame-800 px-4 py-8 text-center text-sm text-ink-soft dark:text-flame-300">
            No documents yet{canManage ? " — add the Blueprint and implementation docs to get started." : "."}
          </p>
        )}
      </div>
    </div>
  );
}
