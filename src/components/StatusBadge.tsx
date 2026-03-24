import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; dot: string; className: string }> = {
  need_review: { label: "Need Review", dot: "bg-status-warning-fg", className: "bg-status-warning-bg text-status-warning-fg" },
  published: { label: "Published", dot: "bg-status-success-fg", className: "bg-status-success-bg text-status-success-fg" },
  rejected: { label: "Rejected", dot: "bg-status-danger-fg", className: "bg-status-danger-bg text-status-danger-fg" },
  draft: { label: "Draft", dot: "bg-muted-foreground/50", className: "bg-muted text-muted-foreground" },
  archived: { label: "Archived", dot: "bg-muted-foreground/40", className: "bg-muted text-muted-foreground" },
};

export default function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, dot: "bg-muted-foreground/50", className: "bg-muted text-muted-foreground" };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[11px] font-medium", config.className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", config.dot)} />
      {config.label}
    </span>
  );
}
