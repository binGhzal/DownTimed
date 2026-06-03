/* DOWNTIMED — Sync Center, conflict resolution, Goodreads import, Settings */

function ProviderCard({ logo, color, name, mode, status, sub, actions }) {
  return (
    <div className="dt-prov">
      <div className="dt-prov-logo" style={{ background: color, color: '#0E0E0E' }}>{logo}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="dt-rowflex" style={{ gap: 10 }}>
          <span style={{ fontFamily: 'var(--bzr-font-stencil)', fontWeight: 800, fontSize: 17, textTransform: 'uppercase', color: 'var(--text-primary)' }}>{name}</span>
          <span className="dt-badge" style={{ color: status === 'connected' ? 'var(--bzr-success)' : 'var(--text-muted)', borderColor: status === 'connected' ? 'var(--bzr-success)' : 'var(--border-default)' }}>
            <span className="dot" style={{ background: 'currentColor' }}></span>{status === 'connected' ? 'Connected' : status === 'csv' ? 'CSV only' : 'Metadata'}
          </span>
        </div>
        <div className="mono" style={{ fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 4 }}>{mode}</div>
        {sub && <p className="caption sec" style={{ marginTop: 6 }}>{sub}</p>}
      </div>
      <div className="dt-rowflex" style={{ flexShrink: 0 }}>{actions}</div>
    </div>
  );
}

