import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Eye, CalendarClock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import Pagination from "@/components/Pagination";
import { mockVideos, mockBlogs, mockGuides, mockFAQs } from "@/lib/mock-data";

const ITEMS_PER_PAGE = 8;

export default function ScheduledPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const allScheduled = useMemo(() => {
    const items = [
      ...mockVideos.filter(v => v.status === "published").slice(0, 3).map(v => ({
        id: v.id, title: v.title, type: "Video" as const, category: v.category,
        date: v.publishDate, status: "scheduled" as const, editUrl: `/video/${v.id}`,
      })),
      ...mockBlogs.filter(b => b.status === "draft").slice(0, 2).map(b => ({
        id: b.id, title: b.title, type: "Blog" as const, category: b.category,
        date: b.publishDate, status: "scheduled" as const, editUrl: `/content/${b.id}?type=blog`,
      })),
      ...mockGuides.filter(g => g.status === "draft").slice(0, 2).map(g => ({
        id: g.id, title: g.title, type: "Panduan" as const, category: g.category,
        date: g.lastUpdated, status: "scheduled" as const, editUrl: `/content/${g.id}?type=guide`,
      })),
    ];
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter(i => i.title.toLowerCase().includes(q));
  }, [search]);

  const totalPages = Math.ceil(allScheduled.length / ITEMS_PER_PAGE);
  const paged = allScheduled.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Konten Terjadwal</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Konten yang dijadwalkan untuk dipublikasikan</p>
        </div>
      </div>

      <div className="rounded-[12px] border border-border bg-surface shadow-soft">
        <div className="flex items-center gap-3 p-4 border-b border-border/60">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari konten..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 h-9 rounded-lg border-border bg-background text-[13px]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border/40">
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Judul</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Tipe</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Kategori</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Jadwal</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-5 py-3 text-right font-medium text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(item => (
                <tr key={item.id} className="border-b border-border/30 hover:bg-accent/40 transition-colors">
                  <td className="px-5 py-4 font-medium text-foreground">{item.title}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <CalendarClock className="h-3.5 w-3.5" />
                      {item.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{item.category}</td>
                  <td className="px-5 py-4 text-muted-foreground">{item.date}</td>
                  <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
                  <td className="px-5 py-4 text-right">
                    <Link to={item.editUrl}>
                      <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground hover:text-foreground">
                        <Eye className="h-3.5 w-3.5" /> Lihat
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">Tidak ada konten terjadwal.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="p-4 border-t border-border/40">
            <Pagination currentPage={page} totalPages={totalPages} totalItems={allScheduled.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}