import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Eye, CheckCircle, XCircle, FolderTree, Tag } from "lucide-react";
import { mockVideos, channels, categories } from "@/lib/mock-data";
import StatusBadge from "@/components/StatusBadge";
import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 8;

export default function VideoPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => mockVideos.filter((v) => {
    if (search && !v.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (channelFilter !== "all" && v.channel !== channelFilter) return false;
    if (statusFilter !== "all" && v.status !== statusFilter) return false;
    if (categoryFilter !== "all" && v.aiSuggestion !== categoryFilter) return false;
    return true;
  }), [search, channelFilter, statusFilter, categoryFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const toggleSelect = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const toggleAll = () =>
    setSelected((s) => (s.length === paged.length ? [] : paged.map((v) => v.id)));

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div className="rounded-xl border border-border bg-surface p-4 shadow-soft">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
            <Input placeholder="Search videos..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 h-9 rounded-[10px] text-[13px] border-border bg-surface focus-visible:ring-1 focus-visible:ring-ring" />
          </div>
          <Select value={channelFilter} onValueChange={(v) => { setChannelFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[160px] h-9 rounded-[10px] text-[13px] border-border bg-surface"><SelectValue placeholder="Channel" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              {channels.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[150px] h-9 rounded-[10px] text-[13px] border-border bg-surface"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="need_review">Need Review</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[160px] h-9 rounded-[10px] text-[13px] border-border bg-surface"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-primary/12 bg-primary/[0.04] px-4 py-3">
          <span className="text-[13px] font-medium text-foreground tabular-nums">{selected.length} selected</span>
          <div className="flex gap-2 ml-auto">
            <Button size="sm" className="h-8 rounded-[10px] text-xs bg-primary text-primary-foreground hover:bg-primary/90"><CheckCircle className="h-3.5 w-3.5 mr-1.5" strokeWidth={1.6} /> Publish</Button>
            <Button size="sm" variant="outline" className="h-8 rounded-[10px] text-xs border-border"><XCircle className="h-3.5 w-3.5 mr-1.5" strokeWidth={1.6} /> Reject</Button>
            <Button size="sm" variant="outline" className="h-8 rounded-[10px] text-xs border-border"><FolderTree className="h-3.5 w-3.5 mr-1.5" strokeWidth={1.6} /> Category</Button>
            <Button size="sm" variant="outline" className="h-8 rounded-[10px] text-xs border-border"><Tag className="h-3.5 w-3.5 mr-1.5" strokeWidth={1.6} /> Tags</Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border bg-surface shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border/70">
                <th className="px-5 py-3.5 text-left w-10"><Checkbox checked={selected.length === paged.length && paged.length > 0} onCheckedChange={toggleAll} /></th>
                <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Video</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Channel</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Date</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">AI Suggestion</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Status</th>
                <th className="px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Publish</th>
                <th className="px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((v) => {
                const isSelected = selected.includes(v.id);
                return (
                  <tr
                    key={v.id}
                    className={cn(
                      "border-b border-border/40 transition-colors duration-150",
                      isSelected
                        ? "bg-primary/[0.04]"
                        : "hover:bg-accent/40"
                    )}
                  >
                    <td className="px-5 py-4"><Checkbox checked={isSelected} onCheckedChange={() => toggleSelect(v.id)} /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3.5">
                        <img src={v.thumbnail} alt="" className="h-[46px] w-[76px] rounded-[8px] object-cover bg-muted shrink-0" />
                        <span className="font-medium text-foreground line-clamp-2 max-w-[280px] leading-snug">{v.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">{v.channel}</td>
                    <td className="px-5 py-4 text-muted-foreground tabular-nums whitespace-nowrap">{v.publishDate}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-full bg-primary/[0.07] px-2.5 py-[3px] text-[11px] font-medium text-primary">{v.aiSuggestion}</span>
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={v.status} /></td>
                    <td className="px-5 py-4 text-center"><Switch checked={v.status === "published"} /></td>
                    <td className="px-5 py-4 text-right">
                      <Link to={`/video/${v.id}`}>
                        <Button size="sm" variant="ghost" className="h-8 rounded-[8px] text-xs text-muted-foreground hover:text-foreground hover:bg-accent">
                          <Eye className="h-3.5 w-3.5 mr-1" strokeWidth={1.6} /> Review
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-16 text-center text-[13px] text-muted-foreground">No videos match your filters.</div>
        )}
        <Pagination currentPage={page} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} />
      </div>
    </div>
  );
}
