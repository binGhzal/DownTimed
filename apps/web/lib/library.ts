import {
  DatabaseNotConfiguredError,
  getPrisma,
  type ListGetPayload,
  type SyncConflictGetPayload,
  type SyncEventGetPayload,
  type UserItemGetPayload,
} from "@downtimed/db";
import type {
  LibraryItemSummary,
  LibrarySnapshot,
  ProgressType,
  UserItemStatus,
} from "@downtimed/types";

import { getCurrentUserId } from "./current-user";

export type LibraryLoadResult =
  | { kind: "ready"; snapshot: LibrarySnapshot }
  | { kind: "database-not-configured" };

type Decimalish = { toNumber: () => number };

function decimalToNumber(value: Decimalish | number | null): number | null {
  if (value == null) return null;
  return typeof value === "number" ? value : value.toNumber();
}

function dateToIso(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

type UserItemWithRelations = UserItemGetPayload<{
  include: {
    item: true;
    userItemTags: { include: { tag: true } };
    listItems: { include: { list: true } };
  };
}>;

type ListWithItems = ListGetPayload<{ include: { listItems: true } }>;
type SyncConflictWithItem = SyncConflictGetPayload<{ include: { item: true } }>;
type SyncEventRow = SyncEventGetPayload<true>;

function toItemSummary(row: UserItemWithRelations): LibraryItemSummary {
  return {
    userItemId: row.id,
    itemId: row.item.id,
    title: row.item.title,
    subtitle: row.item.subtitle,
    description: row.item.description,
    mediaType: row.item.mediaType,
    releaseYear: row.item.releaseYear,
    posterUrl: row.item.posterUrl,
    status: row.status as UserItemStatus,
    progressType: row.progressType as ProgressType,
    progressValue: decimalToNumber(row.progressValue),
    progressTotal: decimalToNumber(row.progressTotal),
    ratingValue: row.ratingValue,
    ratingScale: row.ratingScale,
    notes: row.notes,
    priority: row.priority,
    sourceNote: row.sourceNote,
    startedAt: dateToIso(row.startedAt),
    finishedAt: dateToIso(row.finishedAt),
    addedAt: row.createdAt.toISOString(),
    tags: row.userItemTags.map((join: { tag: { name: string } }) => join.tag.name),
    lists: row.listItems.map((join: { list: { id: string; name: string } }) => ({
      id: join.list.id,
      name: join.list.name,
    })),
  };
}

async function fetchUserItems(userId: string): Promise<UserItemWithRelations[]> {
  const prisma = getPrisma();
  const rows = await prisma.userItem.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    include: {
      item: true,
      userItemTags: { include: { tag: true } },
      listItems: { include: { list: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return rows as UserItemWithRelations[];
}

export async function getLibrarySnapshot(): Promise<LibraryLoadResult> {
  try {
    const userId = getCurrentUserId();
    const prisma = getPrisma();
    const [userItems, lists, syncConflicts, syncEvents]: [
      UserItemWithRelations[],
      ListWithItems[],
      SyncConflictWithItem[],
      SyncEventRow[],
    ] = await Promise.all([
      fetchUserItems(userId),
      prisma.list.findMany({
        where: { userId, deletedAt: null },
        include: { listItems: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      }) as Promise<ListWithItems[]>,
      prisma.syncConflict.findMany({
        where: { userId, status: "open" },
        include: { item: true },
        orderBy: { createdAt: "desc" },
        take: 20,
      }) as Promise<SyncConflictWithItem[]>,
      prisma.syncEvent.findMany({
        where: { userId },
        orderBy: { startedAt: "desc" },
        take: 20,
      }) as Promise<SyncEventRow[]>,
    ]);

    return {
      kind: "ready",
      snapshot: {
        items: userItems.map(toItemSummary),
        lists: lists.map((list) => ({
          id: list.id,
          name: list.name,
          description: list.description,
          itemCount: list.listItems.length,
        })),
        syncConflicts: syncConflicts.map((conflict) => ({
          id: conflict.id,
          provider: conflict.provider,
          fieldName: conflict.fieldName,
          itemTitle: conflict.item?.title ?? null,
          localValue: conflict.localValue,
          remoteValue: conflict.remoteValue,
          status: conflict.status,
          createdAt: conflict.createdAt.toISOString(),
        })),
        syncEvents: syncEvents.map((event) => ({
          id: event.id,
          provider: event.provider,
          direction: event.direction,
          status: event.status,
          startedAt: event.startedAt.toISOString(),
          finishedAt: dateToIso(event.finishedAt),
          itemsSeen: event.itemsSeen,
          itemsCreated: event.itemsCreated,
          itemsUpdated: event.itemsUpdated,
          itemsSkipped: event.itemsSkipped,
          itemsFailed: event.itemsFailed,
        })),
      },
    };
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) {
      return { kind: "database-not-configured" };
    }
    throw error;
  }
}
