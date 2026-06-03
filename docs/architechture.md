# Project Spec Sheet: Web-First Downtime Tracker & Organizer

## 1. Working Concept

**Working title:** `Downtimed`

**One-line description:**
A no-fuss web app for tracking, organizing, and syncing your backlog of movies, shows, books, and games.

**Positioning:**
A lightweight, web-first alternative to Sofa-style downtime organization, focused on quick capture, simple tracking, clean organization, data portability, and useful sync with external services.

**Core idea:**
The app is not a media player, planner, or social network. It is a personal downtime library that helps users answer:

> “What do I want to watch, read, or play next?”

## 2. Product Thesis

Most people already have media scattered across apps:

```txt
Movies and shows → Trakt, Letterboxd, IMDb, streaming apps
Books             → Goodreads, Kindle, Hardcover, Google Books
Games             → Steam, Switch, PlayStation, Xbox, notes apps
Random ideas      → Notes, messages, screenshots, bookmarks
```

The project should become the **central organizer** for that downtime backlog, while respecting that users may still use specialist services.

The strongest wedge is:

```txt
Simple web app
+
portable personal library
+
real sync where possible
+
import/export where sync is not possible
+
no bloated planner/player features
```

Trakt is the best first serious sync integration because its API is built for TV/movie tracking and can synchronize watch history, ratings, and lists with a Trakt profile. ([GitHub][1]) Goodreads should be handled through CSV import/export rather than live API sync because Goodreads no longer issues new public API developer keys and plans to retire the current version of those tools. ([help.goodreads.com][2])

---

# 3. Goals and Non-Goals

## 3.1 Primary Goals

The app should let users:

```txt
1. Quickly add movies, shows, books, games, and manual items.
2. Keep a simple backlog of things to watch/read/play.
3. Track what is current, finished, abandoned, or hidden.
4. Organize items with lightweight lists and tags.
5. Import existing libraries from external services.
6. Two-way sync with services where APIs support it.
7. Export their data at any time.
8. Use the app comfortably on desktop and mobile web.
```

## 3.2 Non-Goals

The app should **not** include:

```txt
Podcast player
Calendar planner
Trip planner
Social feed
Streaming playback
Book reader
Game launcher
Complex Notion-style database builder
AI recommendation engine in MVP
Heavy habit tracking
Episode-by-episode power-user tracking in MVP
```

The guiding rule:

> Add features only if they help the user remember, organize, choose, track, import, sync, or export downtime items.

---

# 4. Target Users

## 4.1 Primary User

**The casual organizer**

Someone who has a messy watchlist/readlist/gamelist across multiple services and wants one calm place to keep track.

Needs:

```txt
Quick add
Simple statuses
Reliable search
Easy imports
No complicated setup
Clean mobile web experience
```

## 4.2 Secondary User

**The media tracker**

Someone already using Trakt, Goodreads, Letterboxd, Hardcover, or similar services.

Needs:

```txt
Import existing data
Two-way sync where possible
Conflict handling
Ratings and finished dates
Export and portability
```

## 4.3 Tertiary User

**The recommendation collector**

Someone who gets recommendations from friends, YouTube, TikTok, newsletters, podcasts, Reddit, Discord, or articles.

Needs:

```txt
Save quickly
Remember who recommended it
Tag by mood/context
Find it later
Pick something based on time/mood
```

---

# 5. Core Product Loop

```txt
Discover something
→ Add it quickly
→ Optionally tag/list it
→ Later choose what to do
→ Mark current/done/abandoned
→ Sync or export changes
```

The app should feel like a **personal inbox and library for downtime**, not a database admin tool.

---

# 6. Supported Content Types

## 6.1 MVP Content Types

```txt
Movie
TV Show
Book
Game
Manual Item
```

## 6.2 Future Content Types

```txt
Album
Article
YouTube video
Course
App
Podcast show, tracking only, not playback
Board game
Place/event, only if the product later expands
```

## 6.3 Content Type Rules

Each content type should share a common base model but allow type-specific metadata.

```txt
Base fields:
  title
  subtitle
  media_type
  description
  poster_or_cover_url
  release_year
  source
  external_ids
  created_at
  updated_at

Movie:
  runtime_minutes
  release_date
  tmdb_id
  imdb_id
  trakt_id

TV Show:
  seasons_count
  episodes_count
  first_air_date
  tmdb_id
  imdb_id
  tvdb_id
  trakt_id

Book:
  author_names
  page_count
  isbn_10
  isbn_13
  openlibrary_id
  google_books_id
  goodreads_id
  hardcover_id

Game:
  platform_names
  release_date
  developer_names
  publisher_names
  igdb_id
  rawg_id

Manual Item:
  custom_url
  user_description
```

---

# 7. Product Scope

## 7.1 MVP Scope

The MVP should include:

```txt
Account creation/login
Responsive web app
Universal quick add
Manual add
Metadata search for movies/shows/books/games
Backlog
Current
Done
Abandoned
Custom lists
Tags
Notes
Ratings
Start/finish dates
Basic progress
CSV/JSON export
Trakt connection
Trakt import
Trakt push for watchlist/watched/rating changes
Goodreads CSV import
Goodreads-style CSV export
Sync center
Conflict review
Settings
```

## 7.2 Post-MVP Scope

```txt
Letterboxd import/export or sync where API access allows
Hardcover integration
StoryGraph CSV import
Steam import
Browser extension
PWA installability polish
Advanced filters
Smart lists
Availability/streaming provider metadata
Recommendation inbox
Shared lists
Public profile, optional
AI-assisted cleanup/deduplication
```

Letterboxd should be treated as a future integration because API access is request-only and not guaranteed, and Letterboxd recommends TMDb for general movie/TV metadata needs. ([Letterboxd][3]) Their API documentation also notes OAuth2 authentication and that some first-party endpoints are restricted because of licensing. ([api-docs.letterboxd.com][4])

Hardcover should also be treated as future/advanced rather than core MVP. Its API is GraphQL and in beta, and its docs say it should be used from a backend rather than directly from a browser. ([Hardcover][5])

---

# 8. Core Screens

## 8.1 Landing Page

Purpose: explain the product and convert users.

Sections:

```txt
Hero:
  "One calm place for what you want to watch, read, and play."

Primary CTA:
  Start free / Sign in

Secondary CTA:
  Import from Trakt or Goodreads

Feature blocks:
  Quick add
  Backlog
  Current
  Done
  Lists and tags
  Sync with services
  Export anytime

Trust/privacy block:
  Your library belongs to you.
  Export anytime.
  No forced social network.
```

## 8.2 Onboarding

First-run flow:

```txt
Step 1: Choose what you track
  Movies
  Shows
  Books
  Games
  Manual stuff

Step 2: Connect services, optional
  Trakt
  Goodreads CSV
  Skip for now

Step 3: Add first item
  Search or paste URL

Step 4: Land on Home
```

Onboarding should be skippable.

## 8.3 Home

Purpose: answer “what now?”

Sections:

```txt
Currently active
Recently added
Continue
Pick something
Recently finished
Sync status
```

Primary actions:

```txt
Add item
Pick for me
Mark done
Open sync center
```

## 8.4 Backlog

Main library view for things the user might do later.

Controls:

```txt
Search
Filter by type
Filter by tag
Filter by list
Filter by estimated time
Filter by source
Sort by recently added
Sort by title
Sort by release year
Sort by priority
Sort randomly
```

