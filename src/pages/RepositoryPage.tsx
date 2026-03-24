import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Pencil, Eye, FileText, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useScreenSize } from "@/components/AppLayout";
import Pagination from "@/components/Pagination";

interface RepoItem {
  id: string;
  nama: string;
  kategori: string;
  kepengurusan: string;
  createdAt: string;
  updatedAt: string;
}

const kategoriOptions = [
  "Peraturan Perkumpulan",
  "Konbes NU",
  "Rencana Strategis",
  "Digitalisasi",
  "Lain-lain",
  "Harlah NU",
];

const mockItems: RepoItem[] = [
  { id: "r1", nama: "AD/ART NU 2022", kategori: "Peraturan Perkumpulan", kepengurusan: "PBNU", createdAt: "2025-03-20", updatedAt: "2025-03-22" },
  { id: "r2", nama: "Hasil Konbes NU 2024", kategori: "Konbes NU", kepengurusan: "PBNU", createdAt: "2025-03-18", updatedAt: "2025-03-18" },
  { id: "r3", nama: "Renstra NU 2025-2030", kategori: "Rencana Strategis", kepengurusan: "PBNU", createdAt: "2025-03-15", updatedAt: "2025-03-20" },
  { id: "r4", nama: "Blueprint Digitalisasi NU", kategori: "Digitalisasi", kepengurusan: "Lembaga Pendidikan NU", createdAt: "2025-03-12", updatedAt: "2025-03-15" },
  { id: "r5", nama: "Panduan Harlah NU ke-103", kategori: "Harlah NU", kepengurusan: "PWNU Jawa Timur", createdAt: "2025-03-10", updatedAt: "2025-03-14" },
  { id: "r6", nama: "PO/PD NU 2023", kategori: "Peraturan Perkumpulan", kepengurusan: "PBNU", createdAt: "2025-03-09", updatedAt: "2025-03-09" },
  { id: "r7", nama: "Rekomendasi Konbes Alim Ulama", kategori: "Konbes NU", kepengurusan: "PBNU", createdAt: "2025-03-08", updatedAt: "2025-03-10" },
  { id: "r8", nama: "Laporan Digitalisasi Pesantren", kategori: "Digitalisasi", kepengurusan: "PWNU Jawa Tengah", createdAt: "2025-03-05", updatedAt: "2025-03-07" },
  { id: "r9", nama: "Dokumen Pendukung Lainnya", kategori: "Lain-lain", kepengurusan: "PCNU Surabaya", createdAt: "2025-03-03", updatedAt: "2025-03-03" },
  { id: "r10", nama: "Susunan Acara Harlah NU 2025", kategori: "Harlah NU", kepengurusan: "PWNU Jawa Barat", createdAt: "2025-03-01", updatedAt: "2025-03-02" },
];

const ITEMS_PER_PAGE = 10;

export default function RepositoryPage() {
  const [search, setSearch] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const screenSize = useScreenSize();

  const filtered = useMemo(() => {
    return mockItems.filter((f) => {
      if (kategoriFilter !== "all" && f.kategori !== kategoriFilter) return false;
      if (search && !f.nama.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, kategoriFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const allSelected = paged.length > 0 && paged.every((f) => selectedIds.has(f.id));

  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(paged.map((f) => f.id)));
  };
  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  const filterSelect = (
    <Select value={kategoriFilter} onValueChange={(v) => { setKategoriFilter(v); setPage(1); }}>
      <SelectTrigger className="w-full sm:w-[200px] h-9 rounded-[10px] text-[13px] border-border bg-background">
        <SelectValue placeholder="Semua Kategori" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Semua Kategori</SelectItem>
        {kategoriOptions.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
      </SelectContent>
    </Select>
  );

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-base md:text-lg font-semibold text-foreground">Repository</h1>
          <p className="text-[12px] md:text-[13px] text-muted-foreground mt-0.5">Kelola dokumen dan file organisasi</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-[10px] bg-accent/60 px-2.5 md:px-3 py-1.5 text-[12px] text-muted-foreground self-start sm:self-auto">
          <FileText className="h-3.5 w-3.5" strokeWidth={1.6} />
          <span className="tabular-nums font-medium">{filtered.length}</span>
          <span className="hidden sm:inline">dokumen</span>
        </div>
      </div>

      {/* Search + Filter + Upload */}
      <div className="rounded-[12px] border border-border bg-surface p-3 md:p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
            <Input
              placeholder="Cari dokumen..."
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
                className={cn("h-9 rounded-[10px] text-[13px] border-border gap-1.5", kategoriFilter !== "all" && "border-primary/40 text-primary")}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-3.5 w-3.5" strokeWidth={1.6} /> Filter
              </Button>
              <Link to="/repository/new" className="w-full">
                <Button size="sm" className="h-9 w-full rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
                  <Plus className="h-4 w-4" strokeWidth={1.6} /> Upload
                </Button>
              </Link>
            </>
          ) : (
            <>
              {filterSelect}
              <Link to="/repository/new">
                <Button size="sm" className="h-9 rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
                  <Plus className="h-4 w-4" strokeWidth={1.6} /> Upload
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
            {paged.map((item) => (
              <div key={item.id} className="p-4 hover:bg-accent/30 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-foreground leading-[1.4]">{item.nama}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="inline-flex items-center rounded-full bg-primary/[0.07] px-2 py-[2px] text-[10px] font-medium text-primary">{item.kategori}</span>
                      <span className="text-[11px] text-muted-foreground">{item.kepengurusan}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">Dibuat: {item.createdAt}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link to={`/repository/${item.id}`} className="text-[12px] font-medium text-primary hover:text-primary/80 transition-colors">
                      Ubah
                    </Link>
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
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Nama Dokumen</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Kategori Dokumen</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden lg:table-cell">Kepengurusan</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden md:table-cell">Ditambahkan pada</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden xl:table-cell">Diperbarui pada</th>
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
                      <span className="font-medium text-foreground">{item.nama}</span>
                    </td>
                    <td className="px-4 md:px-5 py-4">
                      <span className="inline-flex items-center rounded-full bg-primary/[0.07] px-2.5 py-[3px] text-[11px] font-medium text-primary">{item.kategori}</span>
                    </td>
                    <td className="px-4 md:px-5 py-4 text-muted-foreground hidden lg:table-cell">{item.kepengurusan}</td>
                    <td className="px-4 md:px-5 py-4 text-muted-foreground tabular-nums hidden md:table-cell">{item.createdAt}</td>
                    <td className="px-4 md:px-5 py-4 text-muted-foreground tabular-nums hidden xl:table-cell">{item.updatedAt}</td>
                    <td className="px-4 md:px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link to={`/repository/${item.id}`} className="inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:text-primary/80 transition-colors">
                          <Pencil className="h-3 w-3" strokeWidth={1.6} /> Edit
                        </Link>
                        <button className="inline-flex items-center gap-1 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                          <Eye className="h-3 w-3" strokeWidth={1.6} /> View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="p-12 md:p-16 text-center text-[13px] text-muted-foreground">Tidak ada dokumen ditemukan.</div>
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
