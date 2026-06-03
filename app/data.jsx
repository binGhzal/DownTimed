/* DOWNTIMED — mock data layer. Exposes window.DT_DATA + helpers. */

// ── ACCENTS (brand jewels) ──────────────────────────────────
const ACCENTS = [
  { name: 'lime',    vivid: '#C6FF24', ink: '#5E7A00', fg: '#0E0E0E' },
  { name: 'saffron', vivid: '#E89A3C', ink: '#8A5A14', fg: '#0E0E0E' },
  { name: 'ember',   vivid: '#D94E2C', ink: '#8F2E19', fg: '#F5EBD6' },
  { name: 'rose',    vivid: '#C74B7A', ink: '#7A2A4A', fg: '#F5EBD6' },
  { name: 'emerald', vivid: '#2E7A57', ink: '#1C4A34', fg: '#F5EBD6' },
  { name: 'lapis',   vivid: '#2A4E8F', ink: '#1A3560', fg: '#F5EBD6' },
];

// ── COVER PALETTE (ground / ink) — riso + void ladder ───────
const COVER_PALETTE = [
  { bg: '#0E0E0E', fg: '#C6FF24' },
  { bg: '#C6FF24', fg: '#0E0E0E' },
  { bg: '#2B2B2B', fg: '#F5EBD6' },
  { bg: '#D94E2C', fg: '#F5EBD6' },
  { bg: '#2A4E8F', fg: '#F5EBD6' },
  { bg: '#2E7A57', fg: '#FAE7B1' },
  { bg: '#E89A3C', fg: '#0E0E0E' },
  { bg: '#C74B7A', fg: '#F5EBD6' },
  { bg: '#6B2C5A', fg: '#FAE7B1' },
  { bg: '#FAE7B1', fg: '#0E0E0E' },
  { bg: '#1A1A1A', fg: '#E89A3C' },
  { bg: '#EDE4D0', fg: '#0E0E0E' },
];

const TYPE_META = {
  movie:  { label: 'Movie',  glyph: 'film',    creator: 'Dir.',     unit: 'min' },
  show:   { label: 'Show',   glyph: 'tv',      creator: 'Created',  unit: 'eps' },
  book:   { label: 'Book',   glyph: 'book',    creator: 'By',       unit: 'pages' },
  game:   { label: 'Game',   glyph: 'gamepad', creator: 'Studio',   unit: 'hrs' },
  manual: { label: 'Item',   glyph: 'star',    creator: 'From',     unit: '' },
};

const STATUS_META = {
  backlog:   { label: 'Backlog' },
  current:   { label: 'Current' },
  done:      { label: 'Done' },
  abandoned: { label: 'Abandoned' },
  hidden:    { label: 'Hidden' },
};

const MOODS = ['comfort', 'light', 'funny', 'serious', 'deep', 'scary', 'cozy'];

function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) | 0; } return Math.abs(h); }
function coverFor(item) { if (item.coverIdx != null) return COVER_PALETTE[item.coverIdx]; return COVER_PALETTE[hashStr(item.title) % COVER_PALETTE.length]; }

// ── LISTS ───────────────────────────────────────────────────
const LISTS = [
  { id: 'l1', name: 'Weekend movies',     desc: 'Saturday-night, low-commitment.' },
  { id: 'l2', name: 'Short books',        desc: 'Under 300 pages, finishable in a sitting or two.' },
  { id: 'l3', name: 'Cozy games',         desc: 'No fail states. Soft landings.' },
  { id: 'l4', name: 'Recommended by friends', desc: 'The pile of "you HAVE to".' },
  { id: 'l5', name: 'Before the trip',    desc: 'Clear these before September.' },
];

// ── TAGS ────────────────────────────────────────────────────
const ALL_TAGS = ['sci-fi','comfort','deep','funny','serious','fantasy','friend-rec','short','cozy','noir','classic','re-read','netflix','steam','switch','kindle'];

