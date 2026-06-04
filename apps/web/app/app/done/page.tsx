import { LibraryGrid } from "@/components/library-grid";
import { SetupGate } from "@/components/setup-gate";
import { getLibrarySnapshot } from "@/lib/library";

export const dynamic = "force-dynamic";

export default async function DonePage() {
  const result = await getLibrarySnapshot();
  if (result.kind === "database-not-configured") return <SetupGate />;
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Archive</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-charcoal">Done</h1>
      <p className="mt-3 max-w-2xl text-muted">Finished history with ratings, notes, and sync dates.</p>
      <div className="mt-7">
        <LibraryGrid items={result.snapshot.items} status="done" />
      </div>
    </div>
  );
}
