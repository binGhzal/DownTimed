import Link from "next/link";

import { SetupGate } from "@/components/setup-gate";
import { getLibrarySnapshot } from "@/lib/library";

export const dynamic = "force-dynamic";

export default async function AppHomePage() {
  const result = await getLibrarySnapshot();
  if (result.kind === "database-not-configured") return <SetupGate />;

  const { items, syncConflicts, syncEvents } = result.snapshot;
  const count = (status: string) => items.filter((item) => item.status === status).length;
  const recent = items.slice(0, 6);

  return (
    <div className="grid gap-7">
      <section>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Home</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-charcoal">What now?</h1>
        <p className="mt-3 max-w-2xl text-muted">
          {count("backlog")} in backlog, {count("current")} current, {count("done")} done.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Backlog", count("backlog"), "/app/backlog"],
          ["Current", count("current"), "/app/current"],
          ["Done", count("done"), "/app/done"],
          ["Open conflicts", syncConflicts.length, "/app/sync"],
        ].map(([label, value, href]) => (
          <Link key={label} href={String(href)} className="rounded-md border border-line bg-panel p-5">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">{label}</p>
            <p className="mt-3 text-3xl font-semibold text-charcoal">{value}</p>
          </Link>
        ))}
      </section>
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-charcoal">Recently added</h2>
          <Link className="text-sm font-medium text-amber" href="/app/backlog">
            View backlog
          </Link>
        </div>
        <div className="grid gap-3">
          {recent.map((item) => (
            <Link
              key={item.userItemId}
              href={`/app/item/${item.userItemId}`}
              className="flex items-center justify-between rounded-md border border-line bg-panel px-4 py-3"
            >
              <div>
                <p className="font-medium text-charcoal">{item.title}</p>
                <p className="text-sm text-muted">{item.mediaType} · {item.status}</p>
              </div>
              <span className="text-sm text-muted">{item.releaseYear ?? "undated"}</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="rounded-md border border-line bg-panel p-5">
        <h2 className="text-xl font-semibold text-charcoal">Sync status</h2>
        <p className="mt-2 text-sm text-muted">
          Last event: {syncEvents[0]?.provider ?? "none"} {syncEvents[0]?.status ?? ""}
        </p>
      </section>
    </div>
  );
}