Item card should show:

```txt
Cover/poster
Title
Type
Year
Tags
Status
Source badge
Quick actions
```

## 8.5 Current

Items the user has started.

Examples:

```txt
Currently watching
Currently reading
Currently playing
```

Supported progress types:

```txt
None
Percent
Pages
Episodes
Custom text
```

MVP should keep progress simple. Avoid turning TV tracking into a full episode tracker until later.

## 8.6 Done

Finished history.

Fields:

```txt
Finished date
Rating
Notes
Source
Synced status
```

Useful filters:

```txt
This month
This year
Movies
Books
Shows
Games
Rated
Unrated
```

## 8.7 Lists

Lists are user-created collections.

Examples:

```txt
Weekend movies
Short books
Cozy games
Watch with family
Recommended by friends
Before vacation
```

MVP list types:

```txt
Static lists only
Manual ordering
Optional description
Optional visibility later
```

Do **not** build complex smart lists in MVP. Add those later once enough user behavior exists.

## 8.8 Tags

Tags are lightweight labels.

Examples:

```txt
short
comfort
deep
funny
serious
sci-fi
fantasy
friend-rec
watch-with-family
kindle
netflix
steam
switch
```

Tags should be global per user and reusable across all media types.

## 8.9 Item Detail Page

Each item detail page should include:

```txt
Cover/poster
Title
Type
Year
Description
Metadata
User status
User rating
User notes
Progress
Lists
Tags
External links
Sync state
History
```

Primary actions:

```txt
Add to backlog
Start
Mark done
Abandon
Hide
Add to list
Tag
Edit notes
Open external service
Refresh metadata
```

## 8.10 Add Item

Universal add should support:

```txt
Search by title
Paste URL
Paste IMDb/TMDb/Trakt/Goodreads/Open Library/Google Books link
Enter ISBN
Manual item
```

Search result grouping:

```txt
Movies
Shows
Books
Games
Manual
```

When a user searches “Dune,” the UI should clearly distinguish:

```txt
Dune, novel
Dune, 1984 film
Dune, 2021 film
Dune: Part Two
Dune TV-related results
Dune games, if present
```

## 8.11 Sync Center

Purpose: make integrations trustworthy.

Sections:

```txt
Connected accounts
Last sync status
Sync queue
Recent sync events
Conflicts
Import history
Export options
Provider settings
```

Per provider, show:

```txt
Connected/disconnected
Last successful sync
Items imported
Items exported
Errors
Rate-limit/backoff state
Manual sync button
Disconnect button
```

## 8.12 Settings

Sections:

```txt
Account
Profile
Appearance
Default view
Data import
Data export
Connected services
Privacy
Delete account
```

---

# 9. Status System

## 9.1 Core Statuses

```txt
backlog
current
done
abandoned
hidden
```

## 9.2 Status Meanings

```txt
backlog:
  User may want to watch/read/play later.

current:
  User has started or is actively consuming it.

done:
  User finished it.

abandoned:
  User started or considered it but intentionally dropped it.

hidden:
  User does not want it visible in normal views.
```

## 9.3 Status Transitions

Allowed transitions:

```txt
none → backlog
none → current
none → done

backlog → current
backlog → done
backlog → abandoned
backlog → hidden

current → done
current → abandoned
current → backlog
current → hidden

done → backlog
done → current
done → hidden

abandoned → backlog
abandoned → current
abandoned → hidden

hidden → backlog
hidden → current
hidden → done
hidden → abandoned
```

Every status change should create a `user_item_events` record.

---

# 10. Ratings

## 10.1 MVP Rating Model

Use a simple 5-star or 10-point rating system internally.

Recommended:

```txt
Internal rating scale: 0–100 integer
UI display options:
  5 stars
  10-point
  Like/dislike later
```

Why internal `0–100`:

```txt
Trakt-style ratings can map cleanly.
5-star systems can map cleanly.
Future services can map with less data loss.
```

## 10.2 Rating Mapping Examples

```txt
5-star UI:
  1 star  = 20
  2 stars = 40
  3 stars = 60
  4 stars = 80
  5 stars = 100

10-point UI:
  1/10  = 10
  5/10  = 50
  10/10 = 100
```

Store:

```txt
rating_value
rating_scale
rating_source
rated_at
```

---

# 11. Metadata Strategy

## 11.1 Movies and TV

Use TMDb as the primary metadata provider for movies and TV because its developer docs cover movie, TV, actor, and image API methods. ([The Movie Database (TMDB)][6])

Store locally:

```txt
TMDb ID
IMDb ID, when available
Trakt ID, when mapped
Title
Original title
Overview
Poster path/cache key
Backdrop path/cache key, optional
Release date
Runtime
Genres
External IDs
```

Do not copy more metadata than needed.

## 11.2 Books

Use:

```txt
Open Library
Google Books
Goodreads CSV import
Hardcover later
```

Open Library supports ISBN-based lookup and JSON responses. ([openlibrary.org][7]) Google Books supports search, volume retrieval, bookshelves, and authorized access for user-specific data. ([Google for Developers][8])

Store locally:

```txt
ISBN-10
ISBN-13
Open Library ID
Google Books ID
Goodreads ID, from import only
Hardcover ID, later
Title
Subtitle
Authors
Description
Cover URL/cache key
Page count
Published date
Publisher
Language
```

## 11.3 Games

Use either RAWG or IGDB initially.

RAWG provides a games database API with game search, metadata, screenshots, ratings, developers, tags, publishers, and platform data. ([RAWG][9]) IGDB is another strong source, but it requires Twitch developer authentication and its commercial use path should be checked before relying on it for a monetized product. ([api-docs.igdb.com][10])

Recommended MVP choice:

```txt
Use RAWG first for speed.
Evaluate IGDB before paid/commercial launch.
```

Store locally:

```txt
RAWG ID
IGDB ID, optional
Title
Description
Cover URL/cache key
Platforms
Release date
Genres
Developers
Publishers
Average playtime, if available
```

---

# 12. Integrations

## 12.1 Integration Priority

```txt
P0:
  TMDb metadata
  Open Library metadata
  Google Books metadata
  Trakt sync
  Goodreads CSV import/export

P1:
  RAWG or IGDB metadata
  Letterboxd import/export
  Hardcover integration
  StoryGraph CSV import

P2:
  Steam import
  Browser extension
  Streaming availability provider
  Shared/public lists
```

## 12.2 Trakt Integration

Priority: **P0**

Purpose:

```txt
Import and sync movie/TV watchlists, watched history, ratings, and lists.
```

Supported MVP sync:

```txt
Pull:
  Trakt watchlist
  Trakt watched history
  Trakt ratings
  Basic Trakt lists

Push:
  Add/remove watchlist items
  Mark watched
  Update rating
```

Do not initially sync:

```txt
Complex list ordering
Every episode-level event
Comments/reviews
Social data
```

OAuth/token requirements:

```txt
Use server-side OAuth flow.
Store encrypted access and refresh tokens.
Refresh tokens through backend only.
Never expose provider secrets to the browser.
```

Sync direction defaults:

```txt
Watchlist:
  two-way

Watched/done:
  two-way

Ratings:
  two-way

Custom app tags:
  local only

Custom app lists:
  local first, optional push later
```

## 12.3 Goodreads Integration

Priority: **P0 for CSV import/export, not live sync**

