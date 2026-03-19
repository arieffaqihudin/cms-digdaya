import { cn } from "@/lib/utils";

const statusConfig = {
  need_review: { label: "Need Review", className: "bg-status-warning-bg text-status-warning-fg" },
  published: { label: "Published", className: "bg-status-success-bg text-status-success-fg" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive" },
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
};

export default function StatusBadge({ status }: { status: keyof typeof statusConfig }) {
  const config = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold", config.className)}>
      {config.label}
    </span>
  );
}
