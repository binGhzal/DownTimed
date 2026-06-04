export function SetupGate() {
  return (
    <div className="rounded-md border border-amber bg-panel p-6">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-amber">Database required</p>
      <h2 className="mt-3 text-2xl font-semibold text-charcoal">Connect PostgreSQL to run Downtimed.</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
        Real implementation uses the Prisma PostgreSQL schema from the architecture doc. Set
        <code className="mx-1 rounded bg-paper px-1.5 py-0.5 font-mono text-xs">DATABASE_URL</code>
        and run migration plus seed before using the app.
      </p>
      <pre className="mt-5 overflow-x-auto rounded-md border border-line bg-paper p-4 text-xs text-charcoal">
{`cp apps/web/.env.example apps/web/.env.local
pnpm db:migrate
pnpm db:seed
pnpm dev`}
      </pre>
    </div>
  );
}