// ── LIBRARY ─────────────────────────────────────────────────
// progress: {type, value, total}. rating: 0–100 or null.
const LIBRARY = [
  // ── CURRENT ──
  { id:'i1', type:'show', title:'Severance', year:2022, creator:'Dan Erickson', meta:'S2 · Apple TV+',
    status:'current', progress:{type:'episodes', value:4, total:10}, rating:null, source:'trakt',
    tags:['sci-fi','serious'], lists:[], moods:['serious','deep'], time:'short',
    notes:'Watching one per week with M. Do not spoil the elevator.', addedAt:'2026-05-02', startedAt:'2026-05-10',
    desc:'A team whose memories are surgically divided between work and personal life begins to unravel the truth of their jobs.' },
  { id:'i2', type:'book', title:'The Three-Body Problem', year:2008, creator:'Liu Cixin', meta:'400 pages',
    status:'current', progress:{type:'pages', value:212, total:400}, rating:null, source:'goodreads',
    tags:['sci-fi','deep'], lists:['l4'], moods:['deep','serious'], time:'long',
    notes:'Friend-rec from Dev. Slow burn but the physics is worth it.', addedAt:'2026-04-18', startedAt:'2026-05-01',
    desc:'During the Cultural Revolution, a secret military project makes contact with an alien civilization on the brink of destruction.' },
  { id:'i3', type:'game', title:'Hollow Knight', year:2017, creator:'Team Cherry', meta:'~30 hrs · Switch',
    status:'current', progress:{type:'percent', value:62, total:100}, rating:null, source:'manual',
    tags:['fantasy','switch'], lists:['l3'], moods:['serious'], time:'long',
    notes:'Stuck on the second dreamer. Picking away at it before bed.', addedAt:'2026-03-20', startedAt:'2026-04-02',
    desc:'A lone knight descends into the ruined, bug-filled kingdom of Hallownest.' },
  { id:'i4', type:'movie', title:'Perfect Days', year:2023, creator:'Wim Wenders', meta:'124 min',
    status:'current', progress:{type:'percent', value:40, total:100}, rating:null, source:'tmdb',
    tags:['comfort','deep'], lists:[], moods:['comfort','deep','cozy'], time:'long',
    notes:'Paused halfway — the kind of film you don\u2019t rush.', addedAt:'2026-05-20', startedAt:'2026-05-28',
    desc:'A Tokyo toilet cleaner finds beauty and routine in his quiet, repeating days.' },

  // ── BACKLOG ──
  { id:'i5', type:'movie', title:'Dune: Part Two', year:2024, creator:'Denis Villeneuve', meta:'166 min',
    status:'backlog', progress:null, rating:null, source:'trakt', sourceNote:'rec by Priya',
    tags:['sci-fi','friend-rec'], lists:['l1','l4'], moods:['serious','deep'], time:'long', priority:3,
    notes:'', addedAt:'2026-05-29',
    desc:'Paul Atreides unites with the Fremen to wage war against the House Harkonnen.' },
  { id:'i6', type:'book', title:'Piranesi', year:2020, creator:'Susanna Clarke', meta:'272 pages',
    status:'backlog', progress:null, rating:null, source:'goodreads',
    tags:['fantasy','short'], lists:['l2'], moods:['cozy','deep'], time:'medium', priority:2,
    notes:'', addedAt:'2026-05-21',
    desc:'A man lives alone in an infinite labyrinth of halls and tides, keeping a meticulous journal.' },
  { id:'i7', type:'game', title:'Stardew Valley', year:2016, creator:'ConcernedApe', meta:'open-ended · Switch',
    status:'backlog', progress:null, rating:null, source:'manual',
    tags:['cozy','comfort','switch'], lists:['l3'], moods:['cozy','comfort'], time:'long', priority:1,
    notes:'For when work gets loud.', addedAt:'2026-04-30',
    desc:'Inherit a run-down farm and build the life you want, one season at a time.' },
  { id:'i8', type:'show', title:'The Bear', year:2022, creator:'Christopher Storer', meta:'S3 · FX',
    status:'backlog', progress:null, rating:null, source:'trakt',
    tags:['serious'], lists:[], moods:['serious'], time:'short', priority:2,
    notes:'', addedAt:'2026-05-12',
    desc:'A fine-dining chef returns home to run his family\u2019s chaotic Chicago sandwich shop.' },
  { id:'i9', type:'movie', title:'Past Lives', year:2023, creator:'Celine Song', meta:'105 min',
    status:'backlog', progress:null, rating:null, source:'tmdb', sourceNote:'rec by Lena',
    tags:['deep','friend-rec'], lists:['l4'], moods:['deep','serious'], time:'long', priority:3,
    notes:'', addedAt:'2026-05-08',
    desc:'Two childhood friends reconnect across decades and continents, confronting what might have been.' },
  { id:'i10', type:'book', title:'A Memory Called Empire', year:2019, creator:'Arkady Martine', meta:'462 pages',
    status:'backlog', progress:null, rating:null, source:'goodreads',
    tags:['sci-fi'], lists:[], moods:['deep'], time:'long', priority:2,
    notes:'', addedAt:'2026-04-22',
    desc:'An ambassador arrives at the heart of a vast empire to investigate her predecessor\u2019s death.' },
  { id:'i11', type:'game', title:'Outer Wilds', year:2019, creator:'Mobius Digital', meta:'~20 hrs · Steam',
    status:'backlog', progress:null, rating:null, source:'manual', sourceNote:'rec by Dev',
    tags:['sci-fi','friend-rec','steam'], lists:['l4'], moods:['deep'], time:'long', priority:3,
    notes:'Everyone says go in blind. So: blind.', addedAt:'2026-03-30',
    desc:'Explore a solar system trapped in a 22-minute time loop, uncovering an ancient mystery.' },
  { id:'i12', type:'movie', title:'Paddington 2', year:2017, creator:'Paul King', meta:'103 min',
    status:'backlog', progress:null, rating:null, source:'tmdb',
    tags:['comfort','funny','short'], lists:['l1'], moods:['comfort','funny','cozy'], time:'long', priority:1,
    notes:'', addedAt:'2026-05-25',
    desc:'A polite bear searches for the perfect present and ends up in a wrongful-imprisonment caper.' },
  { id:'i13', type:'book', title:'Tomorrow, and Tomorrow, and Tomorrow', year:2022, creator:'Gabrielle Zevin', meta:'416 pages',
    status:'backlog', progress:null, rating:null, source:'goodreads', sourceNote:'rec by Priya',
    tags:['friend-rec'], lists:['l4','l5'], moods:['deep'], time:'long', priority:2,
    notes:'', addedAt:'2026-05-03',
    desc:'Two friends build video games — and a complicated lifelong partnership — across thirty years.' },
  { id:'i14', type:'movie', title:'Everything Everywhere All at Once', year:2022, creator:'Daniels', meta:'139 min',
    status:'backlog', progress:null, rating:null, source:'trakt',
    tags:['funny','sci-fi'], lists:['l1'], moods:['funny','deep'], time:'long', priority:2,
    notes:'', addedAt:'2026-04-15',
    desc:'A laundromat owner is swept into a multiverse adventure to save existence.' },
  { id:'i15', type:'show', title:'Pachinko', year:2022, creator:'Soo Hugh', meta:'Apple TV+',
    status:'backlog', progress:null, rating:null, source:'trakt', sourceNote:'rec by Mom',
    tags:['serious','deep','friend-rec'], lists:['l5'], moods:['deep','serious'], time:'short', priority:2,
    notes:'', addedAt:'2026-04-09',
    desc:'A Korean family\u2019s saga of love, sacrifice and survival across four generations.' },
  { id:'i16', type:'manual', title:'NASA: the secret history of the Saturn V', year:null, creator:'YouTube · Apollo archive', meta:'video · ~48 min',
    status:'backlog', progress:null, rating:null, source:'manual', sourceNote:'sent by Dad',
    tags:['short'], lists:[], moods:['serious'], time:'short', priority:1, customUrl:'youtube.com/watch?v=…',
    notes:'Saved from a group chat. Watch with headphones.', addedAt:'2026-05-27',
    desc:'A long-form documentary essay on the engineering of the Saturn V rocket.' },
  { id:'i17', type:'book', title:'Convenience Store Woman', year:2016, creator:'Sayaka Murata', meta:'176 pages',
    status:'backlog', progress:null, rating:null, source:'goodreads',
    tags:['short','funny'], lists:['l2'], moods:['light','funny'], time:'medium', priority:1,
    notes:'', addedAt:'2026-05-18',
    desc:'A woman who has worked at the same convenience store for eighteen years resists the world\u2019s expectations.' },
  { id:'i18', type:'game', title:'Pentiment', year:2022, creator:'Obsidian', meta:'~20 hrs · Steam',
    status:'backlog', progress:null, rating:null, source:'manual',
    tags:['steam','serious'], lists:[], moods:['deep','serious'], time:'long', priority:2,
    notes:'', addedAt:'2026-04-28',
    desc:'A murder mystery set in 16th-century Bavaria, told through hand-illustrated manuscript art.' },

  // ── DONE ──
  { id:'i19', type:'movie', title:'Dune', year:2021, creator:'Denis Villeneuve', meta:'155 min',
    status:'done', progress:null, rating:90, source:'trakt',
    tags:['sci-fi','classic'], lists:[], moods:['serious','deep'], time:'long',
    notes:'Saw it in IMAX. The sandworm reveal earned every second.', addedAt:'2025-11-02', startedAt:'2025-11-04', finishedAt:'2026-03-14',
    desc:'Paul Atreides travels to the desert planet Arrakis to secure his family\u2019s future.' },
  { id:'i20', type:'book', title:'Dune', year:1965, creator:'Frank Herbert', meta:'688 pages',
    status:'done', progress:null, rating:100, source:'goodreads',
    tags:['sci-fi','classic','re-read'], lists:[], moods:['deep','serious'], time:'long',
    notes:'Third re-read. Still the high-water mark.', addedAt:'2025-09-10', startedAt:'2025-09-12', finishedAt:'2026-02-20',
    desc:'On the desert planet Arrakis, a noble family is betrayed and a messianic legend is born.' },
  { id:'i21', type:'show', title:'Andor', year:2022, creator:'Tony Gilroy', meta:'S1 · Disney+',
    status:'done', progress:null, rating:95, source:'trakt',
    tags:['sci-fi','serious'], lists:[], moods:['serious'], time:'short',
    notes:'The prison arc is some of the best TV of the decade.', addedAt:'2025-12-01', finishedAt:'2026-02-28',
    desc:'The making of a reluctant rebel in the early days of the Galactic Empire.' },
  { id:'i22', type:'game', title:'Tunic', year:2022, creator:'Andrew Shouldice', meta:'~12 hrs · Steam',
    status:'done', progress:null, rating:85, source:'manual',
    tags:['steam','fantasy'], lists:[], moods:['cozy'], time:'long',
    notes:'The in-game manual conceit is genius.', addedAt:'2025-10-15', finishedAt:'2026-01-30',
    desc:'A small fox explores a beautiful, dangerous land guided by a mysterious instruction booklet.' },
  { id:'i23', type:'movie', title:'The Holdovers', year:2023, creator:'Alexander Payne', meta:'133 min',
    status:'done', progress:null, rating:80, source:'tmdb',
    tags:['comfort','funny'], lists:[], moods:['comfort','funny'], time:'long',
    notes:'', addedAt:'2025-12-20', finishedAt:'2026-01-04',
    desc:'A curmudgeonly teacher is stuck supervising students over the holiday break.' },
  { id:'i24', type:'book', title:'Project Hail Mary', year:2021, creator:'Andy Weir', meta:'496 pages',
    status:'done', progress:null, rating:88, source:'goodreads',
    tags:['sci-fi','funny'], lists:[], moods:['funny','light'], time:'long',
    notes:'Read it in three sittings. Rocky.', addedAt:'2025-08-22', finishedAt:'2025-12-12',
    desc:'A lone astronaut wakes with amnesia aboard a spacecraft, humanity\u2019s last hope riding on him.' },
  { id:'i25', type:'show', title:'Fleabag', year:2016, creator:'Phoebe Waller-Bridge', meta:'S2 · Amazon',
    status:'done', progress:null, rating:100, source:'trakt',
    tags:['funny','serious','re-read'], lists:[], moods:['funny','deep'], time:'short',
    notes:'The hot priest. That\u2019s the note.', addedAt:'2025-07-10', finishedAt:'2025-11-30',
    desc:'A sharp, grief-stricken woman careens through life and breaks the fourth wall doing it.' },
  { id:'i26', type:'movie', title:'Aftersun', year:2022, creator:'Charlotte Wells', meta:'102 min',
    status:'done', progress:null, rating:92, source:'tmdb', sourceNote:'rec by Lena',
    tags:['deep','friend-rec'], lists:[], moods:['deep'], time:'long',
    notes:'Cried at an arcade scene. Unprepared.', addedAt:'2025-09-30', finishedAt:'2025-10-22',
    desc:'A woman recalls a seaside holiday with her young father, piecing together who he was.' },

  // ── ABANDONED ──
  { id:'i27', type:'show', title:'Westworld', year:2016, creator:'Lisa Joy & Jonathan Nolan', meta:'S3 · HBO',
    status:'abandoned', progress:{type:'episodes', value:3, total:8}, rating:40, source:'trakt',
    tags:['sci-fi'], lists:[], moods:['serious'], time:'short',
    notes:'Lost the thread somewhere in season 3. Tapping out.', addedAt:'2025-06-01', startedAt:'2025-06-10',
    desc:'A futuristic theme park populated by lifelike androids spirals beyond its makers\u2019 control.' },
  { id:'i28', type:'book', title:'Infinite Jest', year:1996, creator:'David Foster Wallace', meta:'1079 pages',
    status:'abandoned', progress:{type:'pages', value:180, total:1079}, rating:null, source:'goodreads',
    tags:['deep','serious'], lists:[], moods:['deep'], time:'long',
    notes:'Maybe next winter. The footnotes won this round.', addedAt:'2025-05-15', startedAt:'2025-05-20',
    desc:'A sprawling novel orbiting a film so entertaining it\u2019s lethal, and a tennis academy nearby.' },

  // ── HIDDEN ──
  { id:'i29', type:'movie', title:'Cats', year:2019, creator:'Tom Hooper', meta:'110 min',
    status:'hidden', progress:null, rating:null, source:'manual',
    tags:[], lists:[], moods:[], time:'long',
    notes:'Added as a joke. Hiding it forever.', addedAt:'2026-01-01',
    desc:'A tribe of cats decides which one will ascend to a new life. Notoriously.' },
];

