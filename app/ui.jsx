/* DOWNTIMED — shared UI primitives. Exposes components to window. */
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ── ICONS (Lucide paths, 2px stroke, 24 viewBox) ───────────
const ICONS = {
  home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  play: '<circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>',
  check2: '<path d="M21.8 10A10 10 0 1 1 17 3.3"/><path d="m9 11 3 3L22 4"/>',
  layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  sync: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  settings: '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  chevR: '<path d="m9 18 6-6-6-6"/>',
  chevL: '<path d="m15 18-6-6 6-6"/>',
  chevD: '<path d="m6 9 6 6 6-6"/>',
  film: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18M17 3v18M3 7.5h4M17 7.5h4M3 12h18M3 16.5h4M17 16.5h4"/>',
  tv: '<rect width="20" height="15" x="2" y="7" rx="2"/><path d="m17 2-5 5-5-5"/>',
  book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
  gamepad: '<line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/>',
  star: '<path d="M11.5 2.3a.53.53 0 0 1 .95 0l2.3 4.68a2.1 2.1 0 0 0 1.6 1.16l5.17.76a.53.53 0 0 1 .29.9l-3.73 3.64a2.1 2.1 0 0 0-.61 1.88l.88 5.14a.53.53 0 0 1-.77.56l-4.62-2.43a2.1 2.1 0 0 0-1.97 0L6.4 21.01a.53.53 0 0 1-.77-.56l.88-5.14a2.1 2.1 0 0 0-.61-1.88L2.16 9.8a.53.53 0 0 1 .29-.9l5.17-.76a2.1 2.1 0 0 0 1.6-1.16z"/>',
  sparkle: '<path d="M12 3 13.8 10.2 21 12l-7.2 1.8L12 21l-1.8-7.2L3 12l7.2-1.8z"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
  more: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  arrowR: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  eye: '<path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M10.73 5.08a10.74 10.74 0 0 1 11.2 6.57 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-1.44 2.49"/><path d="M14.08 14.16a3 3 0 0 1-4.24-4.24"/><path d="M17.48 17.5a10.75 10.75 0 0 1-15.42-5.15 1 1 0 0 1 0-.7 10.75 10.75 0 0 1 4.45-5.14"/><path d="m2 2 20 20"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  edit: '<path d="M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z"/>',
  external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  wand: '<path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/>',
  menu: '<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  shuffle: '<path d="m18 14 4 4-4 4"/><path d="m18 2 4 4-4 4"/><path d="M2 18h1.97a4 4 0 0 0 3.3-1.7l5.45-8.6a4 4 0 0 1 3.3-1.7H22"/><path d="M2 6h1.97a4 4 0 0 1 3.6 2.2"/><path d="M22 18h-6.04a4 4 0 0 1-3.3-1.8l-.36-.45"/>',
  link: '<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" x2="16" y1="12" y2="12"/>',
  pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  rotate: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
};

function Icon({ name, size, style, className }) {
  const d = ICONS[name] || '';
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round"
         width={size || undefined} height={size || undefined}
         className={className} style={style}
         dangerouslySetInnerHTML={{ __html: d }} />
  );
}

// ── EYEBROW ─────────────────────────────────────────────────
function Eyebrow({ children, lot, accent }) {
  return (
    <span className={'dt-eyebrow' + (lot ? ' lot' : '')}>
      <span className="bar"></span>{children}
    </span>
  );
}