Goodreads should be handled through file-based migration because Goodreads no longer issues new public API developer keys. ([help.goodreads.com][2]) Goodreads still documents CSV export for a user’s books library. ([help.goodreads.com][11])

Supported MVP:

```txt
Import Goodreads CSV
Map shelves to tags/lists
Map read status to user_item status
Import ratings
Import read dates where available
Import ISBNs
Resolve duplicates
Export CSV compatible with common Goodreads-style fields
```

Not supported:

```txt
Live Goodreads sync
Goodreads scraping
Automated Goodreads account login
Unofficial credential-based import
```

## 12.4 Letterboxd Integration

Priority: **P1/P2**

Reasoning:

```txt
Useful for film users.
Not reliable enough for MVP dependency.
API access is request-only.
Some endpoints are restricted.
```

Supported future options:

```txt
Letterboxd CSV import/export
RSS import for public diary entries
Official API sync if access is granted
```

## 12.5 Hardcover Integration

Priority: **P1/P2**

Potential:

```txt
Better modern book-tracking integration than Goodreads.
Could support richer read status/list sync.
```

Constraints:

```txt
API is beta.
Token handling must be backend-only.
OAuth support for external apps appears planned, not the baseline assumption.
```

Hardcover’s docs describe a GraphQL API in beta, token-based access, backend-only use, rate limits, and future OAuth support for external applications. ([Hardcover][5])

## 12.6 Open Library Integration

Priority: **P0**

Use for:

```txt
ISBN lookup
Book metadata
Covers
Open book identifiers
Fallback enrichment
```

## 12.7 Google Books Integration

Priority: **P0**

Use for:

```txt
Book search
Volume metadata
Book covers
Page counts
Potential bookshelf integration later
```

Google Books requires OAuth 2.0 for requests involving private user data, while public data can use an API key or OAuth token. ([Google for Developers][8])

## 12.8 RAWG / IGDB Integration

Priority: **P1 unless games are part of MVP launch**

Use for:

```txt
Game search
Game covers
Platforms
Release dates
Genres
Developers
Publishers
Average playtime, if available
```

Recommendation:

```txt
Start with RAWG for MVP game metadata.
Abstract the game provider so IGDB can be added or swapped later.
```

---

# 13. Sync Model

## 13.1 Sync Philosophy

The app should be the user’s **personal source of truth**, but it should respect external services.

```txt
Local app owns:
  tags
  notes
  custom lists
  priority
  source/who recommended it
  mood
  hidden/archived state

External services may own:
  watched history
  external watchlist membership
  external ratings
  provider-specific lists

Shared:
  status
  rating
  finished date
```

## 13.2 Sync Architecture

Use provider adapters:

```ts
interface SyncAdapter {
  provider: SyncProvider;

  connect(userId: string): Promise<void>;

  disconnect(userId: string): Promise<void>;

  pull(accountId: string): Promise<PullResult>;

  push(accountId: string, changes: LocalChange[]): Promise<PushResult>;

  normalize(input: unknown): Promise<NormalizedExternalItem>;

  mapToLocal(input: NormalizedExternalItem): Promise<ItemMappingResult>;

  mapFromLocal(change: LocalChange): Promise<ExternalChange>;

  resolveConflict(conflict: SyncConflict): Promise<ConflictResolution>;
}
```

Provider enum:

```ts
type SyncProvider =
  | "trakt"
  | "goodreads_csv"
  | "tmdb"
  | "openlibrary"
  | "google_books"
  | "rawg"
  | "igdb"
  | "letterboxd"
  | "hardcover";
```

## 13.3 Sync Modes

```txt
metadata_only:
  Used for TMDb, Open Library, Google Books, RAWG, IGDB.

import_only:
  Used for Goodreads CSV initially.

two_way:
  Used for Trakt.

manual_export:
  Used for CSV/JSON and Goodreads-compatible export.
```

## 13.4 Sync Conflict Rules

General rule:

```txt
If only local changed:
  push local change if provider supports it.

If only remote changed:
  pull remote change.

If both changed:
  create conflict and ask user.

If remote deleted:
  do not hard-delete locally immediately.
  mark as removed remotely and ask user.
```

Conflict UI options:

```txt
Keep local
Use remote
Keep both
Ignore this conflict
Always prefer local for this field
Always prefer remote for this field
```

## 13.5 Sync Event Logging

Every sync run should create logs.

Fields:

```txt
provider
direction
started_at
finished_at
status
items_seen
items_created
items_updated
items_skipped
items_failed
error_code
error_message
raw_summary
```

Do not store full raw provider payloads forever unless needed for debugging. Keep temporary payloads with a short retention window.

---

# 14. Entity Resolution and Deduplication

## 14.1 Matching Priority

When importing or syncing, match in this order:

### Movies

```txt
1. TMDb ID
2. IMDb ID
3. Trakt ID
4. Title + release year
5. Fuzzy title + year range
```

### TV Shows

```txt
1. TMDb ID
2. TVDb ID
3. IMDb ID
4. Trakt ID
5. Title + first air year
```

### Books

```txt
1. ISBN-13
2. ISBN-10
3. Open Library edition ID
4. Google Books volume ID
5. Goodreads ID from CSV
6. Title + author
7. Fuzzy title + author + year
```

### Games

```txt
1. RAWG ID
2. IGDB ID
3. Title + platform + year
4. Fuzzy title + year
```

## 14.2 Duplicate Review UI

When uncertain, ask the user:

```txt
"Is this the same item?"
```

Show:

```txt
Local item
Incoming item
Matched fields
Confidence score
Actions:
  Merge
  Keep separate
  Skip
```

## 14.3 Confidence Scoring

Suggested scoring:

```txt
Exact external ID match:
  100

ISBN match:
  100

Title + author exact:
  90

Title + year exact:
  85

Fuzzy title + year:
  65–80

Fuzzy title only:
  below 60, ask user
```

---

# 15. Data Model

## 15.1 Core Tables

### `users`

```sql
id uuid primary key
email text unique not null
display_name text
avatar_url text
created_at timestamptz not null
updated_at timestamptz not null
deleted_at timestamptz
```

### `items`

Canonical media records.

```sql
id uuid primary key
media_type text not null
title text not null
subtitle text
description text
release_year int
release_date date
poster_url text
backdrop_url text
canonical_key text
metadata_source text
created_at timestamptz not null
updated_at timestamptz not null
```

`media_type` values:

```txt
movie
show
book
game
manual
```

### `external_ids`

Maps canonical items to provider IDs.

```sql
id uuid primary key
item_id uuid not null references items(id)
provider text not null
external_id text not null
external_url text
created_at timestamptz not null
unique(provider, external_id)
```

Provider values:

```txt
tmdb
imdb
trakt
tvdb
openlibrary
google_books
goodreads
hardcover
rawg
igdb
manual_url
```

### `user_items`

The user’s relationship to an item.

```sql
id uuid primary key
user_id uuid not null references users(id)
item_id uuid not null references items(id)
status text not null
progress_type text not null default 'none'
progress_value numeric
progress_total numeric
rating_value int
rating_scale text
notes text
priority int
source_note text
started_at timestamptz
finished_at timestamptz
last_interacted_at timestamptz
created_at timestamptz not null
updated_at timestamptz not null
deleted_at timestamptz
unique(user_id, item_id)
```

Status values:

```txt
backlog
current
done
abandoned
hidden
```

Progress type values:

```txt
none
percent
pages
episodes
custom
```

### `lists`