// ── SYNC EVENTS ─────────────────────────────────────────────
const SYNC_EVENTS = [
  { id:'se1', provider:'trakt', dir:'pull', status:'ok',   when:'Today · 09:14', seen:142, created:0, updated:6, skipped:136, failed:0, note:'6 ratings updated from Trakt' },
  { id:'se2', provider:'trakt', dir:'push', status:'ok',   when:'Today · 09:14', seen:3,  created:2, updated:1, skipped:0, failed:0, note:'2 watchlist adds, 1 marked watched' },
  { id:'se3', provider:'goodreads', dir:'import', status:'ok', when:'May 28 · 18:40', seen:214, created:198, updated:0, skipped:14, failed:2, note:'goodreads_library_export.csv' },
  { id:'se4', provider:'trakt', dir:'pull', status:'warn', when:'May 27 · 21:02', seen:140, created:1, updated:3, skipped:135, failed:1, note:'1 conflict raised (Westworld rating)' },
  { id:'se5', provider:'trakt', dir:'pull', status:'ok',   when:'May 26 · 08:55', seen:138, created:0, updated:2, skipped:136, failed:0, note:'routine sync' },
];

// ── SYNC CONFLICTS ──────────────────────────────────────────
const CONFLICTS = [
  { id:'c1', itemId:'i27', field:'rating', local:'8/10 (80)', remote:'4/10 (40)', base:'—',
    why:'You rated this locally; Trakt has a different rating.' },
  { id:'c2', itemId:'i1', field:'status', local:'Current · ep 4', remote:'Done (watched)',
    base:'Current', why:'Trakt marked all episodes watched; you\u2019re mid-season here.' },
  { id:'c3', itemId:'i21', field:'finished_at', local:'Feb 28, 2026', remote:'Mar 02, 2026',
    base:'—', why:'Finish dates differ by two days between local and Trakt.' },
];

