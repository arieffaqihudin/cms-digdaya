import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Pencil, ImageIcon, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useScreenSize } from "@/components/AppLayout";
import Pagination from "@/components/Pagination";

interface BannerItem {
  id: string;
  title: string;
  thumbnail: string;
  placement: string;
  targetLink: string;
  order: number;
  status: "active" | "inactive" | "scheduled";
}

const placementTabs = ["Home", "Produk", "Promo", "Event", "Onboarding"];

const mockBanners: BannerItem[] = [
  { id: "b1", title: "Promo Ramadhan 2025", thumbnail: "https://placehold.co/320x120/e8f5e9/2e7d32?text=Ramadhan+2025", placement: "Home", targetLink: "/promo/ramadhan", order: 1, status: "active" },
  { id: "b2", title: "Fitur Baru: E-Disposisi", thumbnail: "https://placehold.co/320x120/e0f2f1/00695c?text=E-Disposisi", placement: "Home", targetLink: "/fitur/e-disposisi", order: 2, status: "active" },
  { id: "b3", title: "Webinar Digitalisasi Pesantren", thumbnail: "https://placehold.co/320x120/fff3e0/e65100?text=Webinar", placement: "Home", targetLink: "/event/webinar", order: 3, status: "scheduled" },
  { id: "b4", title: "Update Aplikasi v3.0", thumbnail: "https://placehold.co/320x120/e3f2fd/1565c0?text=Update+v3.0", placement: "Home", targetLink: "/update/v3", order: 4, status: "inactive" },
  { id: "b5", title: "Persuratan Digital", thumbnail: "https://placehold.co/320x120/e8f5e9/388e3c?text=Persuratan", placement: "Produk", targetLink: "/produk/persuratan", order: 1, status: "active" },
  { id: "b6", title: "Digdaya Pesantren", thumbnail: "https://placehold.co/320x120/f3e5f5/7b1fa2?text=Pesantren", placement: "Produk", targetLink: "/produk/pesantren", order: 2, status: "active" },
  { id: "b7", title: "Diskon Akhir Tahun", thumbnail: "https://placehold.co/320x120/fce4ec/c62828?text=Diskon", placement: "Promo", targetLink: "/promo/diskon", order: 1, status: "active" },
  { id: "b8", title: "Gratis 3 Bulan", thumbnail: "https://placehold.co/320x120/e8eaf6/283593?text=Gratis+3+Bulan", placement: "Promo", targetLink: "/promo/gratis", order: 2, status: "scheduled" },
  { id: "b9", title: "Muktamar NU 2025", thumbnail: "https://placehold.co/320x120/e0f7fa/006064?text=Muktamar", placement: "Event", targetLink: "/event/muktamar", order: 1, status: "active" },
  { id: "b10", title: "Selamat Datang", thumbnail: "https://placehold.co/320x120/f1f8e9/33691e?text=Welcome", placement: "Onboarding", targetLink: "/onboarding/welcome", order: 1, status: "active" },
  { id: "b11", title: "Panduan Awal", thumbnail: "https://placehold.co/320x120/fff8e1/f57f17?text=Panduan", placement: "Onboarding", targetLink: "/onboarding/panduan", order: 2, status: "active" },
];

const statusMap: Record<string, { label: string; className: string; dot: string }> = {
  active: { label: "Aktif", className: "bg-[hsl(var(--status-success-bg))] text-[hsl(var(--status-success-fg))]", dot: "bg-[hsl(var(--status-success-fg))]" },
  inactive: { label: "Nonaktif", className: "bg-muted text-muted-foreground", dot: "bg-muted-foreground/50" },
  scheduled: { label: "Terjadwal", className: "bg-[hsl(var(--status-info-bg))] text-[hsl(var(--status-info-fg))]", dot: "bg-[hsl(var(--status-info-fg))]" },
};

const ITEMS_PER_PAGE = 10;

