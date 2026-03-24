import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Pencil, Plus, PenSquare, Filter } from "lucide-react";
import { mockBlogs, categories } from "@/lib/mock-data";
import StatusBadge from "@/components/StatusBadge";
import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useScreenSize } from "@/components/AppLayout";

const ITEMS_PER_PAGE = 8;

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const screenSize = useScreenSize();

  const filtered = useMemo(() => mockBlogs.filter((b) => {
    if (search && !b.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (categoryFilter !== "all" && b.category !== categoryFilter) return false;
    return true;
  }), [search, statusFilter, categoryFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const hasActiveFilters = statusFilter !== "all" || categoryFilter !== "all";

  const filterSelects = (
    <>
      <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(1); }}>
        <SelectTrigger className="w-full sm:w-[160px] h-9 rounded-[10px] text-[13px] border-border bg-background"><SelectValue placeholder="Kategori" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Kategori</SelectItem>
          {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
        <SelectTrigger className="w-full sm:w-[150px] h-9 rounded-[10px] text-[13px] border-border bg-background"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Status</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="published">Dipublikasikan</SelectItem>
          <SelectItem value="archived">Diarsipkan</SelectItem>
        </SelectContent>
      </Select>
    </>
  );

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base md:text-lg font-semibold text-foreground">Blog</h1>
          <p className="text-[12px] md:text-[13px] text-muted-foreground mt-0.5">Kelola artikel blog dan editorial</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-[10px] bg-accent/60 px-2.5 md:px-3 py-1.5 text-[12px] text-muted-foreground">
          <PenSquare className="h-3.5 w-3.5" strokeWidth={1.6} />
          <span className="tabular-nums font-medium">{filtered.length}</span>
          <span className="hidden sm:inline">artikel</span>
        </div>
      </div>

      <div className="rounded-[12px] border border-border bg-surface p-3 md:p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
            <Input placeholder="Cari artikel..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 h-9 rounded-[10px] text-[13px] border-border bg-background focus-visible:ring-1 focus-visible:ring-ring" />
          </div>
          {screenSize === "mobile" ? (
            <>
              <Button variant="outline" size="sm" className={cn("h-9 rounded-[10px] text-[13px] border-border gap-1.5", hasActiveFilters && "border-primary/40 text-primary")} onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-3.5 w-3.5" strokeWidth={1.6} /> Filter
              </Button>
              <Link to="/content/new?type=blog" className="w-full sm:w-auto">
                <Button size="sm" className="h-9 w-full sm:w-auto rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
                  <Plus className="h-4 w-4" strokeWidth={1.6} /> Artikel Baru
                </Button>
              </Link>
            </>
          ) : (
            <>
              {filterSelects}
              <Link to="/content/new?type=blog">
                <Button size="sm" className="h-9 rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
                  <Plus className="h-4 w-4" strokeWidth={1.6} /> Artikel Baru
                </Button>
              </Link>
            </>
          )}
        </div>
        {screenSize === "mobile" && showFilters && (
          <div className="mt-3 pt-3 border-t border-border/60 space-y-2 animate-fade-in">{filterSelects}</div>
        )}
      </div>

      <div className="rounded-[12px] border border-border bg-surface shadow-card overflow-hidden">
        {screenSize === "mobile" ? (
          <div className="divide-y divide-border/30">
            {paged.map((b) => (
              <Link key={b.id} to={`/content/${b.id}?type=blog`} className="flex gap-3 p-4 hover:bg-accent/30 transition-colors">
                <img src={b.coverImage} alt="" className="h-[56px] w-[90px] rounded-[8px] object-cover bg-muted shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-foreground line-clamp-2 leading-[1.4]">{b.title}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-[11px] text-muted-foreground">{b.author}</span>
                    <span className="text-[11px] text-muted-foreground/50">·</span>
                    <span className="text-[11px] text-muted-foreground">{b.category || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge status={b.status} />
                    <span className="text-[10px] text-muted-foreground tabular-nums">{b.publishDate}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Judul</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden lg:table-cell">Kategori</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden xl:table-cell">Penulis</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Status</th>
                  <th className="px-4 md:px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden md:table-cell">Unggulan</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden lg:table-cell">Tanggal</th>
                  <th className="px-4 md:px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((b) => (
                  <tr key={b.id} className="border-b border-border/30 hover:bg-accent/30 transition-colors duration-150">
                    <td className="px-4 md:px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={b.coverImage} alt="" className="h-[48px] w-[80px] rounded-[8px] object-cover bg-muted shrink-0" />
                        <div className="min-w-0">
                          <span className="font-medium text-foreground line-clamp-2 max-w-[280px] leading-[1.4]">{b.title}</span>
                          <p className="text-[11px] text-muted-foreground mt-1 lg:hidden">{b.category || "—"} · {b.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-5 py-4 text-muted-foreground hidden lg:table-cell">{b.category || "—"}</td>
                    <td className="px-4 md:px-5 py-4 text-muted-foreground whitespace-nowrap hidden xl:table-cell">{b.author}</td>
                    <td className="px-4 md:px-5 py-4"><StatusBadge status={b.status} /></td>
                    <td className="px-4 md:px-5 py-4 text-center hidden md:table-cell"><Switch checked={b.featured} /></td>
                    <td className="px-4 md:px-5 py-4 text-muted-foreground tabular-nums whitespace-nowrap hidden lg:table-cell">{b.publishDate}</td>
                    <td className="px-4 md:px-5 py-4 text-right">
                      <Link to={`/content/${b.id}?type=blog`}>
                        <Button size="sm" variant="ghost" className="h-8 rounded-[8px] text-xs text-muted-foreground hover:text-foreground hover:bg-accent gap-1.5">
                          <Eye className="h-3.5 w-3.5" strokeWidth={1.6} /> <span className="hidden md:inline">Edit</span>
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {filtered.length === 0 && <div className="p-12 md:p-16 text-center text-[13px] text-muted-foreground">Tidak ada artikel ditemukan.</div>}
        {totalPages > 0 && (
          <div className="border-t border-border/40">
            <Pagination currentPage={page} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
