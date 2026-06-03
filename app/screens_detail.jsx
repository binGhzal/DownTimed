/* DOWNTIMED — Item detail drawer, Add/search modal, Lists + List detail */

// ── ITEM DETAIL (drawer) ────────────────────────────────────
function ItemDetail({ item, app }) {
  const [notes, setNotes] = useState(item.notes || '');
  const [newTag, setNewTag] = useState('');
  const [showTagAdd, setShowTagAdd] = useState(false);
  const [showListAdd, setShowListAdd] = useState(false);
  useEffect(() => { setNotes(item.notes || ''); }, [item.id]);
  const tm = window.DT_DATA.TYPE_META[item.type];
  const statuses = ['backlog', 'current', 'done', 'abandoned', 'hidden'];

  const history = useMemo(() => {
    const ev = [];
    if (item.finishedAt) ev.push({ t: 'Marked done', d: item.finishedAt, ic: 'check2' });
    if (item.startedAt) ev.push({ t: 'Started', d: item.startedAt, ic: 'play' });
    if (item.source !== 'manual') ev.push({ t: 'Synced from ' + (window.DT_DATA.TYPE_META && ({ trakt: 'Trakt', goodreads: 'Goodreads', tmdb: 'TMDb', rawg: 'RAWG', openlibrary: 'Open Library' }[item.source] || item.source)), d: item.addedAt, ic: 'sync' });
    ev.push({ t: 'Added to library', d: item.addedAt, ic: 'plus' });
    return ev.filter((e) => e.d).sort((a, b) => (b.d || '').localeCompare(a.d || ''));
  }, [item]);

  const extLinks = { movie: ['Trakt', 'TMDb', 'IMDb'], show: ['Trakt', 'TMDb'], book: ['Open Library', 'Google Books', 'Goodreads'], game: ['RAWG', 'Steam'], manual: ['Open link'] }[item.type] || [];

  return (
    <div className="dt-drawer" onClick={(e) => e.stopPropagation()} data-screen-label="Item detail">
      <div className="dt-modal-h" style={{ position: 'sticky', top: 0, background: 'var(--surface-elevated)', zIndex: 2 }}>
        <button className="iconbtn" style={{ border: 'none' }} onClick={app.closeDrawer}><Icon name="x" /></button>
        <span className="mono" style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)', flex: 1 }}>Item · lot {lotNum(item.id)}</span>
        <button className="iconbtn" style={{ border: 'none' }} title="Hide" onClick={() => { app.setStatus(item.id, 'hidden'); app.closeDrawer(); }}><Icon name="eyeOff" /></button>
        <button className="iconbtn" style={{ border: 'none' }} title="Delete" onClick={() => { app.deleteItem(item.id); }}><Icon name="trash" /></button>
      </div>

      <div style={{ padding: 22 }}>
        <div style={{ display: 'flex', gap: 18, marginBottom: 22 }}>
          <div style={{ width: 132, flexShrink: 0, borderRadius: 2, overflow: 'hidden', border: '1px solid var(--border-default)' }}><Cover item={item} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="dt-rowflex" style={{ marginBottom: 8 }}><TypeBadge type={item.type} /><SourceBadge source={item.source} /></div>
            <h2 style={{ fontFamily: 'var(--bzr-font-stencil)', fontWeight: 800, fontSize: 28, textTransform: 'uppercase', lineHeight: 0.95, color: 'var(--text-primary)' }}>{item.title}</h2>
            <div className="caption sec" style={{ marginTop: 8 }}>{tm.creator} {item.creator || '—'}</div>
            <div className="caption muted" style={{ marginTop: 2 }}>{item.year || '—'} · {item.meta}</div>
          </div>
        </div>

        {item.desc && <p className="body" style={{ color: 'var(--text-secondary)', marginBottom: 22, fontSize: 14 }}>{item.desc}</p>}

        {/* status */}
        <div className="dt-field" style={{ marginBottom: 20 }}>
          <span className="dt-label">Status</span>
          <div className="dt-chips">
            {statuses.map((s) => (
              <button key={s} className={'dt-chip' + (item.status === s ? ' on' : '')} onClick={() => app.setStatus(item.id, s)}>{window.DT_DATA.STATUS_META[s].label}</button>
            ))}
          </div>
        </div>

        {/* progress for current */}
        {item.status === 'current' && item.progress && (
          <div className="dt-field" style={{ marginBottom: 20 }}>
            <span className="dt-label">Progress</span>
            <ProgressBar progress={item.progress} />
            <div className="dt-rowflex" style={{ marginTop: 10 }}>
              <button className="btn btn--ghost btn--sm" onClick={() => { const p = item.progress; const v = p.type === 'percent' ? Math.max(0, p.value - 10) : Math.max(0, p.value - 1); app.setProgress(item.id, { ...p, value: v }); }}>−</button>
              <button className="btn btn--ghost btn--sm" onClick={() => { const p = item.progress; const v = p.type === 'percent' ? Math.min(100, p.value + 10) : Math.min(p.total, p.value + 1); app.setProgress(item.id, { ...p, value: v }); }}>{item.progress.type === 'percent' ? '+10%' : item.progress.type === 'pages' ? '+1 page' : '+1 episode'}</button>
              <button className="btn btn--primary btn--sm" onClick={() => app.setStatus(item.id, 'done')}><Icon name="check" />Finish</button>
            </div>
          </div>
        )}

        {/* rating */}
        <div className="dt-field" style={{ marginBottom: 20 }}>
          <span className="dt-label">Your rating</span>
          <div className="dt-rowflex"><Stars value={item.rating} size={22} onChange={(v) => app.setRating(item.id, v)} />{item.rating != null && <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.rating}/100</span>}</div>
        </div>

        {/* tags */}
        <div className="dt-field" style={{ marginBottom: 20 }}>
          <span className="dt-label">Tags</span>
          <div className="dt-chips" style={{ alignItems: 'center' }}>
            {item.tags.map((t) => <TagPill key={t} tag={t} on removable onRemove={() => app.toggleTag(item.id, t)} onClick={() => {}} />)}
            {showTagAdd ? (
              <form onSubmit={(e) => { e.preventDefault(); if (newTag.trim()) { app.toggleTag(item.id, newTag.trim().toLowerCase()); setNewTag(''); setShowTagAdd(false); } }}>
                <input autoFocus value={newTag} onChange={(e) => setNewTag(e.target.value)} onBlur={() => setShowTagAdd(false)} placeholder="new tag" list="dt-taglist"
                       style={{ width: 110, background: 'transparent', border: '1px solid var(--dt-accent)', borderRadius: 99, padding: '4px 10px', color: 'var(--text-primary)', fontFamily: 'var(--bzr-font-mono)', fontSize: 10, outline: 'none' }} />
                <datalist id="dt-taglist">{window.DT_DATA.ALL_TAGS.map((t) => <option key={t} value={t} />)}</datalist>
              </form>
            ) : <button className="dt-tag" onClick={() => setShowTagAdd(true)}><Icon name="plus" size={11} />tag</button>}
          </div>
        </div>

        {/* lists */}
        <div className="dt-field" style={{ marginBottom: 20 }}>
          <span className="dt-label">Lists</span>
          <div className="dt-chips">
            {app.lists.map((l) => (
              <button key={l.id} className={'dt-chip' + (item.lists.includes(l.id) ? ' on' : '')} onClick={() => app.toggleList(item.id, l.id)}>
                {item.lists.includes(l.id) && <Icon name="check" size={12} />}{l.name}
              </button>
            ))}
          </div>
        </div>

        {/* notes */}
        <div className="dt-field" style={{ marginBottom: 20 }}>
          <span className="dt-label">Notes</span>
          <textarea className="input" value={notes} onChange={(e) => setNotes(e.target.value)} onBlur={() => app.update(item.id, { notes })} placeholder="Why you saved it, who recommended it, where you left off…" />
          {item.sourceNote && <span className="caption muted" style={{ marginTop: 4 }}>Source: {item.sourceNote}</span>}
        </div>

        {/* external */}
        <div className="dt-field" style={{ marginBottom: 20 }}>
          <span className="dt-label">Open externally</span>
          <div className="dt-chips">
            {extLinks.map((l) => <button key={l} className="dt-chip" onClick={() => app.toast('Open in ' + l, 'External link')}><Icon name="external" size={12} />{l}</button>)}
            <button className="dt-chip" onClick={() => app.toast('Metadata refreshed', 'From ' + (item.source === 'manual' ? 'manual' : item.source))}><Icon name="rotate" size={12} />Refresh metadata</button>
          </div>
        </div>

        {/* history */}
        <div className="dt-field">
          <span className="dt-label">History</span>
          <div style={{ borderLeft: '2px solid var(--border-default)', paddingLeft: 16, marginLeft: 4, display: 'flex', flexDirection: 'column', gap: 14, marginTop: 6 }}>
            {history.map((e, i) => (
              <div key={i} className="dt-rowflex" style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: -23, width: 10, height: 10, borderRadius: 99, background: 'var(--dt-accent)', border: '2px solid var(--surface-elevated)' }}></span>
                <Icon name={e.ic} size={14} style={{ color: 'var(--text-muted)' }} />
                <span className="caption" style={{ color: 'var(--text-primary)' }}>{e.t}</span>
                <span className="dt-spacer"></span>
                <span className="mono" style={{ fontSize: 10, color: 'var(--text-muted)' }}>{fmtDate(e.d)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ADD ITEM (modal) ────────────────────────────────────────
function AddItem({ app }) {
  const [tab, setTab] = useState('search');
  const [q, setQ] = useState('');
  const [chosen, setChosen] = useState(null);
  const [status, setStatus] = useState('backlog');
  // manual
  const [mTitle, setMTitle] = useState(''); const [mType, setMType] = useState('manual'); const [mNote, setMNote] = useState('');

  const isISBN = /^[0-9]{10}([0-9]{3})?$/.test(q.replace(/[- ]/g, ''));
  const isURL = /^https?:\/\//.test(q.trim()) || /\.(com|org|tv)\//.test(q);
  const results = useMemo(() => {
    if (!q.trim()) return [];
    const ql = q.toLowerCase();
    if (ql.includes('dune')) return window.DT_DATA.SEARCH_POOL;
    return window.DT_DATA.SEARCH_GENERIC.filter((r) => r.title.toLowerCase().includes(ql) || r.creator.toLowerCase().includes(ql) || ql.length < 3 || isISBN || isURL);
  }, [q]);
  const grouped = useMemo(() => {
    const g = {}; results.forEach((r) => { (g[r.type] = g[r.type] || []).push(r); }); return g;
  }, [results]);

  const commit = () => {
    if (chosen) { app.addItem({ type: chosen.type, title: chosen.title, year: chosen.year, creator: chosen.creator, meta: chosen.meta, source: chosen.src.toLowerCase().includes('trakt') ? 'trakt' : chosen.src.toLowerCase().includes('rawg') ? 'rawg' : chosen.src.toLowerCase().includes('open') ? 'openlibrary' : chosen.src.toLowerCase().includes('google') ? 'goodreads' : 'tmdb', status, desc: '' }, status); }
  };

  return (
    <div className="dt-modal" onClick={(e) => e.stopPropagation()}>
      <div className="dt-modal-h">
        <Icon name="plus" size={18} style={{ color: 'var(--dt-accent-text)' }} />
        <span className="t" style={{ fontFamily: 'var(--bzr-font-stencil)', fontWeight: 800, fontSize: 18, textTransform: 'uppercase', flex: 1 }}>Add to library</span>
        <button className="iconbtn" style={{ border: 'none' }} onClick={app.closeModal}><Icon name="x" /></button>
      </div>

      {!chosen ? (
        <>
          <div style={{ padding: '14px 18px 0', display: 'flex', gap: 8 }}>
            <button className={'dt-chip' + (tab === 'search' ? ' on' : '')} onClick={() => setTab('search')}><Icon name="search" size={12} />Search</button>
            <button className={'dt-chip' + (tab === 'manual' ? ' on' : '')} onClick={() => setTab('manual')}><Icon name="star" size={12} />Manual item</button>
          </div>
          {tab === 'search' ? (
            <div className="dt-modal-b" style={{ padding: 18 }}>
              <div className="dt-search" style={{ maxWidth: 'none', marginBottom: 6 }}>
                <Icon name="search" />
                <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Title, ISBN, or paste a link (try “Dune”)"
                       style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontFamily: 'var(--bzr-font-body)', fontSize: 14 }} />
              </div>
              {(isISBN || isURL) && <div className="caption" style={{ color: 'var(--dt-accent-text)', marginBottom: 10 }}><Icon name="link" size={12} style={{ verticalAlign: 'middle', marginRight: 6 }} />{isISBN ? 'Looks like an ISBN — searching Open Library + Google Books' : 'Looks like a link — resolving it'}</div>}
              {!q.trim() ? (
                <div className="dt-empty" style={{ border: 'none', padding: '36px 0' }}><div className="glyph">✦</div><p>Search across movies, shows, books and games at once. Results group by type and flag anything already in your library.</p></div>
              ) : results.length === 0 ? (
                <div className="dt-empty" style={{ border: 'none', padding: '30px 0' }}><p>No matches. Try a different title, or add it as a manual item.</p></div>
              ) : (
                Object.entries(grouped).map(([type, rs]) => (
                  <div key={type} style={{ marginBottom: 16 }}>
                    <div className="mono" style={{ fontSize: 9.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>{window.DT_DATA.TYPE_META[type].label}s</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {rs.map((r, i) => (
                        <div key={i} className="dt-result" onClick={() => !r.inLib && setChosen(r)}>
                          <div style={{ width: 30, height: 45, borderRadius: 2, overflow: 'hidden', border: '1px solid var(--border-default)', flexShrink: 0 }}><Cover item={{ ...r, title: r.title }} mini /></div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontFamily: 'var(--bzr-font-body)', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{r.title} <span className="muted" style={{ fontWeight: 400 }}>({r.year})</span></div>
                            <div className="rsub" style={{ display: 'flex', gap: 8 }}><span>{r.creator}</span><span>·</span><span>{r.meta}</span><span>·</span><SourceBadge source={r.src.toLowerCase()} /></div>
                          </div>
                          {r.inLib ? <span className="dt-badge" style={{ color: 'var(--bzr-success)', borderColor: 'var(--bzr-success)' }}><Icon name="check" size={11} />In library</span>
                            : <button className="btn btn--primary btn--sm" onClick={(e) => { e.stopPropagation(); setChosen(r); }}><Icon name="plus" />Add</button>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="dt-modal-b" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="dt-field"><span className="dt-label">Title</span><input className="input" autoFocus value={mTitle} onChange={(e) => setMTitle(e.target.value)} placeholder="What is it?" /></div>
              <div className="dt-field"><span className="dt-label">Type</span><div className="dt-chips">{['manual', 'movie', 'show', 'book', 'game'].map((t) => <button key={t} className={'dt-chip' + (mType === t ? ' on' : '')} onClick={() => setMType(t)}>{window.DT_DATA.TYPE_META[t].label}</button>)}</div></div>
              <div className="dt-field"><span className="dt-label">Note / where it came from</span><textarea className="input" value={mNote} onChange={(e) => setMNote(e.target.value)} placeholder="Sent by a friend? A link? A vague memory?" /></div>
              <div className="dt-rowflex" style={{ justifyContent: 'flex-end' }}>
                <button className="btn btn--ghost" onClick={app.closeModal}>Cancel</button>
                <button className="btn btn--primary" disabled={!mTitle.trim()} onClick={() => app.addItem({ type: mType, title: mTitle.trim(), year: null, creator: '', meta: window.DT_DATA.TYPE_META[mType].label, source: 'manual', sourceNote: mNote, desc: mNote }, 'backlog')}><Icon name="plus" />Add to backlog</button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="dt-modal-b" style={{ padding: 22 }}>
          <button className="btn btn--ghost btn--sm" style={{ marginBottom: 16 }} onClick={() => setChosen(null)}><Icon name="chevL" />Back to results</button>
          <div style={{ display: 'flex', gap: 18, marginBottom: 20 }}>
            <div style={{ width: 96, flexShrink: 0, borderRadius: 2, overflow: 'hidden', border: '1px solid var(--border-default)' }}><Cover item={chosen} /></div>
            <div>
              <TypeBadge type={chosen.type} />
              <div style={{ fontFamily: 'var(--bzr-font-stencil)', fontWeight: 800, fontSize: 24, textTransform: 'uppercase', color: 'var(--text-primary)', marginTop: 8, lineHeight: 0.95 }}>{chosen.title}</div>
              <div className="caption sec" style={{ marginTop: 6 }}>{chosen.creator} · {chosen.year} · {chosen.meta}</div>
            </div>
          </div>
          <div className="dt-field" style={{ marginBottom: 22 }}>
            <span className="dt-label">Add as</span>
            <div className="dt-chips">{['backlog', 'current', 'done'].map((s) => <button key={s} className={'dt-chip' + (status === s ? ' on' : '')} onClick={() => setStatus(s)}>{window.DT_DATA.STATUS_META[s].label}</button>)}</div>
          </div>
          <div className="dt-rowflex" style={{ justifyContent: 'flex-end' }}>
            <button className="btn btn--ghost" onClick={() => setChosen(null)}>Cancel</button>
            <button className="btn btn--primary" onClick={commit}><Icon name="plus" />Add to {window.DT_DATA.STATUS_META[status].label.toLowerCase()}</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── LISTS ───────────────────────────────────────────────────
function ListsView({ app }) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState(''); const [desc, setDesc] = useState('');
  return (
    <div className="dt-page" data-screen-label="Lists">
      <div className="dt-phead">
        {app.tweaks.eyebrow && <Eyebrow lot>LISTS / {String(app.lists.length).padStart(3, '0')} / JUN 2026</Eyebrow>}
        <div className="dt-rowflex" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div><h1>Lists</h1><p className="lede">Collections you make by hand. Weekend movies. Short books. The friend-rec pile.</p></div>
          <button className="btn btn--primary" onClick={() => setCreating(true)}><Icon name="plus" />New list</button>
        </div>
      </div>

      {creating && (
        <div className="dt-panel" style={{ padding: 18, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="dt-field"><span className="dt-label">Name</span><input className="input" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rainy Sunday" /></div>
          <div className="dt-field"><span className="dt-label">Description</span><input className="input" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Optional" /></div>
          <div className="dt-rowflex" style={{ justifyContent: 'flex-end' }}>
            <button className="btn btn--ghost" onClick={() => { setCreating(false); setName(''); setDesc(''); }}>Cancel</button>
            <button className="btn btn--primary" disabled={!name.trim()} onClick={() => { app.createList(name.trim(), desc.trim()); setCreating(false); setName(''); setDesc(''); }}>Create</button>
          </div>
        </div>
      )}

      <div className="dt-listgrid">
        {app.lists.map((l) => {
          const its = app.items.filter((i) => i.lists.includes(l.id));
          return (
            <div key={l.id} className="dt-listcard" onClick={() => app.go('listDetail', l.id)}>
              <div className="dt-list-collage">
                {its.slice(0, 4).map((it) => <div key={it.id} className="dt-collage-cell"><Cover item={it} mini /></div>)}
                {its.length === 0 && <div className="dt-collage-empty"><Icon name="layers" size={24} /></div>}
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ fontFamily: 'var(--bzr-font-stencil)', fontWeight: 800, fontSize: 18, textTransform: 'uppercase', color: 'var(--text-primary)' }}>{l.name}</div>
                <div className="caption muted" style={{ marginTop: 2 }}>{its.length} item{its.length === 1 ? '' : 's'}</div>
                {l.desc && <p className="caption sec" style={{ marginTop: 8 }}>{l.desc}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ListDetailView({ app, listId }) {
  const list = app.lists.find((l) => l.id === listId);
  const [view, setView] = useState('grid');
  if (!list) return <div className="dt-page"><p className="muted">List not found.</p></div>;
  const items = app.items.filter((i) => i.lists.includes(list.id));
  return (
    <div className="dt-page" data-screen-label="List detail">
      <button className="btn btn--ghost btn--sm" style={{ marginBottom: 16 }} onClick={() => app.go('lists')}><Icon name="chevL" />All lists</button>
      <div className="dt-phead">
        {app.tweaks.eyebrow && <Eyebrow lot>LIST · LOT {lotNum(list.id)}</Eyebrow>}
        <div className="dt-rowflex" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div><h1>{list.name}</h1>{list.desc && <p className="lede">{list.desc}</p>}</div>
          <div className="dt-segment">
            <button className={view === 'grid' ? 'on' : ''} onClick={() => setView('grid')}><GridIcon /></button>
            <button className={view === 'row' ? 'on' : ''} onClick={() => setView('row')}><Icon name="menu" /></button>
          </div>
        </div>
      </div>
      {items.length ? <ItemCollection items={items} app={app} view={view} />
        : <div className="dt-empty"><div className="glyph">✦</div><h3>Empty list</h3><p>Open any item and add it to “{list.name}”, or add from your backlog.</p><button className="btn btn--primary" onClick={() => app.go('backlog')}><Icon name="inbox" />Browse backlog</button></div>}
    </div>
  );
}

Object.assign(window, { ItemDetail, AddItem, ListsView, ListDetailView });
