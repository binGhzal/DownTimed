import { z } from "zod";

export const mediaTypes = ["movie", "show", "book", "game", "manual"] as const;
export const userItemStatuses = ["backlog", "current", "done", "abandoned", "hidden"] as const;
export const progressTypes = ["none", "percent", "pages", "episodes", "custom"] as const;
export const syncProviders = [
  "trakt",
  "goodreads_csv",
  "tmdb",
  "openlibrary",
  "google_books",
  "rawg",
  "igdb",
  "letterboxd",
  "hardcover",
] as const;

export type MediaType = (typeof mediaTypes)[number];
export type UserItemStatus = (typeof userItemStatuses)[number];
export type ProgressType = (typeof progressTypes)[number];
export type SyncProvider = (typeof syncProviders)[number];

export const mediaTypeSchema = z.enum(mediaTypes);
export const userItemStatusSchema = z.enum(userItemStatuses);
export const progressTypeSchema = z.enum(progressTypes);
export const syncProviderSchema = z.enum(syncProviders);

export const statusChangeSchema = z.object({
  userItemId: z.uuid(),
  status: userItemStatusSchema,
});

export const ratingChangeSchema = z.object({
  userItemId: z.uuid(),
  ratingValue: z.number().int().min(0).max(100).nullable(),
  ratingScale: z.enum(["0-100", "5-star", "10-point"]).default("0-100"),
});

export const progressChangeSchema = z.object({
  userItemId: z.uuid(),
  progressType: progressTypeSchema,
  progressValue: z.number().nonnegative().nullable(),
  progressTotal: z.number().positive().nullable(),
});

export const createListSchema = z.object({
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(400).optional(),
});

export const createTagSchema = z.object({
  name: z.string().trim().min(1).max(40),
});

export const addManualItemSchema = z.object({
  title: z.string().trim().min(1).max(240),
  mediaType: mediaTypeSchema.default("manual"),
  sourceNote: z.string().trim().max(500).optional(),
  userDescription: z.string().trim().max(2000).optional(),
});

export type StatusChangeInput = z.infer<typeof statusChangeSchema>;
export type RatingChangeInput = z.infer<typeof ratingChangeSchema>;
export type ProgressChangeInput = z.infer<typeof progressChangeSchema>;
export type CreateListInput = z.infer<typeof createListSchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type AddManualItemInput = z.infer<typeof addManualItemSchema>;

export type LibraryItemSummary = {
  userItemId: string;
  itemId: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  mediaType: MediaType;
  releaseYear: number | null;
  posterUrl: string | null;
  status: UserItemStatus;
  progressType: ProgressType;
  progressValue: number | null;
  progressTotal: number | null;
  ratingValue: number | null;
  ratingScale: string | null;
  notes: string | null;
  priority: number | null;
  sourceNote: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  addedAt: string;
  tags: string[];
  lists: Array<{ id: string; name: string }>;
};

export type UserListSummary = {
  id: string;
  name: string;
  description: string | null;
  itemCount: number;
};

export type SyncConflictSummary = {
  id: string;
  provider: SyncProvider | string;
  fieldName: string;
  itemTitle: string | null;
  localValue: unknown;
  remoteValue: unknown;
  status: "open" | "resolved" | "ignored";
  createdAt: string;
};

export type SyncEventSummary = {
  id: string;
  provider: SyncProvider | string;
  direction: string;
  status: string;
  startedAt: string;
  finishedAt: string | null;
  itemsSeen: number;
  itemsCreated: number;
  itemsUpdated: number;
  itemsSkipped: number;
  itemsFailed: number;
};

export type LibrarySnapshot = {
  items: LibraryItemSummary[];
  lists: UserListSummary[];
  syncConflicts: SyncConflictSummary[];
  syncEvents: SyncEventSummary[];
};
