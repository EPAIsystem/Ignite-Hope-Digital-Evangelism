import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-cream dark:bg-flame-950">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900 px-4 py-3 md:hidden">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open menu" className="rounded-md p-1.5 text-flame-900 dark:text-flame-100 hover:bg-flame-100/50">
            <Menu size={22} />
          </button>
          <span className="font-display text-sm text-flame-950 dark:text-white">Ignite Hope Digital Evangelism</span>
        </header>
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
