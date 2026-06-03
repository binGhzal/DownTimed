/* DOWNTIMED — library views: ItemCard, ItemRow, Backlog, Current, Done */

// ── ITEM CARD (grid) ────────────────────────────────────────
function ItemCard({ item, app }) {
  const acts = [];
  if (item.status !== 'current') acts.push({ ic: 'play', t: 'Start', s: 'current' });
  if (item.status !== 'done') acts.push({ ic: 'check', t: 'Done', s: 'done' });
  if (item.status === 'done' || item.status === 'abandoned') acts.push({ ic: 'inbox', t: 'Backlog', s: 'backlog' });
  return (
    <div className="dt-card" onClick={() => app.open(item.id)}>
      <div className="coverwrap">
        <Cover item={item} />
        <div className="dt-stattab"><StatusBadge status={item.status} /></div>
        <div className="dt-cover-actions" onClick={(e) => e.stopPropagation()}>
          {acts.slice(0, 2).map((a) => (
            <button key={a.s} className="dt-qa" title={a.t}
                    onClick={() => app.setStatus(item.id, a.s)}><Icon name={a.ic} /></button>
          ))}
          <button className="dt-qa" title="Open" onClick={() => app.open(item.id)}><Icon name="more" /></button>
        </div>
      </div>
      <div className="cardtitle">{item.title}</div>
      <div className="cardmeta">
        <Icon name={window.DT_DATA.TYPE_META[item.type].glyph} size={11} />
        {item.year || '—'}
        {item.rating != null && <span style={{ color: 'var(--dt-accent-text)' }}>★ {(item.rating / 20).toFixed(1)}</span>}
      </div>
      {item.status === 'current' && item.progress && <ProgressBar progress={item.progress} />}
    </div>
  );
}

// ── ITEM ROW (list) ─────────────────────────────────────────
function ItemRow({ item, app, rightMode }) {
  const tm = window.DT_DATA.TYPE_META[item.type];
  const right = () => {
    if (rightMode === 'done') return <span className="rcell hide-m">{fmtDate(item.finishedAt)}</span>;
    if (item.status === 'current' && item.progress) {
      const p = item.progress; const pct = p.total ? Math.round(p.value / p.total * 100) : 0;
      return <span className="rcell hide-m">{pct}%</span>;
    }
    return <span className="rcell hide-m">{fmtMonthYear(item.addedAt)}</span>;
  };
  return (
    <div className="dt-row" onClick={() => app.open(item.id)}>
      <div className="rcover"><Cover item={item} mini /></div>
      <div style={{ minWidth: 0 }}>
        <div className="rtitle" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
        <div className="rsub">
          <span>{tm.label}</span><span>·</span><span>{item.year || '—'}</span>
          {item.creator && <><span>·</span><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.creator}</span></>}
        </div>
      </div>
      <span className="rcell hide-m"><StatusBadge status={item.status} /></span>
      <span className="rcell hide-m">{item.rating != null ? <Stars value={item.rating} size={14} /> : <span className="muted">—</span>}</span>
      {right()}
      <button className="iconbtn" style={{ width: 30, height: 30, border: 'none' }} onClick={(e) => { e.stopPropagation(); app.open(item.id); }}><Icon name="chevR" size={16} /></button>
    </div>
  );
}

function RowHeader({ rightMode }) {
  return (
    <div className="dt-rowhead">
      <span></span><span>Title</span>
      <span className="hide-m">Status</span>
      <span className="hide-m">Rating</span>
      <span className="hide-m">{rightMode === 'done' ? 'Finished' : 'Added'}</span>
      <span></span>
    </div>
  );
}

// ── library list/grid renderer ──────────────────────────────
function ItemCollection({ items, app, view, rightMode }) {
  if (!items.length) return null;
  if (view === 'row') {
    return (
      <div className="dt-rows">
        <RowHeader rightMode={rightMode} />
        {items.map((it) => <ItemRow key={it.id} item={it} app={app} rightMode={rightMode} />)}
      </div>
    );
  }
  return <div className="dt-grid">{items.map((it) => <ItemCard key={it.id} item={it} app={app} />)}</div>;
}

