import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Pencil, FileText, Filter, FileImage, FileVideo, File, FileSpreadsheet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useScreenSize } from "@/components/AppLayout";
import Pagination from "@/components/Pagination";

interface RepoItem {
  id: string;
  fileName: string;
  category: string;
  product: string;
  fileType: string;
  fileSize: string;
  uploadDate: string;
  status: "published" | "draft";
}

const productTabs = ["Digdaya Persuratan", "Digdaya Pesantren", "Siskader NU", "Digdaya Kepengurusan"];

const mockItems: RepoItem[] = [
  { id: "r1", fileName: "Panduan Pengguna v2.1", category: "Panduan", product: "Digdaya Persuratan", fileType: "PDF", fileSize: "2.4 MB", uploadDate: "2025-03-20", status: "published" },
  { id: "r2", fileName: "Template Surat Resmi", category: "Template", product: "Digdaya Persuratan", fileType: "DOCX", fileSize: "540 KB", uploadDate: "2025-03-18", status: "published" },
  { id: "r3", fileName: "Video Tutorial Login", category: "Video", product: "Digdaya Persuratan", fileType: "MP4", fileSize: "18.5 MB", uploadDate: "2025-03-15", status: "published" },
  { id: "r4", fileName: "Laporan Bulanan Maret", category: "Laporan", product: "Digdaya Persuratan", fileType: "XLSX", fileSize: "1.1 MB", uploadDate: "2025-03-12", status: "draft" },
  { id: "r5", fileName: "Banner Promosi Ramadhan", category: "Media", product: "Digdaya Persuratan", fileType: "PNG", fileSize: "3.2 MB", uploadDate: "2025-03-10", status: "published" },
  { id: "r6", fileName: "Panduan Admin Pesantren", category: "Panduan", product: "Digdaya Pesantren", fileType: "PDF", fileSize: "4.8 MB", uploadDate: "2025-03-19", status: "published" },
  { id: "r7", fileName: "Data Santri Template", category: "Template", product: "Digdaya Pesantren", fileType: "XLSX", fileSize: "280 KB", uploadDate: "2025-03-17", status: "published" },
  { id: "r8", fileName: "Brosur Digital Pesantren", category: "Media", product: "Digdaya Pesantren", fileType: "PDF", fileSize: "6.1 MB", uploadDate: "2025-03-14", status: "draft" },
  { id: "r9", fileName: "Panduan Input Kader", category: "Panduan", product: "Siskader NU", fileType: "PDF", fileSize: "1.9 MB", uploadDate: "2025-03-16", status: "published" },
  { id: "r10", fileName: "Template Laporan Kader", category: "Template", product: "Siskader NU", fileType: "DOCX", fileSize: "320 KB", uploadDate: "2025-03-11", status: "published" },
  { id: "r11", fileName: "Panduan Kepengurusan", category: "Panduan", product: "Digdaya Kepengurusan", fileType: "PDF", fileSize: "3.5 MB", uploadDate: "2025-03-13", status: "published" },
  { id: "r12", fileName: "Infografis Struktur Organisasi", category: "Media", product: "Digdaya Kepengurusan", fileType: "PNG", fileSize: "2.8 MB", uploadDate: "2025-03-09", status: "published" },
];

const statusMap: Record<string, { label: string; className: string; dot: string }> = {
  published: { label: "Dipublikasikan", className: "bg-[hsl(var(--status-success-bg))] text-[hsl(var(--status-success-fg))]", dot: "bg-[hsl(var(--status-success-fg))]" },
  draft: { label: "Draft", className: "bg-muted text-muted-foreground", dot: "bg-muted-foreground/50" },
};

const fileTypeIcons: Record<string, typeof FileText> = {
  PDF: FileText,
  DOCX: File,
  XLSX: FileSpreadsheet,
  MP4: FileVideo,
  PNG: FileImage,
  JPG: FileImage,
};

const ITEMS_PER_PAGE = 10;

