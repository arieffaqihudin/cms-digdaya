import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Pencil, FolderTree } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useScreenSize } from "@/components/AppLayout";
import Pagination from "@/components/Pagination";

interface DocCategory {
  id: string;
  name: string;
  slug: string;
  product: string;
  isActive: boolean;
}

const mockDocCategories: DocCategory[] = [
  { id: "dc1", name: "Surat Masuk", slug: "surat-masuk", product: "Digdaya Persuratan", isActive: true },
  { id: "dc2", name: "Surat Keluar", slug: "surat-keluar", product: "Digdaya Persuratan", isActive: true },
  { id: "dc3", name: "Disposisi", slug: "disposisi", product: "Digdaya Persuratan", isActive: true },
  { id: "dc4", name: "Arsip Digital", slug: "arsip-digital", product: "Digdaya Persuratan", isActive: false },
  { id: "dc5", name: "Rapor Santri", slug: "rapor-santri", product: "Digdaya Pesantren", isActive: true },
  { id: "dc6", name: "Sertifikat", slug: "sertifikat", product: "Digdaya Pesantren", isActive: true },
  { id: "dc7", name: "Dokumen Kurikulum", slug: "dokumen-kurikulum", product: "Digdaya Pesantren", isActive: false },
  { id: "dc8", name: "Data Kader", slug: "data-kader", product: "Siskader NU", isActive: true },
  { id: "dc9", name: "Laporan Wilayah", slug: "laporan-wilayah", product: "Siskader NU", isActive: true },
  { id: "dc10", name: "SK Pengurus", slug: "sk-pengurus", product: "Digdaya Kepengurusan", isActive: true },
  { id: "dc11", name: "Notulen Rapat", slug: "notulen-rapat", product: "Digdaya Kepengurusan", isActive: true },
  { id: "dc12", name: "Proposal Kegiatan", slug: "proposal-kegiatan", product: "Digdaya Kepengurusan", isActive: false },
];

const productTabs = ["Digdaya Persuratan", "Digdaya Pesantren", "Siskader NU", "Digdaya Kepengurusan"];

const ITEMS_PER_PAGE = 10;

export default function DocCategoryPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(productTabs[0]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const screenSize = useScreenSize();

  const filtered = useMemo(() => {
    return mockDocCategories.filter((c) => {
      if (c.product !== activeTab) return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.slug.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, activeTab]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const allSelected = paged.length > 0 && paged.every((c) => selectedIds.has(c.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paged.map((c) => c.id)));
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPage(1);
    setSelectedIds(new Set());
  };

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-base md:text-lg font-semibold text-foreground">Kategori Dokumen</h1>
          <p className="text-[12px] md:text-[13px] text-muted-foreground mt-0.5">Kelola kategori dokumen berdasarkan produk</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-[10px] bg-accent/60 px-2.5 md:px-3 py-1.5 text-[12px] text-muted-foreground self-start sm:self-auto">
          <FolderTree className="h-3.5 w-3.5" strokeWidth={1.6} />
          <span className="tabular-nums font-medium">{filtered.length}</span>
          <span className="hidden sm:inline">Kategori</span>
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

      {/* Search + Create */}
      <div className="rounded-[12px] border border-border bg-surface p-3 md:p-4 shadow-card">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3">
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
            <Input
              placeholder="Cari kategori dokumen..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 h-9 rounded-[10px] text-[13px] border-border bg-background focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <Link to="/categories/dokumen/new" className="sm:w-auto">
            <Button size="sm" className="h-9 w-full sm:w-auto rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
              <Plus className="h-4 w-4" strokeWidth={1.6} />
              Buat
            </Button>
          </Link>
        </div>
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
                      <span className="inline-flex items-center rounded-full bg-primary/[0.07] px-2 py-[2px] text-[10px] font-medium text-primary">
                        {cat.product}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[10px] font-medium",
                          cat.isActive
                            ? "bg-[hsl(var(--status-success-bg))] text-[hsl(var(--status-success-fg))]"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <span className={cn("h-1.5 w-1.5 rounded-full", cat.isActive ? "bg-[hsl(var(--status-success-fg))]" : "bg-muted-foreground/50")} />
                        {cat.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/categories/dokumen/${cat.id}`}
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
                    <td className="px-4 md:px-5 py-4">
                      <span className="font-medium text-foreground">{cat.name}</span>
                    </td>
                    <td className="px-4 md:px-5 py-4">
                      <span className="font-mono text-[12px] text-muted-foreground">{cat.slug}</span>
                    </td>
                    <td className="px-4 md:px-5 py-4 hidden lg:table-cell">
                      <span className="inline-flex items-center rounded-full bg-primary/[0.07] px-2.5 py-[3px] text-[11px] font-medium text-primary">{cat.product}</span>
                    </td>
                    <td className="px-4 md:px-5 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[11px] font-medium",
                        cat.isActive
                          ? "bg-[hsl(var(--status-success-bg))] text-[hsl(var(--status-success-fg))]"
                          : "bg-muted text-muted-foreground"
                      )}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", cat.isActive ? "bg-[hsl(var(--status-success-fg))]" : "bg-muted-foreground/50")} />
                        {cat.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-4 md:px-5 py-4 text-right">
                      <Link to={`/categories/dokumen/${cat.id}`} className="inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:text-primary/80 transition-colors">
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
          <div className="p-12 md:p-16 text-center text-[13px] text-muted-foreground">
            Tidak ada kategori ditemukan.
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