export default function BannerPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(placementTabs[0]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const screenSize = useScreenSize();

  const filtered = useMemo(() => {
    return mockBanners.filter((b) => {
      if (b.placement !== activeTab) return false;
      if (search && !b.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      return true;
    });
  }, [search, activeTab, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const allSelected = paged.length > 0 && paged.every((b) => selectedIds.has(b.id));
  const hasActiveFilters = statusFilter !== "all";

  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(paged.map((b) => b.id)));
  };
  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPage(1);
    setStatusFilter("all");
    setSelectedIds(new Set());
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const s = statusMap[status] || statusMap.inactive;
    return (
      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[11px] font-medium", s.className)}>
        <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
        {s.label}
      </span>
    );
  };

  const filterSelects = (
    <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
      <SelectTrigger className="w-full sm:w-[150px] h-9 rounded-[10px] text-[13px] border-border bg-background">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Semua Status</SelectItem>
        <SelectItem value="active">Aktif</SelectItem>
        <SelectItem value="inactive">Nonaktif</SelectItem>
        <SelectItem value="scheduled">Terjadwal</SelectItem>
      </SelectContent>
    </Select>
  );

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-base md:text-lg font-semibold text-foreground">Banner App</h1>
          <p className="text-[12px] md:text-[13px] text-muted-foreground mt-0.5">Kelola banner yang ditampilkan di aplikasi</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-[10px] bg-accent/60 px-2.5 md:px-3 py-1.5 text-[12px] text-muted-foreground self-start sm:self-auto">
          <ImageIcon className="h-3.5 w-3.5" strokeWidth={1.6} />
          <span className="tabular-nums font-medium">{filtered.length}</span>
          <span className="hidden sm:inline">banner</span>
        </div>
      </div>

      {/* Placement tabs */}
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-1 min-w-max">
          {placementTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={cn(
                "px-3.5 py-2 rounded-[10px] text-[13px] font-medium transition-colors whitespace-nowrap",
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search + Filters + Create */}
      <div className="rounded-[12px] border border-border bg-surface p-3 md:p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
            <Input
              placeholder="Cari banner..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 h-9 rounded-[10px] text-[13px] border-border bg-background focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          {screenSize === "mobile" ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className={cn("h-9 rounded-[10px] text-[13px] border-border gap-1.5", hasActiveFilters && "border-primary/40 text-primary")}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-3.5 w-3.5" strokeWidth={1.6} /> Filter
              </Button>
              <Link to="/banner/new" className="w-full sm:w-auto">
                <Button size="sm" className="h-9 w-full rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
                  <Plus className="h-4 w-4" strokeWidth={1.6} /> Buat Banner
                </Button>
              </Link>
            </>
          ) : (
            <>
              {filterSelects}
              <Link to="/banner/new">
                <Button size="sm" className="h-9 rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
                  <Plus className="h-4 w-4" strokeWidth={1.6} /> Buat Banner
                </Button>
              </Link>
            </>
          )}
        </div>
        {screenSize === "mobile" && showFilters && (
          <div className="mt-3 pt-3 border-t border-border/60 space-y-2 animate-fade-in">{filterSelects}</div>
        )}
      </div>

      {/* Table / Card List */}
      <div className="rounded-[12px] border border-border bg-surface shadow-card overflow-hidden">
        {screenSize === "mobile" ? (
          <div className="divide-y divide-border/30">
            {paged.map((banner) => (
              <div key={banner.id} className="p-4 hover:bg-accent/30 transition-colors">
                <div className="flex gap-3">
                  <img
                    src={banner.thumbnail}
                    alt={banner.title}
                    className="w-24 h-16 rounded-[8px] object-cover border border-border/50 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-foreground leading-[1.4] truncate">{banner.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="inline-flex items-center rounded-full bg-primary/[0.07] px-2 py-[2px] text-[10px] font-medium text-primary">{banner.placement}</span>
                      <span className="text-[11px] text-muted-foreground">#{banner.order}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <StatusBadge status={banner.status} />
                      <Link
                        to={`/banner/${banner.id}`}
                        className="flex items-center gap-1 text-[12px] font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        <Pencil className="h-3 w-3" strokeWidth={1.6} />
                        Ubah
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="px-4 py-3.5 w-10">
                    <Checkbox checked={allSelected} onCheckedChange={toggleAll} className="h-4 w-4" />
                  </th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Thumbnail</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Title</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden lg:table-cell">Placement</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden xl:table-cell">Target Link</th>
                  <th className="px-4 md:px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground w-20">Order</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Status</th>
                  <th className="px-4 md:px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((banner) => (
                  <tr key={banner.id} className="border-b border-border/30 hover:bg-accent/30 transition-colors duration-150">
                    <td className="px-4 py-3.5">
                      <Checkbox checked={selectedIds.has(banner.id)} onCheckedChange={() => toggleOne(banner.id)} className="h-4 w-4" />
                    </td>
                    <td className="px-4 md:px-5 py-3.5">
                      <img
                        src={banner.thumbnail}
                        alt={banner.title}
                        className="w-28 h-[42px] rounded-[6px] object-cover border border-border/50"
                      />
                    </td>
                    <td className="px-4 md:px-5 py-3.5">
                      <span className="font-medium text-foreground">{banner.title}</span>
                      <p className="text-[11px] text-muted-foreground mt-0.5 lg:hidden">{banner.placement}</p>
                    </td>
                    <td className="px-4 md:px-5 py-3.5 hidden lg:table-cell">
                      <span className="inline-flex items-center rounded-full bg-primary/[0.07] px-2.5 py-[3px] text-[11px] font-medium text-primary">{banner.placement}</span>
                    </td>
                    <td className="px-4 md:px-5 py-3.5 hidden xl:table-cell">
                      <span className="font-mono text-[12px] text-muted-foreground">{banner.targetLink}</span>
                    </td>
                    <td className="px-4 md:px-5 py-3.5 text-center">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-accent text-[12px] font-medium text-foreground">{banner.order}</span>
                    </td>
                    <td className="px-4 md:px-5 py-3.5"><StatusBadge status={banner.status} /></td>
                    <td className="px-4 md:px-5 py-3.5 text-right">
                      <Link to={`/banner/${banner.id}`} className="inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:text-primary/80 transition-colors">
                        <Pencil className="h-3 w-3" strokeWidth={1.6} />
                        Ubah
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="p-12 md:p-16 text-center text-[13px] text-muted-foreground">Tidak ada banner ditemukan.</div>
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
