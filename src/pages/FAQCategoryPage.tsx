import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Pencil, FolderTree, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useScreenSize } from "@/components/AppLayout";
import Pagination from "@/components/Pagination";

interface FAQCategory {
  id: string;
  name: string;
  slug: string;
  product: string;
  isActive: boolean;
}

const productOptions = [
  "Digdaya Persuratan",
  "Digdaya Kepengurusan",
  "Digdaya Pesantren",
  "Portal Pesantren NU",
  "Digdaya Kader",
  "Digdaya Health",
  "Digdaya Masjid",
  "Digdaya Dakwah",
];

const mockFAQCategories: FAQCategory[] = [
  { id: "fc1", name: "Pendaftaran & Akun", slug: "pendaftaran-akun", product: "Digdaya Persuratan", isActive: true },
  { id: "fc2", name: "Pembayaran", slug: "pembayaran", product: "Digdaya Persuratan", isActive: true },
  { id: "fc3", name: "Fitur Utama", slug: "fitur-utama", product: "Digdaya Persuratan", isActive: true },
  { id: "fc4", name: "Teknis & Troubleshoot", slug: "teknis-troubleshoot", product: "Digdaya Persuratan", isActive: false },
  { id: "fc5", name: "Manajemen Santri", slug: "manajemen-santri", product: "Digdaya Pesantren", isActive: true },
  { id: "fc6", name: "Kurikulum", slug: "kurikulum", product: "Digdaya Pesantren", isActive: true },
  { id: "fc7", name: "Laporan Keuangan", slug: "laporan-keuangan", product: "Digdaya Pesantren", isActive: false },
  { id: "fc8", name: "Pendataan Kader", slug: "pendataan-kader", product: "Digdaya Kader", isActive: true },
  { id: "fc9", name: "Verifikasi Data", slug: "verifikasi-data", product: "Digdaya Kader", isActive: true },
  { id: "fc10", name: "Surat & Disposisi", slug: "surat-disposisi", product: "Digdaya Kepengurusan", isActive: true },
  { id: "fc11", name: "Manajemen Pengurus", slug: "manajemen-pengurus", product: "Digdaya Kepengurusan", isActive: true },
  { id: "fc12", name: "Agenda & Rapat", slug: "agenda-rapat", product: "Digdaya Kepengurusan", isActive: false },
];

const ITEMS_PER_PAGE = 10;

