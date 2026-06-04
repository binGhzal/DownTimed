import type { LibraryItemSummary, UserItemStatus } from "@downtimed/types";
import { filterLibraryItems, sortLibraryItems } from "@downtimed/utils";

import { ItemCard } from "./item-card";

const emptyCopy: Record<UserItemStatus, string> = {
  backlog: "Nothing saved yet. Add a movie, book, show, or game.",
  current: "Nothing in progress. Start something from your backlog.",
  done: "Finished items will appear here.",
  abandoned: "Abandoned items will appear here.",
  hidden: "Hidden items will stay out of normal views.",
};

export function LibraryGrid({
  items,
  status,
}: {
  items: LibraryItemSummary[];
  status: UserItemStatus;
}) {
  const visible = sortLibraryItems(filterLibraryItems(items, { status }), "recently-added");
  if (visible.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-line bg-panel p-10 text-center text-muted">
        {emptyCopy[status]}
      </div>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {visible.map((item) => (
        <ItemCard key={item.userItemId} item={item} />
      ))}
    </div>
  );
}
