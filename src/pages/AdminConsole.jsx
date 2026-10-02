import { useEffect, useState } from "react";
import { getAllUsers, upsertUserProfile, TEAMS } from "../lib/store";

const ROLES = ["public", "team", "bible_worker", "digital_missionary", "director", "admin"];

export default function AdminConsole() {
  const [users, setUsers] = useState([]);

  useEffect(() => { refresh(); }, []);
  function refresh() { getAllUsers().then(setUsers); }

  async function setRole(uid, role) {
    await upsertUserProfile(uid, { role });
    refresh();
  }
  async function setTeam(uid, team) {
    await upsertUserProfile(uid, { team: team || null });
    refresh();
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
    </div>
  );
}
