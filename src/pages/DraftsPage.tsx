import { useState, useMemo } from "react";
import { Search, Edit } from "lucide-react";
import { mockVideos, mockBlogs, mockGuides, mockFAQs } from "@/lib/mock-data";
import StatusBadge from "@/components/StatusBadge";
import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 8;

export default function DraftsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const allDrafts = useMemo(() => [
    ...mockVideos.filter(v => v.status === "draft").map(v => ({ id: v.id, title: v.title, type: "Video" as const, category: v.category || v.aiSuggestion, date: v.publishDate, status: v.status, editUrl: `/video/${v.id}` })),
    ...mockBlogs.filter(b => b.status === "draft").map(b => ({ id: b.id, title: b.title, type: "Blog" as const, category: b.category, date: b.publishDate, status: b.status, editUrl: `/content/${b.id}?type=blog` })),
    ...mockGuides.filter(g => g.status === "draft").map(g => ({ id: g.id, title: g.title, type: "Guide" as const, category: g.category, date: g.lastUpdated, status: g.status, editUrl: `/content/${g.id}?type=guide` })),
    ...mockFAQs.filter(f => f.status === "draft").map(f => ({ id: f.id, title: f.question, type: "FAQ" as const, category: f.category, date: "-", status: f.status, editUrl: `/content/${f.id}?type=faq` })),
  ].filter(item => !search || item.title.toLowerCase().includes(search.toLowerCase())), [search]);

  const totalPages = Math.ceil(allDrafts.length / ITEMS_PER_PAGE);
  const paged = allDrafts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-surface p-4 shadow-soft">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
          <Input placeholder="Search drafts..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 h-9 rounded-[10px] text-[13px] border-border bg-surface focus-visible:ring-1 focus-visible:ring-ring" />
        </div>
      </div>
      <div className="rounded-xl border border-border bg-surface shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border/70">
                <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Content</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Type</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Category</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Date</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Status</th>
                <th className="px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((item) => (
                <tr key={`${item.type}-${item.id}`} className="border-b border-border/40 hover:bg-accent/40 transition-colors duration-150">
                  <td className="px-5 py-4 font-medium text-foreground max-w-xs truncate">{item.title}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-full bg-primary/[0.07] px-2.5 py-[3px] text-[11px] font-medium text-primary">{item.type}</span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{item.category || "—"}</td>
                  <td className="px-5 py-4 text-muted-foreground tabular-nums whitespace-nowrap">{item.date}</td>
                  <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
                  <td className="px-5 py-4 text-right">
                    <Link to={item.editUrl}>
                      <Button size="sm" variant="ghost" className="h-8 rounded-[8px] text-xs text-muted-foreground hover:text-foreground hover:bg-accent">
                        <Edit className="h-3.5 w-3.5 mr-1" strokeWidth={1.6} /> Edit
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {allDrafts.length === 0 && <div className="p-16 text-center text-[13px] text-muted-foreground">No drafts found.</div>}
        <Pagination currentPage={page} totalPages={totalPages} totalItems={allDrafts.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} />
      </div>
    </div>
  );
}