```sql
id uuid primary key
user_id uuid not null references users(id)
name text not null
description text
visibility text not null default 'private'
sort_order int
created_at timestamptz not null
updated_at timestamptz not null
deleted_at timestamptz
```

Visibility values:

```txt
private
unlisted
public
```

MVP should only expose `private`.

### `list_items`

```sql
id uuid primary key
list_id uuid not null references lists(id)
user_item_id uuid not null references user_items(id)
sort_order int
added_at timestamptz not null
unique(list_id, user_item_id)
```

### `tags`

```sql
id uuid primary key
user_id uuid not null references users(id)
name text not null
slug text not null
created_at timestamptz not null
unique(user_id, slug)
```

### `user_item_tags`

```sql
user_item_id uuid not null references user_items(id)
tag_id uuid not null references tags(id)
primary key(user_item_id, tag_id)
```

---

## 15.2 Type-Specific Metadata Tables

### `movie_metadata`

```sql
item_id uuid primary key references items(id)
runtime_minutes int
original_title text
genres text[]
production_countries text[]
```

### `show_metadata`

```sql
item_id uuid primary key references items(id)
first_air_date date
last_air_date date
season_count int
episode_count int
status text
genres text[]
```

### `book_metadata`

```sql
item_id uuid primary key references items(id)
authors text[]
publisher text
published_date text
page_count int
isbn_10 text
isbn_13 text
language text
```

### `game_metadata`

```sql
item_id uuid primary key references items(id)
platforms text[]
developers text[]
publishers text[]
genres text[]
average_playtime_hours numeric
```

---

## 15.3 Sync Tables

### `external_accounts`

```sql
id uuid primary key
user_id uuid not null references users(id)
provider text not null
provider_user_id text
provider_username text
access_token_encrypted text
refresh_token_encrypted text
token_expires_at timestamptz
sync_enabled boolean not null default true
last_synced_at timestamptz
created_at timestamptz not null
updated_at timestamptz not null
disconnected_at timestamptz
unique(user_id, provider)
```

### `sync_cursors`

```sql
id uuid primary key
external_account_id uuid not null references external_accounts(id)
resource_type text not null
cursor_value text
last_success_at timestamptz
created_at timestamptz not null
updated_at timestamptz not null
unique(external_account_id, resource_type)
```

### `sync_events`

```sql
id uuid primary key
user_id uuid not null references users(id)
external_account_id uuid references external_accounts(id)
provider text not null
direction text not null
status text not null
started_at timestamptz not null
finished_at timestamptz
items_seen int default 0
items_created int default 0
items_updated int default 0
items_skipped int default 0
items_failed int default 0
error_code text
error_message text
summary jsonb
created_at timestamptz not null
```

### `sync_conflicts`

```sql
id uuid primary key
user_id uuid not null references users(id)
provider text not null
item_id uuid references items(id)
user_item_id uuid references user_items(id)
field_name text not null
local_value jsonb
remote_value jsonb
base_value jsonb
status text not null
resolution text
created_at timestamptz not null
resolved_at timestamptz
```

Status values:

```txt
open
resolved
ignored
```

### `import_jobs`

```sql
id uuid primary key
user_id uuid not null references users(id)
source text not null
filename text
status text not null
total_rows int
processed_rows int
created_count int
updated_count int
skipped_count int
failed_count int
error_message text
created_at timestamptz not null
finished_at timestamptz
```

---

## 15.4 Activity Tables

### `user_item_events`

```sql
id uuid primary key
user_id uuid not null references users(id)
user_item_id uuid not null references user_items(id)
event_type text not null
old_value jsonb
new_value jsonb
source text not null
provider text
created_at timestamptz not null
```

Event types:

```txt
created
status_changed
rating_changed
progress_changed
note_changed
tag_added
tag_removed
list_added
list_removed
synced
imported
exported
deleted
restored
```

---

# 16. API Design

## 16.1 API Style

Use a typed API layer.

Recommended options:

```txt
tRPC
or
REST with OpenAPI
or
Next.js route handlers with Zod validation
```

For this project, a practical setup:

```txt
Next.js
TypeScript
Postgres
Prisma or Drizzle
Zod
Server-side integration adapters
Background queue
```

## 16.2 Core Endpoints

### Auth

```txt
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/session
```

If using a managed auth provider, these may be abstracted away.

### Items

```txt
GET    /api/items/search
POST   /api/items
GET    /api/items/:id
PATCH  /api/items/:id
POST   /api/items/:id/refresh-metadata
```

### User Items

```txt
GET    /api/user-items
POST   /api/user-items
GET    /api/user-items/:id
PATCH  /api/user-items/:id
DELETE /api/user-items/:id
POST   /api/user-items/:id/status
POST   /api/user-items/:id/rating
POST   /api/user-items/:id/progress
```

### Lists

```txt
GET    /api/lists
POST   /api/lists
GET    /api/lists/:id
PATCH  /api/lists/:id
DELETE /api/lists/:id
POST   /api/lists/:id/items
DELETE /api/lists/:id/items/:userItemId
PATCH  /api/lists/:id/reorder
```

### Tags

```txt
GET    /api/tags
POST   /api/tags
PATCH  /api/tags/:id
DELETE /api/tags/:id
POST   /api/user-items/:id/tags
DELETE /api/user-items/:id/tags/:tagId
```

### Search / Metadata

```txt
GET /api/search/universal?q=
GET /api/search/movies?q=
GET /api/search/shows?q=
GET /api/search/books?q=
GET /api/search/games?q=
GET /api/lookup/url?url=
GET /api/lookup/isbn?isbn=
```

### Integrations

```txt
GET    /api/integrations
POST   /api/integrations/trakt/connect
GET    /api/integrations/trakt/callback
POST   /api/integrations/trakt/sync
DELETE /api/integrations/trakt

POST   /api/import/goodreads
GET    /api/import/jobs/:id
GET    /api/export/json
GET    /api/export/csv
GET    /api/export/goodreads-csv
```

### Sync

```txt
GET  /api/sync/events
GET  /api/sync/conflicts
POST /api/sync/conflicts/:id/resolve
POST /api/sync/run
```

---

# 17. Search Behavior

## 17.1 Universal Search

Input examples:

```txt
Dune
Dune 2021
9780140328721
https://www.imdb.com/title/tt1160419/
https://www.goodreads.com/book/show/44767458-dune
```

Search should:

```txt
Detect URLs
Detect ISBNs
Query relevant providers
Group results by type
Deduplicate obvious matches
Show source badges
Let the user add the item in one click
```

## 17.2 Search Result Card

Fields:

```txt
Poster/cover
Title
Type
Year
Author/director/platform where relevant
Provider source
Already in library badge
Add button
```

## 17.3 Add Flow

After selecting a result:

```txt
Choose status:
  Backlog
  Current
  Done

Optional:
  Add tags
  Add to list
  Add note
  Add rating
```

Default should be `backlog`.

---

# 18. Import and Export

## 18.1 Goodreads CSV Import

Flow:

```txt
Upload CSV
Parse file
Show preview
Map shelves/statuses
Detect duplicates
Confirm import
Show import summary
```

Goodreads shelf mapping:

```txt
to-read      → backlog
currently-reading → current
read         → done
other shelves → tags or lists
```

Preserve:

```txt
Title
Author
ISBN
ISBN13
My Rating
Average Rating, optional
Publisher
Binding, optional
Number of Pages
Year Published
Original Publication Year
Date Read
Date Added
Bookshelves
My Review, if available
```

