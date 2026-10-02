import { useEffect, useState } from "react";
import { getAllUsers, upsertUserProfile, TEAMS, getConnectLinks, updateConnectLinks, CONNECT_PLATFORMS } from "../lib/store";

const ROLES = ["public", "team", "bible_worker", "digital_missionary", "director", "admin"];

export default function AdminConsole() {
  const [users, setUsers] = useState([]);
  const [links, setLinks] = useState({});
  const [linksMsg, setLinksMsg] = useState("");

  useEffect(() => {
    refresh();
    getConnectLinks().then(setLinks);
  }, []);
  function refresh() { getAllUsers().then(setUsers); }

  async function setRole(uid, role) {
    await upsertUserProfile(uid, { role });
    refresh();
  }
  async function setTeam(uid, team) {
    await upsertUserProfile(uid, { team: team || null });
    refresh();
  }

  async function handleSaveLinks(e) {
    e.preventDefault();
    await updateConnectLinks(links);
    setLinksMsg("Saved — now visible on the public home page.");
    setTimeout(() => setLinksMsg(""), 3000);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h2 className="font-display text-2xl text-flame-950 dark:text-white">Admin Console</h2>
      <p className="mt-1 text-sm text-ink-soft dark:text-flame-200">Assign roles and team membership for everyone registered.</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-flame-50 dark:bg-flame-950/60 text-xs uppercase tracking-wide text-ink-soft dark:text-flame-300">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Team</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.uid} className="border-t border-flame-100 dark:border-flame-800">
                  <td className="px-4 py-3 font-medium text-ink dark:text-white">{u.name || "—"}</td>
                  <td className="px-4 py-3 text-ink-soft dark:text-flame-300">{u.email}</td>
                  <td className="px-4 py-3">
                    <select value={u.role || "public"} onChange={(e) => setRole(u.uid, e.target.value)}
                      className="rounded-md border border-flame-100 dark:border-flame-800 bg-transparent px-2 py-1 text-sm">
                      {ROLES.map((r) => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select value={u.team || ""} onChange={(e) => setTeam(u.uid, e.target.value)}
                      className="rounded-md border border-flame-100 dark:border-flame-800 bg-transparent px-2 py-1 text-sm">
                      <option value="">—</option>
                      {TEAMS.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td className="px-4 py-6 text-center text-ink-soft dark:text-flame-300" colSpan={4}>No accounts yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-display text-xl text-flame-950 dark:text-white">Connect Links</h3>
        <p className="mt-1 text-sm text-ink-soft dark:text-flame-200">
          Add a URL for any channel you want tappable on the public home page. Leave blank to hide it.
        </p>
        <form onSubmit={handleSaveLinks} className="mt-4 grid gap-3 rounded-xl border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 p-4 sm:grid-cols-2">
          {CONNECT_PLATFORMS.map((p) => (
            <div key={p.key}>
              <label className="text-xs text-ink-soft dark:text-flame-300">{p.label}</label>
              <input
                value={links[p.key] || ""}
                onChange={(e) => setLinks((l) => ({ ...l, [p.key]: e.target.value }))}
                placeholder={p.key === "email" ? "you@example.org" : "https://..."}
                className="w-full rounded-md border border-flame-100 dark:border-flame-800 bg-transparent px-3 py-2 text-sm"
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            {linksMsg && <p className="mb-2 text-xs text-flame-700 dark:text-gold-500">{linksMsg}</p>}
            <button type="submit" className="rounded-md bg-flame-700 px-4 py-2 text-sm font-medium text-white hover:bg-flame-800">
              Save links
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
