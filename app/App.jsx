/* DOWNTIMED — App: store, shell, routing, overlays, tweaks */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "void",
  "accent": "#C6FF24",
  "defaultView": "grid",
  "density": "cozy",
  "eyebrow": true
}/*EDITMODE-END*/;

const LS_KEY = 'downtimed_state_v2';

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const saved = useMemo(() => loadState(), []);
  const [items, setItems] = useState(() => saved?.items || window.DT_DATA.LIBRARY.map((i) => ({ ...i })));
  const [lists, setLists] = useState(() => saved?.lists || window.DT_DATA.LISTS.map((l) => ({ ...l })));
  const [conflicts, setConflicts] = useState(() => saved?.conflicts || window.DT_DATA.CONFLICTS.map((c) => ({ ...c })));
  const [syncEvents, setSyncEvents] = useState(() => saved?.syncEvents || window.DT_DATA.SYNC_EVENTS.map((e) => ({ ...e })));
  const [view, setView] = useState(() => saved?.view || 'landing');
  const [viewParam, setViewParam] = useState(() => saved?.viewParam || null);
  const [drawerId, setDrawerId] = useState(null);
  const [modal, setModal] = useState(null);     // 'add' | 'pick' | 'import'
  const [pickMood, setPickMood] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [navOpen, setNavOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [seed, setSeed] = useState('s');
  const toastId = useRef(0);

  // persist
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify({ items, lists, conflicts, syncEvents, view, viewParam })); } catch (e) {}
  }, [items, lists, conflicts, syncEvents, view, viewParam]);

  // apply tweaks to document root
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', tweaks.theme === 'paper' ? 'light' : 'void');
    root.setAttribute('data-density', tweaks.density);
    root.setAttribute('data-eyebrow', tweaks.eyebrow ? 'on' : 'off');
    const a = window.DT_DATA.ACCENTS.find((x) => x.vivid === tweaks.accent) || window.DT_DATA.ACCENTS[0];
    root.style.setProperty('--dt-accent', a.vivid);
    root.style.setProperty('--dt-accent-ink', a.ink);
    root.style.setProperty('--dt-accent-fg', a.fg);
  }, [tweaks]);

  // ⌘K / Ctrl+K command menu
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); setCmdOpen((o) => !o); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const today = '2026-06-03';
  const toast = useCallback((msg, label) => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, msg, label }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  const update = useCallback((id, patch) => {
    setItems((arr) => arr.map((i) => (i.id === id ? { ...i, ...patch, updatedAt: today } : i)));
  }, []);

  const setStatus = useCallback((id, status) => {
    setItems((arr) => arr.map((i) => {
      if (i.id !== id) return i;
      const p = { ...i, status };
      if (status === 'done' && !i.finishedAt) p.finishedAt = today;
      if (status === 'current' && !i.startedAt) p.startedAt = today;
      return p;
    }));
    toast(window.DT_DATA.STATUS_META[status].label, 'Moved to');
  }, [toast]);

  const setRating = useCallback((id, v) => { update(id, { rating: v }); toast(v == null ? 'Rating cleared' : (v / 20) + ' stars', 'Rated'); }, [update, toast]);
  const setProgress = useCallback((id, progress) => update(id, { progress }), [update]);
  const toggleTag = useCallback((id, tag) => {
    setItems((arr) => arr.map((i) => (i.id === id ? { ...i, tags: i.tags.includes(tag) ? i.tags.filter((t) => t !== tag) : [...i.tags, tag] } : i)));
  }, []);
  const toggleList = useCallback((id, listId) => {
    setItems((arr) => arr.map((i) => (i.id === id ? { ...i, lists: i.lists.includes(listId) ? i.lists.filter((l) => l !== listId) : [...i.lists, listId] } : i)));
  }, []);
  const addItem = useCallback((data, status) => {
    const id = 'u' + Date.now();
    const it = { id, type: 'manual', title: 'Untitled', year: null, creator: '', meta: '', source: 'manual', tags: [], lists: [], moods: [], time: 'long', notes: '', desc: '', rating: null, progress: status === 'current' ? { type: 'percent', value: 0, total: 100 } : null, addedAt: today, ...data, status: status || 'backlog' };
    if (it.status === 'current' && !it.startedAt) it.startedAt = today;
    if (it.status === 'done' && !it.finishedAt) it.finishedAt = today;
    setItems((arr) => [it, ...arr]);
    setModal(null);
    toast(it.title, 'Added to ' + window.DT_DATA.STATUS_META[it.status].label.toLowerCase());
  }, [toast]);
  const deleteItem = useCallback((id) => { setItems((arr) => arr.filter((i) => i.id !== id)); setDrawerId(null); toast('Removed from library', 'Deleted'); }, [toast]);
  const createList = useCallback((name, desc) => { const id = 'ul' + Date.now(); setLists((arr) => [...arr, { id, name, desc }]); toast(name, 'List created'); }, [toast]);
  const resolveConflict = useCallback((id, choice) => {
    const c = conflicts.find((x) => x.id === id);
    setConflicts((arr) => arr.filter((x) => x.id !== id));
    const labels = { local: 'Kept your version', remote: 'Used Trakt version', both: 'Kept both', ignore: 'Ignored' };
    toast(labels[choice] || 'Resolved', 'Conflict');
  }, [conflicts, toast]);
  const runSync = useCallback(() => {
    const ev = { id: 'se' + Date.now(), provider: 'trakt', dir: 'pull', status: 'ok', when: 'Just now', seen: 142, created: 0, updated: Math.floor(Math.random() * 4), skipped: 138, failed: 0 };
    setSyncEvents((arr) => [ev, ...arr]);
    toast(ev.updated + ' items updated', 'Sync complete');
  }, [toast]);

  const go = useCallback((v, param) => { setView(v); setViewParam(param || null); setNavOpen(false); if (v === 'backlog') setSeed('s' + Date.now()); }, []);
  const open = useCallback((id) => setDrawerId(id), []);
  const openPick = useCallback((mood) => { setPickMood(typeof mood === 'string' ? mood : null); setModal('pick'); }, []);

  const exportData = useCallback((fmt) => {
    const download = (filename, text, mime) => {
      const blob = new Blob([text], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    };
    const esc = (v) => { const s = v == null ? '' : String(v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
    const listName = (id) => (lists.find((l) => l.id === id) || {}).name || id;
    const shelf = { backlog: 'to-read', current: 'currently-reading', done: 'read', abandoned: 'abandoned', hidden: 'hidden' };
    if (fmt === 'json') {
      const payload = { app: 'Downtimed', version: '0.1', exported_at: today, item_count: items.length,
        items: items.map((i) => ({ ...i, lists: i.lists.map(listName) })), lists };
      download('downtimed-library.json', JSON.stringify(payload, null, 2), 'application/json');
    } else if (fmt === 'csv') {
      const cols = ['Title', 'Type', 'Year', 'Creator', 'Status', 'Rating (0-100)', 'Stars', 'Tags', 'Lists', 'Source', 'Added', 'Started', 'Finished', 'Notes'];
      const rows = items.map((i) => [i.title, i.type, i.year, i.creator, i.status, i.rating ?? '', i.rating != null ? (i.rating / 20) : '', i.tags.join('; '), i.lists.map(listName).join('; '), i.source, i.addedAt, i.startedAt, i.finishedAt, i.notes].map(esc).join(','));
      download('downtimed-library.csv', [cols.join(','), ...rows].join('\n'), 'text/csv');
    } else if (fmt === 'goodreads') {
      const cols = ['Title', 'Author', 'ISBN', 'ISBN13', 'My Rating', 'Publisher', 'Number of Pages', 'Year Published', 'Date Read', 'Date Added', 'Bookshelves', 'Exclusive Shelf', 'My Review'];
      const books = items.filter((i) => i.type === 'book');
      const rows = books.map((i) => [i.title, i.creator, '', '', i.rating != null ? (i.rating / 20) : '', '', (i.meta || '').replace(/[^0-9]/g, ''), i.year, i.finishedAt, i.addedAt, i.tags.join(', '), shelf[i.status] || '', i.notes].map(esc).join(','));
      download('downtimed-goodreads.csv', [cols.join(','), ...rows].join('\n'), 'text/csv');
    }
    toast(fmt === 'json' ? 'downtimed-library.json' : fmt === 'goodreads' ? 'downtimed-goodreads.csv' : 'downtimed-library.csv', 'Downloaded');
  }, [items, lists, toast]);

  const app = {
    items, lists, conflicts, syncEvents, tweaks, seed, setTweak,
    update, setStatus, setRating, setProgress, toggleTag, toggleList, addItem, deleteItem, createList, resolveConflict, runSync, exportData,
    go, open, openPick, toast,
    closeDrawer: () => setDrawerId(null),
    openAdd: () => setModal('add'),
    openImport: () => setModal('import'),
    closeModal: () => setModal(null),
  };

  const drawerItem = items.find((i) => i.id === drawerId);
  const counts = {
    backlog: items.filter((i) => i.status === 'backlog').length,
    current: items.filter((i) => i.status === 'current').length,
    done: items.filter((i) => i.status === 'done').length,
    lists: lists.length,
  };

  if (view === 'landing') {
    return (
      <>
        <LandingView app={app} />
        <Tweaks app={app} />
      </>
    );
  }

  const renderView = () => {
    switch (view) {
      case 'home': return <HomeView app={app} />;
      case 'backlog': return <BacklogView app={app} />;
      case 'current': return <CurrentView app={app} />;
      case 'done': return <DoneView app={app} />;
      case 'lists': return <ListsView app={app} />;
      case 'listDetail': return <ListDetailView app={app} listId={viewParam} />;
      case 'sync': return <SyncView app={app} />;
      case 'settings': return <SettingsView app={app} />;
      default: return <HomeView app={app} />;
    }
  };

  const navItem = (id, label, ic, count, badge) => (
    <button className={'dt-nav-item' + (view === id ? ' active' : '')} onClick={() => go(id)}>
      <Icon name={ic} />{label}
      {badge != null && badge > 0 ? <span className="count" style={{ color: 'var(--bzr-warn)' }}>{badge}</span> : count != null ? <span className="count">{count}</span> : null}
    </button>
  );

  return (
    <div className="dt-app">
      <div className={'dt-sidebar-scrim' + (navOpen ? ' show' : '')} onClick={() => setNavOpen(false)}></div>
      <aside className={'dt-sidebar' + (navOpen ? ' open' : '')}>
        <div className="dt-brand" style={{ cursor: 'pointer' }} onClick={() => go('home')}>
          <img src="assets/mark-inverse.png" alt="" />
          <div><div className="wm">Downtimed</div><div className="sub">Catch the stars</div></div>
        </div>
        <nav className="dt-nav">
          <div className="dt-nav-group">Library</div>
          {navItem('home', 'Home', 'home')}
          {navItem('backlog', 'Backlog', 'inbox', counts.backlog)}
          {navItem('current', 'Current', 'play', counts.current)}
          {navItem('done', 'Done', 'check2', counts.done)}
          <div className="dt-nav-group">Organize</div>
          {navItem('lists', 'Lists', 'layers', counts.lists)}
          <div className="dt-nav-group">System</div>
          {navItem('sync', 'Sync', 'sync', null, conflicts.length)}
          {navItem('settings', 'Settings', 'settings')}
        </nav>
        <div className="dt-sidefoot">
          <button className="btn btn--primary" onClick={() => setModal('add')}><Icon name="plus" />Quick add</button>
          <button className="dt-nav-item" style={{ padding: 0, border: 'none', justifyContent: 'flex-start', gap: 8 }} onClick={() => go('landing')}><Icon name="external" size={14} />Landing</button>
        </div>
      </aside>

      <main className="dt-main">
        <header className="dt-topbar">
          <button className="iconbtn dt-hamburger" style={{ border: 'none' }} onClick={() => setNavOpen(true)}><Icon name="menu" /></button>
          <div className="dt-search" onClick={() => setCmdOpen(true)}>
            <Icon name="search" />
            <span className="ph">Search your library or run a command…</span>
            <span className="kbd">⌘K</span>
          </div>
          <div className="dt-spacer"></div>
          <button className="iconbtn" title="Pick for me" onClick={() => openPick()}><Icon name="wand" /></button>
          <button className="iconbtn" title={tweaks.theme === 'paper' ? 'Dark' : 'Light'} onClick={() => setTweak('theme', tweaks.theme === 'paper' ? 'void' : 'paper')}><Icon name={tweaks.theme === 'paper' ? 'moon' : 'sun'} /></button>
          <button className="btn btn--primary" onClick={() => setModal('add')}><Icon name="plus" />Add</button>
        </header>
        <div className="dt-scroll">{renderView()}</div>
      </main>

      {/* mobile nav */}
      <nav className="dt-mobilenav">
        {[['home', 'Home', 'home'], ['backlog', 'Backlog', 'inbox'], ['current', 'Current', 'play'], ['lists', 'Lists', 'layers'], ['sync', 'Sync', 'sync']].map(([id, l, ic]) => (
          <button key={id} className={view === id ? 'active' : ''} onClick={() => go(id)}><Icon name={ic} />{l}</button>
        ))}
      </nav>
      <button className="dt-fab" onClick={() => setModal('add')}><Icon name="plus" /></button>

      {/* drawer */}
      {drawerItem && <div className="dt-overlay" onClick={app.closeDrawer}><ItemDetail item={drawerItem} app={app} /></div>}

      {/* modals */}
      {modal && (
        <div className="dt-overlay" style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={app.closeModal}>
          {modal === 'add' && <AddItem app={app} />}
          {modal === 'pick' && <PickForMe app={app} initialMood={pickMood} />}
          {modal === 'import' && <GoodreadsImport app={app} />}
        </div>
      )}

      {/* toasts */}
      <div className="dt-toasts">
        {toasts.map((t) => (
          <div key={t.id} className="dt-toast"><span className="bar"></span><div className="msg">{t.label && <b>{t.label}</b>}{t.msg}</div></div>
        ))}
      </div>

      {cmdOpen && <CommandMenu app={app} onClose={() => setCmdOpen(false)} />}

      <Tweaks app={app} />
    </div>
  );
}

function Tweaks({ app }) {
  const t = app.tweaks; const setTweak = app.setTweak;
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Theme" />
      <TweakRadio label="Surface" value={t.theme} options={[{ value: 'void', label: 'Void' }, { value: 'paper', label: 'Paper' }]} onChange={(v) => setTweak('theme', v)} />
      <TweakColor label="Accent" value={t.accent} options={window.DT_DATA.ACCENTS.map((a) => a.vivid)} onChange={(v) => setTweak('accent', v)} />
      <TweakSection label="Library" />
      <TweakRadio label="Default view" value={t.defaultView} options={[{ value: 'grid', label: 'Grid' }, { value: 'row', label: 'Rows' }]} onChange={(v) => setTweak('defaultView', v)} />
      <TweakRadio label="Density" value={t.density} options={[{ value: 'cozy', label: 'Cozy' }, { value: 'compact', label: 'Compact' }]} onChange={(v) => setTweak('density', v)} />
      <TweakSection label="Voice" />
      <TweakToggle label="Catalog eyebrows" value={t.eyebrow} onChange={(v) => setTweak('eyebrow', v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