// ── BACKLOG ─────────────────────────────────────────────────
function BacklogView({ app }) {
  const [type, setType] = useState('all');
  const [tag, setTag] = useState('all');
  const [list, setList] = useState('all');
  const [time, setTime] = useState('all');
  const [sort, setSort] = useState('added');
  const [q, setQ] = useState('');
  const [view, setView] = useState(app.tweaks.defaultView);
  useEffect(() => { setView(app.tweaks.defaultView); }, [app.tweaks.defaultView]);

  const base = app.items.filter((i) => i.status === 'backlog');
  let items = base.filter((i) => (type === 'all' || i.type === type)
    && (tag === 'all' || i.tags.includes(tag))
    && (list === 'all' || i.lists.includes(list))
    && (time === 'all' || i.time === time)
    && (!q || i.title.toLowerCase().includes(q.toLowerCase()) || (i.creator || '').toLowerCase().includes(q.toLowerCase())));
  items = [...items].sort((a, b) => {
    if (sort === 'added') return (b.addedAt || '').localeCompare(a.addedAt || '');
    if (sort === 'title') return a.title.localeCompare(b.title);
    if (sort === 'year') return (b.year || 0) - (a.year || 0);
    if (sort === 'priority') return (b.priority || 0) - (a.priority || 0);
    if (sort === 'random') return window.DT_HELP.hashStr(a.id + app.seed) - window.DT_HELP.hashStr(b.id + app.seed);
    return 0;
  });

  const typeChips = [['all', 'All'], ['movie', 'Movies'], ['show', 'Shows'], ['book', 'Books'], ['game', 'Games'], ['manual', 'Items']];
  const usedTags = [...new Set(base.flatMap((i) => i.tags))].sort();

  return (
    <div className="dt-page" data-screen-label="Backlog">
      <div className="dt-phead">
        {app.tweaks.eyebrow && <Eyebrow lot>BACKLOG / {String(base.length).padStart(3, '0')} / JUN 2026</Eyebrow>}
        <h1>Backlog</h1>
        <p className="lede">Everything you might make time for. Filter it down, or let the app pick.</p>
      </div>

      <div className="dt-toolbar">
        <div className="dt-chips">
          {typeChips.map(([v, l]) => (
            <button key={v} className={'dt-chip' + (type === v ? ' on' : '')} onClick={() => setType(v)}>{l}</button>
          ))}
        </div>
        <div className="dt-spacer"></div>
        <button className="btn btn--ghost btn--sm" onClick={() => app.openPick()}><Icon name="wand" />Pick for me</button>
      </div>

      <div className="dt-toolbar">
        <div className="dt-search" style={{ maxWidth: 240, flex: '0 1 240px' }} onClick={(e) => e.currentTarget.querySelector('input').focus()}>
          <Icon name="search" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter in backlog…"
                 style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontFamily: 'var(--bzr-font-body)', fontSize: 13 }} />
        </div>
        <select className="dt-select" value={tag} onChange={(e) => setTag(e.target.value)}>
          <option value="all">All tags</option>
          {usedTags.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="dt-select" value={list} onChange={(e) => setList(e.target.value)}>
          <option value="all">All lists</option>
          {app.lists.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <select className="dt-select" value={time} onChange={(e) => setTime(e.target.value)}>
          <option value="all">Any length</option>
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>
        <div className="dt-spacer"></div>
        <select className="dt-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="added">Recently added</option>
          <option value="title">Title A–Z</option>
          <option value="year">Release year</option>
          <option value="priority">Priority</option>
          <option value="random">Random</option>
        </select>
        <div className="dt-segment">
          <button className={view === 'grid' ? 'on' : ''} onClick={() => setView('grid')} title="Grid"><GridIcon /></button>
          <button className={view === 'row' ? 'on' : ''} onClick={() => setView('row')} title="Rows"><Icon name="menu" /></button>
        </div>
      </div>

      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>
        {items.length} {items.length === 1 ? 'record' : 'records'}{(type !== 'all' || tag !== 'all' || list !== 'all' || time !== 'all' || q) ? ' · filtered' : ''}
      </div>

      {items.length ? <ItemCollection items={items} app={app} view={view} />
        : <div className="dt-empty"><div className="glyph">✦</div><h3>Nothing here</h3><p>No backlog items match these filters. Loosen them, or add something new.</p><button className="btn btn--primary" onClick={() => app.openAdd()}><Icon name="plus" />Add item</button></div>}
    </div>
  );
}

function GridIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15" dangerouslySetInnerHTML={{ __html: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>' }} />;
}

// ── CURRENT ─────────────────────────────────────────────────
function CurrentView({ app }) {
  const items = app.items.filter((i) => i.status === 'current');
  const groups = [['show', 'Watching'], ['movie', 'Watching'], ['book', 'Reading'], ['game', 'Playing'], ['manual', 'In progress']];
  return (
    <div className="dt-page" data-screen-label="Current">
      <div className="dt-phead">
        {app.tweaks.eyebrow && <Eyebrow lot>CURRENT / {String(items.length).padStart(3, '0')} / JUN 2026</Eyebrow>}
        <h1>Current</h1>
        <p className="lede">What you've actually started. Nudge the progress, or mark it done.</p>
      </div>
      {items.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {items.map((it) => <CurrentRow key={it.id} item={it} app={app} />)}
        </div>
      ) : (
        <div className="dt-empty"><div className="glyph">▶</div><h3>Nothing in progress</h3><p>Start something from your backlog and it'll show up here.</p><button className="btn btn--primary" onClick={() => app.go('backlog')}><Icon name="inbox" />Open backlog</button></div>
      )}
    </div>
  );
}