// ── UNIVERSAL SEARCH POOL (for Add flow) ────────────────────
const SEARCH_POOL = [
  { type:'movie', title:'Dune', year:1984, creator:'David Lynch', src:'TMDb', meta:'137 min', inLib:false },
  { type:'movie', title:'Dune', year:2021, creator:'Denis Villeneuve', src:'TMDb', meta:'155 min', inLib:true, libId:'i19' },
  { type:'movie', title:'Dune: Part Two', year:2024, creator:'Denis Villeneuve', src:'TMDb', meta:'166 min', inLib:true, libId:'i5' },
  { type:'book',  title:'Dune', year:1965, creator:'Frank Herbert', src:'Open Library', meta:'688 pages', inLib:true, libId:'i20' },
  { type:'book',  title:'Dune Messiah', year:1969, creator:'Frank Herbert', src:'Google Books', meta:'256 pages', inLib:false },
  { type:'show',  title:'Dune: Prophecy', year:2024, creator:'HBO', src:'TMDb', meta:'6 episodes', inLib:false },
  { type:'game',  title:'Dune: Spice Wars', year:2023, creator:'Shiro Games', src:'RAWG', meta:'~25 hrs', inLib:false },
  { type:'game',  title:'Dune: Imperium (digital)', year:2024, creator:'Dire Wolf', src:'RAWG', meta:'~3 hrs', inLib:false },
];