## 18.2 Trakt Import

Flow:

```txt
Connect Trakt
Authorize
Choose import scope
  Watchlist
  Watched history
  Ratings
  Lists
Preview summary
Import
Start sync
```

## 18.3 Export

Required MVP exports:

```txt
Full JSON export
Full CSV export
Goodreads-compatible books CSV
Trakt sync log export, optional
```

Export principles:

```txt
User can export without paid lock-in.
Export should include external IDs.
Export should include lists, tags, notes, statuses, ratings, dates.
```

---

# 19. Frontend Spec

## 19.1 Recommended Stack

```txt
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui or custom component system
TanStack Query or server-first data fetching
Zod for validation
React Hook Form for forms
```

## 19.2 Layout

Desktop:

```txt
Left sidebar navigation
Top search/add bar
Main content area
Optional right detail drawer
```

Mobile:

```txt
Bottom navigation or compact top nav
Floating add button
Full-screen item detail
Filter drawer
Swipe-friendly cards
```

## 19.3 Navigation

Main nav:

```txt
Home
Backlog
Current
Done
Lists
Sync
Settings
```

Secondary:

```txt
Tags
Imports
Exports
Connected Services
```

## 19.4 UI Principles

```txt
Fast before fancy
No dashboards full of noise
One-click status changes
Clear empty states
Visible sync status
Keyboard-friendly desktop use
Thumb-friendly mobile use
```

## 19.5 Empty States

Examples:

```txt
Backlog empty:
  "Nothing saved yet. Add a movie, book, show, or game."

Current empty:
  "Nothing in progress. Start something from your backlog."

Done empty:
  "Finished items will appear here."

Sync empty:
  "Connect Trakt or import a Goodreads CSV to bring your library in."
```

---

# 20. Backend Spec

## 20.1 Recommended Architecture

```txt
Web app:
  Next.js

Database:
  PostgreSQL

ORM:
  Prisma or Drizzle

Queue:
  BullMQ, Inngest, Trigger.dev, or similar

Cache:
  Redis or provider-level cache table

Storage:
  Object storage later for user-uploaded covers

Auth:
  Auth.js, Clerk, Supabase Auth, or custom email/OAuth

Validation:
  Zod

Observability:
  Structured logs
  Error tracking
  Sync job logs
```

## 20.2 Background Jobs

Jobs:

```txt
trakt.pull
trakt.push
metadata.tmdb.refresh
metadata.books.refresh
metadata.games.refresh
goodreads.import
export.generate
dedupe.resolve
sync.retry_failed
```

## 20.3 Provider Caching

Cache external metadata to reduce API calls.

```sql
provider_cache
  id uuid primary key
  provider text
  cache_key text
  response jsonb
  expires_at timestamptz
  created_at timestamptz
  unique(provider, cache_key)
```

Use cache for:

```txt
Search results
Metadata lookup
External ID lookup
Cover/poster configuration
```

---

# 21. Security and Privacy

## 21.1 Data Ownership

The product promise:

```txt
Your data belongs to you.
You can export it.
You can delete your account.
We do not sell your library data.
```

## 21.2 Token Security

External provider tokens must be:

```txt
Stored encrypted
Never exposed to client-side JavaScript
Scoped minimally where provider supports scopes
Deleted on disconnect
Excluded from logs
Excluded from exports
```

## 21.3 Secrets

Use environment-level secrets for:

```txt
OAuth client secrets
API keys
Encryption keys
Database URL
Queue credentials
Email provider keys
```

## 21.4 Account Deletion

Account deletion should:

```txt
Soft-delete user immediately
Disconnect external accounts
Delete encrypted tokens
Queue full deletion
Delete or anonymize personal records
Preserve only aggregate anonymous metrics, if needed
```

## 21.5 Privacy Defaults

```txt
All libraries private by default.
No public profile in MVP.
No social discovery in MVP.
No indexing user libraries by search engines.
```

---

# 22. Accessibility

Requirements:

```txt
Keyboard navigation for all core flows
Visible focus states
Semantic buttons and links
ARIA labels where needed
Color contrast compliant with WCAG AA
No information conveyed by color alone
Reduced motion support
Screen-reader-friendly status messages
```

Important flows to test with keyboard only:

```txt
Search
Add item
Change status
Create list
Apply filters
Resolve sync conflict
Import CSV
Export data
```

---

# 23. Performance Requirements

## 23.1 UX Performance

Targets:

```txt
Initial app shell loads quickly on modern mobile networks.
Search feels responsive.
Status changes feel instant with optimistic UI.
Backlog supports hundreds or thousands of items.
Sync jobs do not block the UI.
```

## 23.2 Backend Performance

Indexes required:

```sql
items(media_type)
items(title)
items(release_year)
external_ids(provider, external_id)
user_items(user_id, status)
user_items(user_id, updated_at)
lists(user_id)
tags(user_id, slug)
sync_events(user_id, created_at)
sync_conflicts(user_id, status)
```

Consider full-text search:

```txt
Postgres full-text search for local library
Provider search for external metadata
```

---

# 24. Analytics and Metrics

## 24.1 Product Metrics

Track:

```txt
Activation:
  user adds first item
  user imports first external library
  user connects Trakt

Engagement:
  items added per user
  status changes per user
  weekly active users
  items marked done
  searches performed

Retention:
  users returning after first week
  users with current items
  users with successful sync jobs

Sync quality:
  sync success rate
  conflicts per sync
  failed provider calls
  retry success rate

Import quality:
  Goodreads rows parsed
  match rate
  duplicate rate
  failed rows
```

## 24.2 Events

Examples:

```txt
user_signed_up
onboarding_completed
item_added
item_status_changed
item_marked_done
list_created
tag_created
trakt_connected
trakt_sync_started
trakt_sync_completed
goodreads_import_started
goodreads_import_completed
export_generated
sync_conflict_created
sync_conflict_resolved
```

Do not track sensitive notes content as analytics properties.

---

# 25. MVP Acceptance Criteria

## 25.1 Account and Library

```txt
A user can create an account.
A user can log in and log out.
A user can add a movie, show, book, game, or manual item.
A user can view backlog/current/done/abandoned items.
A user can change an item’s status.
A user can add notes and ratings.
A user can delete or hide an item.
```

## 25.2 Organization

```txt
A user can create, edit, and delete lists.
A user can add/remove items from lists.
A user can create and apply tags.
A user can filter by type, status, tag, and list.
A user can search within their library.
```

## 25.3 Metadata

```txt
A user can search for movie/show metadata.
A user can search for book metadata.
A user can search for game metadata if games are included in MVP.
A user can refresh metadata for an item.
External IDs are stored for imported/enriched items.
```

## 25.4 Trakt

```txt
A user can connect Trakt.
The app can import Trakt watchlist.
The app can import watched items.
The app can import ratings.
The app can push watchlist changes where supported.
The app can push watched/done changes where supported.
The app records sync events.
The app shows sync errors clearly.
```

## 25.5 Goodreads CSV

```txt
A user can upload a Goodreads CSV.
The app parses the file.
The app previews rows before import.
The app maps Goodreads shelves to statuses/tags/lists.
The app imports ratings and dates where available.
The app reports skipped/failed rows.
```

## 25.6 Export

