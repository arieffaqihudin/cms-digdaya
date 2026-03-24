import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search, Eye, CheckCircle, XCircle, FolderTree, Tag,
  Sparkles, Video, Filter, X,
} from "lucide-react";
import { mockVideos, channels, categories } from "@/lib/mock-data";
import StatusBadge from "@/components/StatusBadge";
import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useScreenSize } from "@/components/AppLayout";

const ITEMS_PER_PAGE = 8;

export default function VideoPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const screenSize = useScreenSize();

  const filtered = useMemo(
    () =>
      mockVideos.filter((v) => {
        if (search && !v.title.toLowerCase().includes(search.toLowerCase())) return false;
        if (channelFilter !== "all" && v.channel !== channelFilter) return false;
        if (statusFilter !== "all" && v.status !== statusFilter) return false;
        if (categoryFilter !== "all" && v.aiSuggestion !== categoryFilter) return false;
        return true;
      }),
    [search, channelFilter, statusFilter, categoryFilter],
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const toggleSelect = (id: string) =>
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const toggleAll = () =>
    setSelected((s) => s.length === paged.length ? [] : paged.map((v) => v.id));

  const hasActiveFilters = channelFilter !== "all" || statusFilter !== "all" || categoryFilter !== "all";

  const filterSelects = (
    <>
      <Select value={channelFilter} onValueChange={(v) => { setChannelFilter(v); setPage(1); }}>
        <SelectTrigger className="w-full sm:w-[160px] h-9 rounded-[10px] text-[13px] border-border bg-background">
          <SelectValue placeholder="Channel" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Channel</SelectItem>
          {channels.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
        <SelectTrigger className="w-full sm:w-[150px] h-9 rounded-[10px] text-[13px] border-border bg-background">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Status</SelectItem>
          <SelectItem value="need_review">Perlu Review</SelectItem>
          <SelectItem value="published">Dipublikasikan</SelectItem>
          <SelectItem value="rejected">Ditolak</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
        </SelectContent>
      </Select>
      <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(1); }}>
        <SelectTrigger className="w-full sm:w-[160px] h-9 rounded-[10px] text-[13px] border-border bg-background">
          <SelectValue placeholder="Kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Kategori</SelectItem>
          {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
        </SelectContent>
      </Select>
    </>
  );

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base md:text-lg font-semibold text-foreground">Video Inbox</h1>
          <p className="text-[12px] md:text-[13px] text-muted-foreground mt-0.5">
            Video yang di-crawl dari channel YouTube
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-[10px] bg-accent/60 px-2.5 md:px-3 py-1.5 text-[12px] text-muted-foreground">
          <Video className="h-3.5 w-3.5" strokeWidth={1.6} />
          <span className="tabular-nums font-medium">{filtered.length}</span>
          <span className="hidden sm:inline">video</span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="rounded-[12px] border border-border bg-surface p-3 md:p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
            <Input
              placeholder="Cari video..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 h-9 rounded-[10px] text-[13px] border-border bg-background focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          {screenSize === "mobile" ? (
            <Button
              variant="outline"
              size="sm"
              className={cn("h-9 rounded-[10px] text-[13px] border-border gap-1.5", hasActiveFilters && "border-primary/40 text-primary")}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-3.5 w-3.5" strokeWidth={1.6} />
              Filter
              {hasActiveFilters && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
            </Button>
          ) : (
            filterSelects
          )}
        </div>
        {/* Mobile filter dropdown */}
        {screenSize === "mobile" && showFilters && (
          <div className="mt-3 pt-3 border-t border-border/60 space-y-2 animate-fade-in">
            {filterSelects}
          </div>
        )}
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="flex items-center gap-2 md:gap-3 rounded-[12px] border border-primary/10 bg-primary/[0.03] px-3 md:px-5 py-3 animate-fade-in flex-wrap">
          <span className="text-[13px] font-medium text-foreground tabular-nums">
            {selected.length} video dipilih
          </span>
          <div className="flex gap-2 ml-auto flex-wrap">
            <Button size="sm" className="h-8 rounded-[10px] text-xs bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
              <CheckCircle className="h-3.5 w-3.5" strokeWidth={1.6} /> Publikasikan
            </Button>
            <Button size="sm" variant="outline" className="h-8 rounded-[10px] text-xs border-border gap-1.5">
              <XCircle className="h-3.5 w-3.5" strokeWidth={1.6} /> Tolak
            </Button>
          </div>
        </div>
      )}

      {/* Table / Card list */}
      <div className="rounded-[12px] border border-border bg-surface shadow-card overflow-hidden">
        {screenSize === "mobile" ? (
          /* Mobile card list */
          <div className="divide-y divide-border/30">
            {paged.map((v) => (
              <Link
                key={v.id}
                to={`/video/${v.id}`}
                className="flex gap-3 p-4 hover:bg-accent/30 transition-colors"
              >
                <img
                  src={v.thumbnail}
                  alt=""
                  className="h-[56px] w-[90px] rounded-[8px] object-cover bg-muted shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-foreground line-clamp-2 leading-[1.4]">{v.title}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-[11px] text-muted-foreground">{v.channel}</span>
                    <span className="text-[11px] text-muted-foreground/50">·</span>
                    <span className="text-[11px] text-muted-foreground tabular-nums">{v.publishDate}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge status={v.status} />
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/[0.07] px-2 py-[2px] text-[10px] font-medium text-primary">
                      <Sparkles className="h-2.5 w-2.5" strokeWidth={1.8} />
                      {v.aiSuggestion}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Desktop/tablet table */
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="px-4 md:px-5 py-3.5 text-left w-10">
                    <Checkbox checked={selected.length === paged.length && paged.length > 0} onCheckedChange={toggleAll} />
                  </th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Video</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden lg:table-cell">Channel</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden xl:table-cell">Tanggal</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden lg:table-cell">AI Suggestion</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Status</th>
                  <th className="px-4 md:px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden md:table-cell">Publish</th>
                  <th className="px-4 md:px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((v) => {
                  const isSelected = selected.includes(v.id);
                  return (
                    <tr
                      key={v.id}
                      className={cn(
                        "border-b border-border/30 transition-colors duration-150",
                        isSelected ? "bg-primary/[0.04]" : "hover:bg-accent/30",
                      )}
                    >
                      <td className="px-4 md:px-5 py-4">
                        <Checkbox checked={isSelected} onCheckedChange={() => toggleSelect(v.id)} />
                      </td>
                      <td className="px-4 md:px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={v.thumbnail} alt="" className="h-[48px] w-[80px] rounded-[8px] object-cover bg-muted shrink-0" />
                          <div className="min-w-0 max-w-[300px]">
                            <p className="font-medium text-foreground line-clamp-2 leading-[1.4]">{v.title}</p>
                            <p className="text-[11px] text-muted-foreground mt-1 lg:hidden">{v.channel} · {v.publishDate}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-5 py-4 text-muted-foreground whitespace-nowrap hidden lg:table-cell">{v.channel}</td>
                      <td className="px-4 md:px-5 py-4 text-muted-foreground tabular-nums whitespace-nowrap hidden xl:table-cell">{v.publishDate}</td>
                      <td className="px-4 md:px-5 py-4 hidden lg:table-cell">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/[0.07] px-2.5 py-[3px] text-[11px] font-medium text-primary">
                          <Sparkles className="h-3 w-3" strokeWidth={1.8} />
                          {v.aiSuggestion}
                        </span>
                      </td>
                      <td className="px-4 md:px-5 py-4"><StatusBadge status={v.status} /></td>
                      <td className="px-4 md:px-5 py-4 text-center hidden md:table-cell"><Switch checked={v.status === "published"} /></td>
                      <td className="px-4 md:px-5 py-4 text-right">
                        <Link to={`/video/${v.id}`}>
                          <Button size="sm" variant="ghost" className="h-8 rounded-[8px] text-xs text-muted-foreground hover:text-foreground hover:bg-accent gap-1.5">
                            <Eye className="h-3.5 w-3.5" strokeWidth={1.6} />
                            <span className="hidden md:inline">Review</span>
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {filtered.length === 0 && (
          <div className="p-12 md:p-16 text-center text-[13px] text-muted-foreground">
            Tidak ada video yang sesuai filter.
          </div>
        )}
        {totalPages > 0 && (
          <div className="border-t border-border/40">
            <Pagination currentPage={page} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
