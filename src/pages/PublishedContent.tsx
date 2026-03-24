import { useState } from "react";
import { Search, Edit } from "lucide-react";
import { mockVideos, mockBlogs, mockGuides, mockFAQs } from "@/lib/mock-data";
import StatusBadge from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function PublishedContent() {
  const [search, setSearch] = useState("");

  const allPublished = [
    ...mockVideos.filter(v => v.status === "published").map(v => ({ id: v.id, title: v.displayTitle || v.title, type: "Video" as const, category: v.category || v.aiSuggestion, date: v.publishDate, status: v.status, thumbnail: v.thumbnail, editUrl: `/video/${v.id}` })),
    ...mockBlogs.filter(b => b.status === "published").map(b => ({ id: b.id, title: b.title, type: "Blog" as const, category: b.category, date: b.publishDate, status: b.status, thumbnail: b.coverImage, editUrl: `/content/${b.id}?type=blog` })),
    ...mockGuides.filter(g => g.status === "published").map(g => ({ id: g.id, title: g.title, type: "Guide" as const, category: g.category, date: g.lastUpdated, status: g.status, thumbnail: undefined, editUrl: `/content/${g.id}?type=guide` })),
    ...mockFAQs.filter(f => f.status === "published").map(f => ({ id: f.id, title: f.question, type: "FAQ" as const, category: f.category, date: "-", status: f.status, thumbnail: undefined, editUrl: `/content/${f.id}?type=faq` })),
  ]
    .filter(item => !search || item.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-surface p-4 shadow-card">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search published content..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 rounded-md" />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/80">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Content</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allPublished.map((item) => (
                <tr key={`${item.type}-${item.id}`} className="hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.thumbnail ? (
                        <img src={item.thumbnail} alt="" className="h-10 w-16 rounded object-cover bg-muted shrink-0" />
                      ) : (
                        <div className="h-10 w-16 rounded bg-muted shrink-0" />
                      )}
                      <span className="font-medium text-foreground truncate max-w-xs">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[11px] font-medium text-primary">{item.type}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{item.category || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground tabular-nums whitespace-nowrap">{item.date}</td>
                  <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <Link to={item.editUrl}>
                      <Button size="sm" variant="outline" className="h-8 rounded-md"><Edit className="h-3.5 w-3.5 mr-1" /> Edit</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {allPublished.length === 0 && (
          <div className="p-12 text-center text-sm text-muted-foreground">No published content found.</div>
        )}
      </div>
    </div>
  );
}
