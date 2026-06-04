import { addManualItem } from "@/app/app/actions";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Settings</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-charcoal">Settings</h1>
      <section className="mt-7 rounded-md border border-line bg-panel p-5">
        <h2 className="text-xl font-semibold text-charcoal">Add manual item</h2>
        <form action={addManualItem} className="mt-5 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-charcoal">
            Title
            <input className="focus-ring rounded-md border border-line bg-paper px-3 py-2" name="title" required />
          </label>
          <label className="grid gap-2 text-sm font-medium text-charcoal">
            Type
            <select className="focus-ring rounded-md border border-line bg-paper px-3 py-2" name="mediaType">
              <option value="manual">Manual item</option>
              <option value="movie">Movie</option>
              <option value="show">Show</option>
              <option value="book">Book</option>
              <option value="game">Game</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-charcoal">
            Source note
            <input className="focus-ring rounded-md border border-line bg-paper px-3 py-2" name="sourceNote" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-charcoal">
            Description
            <textarea className="focus-ring min-h-28 rounded-md border border-line bg-paper px-3 py-2" name="userDescription" />
          </label>
          <button className="focus-ring w-fit rounded-md bg-charcoal px-4 py-2 text-sm font-semibold text-panel" type="submit">
            Add to backlog
          </button>
        </form>
      </section>
      <section className="mt-6 rounded-md border border-line bg-panel p-5">
        <h2 className="text-xl font-semibold text-charcoal">Export</h2>
        <div className="mt-4 flex gap-3">
          <a className="focus-ring rounded-md border border-line px-4 py-2 text-sm font-semibold" href="/api/export/json">
            JSON
          </a>
          <a className="focus-ring rounded-md border border-line px-4 py-2 text-sm font-semibold" href="/api/export/csv">
            CSV
          </a>
        </div>
      </section>
    </div>
  );
}
