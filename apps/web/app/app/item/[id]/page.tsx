import Link from "next/link";
import { notFound } from "next/navigation";

import { setRating } from "@/app/app/actions";
import { StatusForm } from "@/components/status-form";
import { SetupGate } from "@/components/setup-gate";
import { getLibrarySnapshot } from "@/lib/library";

export const dynamic = "force-dynamic";

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getLibrarySnapshot();
  if (result.kind === "database-not-configured") return <SetupGate />;
  const item = result.snapshot.items.find((candidate) => candidate.userItemId === id);
  if (!item) notFound();

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <div className="rounded-md bg-charcoal p-5 text-panel">
        <p className="font-mono text-xs uppercase tracking-[0.18em] opacity-70">{item.mediaType}</p>
        <h1 className="mt-16 text-4xl font-semibold leading-none">{item.title}</h1>
        <p className="mt-4 font-mono text-sm opacity-70">{item.releaseYear ?? "undated"}</p>
      </div>
      <div>
        <Link className="text-sm font-medium text-amber" href="/app/backlog">
          Back to library
        </Link>
        <h2 className="mt-4 text-3xl font-semibold text-charcoal">{item.title}</h2>
        <p className="mt-3 max-w-3xl leading-7 text-muted">{item.description ?? "No description saved yet."}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <StatusForm userItemId={item.userItemId} status="backlog" />
          <StatusForm userItemId={item.userItemId} status="current" />
          <StatusForm userItemId={item.userItemId} status="done" />
          <StatusForm userItemId={item.userItemId} status="abandoned" />
          <StatusForm userItemId={item.userItemId} status="hidden" />
        </div>
        <form action={setRating} className="mt-8 rounded-md border border-line bg-panel p-5">
          <input type="hidden" name="userItemId" value={item.userItemId} />
          <label className="block text-sm font-semibold text-charcoal" htmlFor="ratingValue">
            Rating (0-100)
          </label>
          <div className="mt-3 flex max-w-sm gap-3">
            <input
              className="focus-ring w-full rounded-md border border-line bg-paper px-3 py-2"
              defaultValue={item.ratingValue ?? ""}
              id="ratingValue"
              max={100}
              min={0}
              name="ratingValue"
              type="number"
            />
            <button className="focus-ring rounded-md bg-charcoal px-4 py-2 text-sm font-semibold text-panel" type="submit">
              Save
            </button>
          </div>
        </form>
        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-md border border-line bg-panel p-5">
            <h3 className="font-semibold text-charcoal">Tags</h3>
            <p className="mt-2 text-sm text-muted">{item.tags.length ? item.tags.join(", ") : "No tags"}</p>
          </div>
          <div className="rounded-md border border-line bg-panel p-5">
            <h3 className="font-semibold text-charcoal">Lists</h3>
            <p className="mt-2 text-sm text-muted">
              {item.lists.length ? item.lists.map((list) => list.name).join(", ") : "No lists"}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
