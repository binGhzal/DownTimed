import type { UserItemStatus } from "@downtimed/types";

import { changeStatus } from "@/app/app/actions";

const labels: Record<UserItemStatus, string> = {
  backlog: "Backlog",
  current: "Start",
  done: "Done",
  abandoned: "Abandon",
  hidden: "Hide",
};

export function StatusForm({
  userItemId,
  status,
  compact = false,
}: {
  userItemId: string;
  status: UserItemStatus;
  compact?: boolean;
}) {
  return (
    <form action={changeStatus}>
      <input type="hidden" name="userItemId" value={userItemId} />
      <input type="hidden" name="status" value={status} />
      <button
        className={
          compact
            ? "focus-ring rounded border border-line px-2 py-1 text-xs font-medium text-muted hover:border-amber hover:text-charcoal"
            : "focus-ring rounded-md border border-line px-3 py-2 text-sm font-medium hover:border-amber"
        }
        type="submit"
      >
        {labels[status]}
      </button>
    </form>
  );
}
