import { NavLink } from "react-router-dom";
import { X, Moon, Sun } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function navFor(role) {
  const common = [{ to: "/profile", label: "My Profile" }];
  if (role === "admin" || role === "director") {
    return [
      { to: "/", label: "Home" },
      { to: "/content", label: "Content Calendar" },
      { to: "/followup", label: "Follow-Up CRM" },
      { to: "/documents", label: "Document Library" },
      { to: "/workspace", label: "Team Workspaces" },
      { to: "/kpi", label: "KPI Dashboard" },
      { to: "/campaign", label: "City Campaign" },
      { to: "/donations", label: "Donations" },
      { to: "/admin", label: "Admin Console" },
      ...common,
    ];
  }
  if (role === "bible_worker" || role === "digital_missionary") {
    return [
      { to: "/", label: "Home" },
      { to: "/followup", label: "Follow-Up CRM" },
      { to: "/documents", label: "Document Library" },
      { to: "/workspace", label: "Team Workspace" },
      ...common,
    ];
  }
  if (role === "team") {
    return [
      { to: "/", label: "Home" },
      { to: "/content", label: "Content Calendar" },
      { to: "/documents", label: "Document Library" },
      { to: "/workspace", label: "Team Workspace" },
      { to: "/kpi", label: "KPI Dashboard" },
      ...common,
    ];
  }
  // public / donor / inquirer
  return [
    { to: "/", label: "Home" },
    { to: "/give", label: "Give" },
    { to: "/request-study", label: "Request a Bible Study" },
    { to: "/documents", label: "Document Library" },
    ...common,
  ];
}

export default function Sidebar({ open = false, onClose = () => {} }) {
  const { profile, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const role = profile?.role || "public";
  const links = navFor(role);

  return (
    <>
      {open && (
        <div onClick={onClose} className="fixed inset-0 z-30 bg-black/40 md:hidden" aria-hidden="true" />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-full w-64 max-w-[80vw] shrink-0 flex-col border-r border-flame-100 dark:border-flame-800 bg-flame-950 text-flame-50 transition-transform duration-200 ease-in-out md:static md:z-auto md:w-60 md:max-w-none md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between px-6 py-7">
          <div>
            <p className="text-xs tracking-wide text-flame-100/70">Ignite Hope</p>
            <h1 className="font-display mt-1 text-xl leading-snug">Digital Evangelism</h1>
          </div>
          <button onClick={onClose} aria-label="Close menu" className="shrink-0 rounded-md p-1 text-flame-100/70 hover:bg-flame-900 md:hidden">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive ? "bg-flame-800 text-white" : "text-flame-100/85 hover:bg-flame-900"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-flame-800 px-6 py-4">
          <button onClick={toggle} className="mb-3 flex items-center gap-2 text-xs text-flame-100/80 hover:text-white">
            {dark ? <Sun size={14} /> : <Moon size={14} />}
            {dark ? "Light mode" : "Dark mode"}
          </button>
          <p className="truncate text-sm text-flame-100/90">{profile?.name || "Guest"}</p>
          <p className="text-xs capitalize text-flame-100/60">{role.replace("_", " ")}</p>
          {profile && (
            <button onClick={logout} className="mt-3 text-xs text-gold-500 hover:text-gold-100">
              Sign out
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