```txt
A user can export their library as JSON.
A user can export their library as CSV.
A user can export books in a Goodreads-compatible CSV shape.
Exports include statuses, tags, lists, ratings, notes, dates, and external IDs.
```

---

# 26. Recommended MVP Feature Cut

Build these first:

```txt
1. Auth
2. Manual add
3. Backlog/current/done
4. Lists
5. Tags
6. Universal search shell
7. TMDb search
8. Open Library / Google Books search
9. Export JSON/CSV
10. Goodreads CSV import
11. Trakt connect/import
12. Trakt two-way sync for watchlist/watched/rating
13. Sync center
```

Defer these:

```txt
Smart lists
Browser extension
Letterboxd
Hardcover
Steam
Streaming availability
Social sharing
Public profiles
AI recommendations
Advanced episode tracking
Native apps
Podcast support
Planner/calendar
```

---

# 27. Roadmap

## Phase 0: Foundation

```txt
Project setup
Database schema
Auth
Base UI shell
Core item model
User item model
Lists
Tags
Export
```

## Phase 1: Organizer MVP

```txt
Manual add
Backlog/current/done views
Item detail
Search/filter/sort
Notes
Ratings
Basic progress
Responsive layout
```

## Phase 2: Metadata

```txt
TMDb movie/show search
Open Library book lookup
Google Books search
RAWG game search, optional
External ID mapping
Metadata refresh jobs
Cover/poster handling
```

## Phase 3: Import and Sync

```txt
Goodreads CSV import
Goodreads-compatible export
Trakt OAuth
Trakt import
Trakt push
Sync center
Sync events
Conflict handling
```

## Phase 4: Polish

```txt
Better mobile web UX
PWA installability
Keyboard shortcuts
Advanced filters
Pick for me
Bulk edit
Duplicate resolution
Import repair tools
```

## Phase 5: Expansion

```txt
Letterboxd
Hardcover
StoryGraph CSV
Steam
Browser extension
Shared lists
Public read-only lists
Recommendation inbox
```

---

# 28. “Pick for Me” Spec

This is a good feature because it helps users choose without turning the app into a planner.

## 28.1 Inputs

```txt
Media type:
  any / movie / show / book / game

Time:
  under 30 minutes
  under 1 hour
  under 2 hours
  long

Mood:
  light
  comfort
  serious
  funny
  scary
  deep
  cozy

Source:
  any
  Trakt
  Goodreads
  manual
  friend recommendation

Status:
  backlog
  current
```

## 28.2 Output

Show one suggestion with:

```txt
Title
Reason
Estimated time
Tags
Primary action:
  Start
Secondary:
  Pick another
```

Example:

```txt
"Dune: Part Two"
Reason: In your backlog, tagged sci-fi, under 3 hours, highly prioritized.
```

## 28.3 MVP Implementation

Use deterministic filtering plus random selection. Do not use AI initially.

---

# 29. Design System

## 29.1 Visual Direction

Keywords:

```txt
Calm
Fast
Warm
Personal
Not corporate
Not gamified
Not database-heavy
```

## 29.2 Components

Required components:

```txt
ItemCard
ItemGrid
ItemListRow
StatusBadge
MediaTypeBadge
TagPill
RatingInput
ProgressInput
ListPicker
CommandMenu
FilterDrawer
SyncStatusBadge
ConflictCard
ImportPreviewTable
EmptyState
```

## 29.3 Status Labels

```txt
Backlog
Current
Done
Abandoned
Hidden
```

Avoid overly cute labels in the core product. Users should instantly understand the system.

---

# 30. Error States

## 30.1 Provider Errors

Examples:

```txt
Trakt token expired
Trakt rate limit hit
TMDb search failed
Goodreads CSV malformed
Book match uncertain
Duplicate detected
```

Error UX should provide:

```txt
Plain-language explanation
Retry button where appropriate
View details for technical users
No scary stack traces
No silent failures
```

## 30.2 CSV Import Errors

Show:

```txt
Row number
Original title
Reason failed
Suggested fix
Skip/import manually option
```

---

# 31. Testing Plan

## 31.1 Unit Tests

Cover:

```txt
Status transitions
Rating mappings
CSV parsing
Provider normalization
Duplicate matching
Conflict resolution
Export formatting
URL detection
ISBN validation
```

## 31.2 Integration Tests

Cover:

```txt
Add item flow
Create list flow
Apply tags
Goodreads import job
Trakt sync pull
Trakt sync push
Metadata search
Export generation
```

## 31.3 End-to-End Tests

Critical flows:

```txt
Sign up
Add first movie
Add first book
Import Goodreads CSV
Connect Trakt
Change status
Resolve conflict
Export library
Delete account
```

## 31.4 Manual QA

Test with:

```txt
Large Goodreads CSV
Duplicate books with different editions
Movies with same title/different years
Shows and movies with same title
No-cover items
Slow provider responses
Expired tokens
Mobile viewport
Keyboard-only navigation
```

---

# 32. Major Risks and Mitigations

## 32.1 API Access Risk

Risk:

```txt
External services may restrict APIs, change terms, or limit access.
```

Mitigation:

```txt
Use adapters.
Keep local source of truth.
Support CSV import/export.
Avoid scraping.
Avoid hard dependency on one provider.
```

## 32.2 Sync Complexity

Risk:

```txt
Two-way sync can create confusing conflicts and data loss.
```

Mitigation:

```txt
Start with limited Trakt sync.
Store sync events.
Use tombstones for deletes.
Ask user on conflicts.
Never hard-delete on first remote deletion.
```

## 32.3 Metadata Messiness

Risk:

```txt
Books and games have messy editions, duplicate names, and inconsistent metadata.
```

Mitigation:

```txt
Use external IDs.
Use confidence scoring.
Let users manually fix matches.
Store manual overrides.
```

## 32.4 Product Bloat

Risk:

```txt
The app becomes a planner/player/social network.
```

Mitigation:

```txt
Keep the product rule:
Does this help users remember, choose, track, import, sync, or export?
If not, defer or reject.
```

---

# 33. Suggested Tech Stack

## 33.1 Best Default Stack

```txt
Framework:
  Next.js

Language:
  TypeScript

Database:
  PostgreSQL

ORM:
  Drizzle or Prisma

Styling:
  Tailwind CSS

Components:
  shadcn/ui or custom Radix-based system

Validation:
  Zod

Auth:
  Auth.js, Clerk, or Supabase Auth

Background jobs:
  Inngest, Trigger.dev, or BullMQ

Cache:
  Redis or database-backed provider cache

Hosting:
  Vercel, Railway, Render, Fly.io, or similar

Database hosting:
  Neon, Supabase, Railway, Render, or managed Postgres

Error tracking:
  Sentry or similar

Analytics:
  PostHog, Plausible, or self-hosted event table
```

## 33.2 Repo Structure

```txt
/apps
  /web

/packages
  /db
  /types
  /config
  /integrations
  /sync
  /utils
  /ui
```

## 33.3 Integration Package Structure

```txt
/packages/integrations
  /trakt
    client.ts
    normalize.ts
    sync.ts
    types.ts

  /tmdb
    client.ts
    normalize.ts
    types.ts

  /goodreads
    csv-parser.ts
    csv-export.ts
    mapper.ts
    types.ts

  /openlibrary
    client.ts
    normalize.ts
    types.ts

  /google-books
    client.ts
    normalize.ts
    types.ts

  /rawg
    client.ts
    normalize.ts
    types.ts
```

