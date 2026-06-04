"use server";

import { revalidatePath } from "next/cache";
import {
  addManualItemSchema,
  createListSchema,
  ratingChangeSchema,
  statusChangeSchema,
} from "@downtimed/types";
import { isAllowedStatusTransition, slugify } from "@downtimed/utils";
import { getPrisma, Prisma } from "@downtimed/db";

import { getCurrentUserId } from "@/lib/current-user";

function revalidateLibrary() {
  revalidatePath("/app");
  revalidatePath("/app/backlog");
  revalidatePath("/app/current");
  revalidatePath("/app/done");
  revalidatePath("/app/lists");
}

export async function changeStatus(formData: FormData) {
  const input = statusChangeSchema.parse({
    userItemId: formData.get("userItemId"),
    status: formData.get("status"),
  });
  const userId = getCurrentUserId();
  const prisma = getPrisma();
  const current = await prisma.userItem.findUniqueOrThrow({
    where: { id: input.userItemId },
    select: { status: true, userId: true },
  });
  if (current.userId !== userId) throw new Error("Cannot update another user's item.");
  if (!isAllowedStatusTransition(current.status, input.status)) {
    throw new Error(`Invalid status transition: ${current.status} to ${input.status}.`);
  }
  const updateData = {
    status: input.status,
    lastInteractedAt: new Date(),
    ...(input.status === "current" ? { startedAt: new Date() } : {}),
    ...(input.status === "done" ? { finishedAt: new Date() } : {}),
  };
  await prisma.$transaction([
    prisma.userItem.update({
      where: { id: input.userItemId },
      data: updateData,
    }),
    prisma.userItemEvent.create({
      data: {
        userId,
        userItemId: input.userItemId,
        eventType: "status_changed",
        oldValue: current.status,
        newValue: input.status,
        source: "local",
      },
    }),
  ]);
  revalidateLibrary();
}

export async function setRating(formData: FormData) {
  const rawRating = formData.get("ratingValue");
  const input = ratingChangeSchema.parse({
    userItemId: formData.get("userItemId"),
    ratingValue: rawRating === "" ? null : Number(rawRating),
    ratingScale: "0-100",
  });
  const userId = getCurrentUserId();
  const prisma = getPrisma();
  const current = await prisma.userItem.findUniqueOrThrow({
    where: { id: input.userItemId },
    select: { ratingValue: true, userId: true },
  });
  if (current.userId !== userId) throw new Error("Cannot rate another user's item.");
  await prisma.$transaction([
    prisma.userItem.update({
      where: { id: input.userItemId },
      data: {
        ratingValue: input.ratingValue,
        ratingScale: input.ratingValue == null ? null : input.ratingScale,
        lastInteractedAt: new Date(),
      },
    }),
    prisma.userItemEvent.create({
      data: {
        userId,
        userItemId: input.userItemId,
        eventType: "rating_changed",
        oldValue: current.ratingValue ?? Prisma.JsonNull,
        newValue: input.ratingValue ?? Prisma.JsonNull,
        source: "local",
      },
    }),
  ]);
  revalidateLibrary();
}

export async function createList(formData: FormData) {
  const input = createListSchema.parse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });
  await getPrisma().list.create({
    data: {
      userId: getCurrentUserId(),
      name: input.name,
      description: input.description ?? null,
    },
  });
  revalidateLibrary();
}

export async function addManualItem(formData: FormData) {
  const input = addManualItemSchema.parse({
    title: formData.get("title"),
    mediaType: formData.get("mediaType") || "manual",
    sourceNote: formData.get("sourceNote") || undefined,
    userDescription: formData.get("userDescription") || undefined,
  });
  const userId = getCurrentUserId();
  const prisma = getPrisma();
  const userItem = await prisma.userItem.create({
    data: {
      status: "backlog",
      progressType: "none",
      sourceNote: input.sourceNote ?? null,
      user: {
        connect: { id: userId },
      },
      item: {
        create: {
          mediaType: input.mediaType,
          title: input.title,
          description: input.userDescription ?? null,
          metadataSource: "manual",
          canonicalKey: `manual:${slugify(input.title)}`,
        },
      },
    },
  });
  await prisma.userItemEvent.create({
    data: {
      userId,
      userItemId: userItem.id,
      eventType: "created",
      source: "local",
    },
  });
  revalidateLibrary();
}
