/* DOWNTIMED — ⌘K command menu (Linear-style fast nav + search) */

function CommandMenu({ app, onClose }) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => { inputRef.current && inputRef.current.focus(); }, []);

  const commands = useMemo(() => {
    const nav = [
      { id: 'n-home', group: 'Go to', label: 'Home', ic: 'home', run: () => app.go('home') },
      { id: 'n-backlog', group: 'Go to', label: 'Backlog', ic: 'inbox', run: () => app.go('backlog') },
      { id: 'n-current', group: 'Go to', label: 'Current', ic: 'play', run: () => app.go('current') },
      { id: 'n-done', group: 'Go to', label: 'Done', ic: 'check2', run: () => app.go('done') },
      { id: 'n-lists', group: 'Go to', label: 'Lists', ic: 'layers', run: () => app.go('lists') },
      { id: 'n-sync', group: 'Go to', label: 'Sync center', ic: 'sync', run: () => app.go('sync') },
      { id: 'n-settings', group: 'Go to', label: 'Settings', ic: 'settings', run: () => app.go('settings') },
    ];
    const actions = [
      { id: 'a-add', group: 'Actions', label: 'Add an item', hint: 'search or manual', ic: 'plus', run: () => app.openAdd() },
      { id: 'a-pick', group: 'Actions', label: 'Pick something for me', ic: 'wand', run: () => app.openPick() },
      { id: 'a-import', group: 'Actions', label: 'Import Goodreads CSV', ic: 'upload', run: () => app.openImport() },
      { id: 'a-sync', group: 'Actions', label: 'Run Trakt sync', ic: 'sync', run: () => { app.go('sync'); app.runSync(); } },
      { id: 'a-theme', group: 'Actions', label: app.tweaks.theme === 'paper' ? 'Switch to Void theme' : 'Switch to Paper theme', ic: app.tweaks.theme === 'paper' ? 'moon' : 'sun', run: () => app.setTweak('theme', app.tweaks.theme === 'paper' ? 'void' : 'paper') },
      { id: 'a-export', group: 'Actions', label: 'Export library (JSON)', ic: 'download', run: () => app.exportData('json') },
    ];
    return [...actions, ...nav];
  }, [app]);

  const results = useMemo(() => {
    const ql = q.trim().toLowerCase();
    const cmds = ql ? commands.filter((c) => c.label.toLowerCase().includes(ql)) : commands;
    const items = ql
      ? app.items.filter((i) => i.title.toLowerCase().includes(ql) || (i.creator || '').toLowerCase().includes(ql)).slice(0, 8)
        .map((i) => ({ id: 'i-' + i.id, group: 'Library', item: i, run: () => app.open(i.id) }))
      : [];
    return [...cmds, ...items];
  }, [q, commands, app]);

  useEffect(() => { setSel(0); }, [q]);
  useEffect(() => {
    const el = listRef.current && listRef.current.querySelector('[data-idx="' + sel + '"]');
    if (el) el.scrollIntoViewIfNeeded ? el.scrollIntoViewIfNeeded() : el.scrollInto;
  }, [sel]);

  const fire = (r) => { if (!r) return; onClose(); setTimeout(() => r.run(), 0); };

  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(results.length - 1, s + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); fire(results[sel]); }
    else if (e.key === 'Escape') { e.preventDefault(); onClose(); }
  };

  // group consecutive results by .group for headers
  let lastGroup = null;

  return (
    <div className="dt-cmd-overlay" onClick={onClose}>
      <div className="dt-cmd" onClick={(e) => e.stopPropagation()} onKeyDown={onKey}>
        <div className="dt-cmd-input">
          <Icon name="search" size={18} />
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your library or run a command…" />
          <span className="kbd">ESC</span>
        </div>
        <div className="dt-cmd-list" ref={listRef}>
          {results.length === 0 && <div className="dt-cmd-empty">No matches. Try a title, or “add”, “pick”, “sync”.</div>}
          {results.map((r, idx) => {
            const header = r.group !== lastGroup ? r.group : null;
            lastGroup = r.group;
            return (
              <React.Fragment key={r.id}>
                {header && <div className="dt-cmd-group">{header}</div>}
                <div className={'dt-cmd-row' + (idx === sel ? ' sel' : '')} data-idx={idx}
                     onMouseEnter={() => setSel(idx)} onClick={() => fire(r)}>
                  {r.item ? (
                    <>
                      <div className="dt-cmd-cover"><Cover item={r.item} mini /></div>
                      <div className="dt-cmd-main">
                        <span className="dt-cmd-label">{r.item.title}</span>
                        <span className="dt-cmd-hint">{window.DT_DATA.TYPE_META[r.item.type].label} · {r.item.year || '—'} · {window.DT_DATA.STATUS_META[r.item.status].label}</span>
                      </div>
                      <Icon name="arrowR" size={14} className="dt-cmd-go" />
                    </>
                  ) : (
                    <>
                      <div className="dt-cmd-ic"><Icon name={r.ic} size={16} /></div>
                      <div className="dt-cmd-main">
                        <span className="dt-cmd-label">{r.label}</span>
                        {r.hint && <span className="dt-cmd-hint">{r.hint}</span>}
                      </div>
                      <Icon name="arrowR" size={14} className="dt-cmd-go" />
                    </>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <div className="dt-cmd-foot">
          <span><b>↑↓</b> navigate</span><span><b>↵</b> select</span><span><b>esc</b> close</span>
          <span className="dt-spacer"></span><span>Downtimed · ⌘K</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CommandMenu });
