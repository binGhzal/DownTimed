import type { LibraryItemSummary, MediaType, UserItemStatus } from "@downtimed/types";

export type LibraryFilter = {
  status?: UserItemStatus;
  mediaType?: MediaType | "all";
  query?: string;
  tag?: string;
  listId?: string;
};

export type LibrarySort = "recently-added" | "title" | "release-year" | "priority";

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function filterLibraryItems(items: LibraryItemSummary[], filter: LibraryFilter): LibraryItemSummary[] {
  const query = filter.query?.trim().toLowerCase();
  return items.filter((item) => {
    if (filter.status && item.status !== filter.status) return false;
    if (filter.mediaType && filter.mediaType !== "all" && item.mediaType !== filter.mediaType) return false;
    if (filter.tag && !item.tags.includes(filter.tag)) return false;
    if (filter.listId && !item.lists.some((list) => list.id === filter.listId)) return false;
    if (!query) return true;
    return [item.title, item.subtitle, item.description, item.sourceNote]
      .filter((part): part is string => Boolean(part))
      .some((part) => part.toLowerCase().includes(query));
  });
}

export function sortLibraryItems(items: LibraryItemSummary[], sort: LibrarySort): LibraryItemSummary[] {
  return [...items].sort((left, right) => {
    if (sort === "title") return left.title.localeCompare(right.title);
    if (sort === "release-year") return (right.releaseYear ?? 0) - (left.releaseYear ?? 0);
    if (sort === "priority") return (right.priority ?? 0) - (left.priority ?? 0);
    return right.addedAt.localeCompare(left.addedAt);
  });
}

export function isAllowedStatusTransition(from: UserItemStatus, to: UserItemStatus): boolean {
  if (from === to) return true;
  const allowed: Record<UserItemStatus, UserItemStatus[]> = {
    backlog: ["current", "done", "abandoned", "hidden"],
    current: ["done", "abandoned", "backlog", "hidden"],
    done: ["backlog", "current", "hidden"],
    abandoned: ["backlog", "current", "hidden"],
    hidden: ["backlog", "current", "done", "abandoned"],
  };
  return allowed[from].includes(to);
}

export function toCsv(rows: Array<Record<string, string | number | null | undefined>>): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0] ?? {});
  const escape = (value: string | number | null | undefined): string => {
    const normalized = value == null ? "" : String(value);
    return /[",\n\r]/.test(normalized) ? `"${normalized.replace(/"/g, '""')}"` : normalized;
  };
  return [
    headers.map(escape).join(","),
    ...rows.map((row) => headers.map((header) => escape(row[header])).join(",")),
  ].join("\n");
}

export function toLibraryExportRows(items: LibraryItemSummary[]): Array<Record<string, string | number | null>> {
  return items.map((item) => ({
    title: item.title,
    media_type: item.mediaType,
    status: item.status,
    release_year: item.releaseYear,
    rating_value: item.ratingValue,
    tags: item.tags.join("; "),
    lists: item.lists.map((list) => list.name).join("; "),
    added_at: item.addedAt,
    started_at: item.startedAt,
    finished_at: item.finishedAt,
    notes: item.notes,
  }));
}
