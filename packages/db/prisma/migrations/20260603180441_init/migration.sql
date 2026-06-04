-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('movie', 'show', 'book', 'game', 'manual');

-- CreateEnum
CREATE TYPE "UserItemStatus" AS ENUM ('backlog', 'current', 'done', 'abandoned', 'hidden');

-- CreateEnum
CREATE TYPE "ProgressType" AS ENUM ('none', 'percent', 'pages', 'episodes', 'custom');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('private', 'unlisted', 'public');

-- CreateEnum
CREATE TYPE "SyncConflictStatus" AS ENUM ('open', 'resolved', 'ignored');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "display_name" TEXT,
    "avatar_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" UUID NOT NULL,
    "media_type" "MediaType" NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "release_year" INTEGER,
    "release_date" DATE,
    "poster_url" TEXT,
    "backdrop_url" TEXT,
    "canonical_key" TEXT,
    "metadata_source" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_ids" (
    "id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "external_id" TEXT NOT NULL,
    "external_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "external_ids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_items" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "status" "UserItemStatus" NOT NULL,
    "progress_type" "ProgressType" NOT NULL DEFAULT 'none',
    "progress_value" DECIMAL(65,30),
    "progress_total" DECIMAL(65,30),
    "rating_value" INTEGER,
    "rating_scale" TEXT,
    "notes" TEXT,
    "priority" INTEGER,
    "source_note" TEXT,
    "started_at" TIMESTAMPTZ(6),
    "finished_at" TIMESTAMPTZ(6),
    "last_interacted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "user_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lists" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "visibility" "Visibility" NOT NULL DEFAULT 'private',
    "sort_order" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "list_items" (
    "id" UUID NOT NULL,
    "list_id" UUID NOT NULL,
    "user_item_id" UUID NOT NULL,
    "sort_order" INTEGER,
    "added_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "list_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_item_tags" (
    "user_item_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,

    CONSTRAINT "user_item_tags_pkey" PRIMARY KEY ("user_item_id","tag_id")
);

