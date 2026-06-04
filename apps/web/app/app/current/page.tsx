import { LibraryGrid } from "@/components/library-grid";
import { SetupGate } from "@/components/setup-gate";
import { getLibrarySnapshot } from "@/lib/library";

export const dynamic = "force-dynamic";

export default async function CurrentPage() {
  const result = await getLibrarySnapshot();
  if (result.kind === "database-not-configured") return <SetupGate />;
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Library</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-charcoal">Current</h1>
      <p className="mt-3 max-w-2xl text-muted">Items you have started, with progress ready for the next pass.</p>
      <div className="mt-7">
        <LibraryGrid items={result.snapshot.items} status="current" />
      </div>
    </div>
  );
}
