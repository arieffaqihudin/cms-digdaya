import { mockVideos } from "@/lib/mock-data";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

export default function RejectedVideos() {
  const rejected = mockVideos.filter((v) => v.status === "rejected");

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-surface shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/80 backdrop-blur">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Video</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Channel</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reason</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rejected.map((v) => (
                <tr key={v.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={v.thumbnail} alt="" className="h-14 w-24 rounded object-cover bg-muted shrink-0" />
                      <span className="font-medium text-foreground truncate max-w-xs">{v.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{v.channel}</td>
                  <td className="px-4 py-3 text-muted-foreground">{v.rejectReason || "—"}</td>
                  <td className="px-4 py-3"><StatusBadge status={v.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/inbox/${v.id}`}>
                      <Button size="sm" variant="outline" className="h-8 rounded-md">
                        <RotateCcw className="h-3.5 w-3.5 mr-1" /> Re-review
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rejected.length === 0 && (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No rejected videos. All caught up!
          </div>
        )}
      </div>
    </div>
  );
}
