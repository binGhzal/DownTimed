import { getLibrarySnapshot } from "@/lib/library";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getLibrarySnapshot();
  if (result.kind === "database-not-configured") {
    return Response.json({ error: "DATABASE_URL is required." }, { status: 503 });
  }
  return Response.json(result.snapshot, {
    headers: {
      "content-disposition": "attachment; filename=downtimed-library.json",
    },
  });
}