export default function FAQCategoryPage() {
  const [search, setSearch] = useState("");
  const [productFilter, setProductFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const screenSize = useScreenSize();

  const filtered = useMemo(() => {
    return mockFAQCategories.filter((c) => {
      if (productFilter !== "all" && c.product !== productFilter) return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.slug.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, productFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const allSelected = paged.length > 0 && paged.every((c) => selectedIds.has(c.id));

  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(paged.map((c) => c.id)));
  };
  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  const filterSelect = (
    <Select value={productFilter} onValueChange={(v) => { setProductFilter(v); setPage(1); }}>
      <SelectTrigger className="w-full sm:w-[200px] h-9 rounded-[10px] text-[13px] border-border bg-background">
        <SelectValue placeholder="Semua Produk" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Semua Produk</SelectItem>
        {productOptions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
      </SelectContent>
    </Select>
  );

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-base md:text-lg font-semibold text-foreground">Kategori FAQ</h1>
          <p className="text-[12px] md:text-[13px] text-muted-foreground mt-0.5">Kelola kategori pertanyaan berdasarkan produk</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-[10px] bg-accent/60 px-2.5 md:px-3 py-1.5 text-[12px] text-muted-foreground self-start sm:self-auto">
          <FolderTree className="h-3.5 w-3.5" strokeWidth={1.6} />
          <span className="tabular-nums font-medium">{filtered.length}</span>
          <span className="hidden sm:inline">Kategori</span>
        </div>
      </div>

      {/* Search + Filter + Create */}
      <div className="rounded-[12px] border border-border bg-surface p-3 md:p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
            <Input
              placeholder="Cari kategori..."
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
                className={cn("h-9 rounded-[10px] text-[13px] border-border gap-1.5", productFilter !== "all" && "border-primary/40 text-primary")}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-3.5 w-3.5" strokeWidth={1.6} /> Filter
              </Button>
              <Link to="/categories/faq/new" className="w-full">
                <Button size="sm" className="h-9 w-full rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
                  <Plus className="h-4 w-4" strokeWidth={1.6} /> Buat
                </Button>
              </Link>
            </>
          ) : (
            <>
              {filterSelect}
              <Link to="/categories/faq/new">
                <Button size="sm" className="h-9 rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
                  <Plus className="h-4 w-4" strokeWidth={1.6} /> Buat
                </Button>
              </Link>
            </>
          )}
        </div>
        {screenSize === "mobile" && showFilters && (
          <div className="mt-3 pt-3 border-t border-border/60 space-y-2 animate-fade-in">{filterSelect}</div>
        )}
      </div>

      {/* Table / Card List */}
      <div className="rounded-[12px] border border-border bg-surface shadow-card overflow-hidden">
        {screenSize === "mobile" ? (
          <div className="divide-y divide-border/30">
            {paged.map((cat) => (
              <div key={cat.id} className="p-4 hover:bg-accent/30 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-foreground">{cat.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">{cat.slug}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="inline-flex items-center rounded-full bg-primary/[0.07] px-2 py-[2px] text-[10px] font-medium text-primary">{cat.product}</span>
                      <span className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[10px] font-medium",
                        cat.isActive ? "bg-[hsl(var(--status-success-bg))] text-[hsl(var(--status-success-fg))]" : "bg-muted text-muted-foreground"
                      )}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", cat.isActive ? "bg-[hsl(var(--status-success-fg))]" : "bg-muted-foreground/50")} />
                        {cat.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                  </div>
                  <Link to={`/categories/faq/${cat.id}`} className="flex items-center gap-1 text-[12px] font-medium text-primary hover:text-primary/80 transition-colors shrink-0">
                    <Pencil className="h-3 w-3" strokeWidth={1.6} /> Ubah
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
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Nama Kategori</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Slug</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden lg:table-cell">Produk</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Status</th>
                  <th className="px-4 md:px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((cat) => (
                  <tr key={cat.id} className="border-b border-border/30 hover:bg-accent/30 transition-colors duration-150">
                    <td className="px-4 py-4">
                      <Checkbox checked={selectedIds.has(cat.id)} onCheckedChange={() => toggleOne(cat.id)} className="h-4 w-4" />
                    </td>
                    <td className="px-4 md:px-5 py-4"><span className="font-medium text-foreground">{cat.name}</span></td>
                    <td className="px-4 md:px-5 py-4"><span className="font-mono text-[12px] text-muted-foreground">{cat.slug}</span></td>
                    <td className="px-4 md:px-5 py-4 hidden lg:table-cell">
                      <span className="inline-flex items-center rounded-full bg-primary/[0.07] px-2.5 py-[3px] text-[11px] font-medium text-primary">{cat.product}</span>
                    </td>
                    <td className="px-4 md:px-5 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[11px] font-medium",
                        cat.isActive ? "bg-[hsl(var(--status-success-bg))] text-[hsl(var(--status-success-fg))]" : "bg-muted text-muted-foreground"
                      )}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", cat.isActive ? "bg-[hsl(var(--status-success-fg))]" : "bg-muted-foreground/50")} />
                        {cat.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-4 md:px-5 py-4 text-right">
                      <Link to={`/categories/faq/${cat.id}`} className="inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:text-primary/80 transition-colors">
                        <Pencil className="h-3 w-3" strokeWidth={1.6} /> Ubah
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="p-12 md:p-16 text-center text-[13px] text-muted-foreground">Tidak ada kategori ditemukan.</div>
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