// ── COVER (typographic poster) ──────────────────────────────
function Cover({ item, mini }) {
  const { coverFor } = window.DT_HELP;
  const pal = coverFor(item);
  const tm = window.DT_DATA.TYPE_META[item.type];
  const len = item.title.length;
  const fs = mini ? 0 : len > 36 ? '8.5cqw' : len > 24 ? '10.5cqw' : len > 14 ? '13cqw' : '16.5cqw';
  if (mini) {
    return (
      <div className="dt-cover" style={{ background: pal.bg, color: pal.fg, height: '100%' }}>
        <div className="ctype" style={{ justifyContent: 'center', opacity: 0.9 }}>
          <Icon name={tm.glyph} size={14} />
        </div>
      </div>
    );
  }
  return (
    <div className="dt-cover" style={{ background: pal.bg, color: pal.fg }}>
      <svg className="rings" viewBox="0 0 100 100" fill="none" stroke={pal.fg} strokeWidth="0.8">
        <circle cx="78" cy="22" r="30" /><circle cx="78" cy="22" r="20" /><circle cx="78" cy="22" r="10" />
      </svg>
      <div className="ctype">
        <Icon name={tm.glyph} size={16} />
        <span className="clot">{tm.label}</span>
      </div>
      <div className="ctitle" style={{ fontSize: fs }}>{item.title}</div>
      <div className="cmeta">{item.year || '—'}{item.creator ? ' · ' + (item.creator.split('&')[0].split(',')[0].trim()) : ''}</div>
    </div>
  );
}

// ── BADGES ──────────────────────────────────────────────────
function TypeBadge({ type }) {
  const tm = window.DT_DATA.TYPE_META[type];
  return <span className="dt-badge type"><Icon name={tm.glyph} size={12} />{tm.label}</span>;
}
function StatusBadge({ status }) {
  const sm = window.DT_DATA.STATUS_META[status];
  return <span className={'dt-badge dt-status ' + status}><span className={'dot ' + status}></span>{sm.label}</span>;
}
function SourceBadge({ source }) {
  const map = { trakt: 'Trakt', goodreads: 'Goodreads', manual: 'Manual', tmdb: 'TMDb', rawg: 'RAWG', openlibrary: 'Open Library' };
  return <span className="src-badge">{map[source] || source}</span>;
}

// ── TAG PILL ────────────────────────────────────────────────
function TagPill({ tag, on, onClick, removable, onRemove }) {
  return (
    <button className={'dt-tag' + (on ? ' on' : '')} onClick={onClick}>
      {tag}
      {removable && <span className="x" onClick={(e) => { e.stopPropagation(); onRemove && onRemove(); }}><Icon name="x" size={11} /></span>}
    </button>
  );
}

// ── RATING STARS (0–100 internal, 5-star display) ───────────
function Stars({ value, onChange, size }) {
  const [hover, setHover] = useState(0);
  const stars = value != null ? Math.round(value / 20) : 0;
  const ro = !onChange;
  return (
    <div className={'dt-stars' + (ro ? ' ro' : '')} onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => {
        const active = (hover || stars) >= n;
        const Tag = ro ? 'span' : 'button';
        return (
          <Tag key={n} className={active ? 'on' : ''}
               onMouseEnter={ro ? undefined : () => setHover(n)}
               onClick={ro ? undefined : () => onChange(n === stars ? null : n * 20)}>
            <Icon name="star" size={size} style={{ fill: active ? 'currentColor' : 'none' }} />
          </Tag>
        );
      })}
    </div>
  );
}

// ── PROGRESS ────────────────────────────────────────────────
function ProgressBar({ progress }) {
  if (!progress || progress.type === 'none') return null;
  const pct = progress.total ? Math.round((progress.value / progress.total) * 100) : 0;
  const label = progress.type === 'percent' ? pct + '%'
    : progress.type === 'pages' ? `p.${progress.value} / ${progress.total}`
    : progress.type === 'episodes' ? `ep ${progress.value} / ${progress.total}` : '';
  return (
    <div>
      <div className="dt-progress"><i style={{ width: pct + '%' }}></i></div>
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.08em', color: 'var(--text-muted)', marginTop: 5, textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}

// ── helpers ─────────────────────────────────────────────────
function fmtDate(s) {
  if (!s) return '—';
  const d = new Date(s + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function fmtMonthYear(s) {
  if (!s) return '—';
  const d = new Date(s + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
function lotNum(id) { const n = (window.DT_HELP.hashStr(id) % 900) + 100; return String(n).padStart(3, '0'); }

Object.assign(window, {
  Icon, Eyebrow, Cover, TypeBadge, StatusBadge, SourceBadge, TagPill, Stars, ProgressBar,
  fmtDate, fmtMonthYear, lotNum,
});