-- CreateTable
CREATE TABLE "movie_metadata" (
    "item_id" UUID NOT NULL,
    "runtime_minutes" INTEGER,
    "original_title" TEXT,
    "genres" TEXT[],
    "production_countries" TEXT[],

    CONSTRAINT "movie_metadata_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "show_metadata" (
    "item_id" UUID NOT NULL,
    "first_air_date" DATE,
    "last_air_date" DATE,
    "season_count" INTEGER,
    "episode_count" INTEGER,
    "status" TEXT,
    "genres" TEXT[],

    CONSTRAINT "show_metadata_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "book_metadata" (
    "item_id" UUID NOT NULL,
    "authors" TEXT[],
    "publisher" TEXT,
    "published_date" TEXT,
    "page_count" INTEGER,
    "isbn_10" TEXT,
    "isbn_13" TEXT,
    "language" TEXT,

    CONSTRAINT "book_metadata_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "game_metadata" (
    "item_id" UUID NOT NULL,
    "platforms" TEXT[],
    "developers" TEXT[],
    "publishers" TEXT[],
    "genres" TEXT[],
    "average_playtime_hours" DECIMAL(65,30),

    CONSTRAINT "game_metadata_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "external_accounts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_user_id" TEXT,
    "provider_username" TEXT,
    "access_token_encrypted" TEXT,
    "refresh_token_encrypted" TEXT,
    "token_expires_at" TIMESTAMPTZ(6),
    "sync_enabled" BOOLEAN NOT NULL DEFAULT true,
    "last_synced_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "disconnected_at" TIMESTAMPTZ(6),

    CONSTRAINT "external_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_cursors" (
    "id" UUID NOT NULL,
    "external_account_id" UUID NOT NULL,
    "resource_type" TEXT NOT NULL,
    "cursor_value" TEXT,
    "last_success_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "sync_cursors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_events" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "external_account_id" UUID,
    "provider" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "started_at" TIMESTAMPTZ(6) NOT NULL,
    "finished_at" TIMESTAMPTZ(6),
    "items_seen" INTEGER NOT NULL DEFAULT 0,
    "items_created" INTEGER NOT NULL DEFAULT 0,
    "items_updated" INTEGER NOT NULL DEFAULT 0,
    "items_skipped" INTEGER NOT NULL DEFAULT 0,
    "items_failed" INTEGER NOT NULL DEFAULT 0,
    "error_code" TEXT,
    "error_message" TEXT,
    "summary" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sync_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_conflicts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "item_id" UUID,
    "user_item_id" UUID,
    "field_name" TEXT NOT NULL,
    "local_value" JSONB,
    "remote_value" JSONB,
    "base_value" JSONB,
    "status" "SyncConflictStatus" NOT NULL,
    "resolution" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMPTZ(6),

    CONSTRAINT "sync_conflicts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_jobs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "source" TEXT NOT NULL,
    "filename" TEXT,
    "status" TEXT NOT NULL,
    "total_rows" INTEGER,
    "processed_rows" INTEGER,
    "created_count" INTEGER,
    "updated_count" INTEGER,
    "skipped_count" INTEGER,
    "failed_count" INTEGER,
    "error_message" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMPTZ(6),

    CONSTRAINT "import_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider_cache" (
    "id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "cache_key" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "provider_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_item_events" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "user_item_id" UUID NOT NULL,
    "event_type" TEXT NOT NULL,
    "old_value" JSONB,
    "new_value" JSONB,
    "source" TEXT NOT NULL,
    "provider" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_item_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "external_ids_provider_external_id_key" ON "external_ids"("provider", "external_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_items_user_id_item_id_key" ON "user_items"("user_id", "item_id");

-- CreateIndex
CREATE UNIQUE INDEX "list_items_list_id_user_item_id_key" ON "list_items"("list_id", "user_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_user_id_slug_key" ON "tags"("user_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "external_accounts_user_id_provider_key" ON "external_accounts"("user_id", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "sync_cursors_external_account_id_resource_type_key" ON "sync_cursors"("external_account_id", "resource_type");

-- CreateIndex
CREATE UNIQUE INDEX "provider_cache_provider_cache_key_key" ON "provider_cache"("provider", "cache_key");

-- AddForeignKey
ALTER TABLE "external_ids" ADD CONSTRAINT "external_ids_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_items" ADD CONSTRAINT "user_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_items" ADD CONSTRAINT "user_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lists" ADD CONSTRAINT "lists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_user_item_id_fkey" FOREIGN KEY ("user_item_id") REFERENCES "user_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_item_tags" ADD CONSTRAINT "user_item_tags_user_item_id_fkey" FOREIGN KEY ("user_item_id") REFERENCES "user_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_item_tags" ADD CONSTRAINT "user_item_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movie_metadata" ADD CONSTRAINT "movie_metadata_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "show_metadata" ADD CONSTRAINT "show_metadata_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_metadata" ADD CONSTRAINT "book_metadata_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_metadata" ADD CONSTRAINT "game_metadata_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "external_accounts" ADD CONSTRAINT "external_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sync_cursors" ADD CONSTRAINT "sync_cursors_external_account_id_fkey" FOREIGN KEY ("external_account_id") REFERENCES "external_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sync_events" ADD CONSTRAINT "sync_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sync_events" ADD CONSTRAINT "sync_events_external_account_id_fkey" FOREIGN KEY ("external_account_id") REFERENCES "external_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sync_conflicts" ADD CONSTRAINT "sync_conflicts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sync_conflicts" ADD CONSTRAINT "sync_conflicts_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sync_conflicts" ADD CONSTRAINT "sync_conflicts_user_item_id_fkey" FOREIGN KEY ("user_item_id") REFERENCES "user_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_jobs" ADD CONSTRAINT "import_jobs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_item_events" ADD CONSTRAINT "user_item_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_item_events" ADD CONSTRAINT "user_item_events_user_item_id_fkey" FOREIGN KEY ("user_item_id") REFERENCES "user_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
