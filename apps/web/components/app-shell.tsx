import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Home,
  Inbox,
  Layers3,
  PlayCircle,
  RefreshCw,
  Settings,
  Shuffle,
} from "lucide-react";

const nav = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/app/backlog", label: "Backlog", icon: Inbox },
  { href: "/app/current", label: "Current", icon: PlayCircle },
  { href: "/app/done", label: "Done", icon: CheckCircle2 },
  { href: "/app/lists", label: "Lists", icon: Layers3 },
  { href: "/app/sync", label: "Sync", icon: RefreshCw },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-panel px-4 py-5 lg:block">
        <Link href="/app" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-charcoal text-panel">
            <BookOpen size={20} />
          </div>
          <div>
            <p className="font-semibold leading-none">Downtimed</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Library</p>
          </div>
        </Link>
        <nav className="mt-8 grid gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-paper hover:text-charcoal"
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-line bg-paper/90 px-5 py-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <Link className="focus-ring rounded-md border border-line px-3 py-2 text-sm lg:hidden" href="/app">
              Downtimed
            </Link>
            <div className="hidden flex-1 rounded-md border border-line bg-panel px-4 py-2 text-sm text-muted sm:block">
              Personal library for movies, shows, books, games, and manual items.
            </div>
            <Link className="focus-ring rounded-md bg-charcoal px-4 py-2 text-sm font-semibold text-panel" href="/app/backlog">
              <span className="inline-flex items-center gap-2">
                <Shuffle size={15} />
                Browse
              </span>
            </Link>
          </div>
        </header>
        <div className="px-5 py-7 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
