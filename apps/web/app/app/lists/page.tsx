import Link from "next/link";

import { createList } from "@/app/app/actions";
import { SetupGate } from "@/components/setup-gate";
import { getLibrarySnapshot } from "@/lib/library";

export const dynamic = "force-dynamic";

export default async function ListsPage() {
  const result = await getLibrarySnapshot();
  if (result.kind === "database-not-configured") return <SetupGate />;

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Organize</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-charcoal">Lists</h1>
      <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-3">
          {result.snapshot.lists.map((list) => (
            <div key={list.id} className="rounded-md border border-line bg-panel p-5">
              <p className="text-lg font-semibold text-charcoal">{list.name}</p>
              <p className="mt-1 text-sm text-muted">{list.description ?? "No description"}</p>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-muted">
                {list.itemCount} item{list.itemCount === 1 ? "" : "s"}
              </p>
            </div>
          ))}
        </div>
        <form action={createList} className="rounded-md border border-line bg-panel p-5">
          <h2 className="text-xl font-semibold text-charcoal">Create list</h2>
          <label className="mt-5 block text-sm font-medium text-charcoal" htmlFor="name">
            Name
          </label>
          <input className="focus-ring mt-2 w-full rounded-md border border-line bg-paper px-3 py-2" id="name" name="name" required />
          <label className="mt-4 block text-sm font-medium text-charcoal" htmlFor="description">
            Description
          </label>
          <textarea
            className="focus-ring mt-2 min-h-24 w-full rounded-md border border-line bg-paper px-3 py-2"
            id="description"
            name="description"
          />
          <button className="focus-ring mt-4 rounded-md bg-charcoal px-4 py-2 text-sm font-semibold text-panel" type="submit">
            Create
          </button>
        </form>
      </div>
      <Link className="mt-6 inline-block text-sm font-medium text-amber" href="/app/backlog">
        Back to backlog
      </Link>
    </div>
  );
}