function ConflictCard({ conflict, app }) {
  const item = app.items.find((i) => i.id === conflict.itemId);
  const [pick, setPick] = useState(null);
  return (
    <div className="dt-conflict">
      <div className="dt-conflict-h">
        <Icon name="alert" size={16} style={{ color: 'var(--bzr-warn)' }} />
        <span style={{ fontFamily: 'var(--bzr-font-body)', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{item ? item.title : 'Item'}</span>
        <span className="dt-badge" style={{ marginLeft: 4 }}>{conflict.field}</span>
        <span className="dt-spacer"></span>
        <SourceBadge source="trakt" />
      </div>
      <p className="caption sec" style={{ padding: '12px 16px 0' }}>{conflict.why}</p>
      <div className="dt-conflict-opt">
        <div className={'dt-conflict-side' + (pick === 'local' ? ' pick' : '')} onClick={() => setPick('local')}>
          <div className="mono" style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--dt-accent-text)', marginBottom: 6 }}>This app (local)</div>
          <div style={{ fontFamily: 'var(--bzr-font-body)', fontWeight: 600, color: 'var(--text-primary)' }}>{conflict.local}</div>
        </div>
        <div className={'dt-conflict-side' + (pick === 'remote' ? ' pick' : '')} onClick={() => setPick('remote')}>
          <div className="mono" style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>Trakt (remote)</div>
          <div style={{ fontFamily: 'var(--bzr-font-body)', fontWeight: 600, color: 'var(--text-primary)' }}>{conflict.remote}</div>
        </div>
      </div>
      <div className="dt-rowflex" style={{ padding: '0 16px 16px', flexWrap: 'wrap' }}>
        <button className="btn btn--primary btn--sm" disabled={!pick} onClick={() => app.resolveConflict(conflict.id, pick)}><Icon name="check" />Resolve · keep {pick || '…'}</button>
        <button className="btn btn--ghost btn--sm" onClick={() => app.resolveConflict(conflict.id, 'both')}>Keep both</button>
        <button className="btn btn--ghost btn--sm" onClick={() => app.resolveConflict(conflict.id, 'ignore')}>Ignore</button>
      </div>
    </div>
  );
}

function SyncView({ app }) {
  const [syncing, setSyncing] = useState(false);
  const run = () => { setSyncing(true); setTimeout(() => { setSyncing(false); app.runSync(); }, 1300); };
  return (
    <div className="dt-page" data-screen-label="Sync Center">
      <div className="dt-phead">
        {app.tweaks.eyebrow && <Eyebrow lot>SYNC / CENTER / JUN 2026</Eyebrow>}
        <div className="dt-rowflex" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div><h1>Sync center</h1><p className="lede">Where your library meets the services you already use. Trustworthy, legible, reversible.</p></div>
          <button className="btn btn--primary" onClick={run} disabled={syncing}><Icon name="sync" style={{ animation: syncing ? 'dt-spin 0.8s linear infinite' : 'none' }} />{syncing ? 'Syncing…' : 'Sync now'}</button>
        </div>
      </div>

      {/* conflicts first */}
      {app.conflicts.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <div className="dt-rowflex" style={{ marginBottom: 14 }}><Icon name="alert" size={16} style={{ color: 'var(--bzr-warn)' }} /><span style={{ fontFamily: 'var(--bzr-font-stencil)', fontWeight: 800, fontSize: 20, textTransform: 'uppercase', color: 'var(--text-primary)' }}>Needs your call</span><span className="dt-badge" style={{ color: 'var(--bzr-warn)', borderColor: 'var(--bzr-warn)' }}>{app.conflicts.length}</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {app.conflicts.map((c) => <ConflictCard key={c.id} conflict={c} app={app} />)}
          </div>
        </section>
      )}

      {/* connected accounts */}
      <section style={{ marginBottom: 32 }}>
        <div className="mono" style={{ fontSize: 9.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>Connected accounts</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <ProviderCard logo="T" color="#E89A3C" name="Trakt" status="connected" mode="Two-way · watchlist, watched, ratings"
            sub="Last pull today 09:14 · 6 items updated. Pushes watchlist adds and watched marks back."
            actions={<><button className="btn btn--ghost btn--sm" onClick={() => app.toast('Syncing Trakt…', 'Manual sync')}><Icon name="sync" />Sync</button><button className="btn btn--ghost btn--sm" onClick={() => app.toast('Disconnected Trakt', 'Account')}>Disconnect</button></>} />
          <ProviderCard logo="G" color="#C6FF24" name="Goodreads" status="csv" mode="Import / export only · no live API"
            sub="Goodreads no longer issues API keys — bring books in by CSV, export in a Goodreads-shaped file."
            actions={<button className="btn btn--primary btn--sm" onClick={() => app.openImport()}><Icon name="upload" />Import CSV</button>} />
          <ProviderCard logo="M" color="#2A4E8F" name="TMDb · Open Library · RAWG" status="meta" mode="Metadata only · covers, runtimes, IDs"
            sub="Powers search and enrichment for movies, shows, books and games. No account needed."
            actions={<span className="src-badge">Always on</span>} />
        </div>
      </section>

      {/* recent events */}
      <section style={{ marginBottom: 32 }}>
        <div className="dt-panel">
          <div className="dt-panel-h"><span className="t">Recent sync events</span><button className="btn btn--ghost btn--sm" onClick={() => app.toast('Exported sync log', 'CSV')}><Icon name="download" />Log</button></div>
          <div style={{ overflowX: 'auto' }}>
            <table className="dt-synctable">
              <thead><tr><th>Provider</th><th>Direction</th><th>When</th><th>Seen</th><th>Updated</th><th>Skipped</th><th>Status</th></tr></thead>
              <tbody>
                {app.syncEvents.map((e) => (
                  <tr key={e.id}>
                    <td><span style={{ fontFamily: 'var(--bzr-font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>{e.provider}</span></td>
                    <td className="mono" style={{ textTransform: 'uppercase', fontSize: 11 }}>{e.dir}</td>
                    <td className="mono" style={{ fontSize: 11 }}>{e.when}</td>
                    <td className="mono">{e.seen}</td>
                    <td className="mono" style={{ color: 'var(--dt-accent-text)' }}>{e.updated}</td>
                    <td className="mono">{e.skipped}</td>
                    <td><span className="dt-badge" style={{ color: e.status === 'ok' ? 'var(--bzr-success)' : 'var(--bzr-warn)', borderColor: 'transparent' }}><span className="dot" style={{ background: 'currentColor' }}></span>{e.status === 'ok' ? 'OK' : 'Warn'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* export */}
      <section>
        <div className="mono" style={{ fontSize: 9.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>Export · your data, any time</div>
        <div className="dt-rowflex" style={{ flexWrap: 'wrap' }}>
          <button className="btn btn--ghost" onClick={() => app.exportData('json')}><Icon name="download" />Full JSON</button>
          <button className="btn btn--ghost" onClick={() => app.exportData('csv')}><Icon name="download" />Full CSV</button>
          <button className="btn btn--ghost" onClick={() => app.exportData('goodreads')}><Icon name="download" />Goodreads CSV</button>
        </div>
      </section>
    </div>
  );
}

// ── GOODREADS IMPORT (modal) ────────────────────────────────
function GoodreadsImport({ app }) {
  const [step, setStep] = useState('upload');
  const rows = window.DT_DATA.GOODREADS_ROWS;
  const counts = { ok: rows.filter((r) => r.status === 'ok').length, dupe: rows.filter((r) => r.status === 'dupe').length, warn: rows.filter((r) => r.status === 'warn').length, fail: rows.filter((r) => r.status === 'fail').length };
  return (
    <div className="dt-modal" onClick={(e) => e.stopPropagation()} style={{ width: 'min(880px, 100%)' }}>
      <div className="dt-modal-h">
        <Icon name="upload" size={18} style={{ color: 'var(--dt-accent-text)' }} />
        <span className="t" style={{ fontFamily: 'var(--bzr-font-stencil)', fontWeight: 800, fontSize: 18, textTransform: 'uppercase', flex: 1 }}>Import Goodreads CSV</span>
        <button className="iconbtn" style={{ border: 'none' }} onClick={app.closeModal}><Icon name="x" /></button>
      </div>
      <div className="dt-modal-b" style={{ padding: 20 }}>
        {step === 'upload' ? (
          <div>
            <label className="dt-dropzone">
              <Icon name="upload" size={28} style={{ color: 'var(--dt-accent-text)' }} />
              <div style={{ fontFamily: 'var(--bzr-font-stencil)', fontWeight: 800, fontSize: 18, textTransform: 'uppercase', color: 'var(--text-primary)', marginTop: 10 }}>Drop your Goodreads export</div>
              <p className="caption sec" style={{ marginTop: 6 }}>From Goodreads → My Books → Import/Export → Export Library. Drop the <span className="mono">goodreads_library_export.csv</span> here.</p>
              <span className="btn btn--ghost btn--sm" style={{ marginTop: 14 }}>Choose file</span>
              <input type="file" accept=".csv" style={{ display: 'none' }} onChange={() => setStep('preview')} />
            </label>
            <div className="dt-rowflex" style={{ justifyContent: 'center', marginTop: 16 }}>
              <button className="btn btn--primary" onClick={() => setStep('preview')}>Use a sample file<Icon name="arrowR" /></button>
            </div>
          </div>
        ) : step === 'preview' ? (
          <div>
            <div className="dt-rowflex" style={{ gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
              <span className="dt-badge" style={{ color: 'var(--bzr-success)', borderColor: 'var(--bzr-success)' }}>{counts.ok} ready</span>
              <span className="dt-badge" style={{ color: 'var(--bzr-warn)', borderColor: 'var(--bzr-warn)' }}>{counts.dupe} duplicate</span>
              <span className="dt-badge" style={{ color: 'var(--bzr-warn)', borderColor: 'var(--bzr-warn)' }}>{counts.warn} needs review</span>
              <span className="dt-badge" style={{ color: 'var(--bzr-danger)', borderColor: 'var(--bzr-danger)' }}>{counts.fail} will skip</span>
              <span className="dt-spacer"></span>
              <span className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Shelf → status mapping shown</span>
            </div>
            <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--rd-2)', overflow: 'hidden', overflowX: 'auto' }}>
              <table className="dt-import-table">
                <thead><tr><th>Title</th><th>Author</th><th>ISBN</th><th>Shelf</th><th>Rating</th><th>→ Status</th><th></th></tr></thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className={r.status}>
                      <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{r.title}</td>
                      <td>{r.author}</td>
                      <td className="mono" style={{ fontSize: 11 }}>{r.isbn || '—'}</td>
                      <td className="mono" style={{ fontSize: 11, textTransform: 'uppercase' }}>{r.shelf || '—'}</td>
                      <td>{r.rating ? '★'.repeat(r.rating) : '—'}</td>
                      <td><span className="dt-badge dt-status">{r.map}</span></td>
                      <td>{r.status === 'dupe' ? <span className="caption" style={{ color: 'var(--bzr-warn)' }}>dup?</span> : r.status === 'warn' ? <Icon name="alert" size={13} style={{ color: 'var(--bzr-warn)' }} /> : r.status === 'fail' ? <Icon name="x" size={13} style={{ color: 'var(--bzr-danger)' }} /> : <Icon name="check" size={13} style={{ color: 'var(--bzr-success)' }} />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="caption muted" style={{ marginTop: 10 }}>to-read → backlog · currently-reading → current · read → done · abandoned → abandoned. Ratings and read dates carried over where present.</p>
            <div className="dt-rowflex" style={{ justifyContent: 'flex-end', marginTop: 18 }}>
              <button className="btn btn--ghost" onClick={() => setStep('upload')}>Back</button>
              <button className="btn btn--primary" onClick={() => setStep('done')}><Icon name="check" />Import {counts.ok + counts.dupe + counts.warn} books</button>
            </div>
          </div>
        ) : (
          <div className="dt-empty" style={{ border: 'none' }}>
            <div className="glyph">✓</div><h3>Import complete</h3>
            <p>{counts.ok + counts.warn} books added, {counts.dupe} flagged as possible duplicates for review, {counts.fail} row skipped. Ratings and read dates carried over.</p>
            <div className="dt-rowflex" style={{ justifyContent: 'center' }}>
              <button className="btn btn--ghost" onClick={() => { app.closeModal(); app.go('sync'); }}>Review duplicates</button>
              <button className="btn btn--primary" onClick={() => { app.closeModal(); app.go('backlog'); }}>See library<Icon name="arrowR" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── SETTINGS ────────────────────────────────────────────────
function SettingsView({ app }) {
  const [sec, setSec] = useState('appearance');
  const t = app.tweaks;
  const sections = [['appearance', 'Appearance'], ['account', 'Account'], ['data', 'Data'], ['connected', 'Connected'], ['privacy', 'Privacy']];
  return (
    <div className="dt-page" data-screen-label="Settings" style={{ maxWidth: 980 }}>
      <div className="dt-phead">
        {app.tweaks.eyebrow && <Eyebrow lot>SETTINGS / ACCOUNT</Eyebrow>}
        <h1>Settings</h1>
      </div>
      <div className="dt-settings-grid">
        <div className="dt-settings-nav">
          {sections.map(([id, l]) => <button key={id} className={sec === id ? 'on' : ''} onClick={() => setSec(id)}>{l}</button>)}
        </div>
        <div>
          {sec === 'appearance' && (
            <div>
              <div className="dt-settings-row">
                <div><div className="t">Theme</div><div className="d">Deep Void or warm Paper.</div></div>
                <div className="dt-seg-toggle">
                  <button className={t.theme === 'void' ? 'on' : ''} onClick={() => app.setTweak('theme', 'void')}>Void</button>
                  <button className={t.theme === 'paper' ? 'on' : ''} onClick={() => app.setTweak('theme', 'paper')}>Paper</button>
                </div>
              </div>
              <div className="dt-settings-row">
                <div><div className="t">Accent</div><div className="d">One signal color across the app.</div></div>
                <div className="dt-rowflex" style={{ gap: 8 }}>
                  {window.DT_DATA.ACCENTS.map((a) => (
                    <button key={a.name} onClick={() => app.setTweak('accent', a.vivid)} title={a.name}
                            style={{ width: 26, height: 26, borderRadius: 'var(--rd-1)', background: a.vivid, border: t.accent === a.vivid ? '2px solid var(--text-primary)' : '1px solid var(--border-default)', cursor: 'pointer' }} />
                  ))}
                </div>
              </div>
              <div className="dt-settings-row">
                <div><div className="t">Default library view</div><div className="d">Grid of covers, or dense rows.</div></div>
                <div className="dt-seg-toggle">
                  <button className={t.defaultView === 'grid' ? 'on' : ''} onClick={() => app.setTweak('defaultView', 'grid')}>Grid</button>
                  <button className={t.defaultView === 'row' ? 'on' : ''} onClick={() => app.setTweak('defaultView', 'row')}>Rows</button>
                </div>
              </div>
              <div className="dt-settings-row">
                <div><div className="t">Card density</div><div className="d">Cozy covers or compact tiles.</div></div>
                <div className="dt-seg-toggle">
                  <button className={t.density === 'cozy' ? 'on' : ''} onClick={() => app.setTweak('density', 'cozy')}>Cozy</button>
                  <button className={t.density === 'compact' ? 'on' : ''} onClick={() => app.setTweak('density', 'compact')}>Compact</button>
                </div>
              </div>
              <div className="dt-settings-row">
                <div><div className="t">Catalog eyebrows</div><div className="d">The mono lot-number labels above sections.</div></div>
                <div className="dt-seg-toggle">
                  <button className={t.eyebrow ? 'on' : ''} onClick={() => app.setTweak('eyebrow', true)}>On</button>
                  <button className={!t.eyebrow ? 'on' : ''} onClick={() => app.setTweak('eyebrow', false)}>Off</button>
                </div>
              </div>
            </div>
          )}
          {sec === 'account' && (
            <div>
              <div className="dt-settings-row"><div><div className="t">Display name</div><div className="d">Shown only to you in this prototype.</div></div><input className="input" defaultValue="You" style={{ maxWidth: 220 }} /></div>
              <div className="dt-settings-row"><div><div className="t">Email</div><div className="d">Sign-in identity.</div></div><input className="input" defaultValue="you@downtimed.app" style={{ maxWidth: 260 }} /></div>
              <div className="dt-settings-row"><div><div className="t" style={{ color: 'var(--bzr-danger)' }}>Delete account</div><div className="d">Soft-delete, disconnect services, queue full erase.</div></div><button className="btn btn--danger btn--sm" onClick={() => app.toast('This would start account deletion', 'Danger zone')}><Icon name="trash" />Delete</button></div>
            </div>
          )}
          {sec === 'data' && (
            <div>
              <div className="dt-settings-row"><div><div className="t">Export library</div><div className="d">JSON, CSV, or Goodreads-shaped. Includes statuses, tags, lists, ratings, notes, dates, external IDs.</div></div><div className="dt-rowflex"><button className="btn btn--ghost btn--sm" onClick={() => app.exportData('json')}>JSON</button><button className="btn btn--ghost btn--sm" onClick={() => app.exportData('csv')}>CSV</button><button className="btn btn--ghost btn--sm" onClick={() => app.exportData('goodreads')}>Goodreads</button></div></div>
              <div className="dt-settings-row"><div><div className="t">Import Goodreads CSV</div><div className="d">Bring an existing book library in.</div></div><button className="btn btn--primary btn--sm" onClick={() => app.openImport()}><Icon name="upload" />Import</button></div>
            </div>
          )}
          {sec === 'connected' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <ProviderCard logo="T" color="#E89A3C" name="Trakt" status="connected" mode="Two-way" actions={<button className="btn btn--ghost btn--sm" onClick={() => app.toast('Disconnected', 'Trakt')}>Disconnect</button>} />
              <ProviderCard logo="G" color="#C6FF24" name="Goodreads" status="csv" mode="CSV only" actions={<button className="btn btn--ghost btn--sm" onClick={() => app.openImport()}>Import</button>} />
            </div>
          )}
          {sec === 'privacy' && (
            <div>
              <div className="dt-settings-row"><div><div className="t">Library visibility</div><div className="d">Private by default. No public profile in this version.</div></div><span className="dt-badge"><span className="dot" style={{ background: 'var(--bzr-success)' }}></span>Private</span></div>
              <div className="dt-settings-row"><div><div className="t">Search-engine indexing</div><div className="d">Never index your library.</div></div><span className="dt-badge">Off</span></div>
              <div className="dt-settings-row"><div><div className="t">Notes in analytics</div><div className="d">Your notes are never tracked as event properties.</div></div><span className="dt-badge">Excluded</span></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ProviderCard, ConflictCard, SyncView, GoodreadsImport, SettingsView });