function CurrentRow({ item, app }) {
  const tm = window.DT_DATA.TYPE_META[item.type];
  const p = item.progress;
  const step = () => {
    if (!p) return;
    if (p.type === 'percent') app.setProgress(item.id, { ...p, value: Math.min(100, p.value + 10) });
    else app.setProgress(item.id, { ...p, value: Math.min(p.total, p.value + 1) });
  };
  return (
    <div className="dt-panel" style={{ display: 'flex', gap: 18, padding: 16, alignItems: 'center', cursor: 'pointer' }} onClick={() => app.open(item.id)}>
      <div style={{ width: 64, height: 96, flexShrink: 0, borderRadius: 2, overflow: 'hidden', border: '1px solid var(--border-default)' }}><Cover item={item} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="dt-rowflex" style={{ marginBottom: 4 }}><TypeBadge type={item.type} /><SourceBadge source={item.source} /></div>
        <div style={{ fontFamily: 'var(--bzr-font-stencil)', fontWeight: 800, fontSize: 22, textTransform: 'uppercase', color: 'var(--text-primary)', lineHeight: 1 }}>{item.title}</div>
        <div className="caption" style={{ marginTop: 6, color: 'var(--text-secondary)' }}>{item.meta}{item.creator ? ' · ' + item.creator : ''}</div>
        {p && <div style={{ marginTop: 12, maxWidth: 420 }}><ProgressBar progress={p} /></div>}
      </div>
      <div className="dt-rowflex" style={{ flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
        {p && <button className="btn btn--ghost btn--sm" onClick={step}><Icon name="plus" />{p.type === 'percent' ? '+10%' : p.type === 'pages' ? '+1 pg' : '+1 ep'}</button>}
        <button className="btn btn--primary btn--sm" onClick={() => app.setStatus(item.id, 'done')}><Icon name="check" />Done</button>
      </div>
    </div>
  );
}

// ── DONE ────────────────────────────────────────────────────
function DoneView({ app }) {
  const [period, setPeriod] = useState('all');
  const [type, setType] = useState('all');
  const [rated, setRated] = useState('all');
  const base = app.items.filter((i) => i.status === 'done');
  let items = base.filter((i) => (type === 'all' || i.type === type)
    && (rated === 'all' || (rated === 'rated' ? i.rating != null : i.rating == null))
    && (period === 'all' || (i.finishedAt && i.finishedAt.startsWith(period))));
  items = [...items].sort((a, b) => (b.finishedAt || '').localeCompare(a.finishedAt || ''));
  const years = [...new Set(base.map((i) => (i.finishedAt || '').slice(0, 4)).filter(Boolean))].sort().reverse();

  return (
    <div className="dt-page" data-screen-label="Done">
      <div className="dt-phead">
        {app.tweaks.eyebrow && <Eyebrow lot>DONE / {String(base.length).padStart(3, '0')} / ARCHIVE</Eyebrow>}
        <h1>Done</h1>
        <p className="lede">The log. Everything you finished, when, and what you thought.</p>
      </div>
      <div className="dt-toolbar">
        <div className="dt-chips">
          {[['all', 'All'], ['movie', 'Movies'], ['show', 'Shows'], ['book', 'Books'], ['game', 'Games']].map(([v, l]) => (
            <button key={v} className={'dt-chip' + (type === v ? ' on' : '')} onClick={() => setType(v)}>{l}</button>
          ))}
        </div>
        <div className="dt-spacer"></div>
        <select className="dt-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="all">All time</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select className="dt-select" value={rated} onChange={(e) => setRated(e.target.value)}>
          <option value="all">Rated &amp; unrated</option>
          <option value="rated">Rated</option>
          <option value="unrated">Unrated</option>
        </select>
      </div>
      {items.length ? <ItemCollection items={items} app={app} view="row" rightMode="done" />
        : <div className="dt-empty"><div className="glyph">✦</div><h3>Nothing logged yet</h3><p>Finished items will appear here with dates and ratings.</p></div>}
    </div>
  );
}

Object.assign(window, { ItemCard, ItemRow, ItemCollection, BacklogView, CurrentView, DoneView, GridIcon });
