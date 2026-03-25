import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search, Eye, CheckCircle, XCircle, Video, Filter, X,
  RefreshCw, Plus, Pencil, Star,
} from "lucide-react";
import { mockVideos, channels } from "@/lib/mock-data";
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
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

const videoCategories = ["Kegiatan Organisasi", "Program & Inisiatif NU", "Tokoh & Kepemimpinan", "NU & Kebangsaan"];

const ITEMS_PER_PAGE = 8;

export default function VideoPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const screenSize = useScreenSize();

  // Sort: published first, then by date
  const filtered = useMemo(() => {
    const result = mockVideos.filter((v) => {
      if (search && !v.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (channelFilter !== "all" && v.channel !== channelFilter) return false;
      if (statusFilter !== "all" && v.status !== statusFilter) return false;
      if (categoryFilter !== "all" && v.category !== categoryFilter) return false;
      return true;
    });

    return result.sort((a, b) => {
      if (a.status === "published" && b.status !== "published") return -1;
      if (a.status !== "published" && b.status === "published") return 1;
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    });
  }, [search, channelFilter, statusFilter, categoryFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const toggleSelect = (id: string) =>
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const toggleAll = () =>
    setSelected((s) => s.length === paged.length ? [] : paged.map((v) => v.id));

  const hasActiveFilters = channelFilter !== "all" || statusFilter !== "all" || categoryFilter !== "all";

  const [showSyncModal, setShowSyncModal] = useState(false);

  const handleSync = (startDate: Date, endDate: Date) => {
    setSyncing(true);
    setShowSyncModal(false);
    setTimeout(() => {
      setSyncing(false);
      toast.success("Video berhasil disinkronkan", {
        description: "12 video berhasil diambil.",
      });
    }, 2000);
  };

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
          <SelectItem value="published">Dipublikasikan</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
        </SelectContent>
      </Select>
      <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(1); }}>
        <SelectTrigger className="w-full sm:w-[160px] h-9 rounded-[10px] text-[13px] border-border bg-background">
          <SelectValue placeholder="Kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Kategori</SelectItem>
          {videoCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
        </SelectContent>
      </Select>
    </>
  );

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base md:text-lg font-semibold text-foreground">Video</h1>
          <p className="text-[12px] md:text-[13px] text-muted-foreground mt-0.5">
            Kelola video konten CMS
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
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-[10px] text-[13px] border-border gap-1.5"
            onClick={handleSync}
            disabled={syncing}
          >
            <RefreshCw className={cn("h-3.5 w-3.5", syncing && "animate-spin")} strokeWidth={1.6} />
            {screenSize === "mobile" ? "Sinkron" : "Sinkron Video"}
          </Button>
          <Button
            size="sm"
            className="h-9 rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.6} />
            {screenSize === "mobile" ? "Tambah" : "+ Tambah Video"}
          </Button>
        </div>
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
                    {v.featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-[2px] text-[10px] font-medium text-amber-600">
                        <Star className="h-2.5 w-2.5" strokeWidth={1.8} />
                        Unggulan
                      </span>
                    )}
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
                  <th className="px-4 md:px-5 py-3.5 text-left w-10">
                    <Checkbox checked={selected.length === paged.length && paged.length > 0} onCheckedChange={toggleAll} />
                  </th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Video</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden lg:table-cell">Channel</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden xl:table-cell">Tanggal</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden lg:table-cell">Kategori</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Status</th>
                  <th className="px-4 md:px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden md:table-cell">Unggulan</th>
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
                        <span className="text-[12px] text-muted-foreground">{v.category || "-"}</span>
                      </td>
                      <td className="px-4 md:px-5 py-4"><StatusBadge status={v.status} /></td>
                      <td className="px-4 md:px-5 py-4 text-center hidden md:table-cell">
                        {v.featured ? (
                          <Star className="h-4 w-4 text-amber-500 mx-auto fill-amber-500" strokeWidth={1.6} />
                        ) : (
                          <span className="text-muted-foreground/30">—</span>
                        )}
                      </td>
                      <td className="px-4 md:px-5 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-[8px] text-muted-foreground hover:text-foreground hover:bg-accent">
                              <MoreHorizontal className="h-4 w-4" strokeWidth={1.6} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-[10px] min-w-[140px]">
                            <DropdownMenuItem asChild className="gap-2 text-[13px]">
                              <Link to={`/video/${v.id}`}>
                                <Pencil className="h-3.5 w-3.5" strokeWidth={1.6} /> Ubah
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="gap-2 text-[13px]">
                              <Link to={`/video/${v.id}`}>
                                <Eye className="h-3.5 w-3.5" strokeWidth={1.6} /> Lihat
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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

      {/* Add Video Modal */}
      <AddVideoModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  );
}

