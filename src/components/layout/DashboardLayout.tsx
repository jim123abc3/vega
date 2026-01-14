import { type ReactNode, useState } from "react";
import { useAuth } from "../../features/auth/authContext";
import { Link } from "react-router-dom";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const [theme, setTheme] = useState<"brandA" | "brandB">("brandA");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "brandA" ? "brandB" : "brandA"));
  };

  return (
    <div
      data-theme={theme}
      className="min-h-screen flex bg-(--color-bg) text-(--color-text)"
    >
      <aside className="w-64 shrink-0 bg-(--color-surface) border-r border-(--color-border) hidden md:flex flex-col">
        <div className="px-4 py-4 text-lg font-semibold text-(--color-primary)">
          Portfolio Dashboard
        </div>
        <nav className="flex-1 px-4 py-2 space-y-2">
          <Link
            to="/dashboard"
            className="block rounded px-3 py-2 text-sm hover:bg-(--color-surface-alt)"
          >
            Overview
          </Link>
        </nav>
        <button
          onClick={logout}
          className="m-4 rounded bg-(--color-surface-alt) hover:bg-(--color-border) px-3 py-2 text-sm cursor-pointer"
        >
          Logout
        </button>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-14 flex items-center justify-between px-4 border-b border-(--color-border) bg-(--color-surface)">
          <div className="md:hidden font-semibold text-(--color-primary)">
            Portfolio Dashboard
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={toggleTheme}
              className="rounded border border-(--color-border) px-3 py-1 text-xs bg-(--color-surface-alt) hover:bg-(--color-border) cursor-pointer"
            >
              Toggle Theme
            </button>
          </div>
        </header>
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
