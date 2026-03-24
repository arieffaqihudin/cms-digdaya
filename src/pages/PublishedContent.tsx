import { useState, useMemo } from "react";
import { Search, Pencil } from "lucide-react";
import { mockVideos, mockBlogs, mockGuides, mockFAQs } from "@/lib/mock-data";
import StatusBadge from "@/components/StatusBadge";
import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 8;

export default function PublishedContent() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const allPublished = useMemo(() => [
    ...mockVideos.filter(v => v.status === "published").map(v => ({ id: v.id, title: v.displayTitle || v.title, type: "Video" as const, category: v.category || v.aiSuggestion, date: v.publishDate, status: v.status, thumbnail: v.thumbnail, editUrl: `/video/${v.id}` })),
    ...mockBlogs.filter(b => b.status === "published").map(b => ({ id: b.id, title: b.title, type: "Blog" as const, category: b.category, date: b.publishDate, status: b.status, thumbnail: b.coverImage, editUrl: `/content/${b.id}?type=blog` })),
    ...mockGuides.filter(g => g.status === "published").map(g => ({ id: g.id, title: g.title, type: "Guide" as const, category: g.category, date: g.lastUpdated, status: g.status, thumbnail: undefined, editUrl: `/content/${g.id}?type=guide` })),
    ...mockFAQs.filter(f => f.status === "published").map(f => ({ id: f.id, title: f.question, type: "FAQ" as const, category: f.category, date: "-", status: f.status, thumbnail: undefined, editUrl: `/content/${f.id}?type=faq` })),
  ]
    .filter(item => !search || item.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date)), [search]);

  const totalPages = Math.ceil(allPublished.length / ITEMS_PER_PAGE);
  const paged = allPublished.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="rounded-[12px] border border-border bg-surface p-3 md:p-4 shadow-card">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
          <Input placeholder="Cari konten dipublikasikan..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 h-9 rounded-[10px] text-[13px] border-border bg-background focus-visible:ring-1 focus-visible:ring-ring" />
        </div>
      </div>
      <div className="rounded-[12px] border border-border bg-surface shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border/60">
                <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Konten</th>
                <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Tipe</th>
                <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Kategori</th>
                <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Tanggal</th>
                <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Status</th>
                <th className="px-4 md:px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((item) => (
                <tr key={`${item.type}-${item.id}`} className="border-b border-border/30 hover:bg-accent/30 transition-colors duration-150">
                  <td className="px-4 md:px-5 py-4">
                    <div className="flex items-center gap-3.5">
                      {item.thumbnail ? (
                        <img src={item.thumbnail} alt="" className="h-[40px] w-[64px] rounded-[8px] object-cover bg-muted shrink-0" />
                      ) : (
                        <div className="h-[40px] w-[64px] rounded-[8px] bg-accent shrink-0" />
                      )}
                      <span className="font-medium text-foreground truncate max-w-[280px]">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-5 py-4">
                    <span className="inline-flex items-center rounded-full bg-primary/[0.07] px-2.5 py-[3px] text-[11px] font-medium text-primary">{item.type}</span>
                  </td>
                  <td className="px-4 md:px-5 py-4 text-muted-foreground">{item.category || "—"}</td>
                  <td className="px-4 md:px-5 py-4 text-muted-foreground tabular-nums whitespace-nowrap">{item.date}</td>
                  <td className="px-4 md:px-5 py-4"><StatusBadge status={item.status} /></td>
                  <td className="px-4 md:px-5 py-4 text-right">
                    <Link to={item.editUrl}>
                      <Button size="sm" variant="ghost" className="h-8 rounded-[8px] text-xs text-muted-foreground hover:text-foreground hover:bg-accent gap-1.5">
                        <Pencil className="h-3.5 w-3.5" strokeWidth={1.6} /> Ubah
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {allPublished.length === 0 && <div className="p-12 md:p-16 text-center text-[13px] text-muted-foreground">Tidak ada konten dipublikasikan.</div>}
        <Pagination currentPage={page} totalPages={totalPages} totalItems={allPublished.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} />
      </div>
    </div>
  );
}