/* ─── Add Video Modal ─── */
function AddVideoModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [channel, setChannel] = useState("");
  const [publishDate, setPublishDate] = useState<Date | undefined>(undefined);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("draft");
  const [featured, setFeatured] = useState(false);
  const [description, setDescription] = useState("");

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Judul video wajib diisi");
      return;
    }
    toast.success("Video berhasil ditambahkan");
    onOpenChange(false);
    // Reset
    setTitle(""); setYoutubeUrl(""); setChannel(""); setPublishDate(undefined);
    setCategory(""); setStatus("draft"); setFeatured(false); setDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] rounded-[12px] p-0 gap-0">
        <DialogHeader className="px-5 py-4 border-b border-border/50">
          <DialogTitle className="text-[15px] font-semibold text-foreground">Tambah Video</DialogTitle>
        </DialogHeader>
        <div className="px-5 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Judul */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium text-muted-foreground">Judul</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul video..."
              className="rounded-[10px] h-9 text-[13px] border-border bg-background"
            />
          </div>

          {/* Link YouTube */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium text-muted-foreground">Link YouTube</Label>
            <Input
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="rounded-[10px] h-9 text-[13px] border-border bg-background"
            />
          </div>

          {/* Channel Sumber */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium text-muted-foreground">Channel Sumber</Label>
            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger className="rounded-[10px] h-9 text-[13px] border-border bg-background">
                <SelectValue placeholder="Pilih channel" />
              </SelectTrigger>
              <SelectContent>
                {channels.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Tanggal Publish */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium text-muted-foreground">Tanggal Publish</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-[10px] h-9 text-[13px] border-border",
                    !publishDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-3.5 w-3.5" strokeWidth={1.6} />
                  {publishDate ? format(publishDate, "dd MMM yyyy") : "Pilih tanggal..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={publishDate}
                  onSelect={setPublishDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Kategori Video */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium text-muted-foreground">Kategori Video</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="rounded-[10px] h-9 text-[13px] border-border bg-background">
                <SelectValue placeholder="Pilih kategori video" />
              </SelectTrigger>
              <SelectContent>
                {videoCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium text-muted-foreground">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="rounded-[10px] h-9 text-[13px] border-border bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Dipublikasikan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Unggulan */}
          <div className="flex items-center justify-between py-1">
            <div>
              <span className="text-[13px] text-foreground">Unggulan</span>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5">Tampilkan sebagai video unggulan</p>
            </div>
            <Switch checked={featured} onCheckedChange={setFeatured} />
          </div>

          {/* Deskripsi */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium text-muted-foreground">Deskripsi (opsional)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="rounded-[10px] resize-none text-[13px] border-border bg-background leading-relaxed"
              placeholder="Tulis deskripsi video..."
            />
          </div>
        </div>
        <DialogFooter className="px-5 py-4 border-t border-border/50 gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="rounded-[10px] h-9 text-[13px] border-border">Batal</Button>
          </DialogClose>
          <Button className="rounded-[10px] h-9 text-[13px] bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSave}>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