---

# 34. Environment Variables

Example:

```txt
DATABASE_URL
APP_URL
SESSION_SECRET
ENCRYPTION_KEY

TRAKT_CLIENT_ID
TRAKT_CLIENT_SECRET
TRAKT_REDIRECT_URI

TMDB_API_KEY
GOOGLE_BOOKS_API_KEY
RAWG_API_KEY

REDIS_URL
SENTRY_DSN
POSTHOG_KEY
```

Do not expose provider secrets through public frontend environment variables unless the provider explicitly supports safe public keys.

---

# 35. First Build Checklist

Start with this exact order:

```txt
1. Create database schema.
2. Build auth.
3. Build app shell.
4. Build item/user_item CRUD.
5. Build Backlog, Current, Done views.
6. Build item detail page.
7. Build tags and lists.
8. Build local search/filter.
9. Build JSON/CSV export.
10. Build TMDb search.
11. Build Open Library / Google Books search.
12. Build Goodreads CSV import.
13. Build Trakt OAuth.
14. Build Trakt pull.
15. Build Trakt push.
16. Build sync center.
17. Build conflict handling.
18. Polish mobile web.
```

---

# 36. Final Product Definition

The product should be:

```txt
A calm, web-first downtime organizer
for movies, shows, books, games, and manual items
with quick capture,
simple tracking,
lists and tags,
portable data,
and practical sync with the services users already use.
```

The MVP should **not** try to beat every specialist app. It should beat the messy reality of having watchlists, readlists, and game backlogs scattered everywhere.

---

# 37. Visual Direction, Prototype Scope, and Next Workflow

## 37.1 Visual Source / Direction

### Default visual direction

The app should feel like:

```txt
Sofa’s calm downtime-organizer spirit
+
a clean web-first productivity app
+
a lightweight media library
+
zero social-network clutter
```

But it should **not** visually clone Sofa.

The visual direction should be:

```txt
Calm
Warm
Fast
Low-friction
Personal
Poster/cover-forward
Desktop-friendly
Excellent on mobile web
Not corporate
Not gamified
Not database-heavy
```

## 37.2 Reference Apps

Use these as **directional references**, not direct copies.

### Primary reference

```txt
Sofa
```

Use for:

```txt
The mental model
The cozy downtime-library feeling
The idea of organizing media across categories
Simple status-based tracking
```

Do not copy:

```txt
Native iOS visual language too closely
Podcast/player/planner features
Exact navigation
Exact card treatments
Exact terminology
```

### Secondary references

```txt
Letterboxd
```

Use for:

```txt
Movie/poster density
Fast scanning
Film library feel
```

```txt
Raindrop.io
```

Use for:

```txt
Cross-type saved-item organization
Tags
Collections/lists
Quick capture feel
```

```txt
Linear
```

Use for:

```txt
Keyboard-friendly interactions
Command menu
Clean sidebar layout
Fast web app feel
```

```txt
Notion, lightly
```

Use for:

```txt
Flexible organization
Readable lists
Simple metadata editing
```

Avoid:

```txt
Notion-level customization
Database-builder complexity
Too many field types
```

```txt
Apple Reminders / Things / Todoist, lightly
```

Use for:

```txt
Simple queues
Clear status changes
Low cognitive load
```

Avoid:

```txt
Turning the app into a task manager
Dates, deadlines, recurring reminders, planner bloat
```

## 37.3 Desired Look

### Recommended visual style

```txt
Warm minimalism
```

Not sterile SaaS minimalism. Not heavy entertainment-app maximalism.

The app should feel like a personal shelf, not an admin dashboard.

### Palette direction

Use a mostly neutral base:

```txt
Background:
  warm off-white or soft dark mode

Surfaces:
  cards, panels, drawers

Text:
  high-contrast but not harsh

Accent:
  one warm primary color
  one subtle secondary color

Media:
  posters and covers provide most of the visual color
```

Suggested palette personality:

```txt
Warm gray
Soft cream
Charcoal
Muted amber / coral / sage / blue accent
```

Avoid:

```txt
Bright neon
Overly saturated gradients
Corporate blue everywhere
Too many semantic colors
```

## 37.4 Typography Direction

Use a modern, readable sans-serif.

Recommended feel:

```txt
Clean
Friendly
Highly legible
Works well for dense lists and item titles
```

Possible font directions:

```txt
Inter-style neutral UI font
Geist-style modern web font
System font stack for speed and simplicity
```

Typography hierarchy:

```txt
Page title:
  confident but not huge

Item title:
  readable in cards and rows

Metadata:
  compact, secondary, scannable

Tags:
  small but legible

Descriptions/notes:
  comfortable long-form reading
```

## 37.5 Layout Direction

### Desktop

Use a sidebar-first app layout:

```txt
Left sidebar:
  Home
  Backlog
  Current
  Done
  Lists
  Sync
  Settings

Top area:
  Universal search / quick add

Main area:
  Cards, rows, or mixed views

Right drawer:
  Optional item detail preview
```

Desktop should feel efficient and keyboard-friendly.

### Mobile web

Use a simplified navigation model:

```txt
Top search/add
Bottom nav or compact tab nav
Full-screen item detail
Drawer-based filters
Large tap targets
Poster/card browsing
```

Mobile should feel like a real app, even though it is web-first.

## 37.6 Design System

Use a small custom design system rather than a heavy prebuilt theme.

Recommended implementation:

```txt
Tailwind CSS
Radix primitives
shadcn/ui as a starting point, not as a final visual identity
Custom design tokens
```

Core tokens:

```txt
Color
Spacing
Border radius
Typography
Shadow
Surface elevation
Status colors
Media-type badges
Focus states
```

Core components:

```txt
AppShell
Sidebar
MobileNav
CommandMenu
UniversalSearch
ItemCard
ItemRow
ItemDetailDrawer
StatusBadge
MediaTypeBadge
TagPill
RatingInput
ProgressInput
ListPicker
FilterBar
FilterDrawer
EmptyState
SyncStatusBadge
ImportPreviewTable
ConflictCard
```

## 37.7 Visual Concepts Required

Before building the coded prototype, create **three visual concepts**.

### Concept A: Cozy Shelf

Best for:

```txt
Users who want the app to feel personal and warm.
```

Visual traits:

```txt
Large covers/posters
Soft cards
Warm background
Gentle shadows
Personal library feeling
Friendly empty states
```

Good for:

```txt
Casual users
Book/movie collectors
Downtime vibe
```

Risk:

```txt
Could feel less efficient for power users.
```

### Concept B: Fast Library

Best for:

```txt
Users who want speed, density, and control.
```

Visual traits:

```txt
Sidebar
Compact rows
Fast filters
Command menu
Keyboard shortcuts
High information density
```

Good for:

```txt
Trakt users
Large libraries
Desktop-first usage
```

Risk:

```txt
Could feel too utilitarian if not softened.
```

### Concept C: Magazine Grid

Best for:

```txt
Users who browse visually and want inspiration.
```

Visual traits:

```txt
Poster-forward grid
Large visual collections
Mood-based sections
Beautiful Home screen
Strong “what should I do tonight?” experience
```

Good for:

```txt
Movies
Shows
Games
Casual discovery
```

Risk:

```txt
Books and manual items may need careful treatment.
```

## 37.8 Recommended Direction

The best final direction is likely a hybrid:

```txt
Concept A warmth
+
Concept B efficiency
+
Concept C poster-forward browsing
```