export default function RepositoryPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(productTabs[0]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const screenSize = useScreenSize();

  const categoriesForTab = useMemo(() => {
    const cats = new Set(mockItems.filter((f) => f.product === activeTab).map((f) => f.category));
    return Array.from(cats);
  }, [activeTab]);

  const filtered = useMemo(() => {
    return mockItems.filter((f) => {
      if (f.product !== activeTab) return false;
      if (search && !f.fileName.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== "all" && f.category !== categoryFilter) return false;
      if (statusFilter !== "all" && f.status !== statusFilter) return false;
      return true;
    });
  }, [search, activeTab, categoryFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const allSelected = paged.length > 0 && paged.every((f) => selectedIds.has(f.id));
  const hasActiveFilters = categoryFilter !== "all" || statusFilter !== "all";

  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(paged.map((f) => f.id)));
  };
  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPage(1);
    setCategoryFilter("all");
    setStatusFilter("all");
    setSelectedIds(new Set());
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const s = statusMap[status] || statusMap.draft;
    return (
      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[11px] font-medium", s.className)}>
        <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
        {s.label}
      </span>
    );
  };

  const FileTypeIcon = ({ type }: { type: string }) => {
    const Icon = fileTypeIcons[type] || File;
    return <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />;
  };

  const filterSelects = (
    <>
      <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(1); }}>
        <SelectTrigger className="w-full sm:w-[170px] h-9 rounded-[10px] text-[13px] border-border bg-background">
          <SelectValue placeholder="Kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Kategori</SelectItem>
          {categoriesForTab.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
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
    </>
  );

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-base md:text-lg font-semibold text-foreground">Repository</h1>
          <p className="text-[12px] md:text-[13px] text-muted-foreground mt-0.5">Kelola dokumen dan file Digdaya</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-[10px] bg-accent/60 px-2.5 md:px-3 py-1.5 text-[12px] text-muted-foreground self-start sm:self-auto">
          <FileText className="h-3.5 w-3.5" strokeWidth={1.6} />
          <span className="tabular-nums font-medium">{filtered.length}</span>
          <span className="hidden sm:inline">file</span>
        </div>
      </div>

      {/* Product tabs */}
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-1 min-w-max">
          {productTabs.map((tab) => (
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

      {/* Search + Filters + Upload */}
      <div className="rounded-[12px] border border-border bg-surface p-3 md:p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
            <Input
              placeholder="Cari file..."
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
              <Link to="/repository/new" className="w-full sm:w-auto">
                <Button size="sm" className="h-9 w-full rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
                  <Plus className="h-4 w-4" strokeWidth={1.6} /> Upload
                </Button>
              </Link>
            </>
          ) : (
            <>
              {filterSelects}
              <Link to="/repository/new">
                <Button size="sm" className="h-9 rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
                  <Plus className="h-4 w-4" strokeWidth={1.6} /> Upload
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
            {paged.map((item) => (
              <div key={item.id} className="p-4 hover:bg-accent/30 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <FileTypeIcon type={item.fileType} />
                      <p className="text-[13px] font-medium text-foreground leading-[1.4] truncate">{item.fileName}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-[11px] text-muted-foreground">{item.category}</span>
                      <span className="text-[11px] text-muted-foreground/50">·</span>
                      <span className="text-[11px] text-muted-foreground">{item.fileType} · {item.fileSize}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="inline-flex items-center rounded-full bg-primary/[0.07] px-2 py-[2px] text-[10px] font-medium text-primary">{item.product}</span>
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                  <Link
                    to={`/repository/${item.id}`}
                    className="flex items-center gap-1 text-[12px] font-medium text-primary hover:text-primary/80 transition-colors shrink-0 mt-0.5"
                  >
                    <Pencil className="h-3 w-3" strokeWidth={1.6} />
                    Ubah
                  </Link>
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
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">File Name</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden lg:table-cell">Category</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden lg:table-cell">Produk</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden xl:table-cell">File Type</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden xl:table-cell">File Size</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden md:table-cell">Upload Date</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Status</th>
                  <th className="px-4 md:px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((item) => (
                  <tr key={item.id} className="border-b border-border/30 hover:bg-accent/30 transition-colors duration-150">
                    <td className="px-4 py-4">
                      <Checkbox checked={selectedIds.has(item.id)} onCheckedChange={() => toggleOne(item.id)} className="h-4 w-4" />
                    </td>
                    <td className="px-4 md:px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <FileTypeIcon type={item.fileType} />
                        <div>
                          <span className="font-medium text-foreground leading-[1.4]">{item.fileName}</span>
                          <p className="text-[11px] text-muted-foreground mt-0.5 lg:hidden">{item.category} · {item.fileType} · {item.fileSize}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-5 py-4 text-muted-foreground hidden lg:table-cell">{item.category}</td>
                    <td className="px-4 md:px-5 py-4 hidden lg:table-cell">
                      <span className="inline-flex items-center rounded-full bg-primary/[0.07] px-2.5 py-[3px] text-[11px] font-medium text-primary">{item.product}</span>
                    </td>
                    <td className="px-4 md:px-5 py-4 text-muted-foreground hidden xl:table-cell">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-accent/80 px-2 py-[3px] text-[11px] font-mono">{item.fileType}</span>
                    </td>
                    <td className="px-4 md:px-5 py-4 text-muted-foreground tabular-nums hidden xl:table-cell">{item.fileSize}</td>
                    <td className="px-4 md:px-5 py-4 text-muted-foreground tabular-nums hidden md:table-cell">{item.uploadDate}</td>
                    <td className="px-4 md:px-5 py-4"><StatusBadge status={item.status} /></td>
                    <td className="px-4 md:px-5 py-4 text-right">
                      <Link to={`/repository/${item.id}`} className="inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:text-primary/80 transition-colors">
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
          <div className="p-12 md:p-16 text-center text-[13px] text-muted-foreground">Tidak ada file ditemukan.</div>
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
