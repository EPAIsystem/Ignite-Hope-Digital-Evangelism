import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getTasks, addTask, updateTask, deleteTask, TEAMS, TASK_STATUSES } from "../lib/store";

export default function TeamWorkspace() {
  const { profile } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [team, setTeam] = useState(profile?.team || TEAMS[0]);
  const [showForm, setShowForm] = useState(false);
  const [desc, setDesc] = useState("");
  const [assignee, setAssignee] = useState("");

  useEffect(() => { refresh(); }, []);
  function refresh() { getTasks().then(setTasks); }

  async function handleAdd(e) {
    e.preventDefault();
    await addTask({ team, description: desc, assignee });
    setDesc(""); setAssignee("");
    setShowForm(false);
    refresh();
  }

  const visible = tasks.filter((t) => t.team === team);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h2 className="font-display text-2xl text-flame-950 dark:text-white">Team Workspaces</h2>
      <p className="mt-1 text-sm text-ink-soft dark:text-flame-200">One shared board per Directorate team, per Part IX of the Blueprint.</p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <select value={team} onChange={(e) => setTeam(e.target.value)}
          className="rounded-md border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 px-3 py-2 text-sm">
          {TEAMS.map((t) => <option key={t}>{t}</option>)}
        </select>
        <button onClick={() => setShowForm((s) => !s)} className="rounded-md bg-flame-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-flame-800">
          {showForm ? "Cancel" : "+ New task"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mt-4 space-y-3 rounded-xl border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 p-4">
          <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Task description" required
            className="w-full rounded-md border border-flame-100 dark:border-flame-800 bg-transparent px-3 py-2 text-sm" />
          <input value={assignee} onChange={(e) => setAssignee(e.target.value)} placeholder="Assignee (optional)"
            className="w-full rounded-md border border-flame-100 dark:border-flame-800 bg-transparent px-3 py-2 text-sm" />
          <button type="submit" className="rounded-md bg-flame-700 px-4 py-2 text-sm font-medium text-white hover:bg-flame-800">Add task</button>
        </form>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {TASK_STATUSES.map((status) => (
          <div key={status} className="rounded-xl border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 p-3">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-soft dark:text-flame-300">{status}</p>
            <div className="space-y-2">
              {visible.filter((t) => t.status === status).map((t) => (
                <div key={t.id} className="rounded-lg bg-flame-50 dark:bg-flame-950/40 p-2.5">
                  <p className="text-sm text-ink dark:text-white">{t.description}</p>
                  {t.assignee && <p className="text-xs text-ink-soft dark:text-flame-300">{t.assignee}</p>}
                  <div className="mt-1.5 flex items-center gap-2">
                    <select value={t.status} onChange={(e) => updateTask(t.id, { status: e.target.value }).then(refresh)}
                      className="rounded border border-flame-100 dark:border-flame-800 bg-transparent px-1.5 py-0.5 text-xs">
                      {TASK_STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <button onClick={() => deleteTask(t.id).then(refresh)} className="text-xs text-red-600 hover:underline">×</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
