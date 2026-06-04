import { SetupGate } from "@/components/setup-gate";
import { getLibrarySnapshot } from "@/lib/library";

export const dynamic = "force-dynamic";

export default async function SyncPage() {
  const result = await getLibrarySnapshot();
  if (result.kind === "database-not-configured") return <SetupGate />;

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Integrations</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-charcoal">Sync center</h1>
      <section className="mt-7 rounded-md border border-line bg-panel p-5">
        <h2 className="text-xl font-semibold text-charcoal">Open conflicts</h2>
        <div className="mt-4 grid gap-3">
          {result.snapshot.syncConflicts.length === 0 ? (
            <p className="text-sm text-muted">No open sync conflicts.</p>
          ) : (
            result.snapshot.syncConflicts.map((conflict) => (
              <div key={conflict.id} className="rounded-md border border-line bg-paper p-4">
                <p className="font-semibold text-charcoal">{conflict.itemTitle ?? "Unmatched item"}</p>
                <p className="mt-1 text-sm text-muted">
                  {conflict.provider} · {conflict.fieldName}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
      <section className="mt-6 rounded-md border border-line bg-panel p-5">
        <h2 className="text-xl font-semibold text-charcoal">Recent sync events</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
              <tr>
                <th className="py-2">Provider</th>
                <th>Direction</th>
                <th>Status</th>
                <th>Seen</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Failed</th>
              </tr>
            </thead>
            <tbody>
              {result.snapshot.syncEvents.map((event) => (
                <tr key={event.id} className="border-t border-line">
                  <td className="py-3">{event.provider}</td>
                  <td>{event.direction}</td>
                  <td>{event.status}</td>
                  <td>{event.itemsSeen}</td>
                  <td>{event.itemsCreated}</td>
                  <td>{event.itemsUpdated}</td>
                  <td>{event.itemsFailed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
