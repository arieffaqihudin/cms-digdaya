import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, BookOpen, Pencil, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useScreenSize } from "@/components/AppLayout";
import { products } from "@/lib/mock-data";

const mockPanduan = [
  { id: "1", topik: "Cara Membuat Surat Keluar", slug: "cara-membuat-surat-keluar", produk: "Digdaya Persuratan", createdAt: "2025-01-10" },
  { id: "2", topik: "Panduan Arsip Digital", slug: "panduan-arsip-digital", produk: "Digdaya Persuratan", createdAt: "2025-01-12" },
  { id: "3", topik: "Mengelola Disposisi", slug: "mengelola-disposisi", produk: "Digdaya Persuratan", createdAt: "2025-02-01" },
  { id: "4", topik: "Setup Awal SIPD", slug: "setup-awal-sipd", produk: "Digdaya SIPD", createdAt: "2025-02-15" },
  { id: "5", topik: "Input Anggaran", slug: "input-anggaran", produk: "Digdaya SIPD", createdAt: "2025-03-01" },
];

export default function PanduanPage() {
  const [search, setSearch] = useState("");
  const [filterProduk, setFilterProduk] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const screenSize = useScreenSize();

  const filtered = useMemo(
    () =>
      mockPanduan.filter((p) => {
        const matchSearch = p.topik.toLowerCase().includes(search.toLowerCase());
        const matchProduk = filterProduk === "all" || p.produk === filterProduk;
        return matchSearch && matchProduk;
      }),
    [search, filterProduk]
  );

  const hasActiveFilters = filterProduk !== "all";

  const filterSelects = (
    <Select value={filterProduk} onValueChange={(v) => { setFilterProduk(v); }}>
      <SelectTrigger className="w-full sm:w-[200px] h-9 rounded-[10px] text-[13px] border-border bg-background">
        <SelectValue placeholder="Semua Produk" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Semua Produk</SelectItem>
        {products.map((p) => (
          <SelectItem key={p} value={p}>{p}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-base md:text-lg font-semibold text-foreground">Panduan</h1>
          <p className="text-[12px] md:text-[13px] text-muted-foreground mt-0.5">Kelola topik panduan produk Digdaya</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-[10px] bg-accent/60 px-2.5 md:px-3 py-1.5 text-[12px] text-muted-foreground self-start sm:self-auto">
          <BookOpen className="h-3.5 w-3.5" strokeWidth={1.6} />
          <span className="tabular-nums font-medium">{filtered.length}</span>
          <span className="hidden sm:inline">topik</span>
        </div>
      </div>

      {/* Search + Filters + Create */}
      <div className="rounded-[12px] border border-border bg-surface p-3 md:p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
            <Input
              placeholder="Cari topik..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              <Link to="/panduan/new" className="w-full sm:w-auto">
                <Button size="sm" className="h-9 w-full rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
                  <Plus className="h-4 w-4" strokeWidth={1.6} /> Buat Panduan
                </Button>
              </Link>
            </>
          ) : (
            <>
              {filterSelects}
              <Link to="/panduan/new">
                <Button size="sm" className="h-9 rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
                  <Plus className="h-4 w-4" strokeWidth={1.6} /> Buat Panduan
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
            {filtered.map((item) => (
              <div key={item.id} className="p-4 hover:bg-accent/30 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-foreground leading-[1.4]">{item.topik}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="font-mono text-[11px] text-muted-foreground">{item.slug}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="inline-flex items-center rounded-full bg-primary/[0.07] px-2 py-[2px] text-[10px] font-medium text-primary">{item.produk}</span>
                      <span className="text-[11px] text-muted-foreground tabular-nums">{item.createdAt}</span>
                    </div>
                  </div>
                  <Link
                    to={`/panduan/${item.id}`}
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
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Topik</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden xl:table-cell">Slug</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden lg:table-cell">Produk</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden md:table-cell">Dibuat pada</th>
                  <th className="px-4 md:px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-border/30 hover:bg-accent/30 transition-colors duration-150">
                    <td className="px-4 md:px-5 py-4">
                      <span className="font-medium text-foreground leading-[1.4]">{item.topik}</span>
                      <p className="text-[11px] text-muted-foreground mt-0.5 lg:hidden">{item.produk}</p>
                    </td>
                    <td className="px-4 md:px-5 py-4 hidden xl:table-cell">
                      <span className="font-mono text-[12px] text-muted-foreground">{item.slug}</span>
                    </td>
                    <td className="px-4 md:px-5 py-4 hidden lg:table-cell">
                      <span className="inline-flex items-center rounded-full bg-primary/[0.07] px-2.5 py-[3px] text-[11px] font-medium text-primary">{item.produk}</span>
                    </td>
                    <td className="px-4 md:px-5 py-4 text-muted-foreground tabular-nums hidden md:table-cell">{item.createdAt}</td>
                    <td className="px-4 md:px-5 py-4 text-right">
                      <Link to={`/panduan/${item.id}`} className="inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:text-primary/80 transition-colors">
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
          <div className="p-12 md:p-16 text-center text-[13px] text-muted-foreground">Tidak ada panduan ditemukan.</div>
        )}
      </div>
    </div>
  );
}