The default product direction should be:

> **A calm, warm, poster-forward library that becomes denser and faster when the user needs it.**

In practice:

```txt
Home:
  more visual and cozy

Backlog:
  grid or row toggle

Current:
  progress-focused

Done:
  history/log style

Sync:
  utilitarian and clear

Settings:
  simple and boring
```

---

# 38. Interactivity Level

## 38.1 Recommendation

Build a **coded working prototype**, not just static mocks.

Because this is a web app with lots of stateful behavior, a static mock will not properly test the product.

The first prototype should be:

```txt
Next.js
React
TypeScript
Tailwind
Mock data
No real auth required
No real integrations required
Local state or mocked API
Responsive desktop/mobile
```

## 38.2 Prototype Type

### Do not start with only static screens

Static screens are useful for exploring visual direction, but they will not validate:

```txt
Quick add
Filtering
Status changes
List management
Tagging
Import preview
Sync conflicts
Item detail behavior
Mobile navigation
```

### Build this instead

Use a two-step prototype approach:

```txt
Step 1:
  Three static visual concepts

Step 2:
  One coded interactive prototype based on the chosen direction
```

This keeps visual exploration fast while still producing something realistic enough to test.

## 38.3 Prototype Scope

The coded prototype should include these screens:

```txt
Landing page
Home
Backlog
Current
Done
Lists
List detail
Item detail
Add item flow
Sync center
Goodreads import preview
Trakt sync mock
Settings
```

## 38.4 Prototype Interactions

The prototype should support:

```txt
Search mock items
Add item from mock search
Add manual item
Change status
Move item to backlog/current/done/abandoned
Add/remove tags
Add/remove item from list
Create list
Filter backlog
Sort backlog
Open item detail
Edit notes
Set rating
Set progress
Run fake sync
Show fake sync conflict
Resolve fake conflict
Preview Goodreads CSV import with sample rows
Export mock JSON/CSV button state
```

## 38.5 What Should Be Mocked

Mock these in the first prototype:

```txt
Authentication
Trakt OAuth
TMDb API
Open Library API
Google Books API
Goodreads CSV parsing
Actual database persistence
Real sync jobs
Real conflict generation
```

Use realistic sample data so the product feels real.

Sample data should include:

```txt
Movies
TV shows
Books
Games
Manual items
Duplicate-looking items
Items from Trakt
Items from Goodreads
Items with no cover
Items with long titles
Items with notes
Items in multiple lists
Items with sync conflicts
```

---

# 39. Next Workflow

## 39.1 Recommended Next Workflow

The best workflow from here is:

```txt
1. Product flow refinement
2. Three visual concepts
3. Pick one direction
4. Coded prototype
5. UX audit
6. MVP implementation plan
```

## 39.2 Step 1: Product Flow Refinement

Before visual work, refine the key flows.

Required flows:

```txt
Add a movie/show/book/game
Add a manual item
Move item from backlog to current
Mark item done
Create a list
Tag an item
Import Goodreads CSV
Connect Trakt
Resolve sync conflict
Export library
```

Output:

```txt
Flow map
Screen list
Interaction notes
Edge cases
```

## 39.3 Step 2: Three Visual Concepts

Create three concepts:

```txt
Cozy Shelf
Fast Library
Magazine Grid
```

Each concept should include:

```txt
Home screen
Backlog screen
Item detail
Add item/search state
Mobile view
```

Output:

```txt
15 total mock screens
5 screens per concept
```

## 39.4 Step 3: Direction Selection

Evaluate the three concepts using this rubric:

```txt
Does it feel no-fuss?
Does it feel web-native?
Does it make adding items fast?
Does it make choosing what to do easy?
Does it scale to large libraries?
Does it work on mobile?
Does it avoid looking like a clone of Sofa?
Does it avoid looking like a generic SaaS dashboard?
```

Pick one direction or combine the strongest parts.

## 39.5 Step 4: Coded Prototype

Build a working prototype with mocked data.

Recommended stack:

```txt
Next.js
React
TypeScript
Tailwind
Radix/shadcn primitives
Mock service layer
Local storage persistence, optional
```

Prototype routes:

```txt
/
/app
/app/backlog
/app/current
/app/done
/app/lists
/app/lists/:id
/app/item/:id
/app/sync
/app/settings
```

Prototype should include:

```txt
Responsive layout
Mock add flow
Mock universal search
Mock filtering
Mock item status changes
Mock tags/lists
Mock sync center
Mock import preview
Mock conflict resolution
```

## 39.6 Step 5: UX Audit

After the coded prototype, audit:

```txt
Is the app too complex?
Is quick add obvious enough?
Can users understand statuses instantly?
Does sync feel trustworthy?
Are lists and tags clear?
Does mobile feel native enough?
Does the app still feel no-fuss?
```

Audit output:

```txt
UX issues
Severity
Recommended fixes
MVP cuts
Post-MVP ideas
```

## 39.7 Step 6: MVP Implementation Plan

Only after the prototype is validated, move into real implementation.

Implementation order:

```txt
1. Database schema
2. Auth
3. Real item/user_item CRUD
4. Lists and tags
5. Local search/filter
6. Metadata search
7. Export
8. Goodreads import
9. Trakt OAuth
10. Trakt sync
11. Sync center
12. Conflict handling
```

---

# 40. Updated Decision Summary

## Visual source / direction

Use:

```txt
Sofa as product inspiration
Letterboxd as poster/library inspiration
Raindrop as saved-item organization inspiration
Linear as web-app speed inspiration
```

Final look:

```txt
Warm
Calm
Poster-forward
Web-native
Efficient
Not bloated
Not a clone
```

## Interactivity

Build:

```txt
Three static visual concepts first
Then one coded interactive prototype
```

Do **not** rely only on static mockups.

## Next workflow

Proceed in this order:

```txt
Product flow refinement
→ three visual concepts
→ direction selection
→ coded prototype
→ UX audit
→ MVP build plan
```

## Prototype target

The first interactive version should feel like:

> “A real app with fake data,” not “a pretty screenshot.”

[1]: https://github.com/trakt/trakt-api "GitHub - trakt/trakt-api: The Trakt API is a RESTful API that allows developers to integrate TV show and movie tracking features into their applications. It enables access to Trakt's extensive media database and lets apps synchronize a user's watch history, ratings, and lists with their Trakt.tv profile. · GitHub"
[2]: https://help.goodreads.com/s/article/Does-Goodreads-support-the-use-of-APIs "Goodreads Help"
[3]: https://letterboxd.com/api-beta/ "‎API • Letterboxd"
[4]: https://api-docs.letterboxd.com/ "Letterboxd API"
[5]: https://docs.hardcover.app/api/getting-started/ "Getting Started with the API | Hardcover"
[6]: https://developer.themoviedb.org/docs/getting-started "Getting Started"
[7]: https://openlibrary.org/dev/docs/api/books "Developer Center / APIs / Books API | Open Library"
[8]: https://developers.google.com/books/docs/v1/using "Using the API  |  Google Books APIs  |  Google for Developers"
[9]: https://rawg.io/apidocs "Explore RAWG Video Games Database API • RAWG"
[10]: https://api-docs.igdb.com/ "IGDB API docs"
[11]: https://help.goodreads.com/s/article/How-do-I-import-or-export-my-books-1553870934590?utm_source=chatgpt.com "How do I import or export my books? - Goodreads"