// generic fallback results when query isn't "dune"
const SEARCH_GENERIC = [
  { type:'movie', title:'The Substance', year:2024, creator:'Coralie Fargeat', src:'TMDb', meta:'141 min', inLib:false },
  { type:'show',  title:'Shogun', year:2024, creator:'FX', src:'TMDb', meta:'10 episodes', inLib:false },
  { type:'book',  title:'The Will of the Many', year:2023, creator:'James Islington', src:'Open Library', meta:'624 pages', inLib:false },
  { type:'game',  title:'Animal Well', year:2024, creator:'Billy Basso', src:'RAWG', meta:'~6 hrs', inLib:false },
  { type:'book',  title:'Babel', year:2022, creator:'R.F. Kuang', src:'Google Books', meta:'546 pages', inLib:false },
];

// ── GOODREADS CSV IMPORT (sample preview rows) ──────────────
const GOODREADS_ROWS = [
  { title:'The Left Hand of Darkness', author:'Ursula K. Le Guin', isbn:'9780441478125', shelf:'to-read', rating:0, dateRead:'', map:'backlog', status:'ok' },
  { title:'Klara and the Sun', author:'Kazuo Ishiguro', isbn:'9780571364886', shelf:'read', rating:4, dateRead:'2025/12/02', map:'done', status:'ok' },
  { title:'The Fifth Season', author:'N.K. Jemisin', isbn:'9780316229296', shelf:'currently-reading', rating:0, dateRead:'', map:'current', status:'ok' },
  { title:'Circe', author:'Madeline Miller', isbn:'9780316556347', shelf:'read', rating:5, dateRead:'2025/09/18', map:'done', status:'dupe', dupeOf:'A title close to one already in your library' },
  { title:'Project Hail Mary', author:'Andy Weir', isbn:'9780593135204', shelf:'read', rating:5, dateRead:'2025/12/12', map:'done', status:'dupe', dupeOf:'Project Hail Mary (already in library)' },
  { title:'The Goldfinch', author:'Donna Tartt', isbn:'', shelf:'read', rating:3, dateRead:'2025/03/01', map:'done', status:'warn', warn:'No ISBN — matched by title + author' },
  { title:'Ducks, Newburyport', author:'Lucy Ellmann', isbn:'9781948226059', shelf:'abandoned', rating:0, dateRead:'', map:'abandoned', status:'ok' },
  { title:'???', author:'(blank row)', isbn:'', shelf:'', rating:0, dateRead:'', map:'—', status:'fail', warn:'Row 47 — missing title, will be skipped' },
];

window.DT_DATA = { ACCENTS, COVER_PALETTE, TYPE_META, STATUS_META, MOODS, LISTS, ALL_TAGS, LIBRARY, SYNC_EVENTS, CONFLICTS, SEARCH_POOL, SEARCH_GENERIC, GOODREADS_ROWS };
window.DT_HELP = { hashStr, coverFor };
