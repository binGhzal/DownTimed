import { toCsv, toLibraryExportRows } from "@downtimed/utils";

import { getLibrarySnapshot } from "@/lib/library";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getLibrarySnapshot();
  if (result.kind === "database-not-configured") {
    return new Response("DATABASE_URL is required.\n", { status: 503 });
  }
  return new Response(toCsv(toLibraryExportRows(result.snapshot.items)), {
    headers: {
      "content-disposition": "attachment; filename=downtimed-library.csv",
      "content-type": "text/csv; charset=utf-8",
    },
  });
}
