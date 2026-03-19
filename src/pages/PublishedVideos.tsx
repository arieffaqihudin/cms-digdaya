import { useState } from "react";
import { Search, Edit, ExternalLink } from "lucide-react";
import { mockVideos } from "@/lib/mock-data";
import StatusBadge from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function PublishedVideos() {
  const [search, setSearch] = useState("");
  const published = mockVideos
    .filter((v) => v.status === "published")
    .filter((v) => !search || v.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-surface p-4 shadow-card">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search published videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 rounded-md"
          />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/80 backdrop-blur">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Video</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Channel</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {published.map((v) => (
                <tr key={v.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={v.thumbnail} alt="" className="h-14 w-24 rounded object-cover bg-muted shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate max-w-xs">{v.displayTitle || v.title}</p>
                        {v.tags && v.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {v.tags.map((t) => (
                              <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{v.channel}</td>
                  <td className="px-4 py-3 text-muted-foreground">{v.category || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground tabular-nums whitespace-nowrap">{v.publishDate}</td>
                  <td className="px-4 py-3"><StatusBadge status={v.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/inbox/${v.id}`}>
                        <Button size="sm" variant="outline" className="h-8 rounded-md">
                          <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {published.length === 0 && (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No published videos found.
          </div>
        )}
      </div>
    </div>
  );
}
