import Link from "next/link";

const features = [
  "Quick add for movies, shows, books, games, and manual items",
  "Backlog, current, done, abandoned, and hidden statuses",
  "Private lists and reusable tags",
  "Portable JSON and CSV exports",
  "Trakt and Goodreads integration boundaries",
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 content-center gap-12 px-6 py-12 lg:grid-cols-[1fr_420px]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Downtimed</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl">
            One calm place for what you want to watch, read, and play.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            A personal downtime library with quick capture, simple tracking, lists, tags, exports,
            and practical sync with the services users already use.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              className="focus-ring rounded-md bg-charcoal px-5 py-3 text-sm font-semibold text-panel"
              href="/app"
            >
              Open app
            </Link>
            <Link
              className="focus-ring rounded-md border border-line px-5 py-3 text-sm font-semibold"
              href="/app/sync"
            >
              Import or sync
            </Link>
          </div>
        </div>
        <div className="grid gap-3">
          {features.map((feature) => (
            <div key={feature} className="rounded-md border border-line bg-panel p-5 shadow-sm">
              <p className="text-sm font-medium text-charcoal">{feature}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
