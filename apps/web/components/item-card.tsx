import Link from "next/link";
import type { LibraryItemSummary } from "@downtimed/types";

import { StatusForm } from "./status-form";

const mediaLabels: Record<LibraryItemSummary["mediaType"], string> = {
  movie: "Movie",
  show: "Show",
  book: "Book",
  game: "Game",
  manual: "Item",
};

export function ItemCard({ item }: { item: LibraryItemSummary }) {
  return (
    <article className="rounded-md border border-line bg-panel p-4 shadow-sm">
      <Link href={`/app/item/${item.userItemId}`} className="block">
        <div className="flex aspect-[2/3] flex-col justify-between rounded bg-charcoal p-4 text-panel">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-70">
            {mediaLabels[item.mediaType]}
          </p>
          <h3 className="text-2xl font-semibold leading-none">{item.title}</h3>
          <p className="font-mono text-xs opacity-70">{item.releaseYear ?? "undated"}</p>
        </div>
        <div className="mt-4">
          <p className="font-semibold leading-tight text-charcoal">{item.title}</p>
          <p className="mt-1 text-sm text-muted">{item.status}</p>
        </div>
      </Link>
      <div className="mt-4 flex flex-wrap gap-2">
        {item.status !== "current" ? <StatusForm userItemId={item.userItemId} status="current" compact /> : null}
        {item.status !== "done" ? <StatusForm userItemId={item.userItemId} status="done" compact /> : null}
        {item.status !== "backlog" ? <StatusForm userItemId={item.userItemId} status="backlog" compact /> : null}
      </div>
    </article>
  );
}
