/* DOWNTIMED — Landing (marketing), Home, Pick-for-me */

// ── LANDING ─────────────────────────────────────────────────
function LandingView({ app }) {
  const features = [
    { ic: 'plus', t: 'Quick add', d: 'Search a title, paste a link, or jot a manual note. One tap to file it.' },
    { ic: 'inbox', t: 'One backlog', d: 'Movies, shows, books, games and loose ideas in a single calm queue.' },
    { ic: 'wand', t: 'Pick for me', d: 'Tell it your mood and how long you\u2019ve got. It chooses. You start.' },
    { ic: 'sync', t: 'Real sync', d: 'Two-way with Trakt. Goodreads in by CSV. Conflicts you can actually read.' },
    { ic: 'tag', t: 'Lists & tags', d: 'Cozy games. Short books. Recommended by friends. Organize lightly.' },
    { ic: 'download', t: 'Export anytime', d: 'JSON, CSV, Goodreads-shaped. Your library is yours to take.' },
  ];
  return (
    <div className="dt-landing" data-screen-label="Landing">
      <header className="lp-nav">
        <div className="dt-rowflex">
          <img src="assets/mark-inverse.png" style={{ width: 30, height: 30 }} alt="" />
          <span className="wordmark">Downtimed</span>
        </div>
        <div className="dt-rowflex" style={{ gap: 10 }}>
          <button className="btn btn--ghost btn--sm" onClick={() => app.go('home')}>Sign in</button>
          <button className="btn btn--primary btn--sm" onClick={() => app.go('home')}>Start free<Icon name="arrowR" /></button>
        </div>
      </header>

      <section className="lp-hero">
        <Eyebrow lot>BIZARRE / DOWNTIMED / V0.1 / JUN 2026</Eyebrow>
        <h1 className="lp-h1">One calm place<br />for what you want to<br /><em>watch, read &amp; play.</em></h1>
        <p className="lp-sub">Your watchlist, readlist and game backlog are scattered across ten apps and a hundred screenshots. Downtimed files them in one library — quick to add, simple to track, yours to export.</p>
        <div className="dt-rowflex" style={{ gap: 12, marginTop: 8 }}>
          <button className="btn btn--primary btn--lg" onClick={() => app.go('home')} style={{ padding: '14px 24px' }}>Open the app<Icon name="arrowR" /></button>
          <button className="btn btn--ghost btn--lg" onClick={() => app.go('sync')} style={{ padding: '14px 24px' }}><Icon name="sync" />Import from Trakt or Goodreads</button>
        </div>
        <div className="lp-poster-wall">
          {app.items.slice(0, 11).map((it) => (
            <div key={it.id} className="lp-poster"><Cover item={it} /></div>
          ))}
        </div>
      </section>

      <section className="lp-features">
        <Eyebrow lot>CATALOG / WHAT IT DOES</Eyebrow>
        <div className="lp-fgrid">
          {features.map((f) => (
            <div key={f.t} className="lp-feature">
              <div className="lp-ficon"><Icon name={f.ic} size={20} /></div>
              <div style={{ fontFamily: 'var(--bzr-font-stencil)', fontWeight: 800, fontSize: 20, textTransform: 'uppercase', color: 'var(--text-primary)' }}>{f.t}</div>
              <p className="caption" style={{ color: 'var(--text-secondary)' }}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-trust">
        <div>
          <Eyebrow lot>FILED UNDER / YOUR DATA</Eyebrow>
          <h2 style={{ fontFamily: 'var(--bzr-font-stencil)', fontWeight: 800, fontSize: 34, textTransform: 'uppercase', color: 'var(--text-primary)', margin: '12px 0' }}>Your library belongs to you.</h2>
          <p className="body-lead" style={{ color: 'var(--text-secondary)', maxWidth: 520 }}>Export any time. No forced social network. No selling your taste back to you. Private by default — built to organize the mess, not to grow a feed.</p>
        </div>
        <div className="lp-slogan slogan">CATCH<br />THE STARS</div>
      </section>

      <footer className="lp-foot">
        <span className="mono">© 2026 BIZARRE INDUSTRIES · DOWNTIMED V0.1</span>
        <span className="mono">A WEB-FIRST DOWNTIME ORGANIZER</span>
      </footer>
    </div>
  );
}

// ── HOME ────────────────────────────────────────────────────
function HomeView({ app }) {
  const hour = new Date().getHours();
  const greet = hour < 5 ? 'Still up' : hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const backlog = app.items.filter((i) => i.status === 'backlog');
  const current = app.items.filter((i) => i.status === 'current');
  const recentAdded = [...backlog].sort((a, b) => (b.addedAt || '').localeCompare(a.addedAt || '')).slice(0, 6);
  const recentDone = app.items.filter((i) => i.status === 'done').sort((a, b) => (b.finishedAt || '').localeCompare(a.finishedAt || '')).slice(0, 4);
  const spotlight = [...backlog].sort((a, b) => (b.priority || 0) - (a.priority || 0))[0];
  const featured = [...backlog].sort((a, b) => (b.priority || 0) - (a.priority || 0)).slice(0, 3);
  const lastSync = window.DT_DATA.SYNC_EVENTS[0];

  return (
    <div className="dt-page" data-screen-label="Home">
      <div className="dt-home-hero">
        <div className="dt-home-greet">
          {app.tweaks.eyebrow && <Eyebrow lot>HOME / {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()} / 2026</Eyebrow>}
          <h1>{greet}.<br />What now?</h1>
          <p className="lede">{backlog.length} waiting in the backlog · {current.length} on the go. Pick something, or add to the pile.</p>
          <div className="dt-rowflex" style={{ gap: 12, marginTop: 4 }}>
            <button className="btn btn--primary btn--lg" onClick={() => app.openPick()} style={{ padding: '13px 22px' }}><Icon name="wand" />Pick for me</button>
            <button className="btn btn--ghost btn--lg" onClick={() => app.openAdd()} style={{ padding: '13px 22px' }}><Icon name="plus" />Add something</button>
          </div>
        </div>
        {spotlight && (
          <div className="dt-spotlight">
            <div className="dt-spot-cover">
              <image-slot id="dt-spotlight-cover" shape="rect" placeholder="Drop a real cover" style={{ width: '100%', height: '100%', display: 'block' }}></image-slot>
            </div>
            <div className="dt-spot-body">
              <Eyebrow>SPOTLIGHT · FROM YOUR BACKLOG</Eyebrow>
              <div className="dt-spot-title">{spotlight.title}</div>
              <div className="caption sec" style={{ margin: '4px 0 10px' }}>{window.DT_DATA.TYPE_META[spotlight.type].label} · {spotlight.year} · {spotlight.meta}</div>
              <p className="caption sec" style={{ marginBottom: 14 }}>{spotlight.desc}</p>
              <div className="dt-rowflex">
                <button className="btn btn--primary btn--sm" onClick={() => app.setStatus(spotlight.id, 'current')}><Icon name="play" />Start it</button>
                <button className="btn btn--ghost btn--sm" onClick={() => app.open(spotlight.id)}>Details</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {current.length > 0 && (
        <section className="dt-section">
          <SectionHead app={app} eyebrow="CONTINUE" title="On the go" action={{ label: 'All current', fn: () => app.go('current') }} />
          <div className="dt-hscroll">
            {current.map((it) => (
              <div key={it.id} className="dt-hcard" onClick={() => app.open(it.id)}>
                <div className="coverwrap" style={{ border: '1px solid var(--border-default)', borderRadius: 2, overflow: 'hidden' }}><Cover item={it} /></div>
                <div className="cardtitle" style={{ marginTop: 8 }}>{it.title}</div>
                {it.progress && <div style={{ marginTop: 6 }}><ProgressBar progress={it.progress} /></div>}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="dt-section">
        <SectionHead app={app} eyebrow="BY MOOD" title="Jump back in" />
        <div className="dt-chips">
          {['comfort', 'light', 'funny', 'serious', 'deep', 'cozy'].map((m) => (
            <button key={m} className="dt-chip" onClick={() => app.openPick(m)}><Icon name="wand" />{m}</button>
          ))}
        </div>
      </section>

      <section className="dt-section">
        <SectionHead app={app} eyebrow="PIN YOUR SHELF" title="Featured" sub="Drop real covers onto these — they'll stick." />
        <div className="dt-featured">
          {featured.map((it, idx) => (
            <div key={it.id} className="dt-feat" onClick={() => app.open(it.id)}>
              <div className="dt-feat-cover">
                <image-slot id={'dt-feat-' + idx} shape="rect" placeholder="Drop cover" style={{ width: '100%', height: '100%', display: 'block' }}></image-slot>
              </div>
              <div className="cardtitle" style={{ marginTop: 8 }}>{it.title}</div>
              <div className="cardmeta"><Icon name={window.DT_DATA.TYPE_META[it.type].glyph} size={11} />{it.year}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="dt-section">
        <SectionHead app={app} eyebrow="RECENTLY ADDED" title="Fresh in the pile" action={{ label: 'All backlog', fn: () => app.go('backlog') }} />
        <div className="dt-grid">{recentAdded.map((it) => <ItemCard key={it.id} item={it} app={app} />)}</div>
      </section>

      <div className="dt-home-bottom">
        <section className="dt-panel">
          <div className="dt-panel-h"><span className="t">Recently finished</span><button className="btn btn--ghost btn--sm" onClick={() => app.go('done')}>Log</button></div>
          {recentDone.map((it) => (
            <div key={it.id} className="dt-done-line" onClick={() => app.open(it.id)}>
              <div style={{ width: 24, height: 36, borderRadius: 2, overflow: 'hidden', border: '1px solid var(--border-default)', flexShrink: 0 }}><Cover item={it} mini /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--bzr-font-body)', fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.title}</div>
                <div className="mono" style={{ fontSize: 9.5, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{fmtDate(it.finishedAt)}</div>
              </div>
              {it.rating != null && <Stars value={it.rating} size={13} />}
            </div>
          ))}
        </section>

        <section className="dt-panel">
          <div className="dt-panel-h"><span className="t">Sync status</span><button className="btn btn--ghost btn--sm" onClick={() => app.go('sync')}>Center</button></div>
          <div style={{ padding: 18 }}>
            <div className="dt-rowflex" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
              <div className="dt-rowflex"><span className="dot" style={{ width: 8, height: 8, borderRadius: 99, background: 'var(--bzr-success)' }}></span><span className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>Trakt connected</span></div>
              <span className="src-badge">{lastSync.when}</span>
            </div>
            <p className="caption sec" style={{ marginBottom: 14 }}>Last pull updated {lastSync.updated} items. {app.conflicts.length} conflict{app.conflicts.length === 1 ? '' : 's'} need{app.conflicts.length === 1 ? 's' : ''} your call.</p>
            <div className="dt-rowflex">
              <button className="btn btn--primary btn--sm" onClick={() => app.go('sync')}><Icon name="sync" />Open sync</button>
              {app.conflicts.length > 0 && <button className="btn btn--ghost btn--sm" onClick={() => app.go('sync')}><Icon name="alert" />Resolve</button>}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionHead({ app, eyebrow, title, sub, action }) {
  return (
    <div className="dt-sechead">
      <div>
        {app.tweaks.eyebrow && <Eyebrow lot>{eyebrow}</Eyebrow>}
        <div className="dt-sectitle">{title}</div>
        {sub && <div className="caption sec" style={{ marginTop: 4 }}>{sub}</div>}
      </div>
      {action && <button className="btn btn--ghost btn--sm" onClick={action.fn}>{action.label}<Icon name="arrowR" /></button>}
    </div>
  );
}

// ── PICK FOR ME ─────────────────────────────────────────────
function PickForMe({ app, initialMood }) {
  const [type, setType] = useState('any');
  const [time, setTime] = useState('any');
  const [mood, setMood] = useState(initialMood || 'any');
  const [src, setSrc] = useState('any');
  const [pick, setPick] = useState(null);
  const [picked, setPicked] = useState(false);

  const pool = useMemo(() => app.items.filter((i) => (i.status === 'backlog' || i.status === 'current')
    && (type === 'any' || i.type === type)
    && (time === 'any' || i.time === time)
    && (mood === 'any' || (i.moods || []).includes(mood))
    && (src === 'any' || (src === 'friend' ? !!i.sourceNote : i.source === src))), [app.items, type, time, mood, src]);

  const roll = useCallback(() => {
    if (!pool.length) { setPick(null); setPicked(true); return; }
    const idx = Math.floor(Math.random() * pool.length);
    setPick(pool[idx]); setPicked(true);
  }, [pool]);

  const reason = (it) => {
    const bits = [];
    bits.push(it.status === 'current' ? 'already in progress' : 'in your backlog');
    if (it.tags.length) bits.push('tagged ' + it.tags.slice(0, 2).join(', '));
    bits.push(it.time === 'short' ? 'a short one' : it.time === 'medium' ? 'medium length' : 'a longer sit');
    if (it.sourceNote) bits.push(it.sourceNote);
    return bits.join(' · ');
  };

  const seg = (val, set, opts) => (
    <div className="dt-chips">
      {opts.map(([v, l]) => <button key={v} className={'dt-chip' + (val === v ? ' on' : '')} onClick={() => set(v)}>{l}</button>)}
    </div>
  );

  return (
    <div className="dt-modal" onClick={(e) => e.stopPropagation()} style={{ width: 'min(640px, 100%)' }}>
      <div className="dt-modal-h">
        <Icon name="wand" size={18} style={{ color: 'var(--dt-accent-text)' }} />
        <span className="t" style={{ fontFamily: 'var(--bzr-font-stencil)', fontWeight: 800, fontSize: 18, textTransform: 'uppercase', flex: 1 }}>Pick for me</span>
        <button className="iconbtn" style={{ border: 'none' }} onClick={app.closeModal}><Icon name="x" /></button>
      </div>
      <div className="dt-modal-b" style={{ padding: 20 }}>
        {!picked ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="dt-field"><span className="dt-label">Type</span>{seg(type, setType, [['any', 'Any'], ['movie', 'Movie'], ['show', 'Show'], ['book', 'Book'], ['game', 'Game']])}</div>
            <div className="dt-field"><span className="dt-label">Time</span>{seg(time, setTime, [['any', 'Any'], ['short', 'Short'], ['medium', '~1 hr'], ['long', 'Long']])}</div>
            <div className="dt-field"><span className="dt-label">Mood</span>{seg(mood, setMood, [['any', 'Any'], ...window.DT_DATA.MOODS.map((m) => [m, m])])}</div>
            <div className="dt-field"><span className="dt-label">Source</span>{seg(src, setSrc, [['any', 'Any'], ['trakt', 'Trakt'], ['goodreads', 'Goodreads'], ['manual', 'Manual'], ['friend', 'Friend rec']])}</div>
            <div className="dt-rowflex" style={{ justifyContent: 'space-between', marginTop: 4 }}>
              <span className="mono" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{pool.length} match{pool.length === 1 ? '' : 'es'}</span>
              <button className="btn btn--primary" disabled={!pool.length} onClick={roll}><Icon name="shuffle" />Roll it</button>
            </div>
          </div>
        ) : pick ? (
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ width: 150, flexShrink: 0, borderRadius: 2, overflow: 'hidden', border: '1px solid var(--border-default)' }}><Cover item={pick} /></div>
            <div style={{ flex: 1 }}>
              <div className="dt-rowflex" style={{ marginBottom: 8 }}><TypeBadge type={pick.type} /><StatusBadge status={pick.status} /></div>
              <div style={{ fontFamily: 'var(--bzr-font-stencil)', fontWeight: 800, fontSize: 28, textTransform: 'uppercase', color: 'var(--text-primary)', lineHeight: 0.95 }}>{pick.title}</div>
              <p className="caption" style={{ color: 'var(--dt-accent-text)', margin: '10px 0', textTransform: 'capitalize' }}>{reason(pick)}.</p>
              <p className="caption sec">{pick.desc}</p>
              <div className="dt-rowflex" style={{ marginTop: 16 }}>
                <button className="btn btn--primary" onClick={() => { app.setStatus(pick.id, 'current'); app.closeModal(); app.open(pick.id); }}><Icon name="play" />Start it</button>
                <button className="btn btn--ghost" onClick={roll}><Icon name="shuffle" />Pick another</button>
                <button className="btn btn--ghost btn--sm" onClick={() => setPicked(false)}>Change filters</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="dt-empty" style={{ border: 'none', padding: '30px 0' }}>
            <div className="glyph">✦</div><h3>No match</h3><p>Nothing fits those filters. Loosen the mood or time and roll again.</p>
            <button className="btn btn--ghost" onClick={() => setPicked(false)}>Back to filters</button>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { LandingView, HomeView, PickForMe, SectionHead });
