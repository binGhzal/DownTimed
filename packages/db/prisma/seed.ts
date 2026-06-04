import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/client/client";

const seedUserId = "00000000-0000-4000-8000-000000000001";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed Downtimed.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const seedItems = [
  {
    mediaType: "show" as const,
    title: "Severance",
    description: "A team whose memories are surgically divided between work and personal life begins to unravel the truth of their jobs.",
    releaseYear: 2022,
    status: "current" as const,
    progressType: "episodes" as const,
    progressValue: 4,
    progressTotal: 10,
    ratingValue: null,
    sourceNote: "Imported from Trakt",
    tags: ["sci-fi", "serious"],
    lists: [],
  },
  {
    mediaType: "book" as const,
    title: "The Three-Body Problem",
    description: "During the Cultural Revolution, a secret military project makes contact with an alien civilization on the brink of destruction.",
    releaseYear: 2008,
    status: "current" as const,
    progressType: "pages" as const,
    progressValue: 212,
    progressTotal: 400,
    ratingValue: null,
    sourceNote: "Imported from Goodreads",
    tags: ["sci-fi", "deep"],
    lists: ["Recommended by friends"],
  },
  {
    mediaType: "movie" as const,
    title: "Dune: Part Two",
    description: "Paul Atreides unites with the Fremen to wage war against the House Harkonnen.",
    releaseYear: 2024,
    status: "backlog" as const,
    progressType: "none" as const,
    progressValue: null,
    progressTotal: null,
    ratingValue: null,
    sourceNote: "rec by Priya",
    tags: ["sci-fi", "friend-rec"],
    lists: ["Weekend movies", "Recommended by friends"],
  },
  {
    mediaType: "game" as const,
    title: "Outer Wilds",
    description: "Explore a solar system trapped in a 22-minute time loop, uncovering an ancient mystery.",
    releaseYear: 2019,
    status: "backlog" as const,
    progressType: "none" as const,
    progressValue: null,
    progressTotal: null,
    ratingValue: null,
    sourceNote: "rec by Dev",
    tags: ["sci-fi", "steam"],
    lists: ["Recommended by friends"],
  },
  {
    mediaType: "movie" as const,
    title: "Dune",
    description: "Paul Atreides travels to the desert planet Arrakis to secure his family's future.",
    releaseYear: 2021,
    status: "done" as const,
    progressType: "none" as const,
    progressValue: null,
    progressTotal: null,
    ratingValue: 90,
    sourceNote: "Imported from Trakt",
    tags: ["sci-fi", "classic"],
    lists: [],
  },
];

function seedCanonicalKey(mediaType: string, title: string) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `seed:${mediaType}:${slug}`;
}

async function main() {
  const seedTitles = seedItems.map((item) => item.title);

  await prisma.user.deleteMany({ where: { id: seedUserId } });
  await prisma.item.deleteMany({
    where: {
      OR: [
        { canonicalKey: { startsWith: "seed:" } },
        {
          title: { in: seedTitles },
          metadataSource: { in: ["tmdb", "openlibrary", "rawg"] },
        },
      ],
    },
  });

  const user = await prisma.user.create({
    data: {
      id: seedUserId,
      email: "seed@downtimed.local",
      displayName: "Seed User",
    },
  });

  const listByName = new Map<string, string>();
  for (const name of ["Weekend movies", "Recommended by friends", "Short books"]) {
    const list = await prisma.list.create({
      data: {
        userId: user.id,
        name,
        description: name === "Recommended by friends" ? "The pile of you-have-to recommendations." : null,
      },
    });
    listByName.set(name, list.id);
  }

  const tagByName = new Map<string, string>();
  for (const name of [...new Set(seedItems.flatMap((item) => item.tags))]) {
    const tag = await prisma.tag.create({
      data: {
        userId: user.id,
        name,
        slug: name,
      },
    });
    tagByName.set(name, tag.id);
  }

  for (const seed of seedItems) {
    const item = await prisma.item.create({
      data: {
        mediaType: seed.mediaType,
        title: seed.title,
        description: seed.description,
        releaseYear: seed.releaseYear,
        canonicalKey: seedCanonicalKey(seed.mediaType, seed.title),
        metadataSource: seed.mediaType === "book" ? "openlibrary" : seed.mediaType === "game" ? "rawg" : "tmdb",
      },
    });
    const userItem = await prisma.userItem.create({
      data: {
        userId: user.id,
        itemId: item.id,
        status: seed.status,
        progressType: seed.progressType,
        progressValue: seed.progressValue,
        progressTotal: seed.progressTotal,
        ratingValue: seed.ratingValue,
        ratingScale: seed.ratingValue == null ? null : "0-100",
        sourceNote: seed.sourceNote,
        finishedAt: seed.status === "done" ? new Date("2026-03-14T00:00:00.000Z") : null,
      },
    });

    for (const tagName of seed.tags) {
      const tagId = tagByName.get(tagName);
      if (tagId) {
        await prisma.userItemTag.create({ data: { userItemId: userItem.id, tagId } });
      }
    }
    for (const listName of seed.lists) {
      const listId = listByName.get(listName);
      if (listId) {
        await prisma.listItem.create({ data: { listId, userItemId: userItem.id } });
      }
    }
  }

  await prisma.externalAccount.create({
    data: {
      userId: user.id,
      provider: "trakt",
      providerUsername: "seed-user",
      syncEnabled: true,
      lastSyncedAt: new Date(),
    },
  });

  await prisma.syncEvent.create({
    data: {
      userId: user.id,
      provider: "trakt",
      direction: "pull",
      status: "ok",
      startedAt: new Date(),
      finishedAt: new Date(),
      itemsSeen: 5,
      itemsCreated: 5,
      itemsUpdated: 0,
      itemsSkipped: 0,
      itemsFailed: 0,
      summary: { seed: true },
    },
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
