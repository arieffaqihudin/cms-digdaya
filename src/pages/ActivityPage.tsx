import { useState, useMemo } from "react";
import { Search, Filter, Eye, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useScreenSize } from "@/components/AppLayout";

// ─── Types & Mock Data ───────────────────────────────────────────────
interface ActivityLog {
  id: string;
  name: string;
  menu: string;
  activity: string;
  time: string;
  detail?: string;
}

const mockActivities: ActivityLog[] = [
  { id: "a1", name: "Arief Faqihudin", menu: "Pengguna", activity: "Menambahkan pengguna baru", time: "2026-03-24T23:10:00", detail: "Menambahkan pengguna 'Siti Aminah' dengan role Editor Konten." },
  { id: "a2", name: "Admin Digdaya", menu: "FAQ", activity: "Mengubah FAQ", time: "2026-03-24T22:40:00", detail: "Mengubah pertanyaan 'Bagaimana cara mendaftar di Digdaya?' — jawaban diperbarui." },
  { id: "a3", name: "Editor Konten", menu: "Blog", activity: "Mempublikasikan artikel", time: "2026-03-24T21:15:00", detail: "Artikel 'Refleksi Ramadhan: Memaknai Bulan Suci' dipublikasikan." },
  { id: "a4", name: "Arief Faqihudin", menu: "Hak Akses", activity: "Membuat grup akses baru", time: "2026-03-24T20:30:00", detail: "Grup 'Manager Produk' dibuat dengan 10 akses menu." },
  { id: "a5", name: "M. Rizki Pratama", menu: "Repository", activity: "Mengupload dokumen", time: "2026-03-24T19:45:00", detail: "Dokumen 'Peraturan Perkumpulan 2026' berhasil diupload." },
  { id: "a6", name: "Dewi Rahmawati", menu: "Panduan", activity: "Menambahkan panduan baru", time: "2026-03-24T18:20:00", detail: "Panduan 'Cara Mendaftar Akun Digdaya' ditambahkan." },
  { id: "a7", name: "Admin Digdaya", menu: "Video", activity: "Mereview video", time: "2026-03-24T17:00:00", detail: "Video 'Khutbah Jumat' disetujui untuk dipublikasikan." },
  { id: "a8", name: "Hasan Basri", menu: "Banner App", activity: "Mengubah banner", time: "2026-03-24T15:30:00", detail: "Banner 'Promo Ramadhan' diperbarui gambar dan teks." },
  { id: "a9", name: "Arief Faqihudin", menu: "Produk", activity: "Menambahkan produk", time: "2026-03-23T14:10:00", detail: "Produk 'Digdaya Masjid' ditambahkan ke master data." },
  { id: "a10", name: "Siti Aminah", menu: "Kategori FAQ", activity: "Menghapus kategori", time: "2026-03-23T12:00:00", detail: "Kategori 'Lain-lain' dihapus dari master data." },
];

const menuOptions = [
  "Dashboard", "Video", "Blog", "Panduan", "FAQ", "Repository", "Banner App",
  "Kategori FAQ", "Kategori Dokumen", "Produk", "Tag", "Channel",
  "Hak Akses", "Pengguna", "Profil",
];

// ─── Component ───────────────────────────────────────────────────────
export default function ActivityPage() {
  const screenSize = useScreenSize();
  const [search, setSearch] = useState("");
  const [menuFilter, setMenuFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const [viewItem, setViewItem] = useState<ActivityLog | null>(null);

  const filtered = useMemo(() => {
    return mockActivities.filter((a) => {
      if (menuFilter !== "all" && a.menu !== menuFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!a.name.toLowerCase().includes(q) && !a.menu.toLowerCase().includes(q) && !a.activity.toLowerCase().includes(q)) return false;
      }
      if (dateFrom) {
        const d = new Date(a.time);
        if (d < dateFrom) return false;
      }
      if (dateTo) {
        const d = new Date(a.time);
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        if (d > end) return false;
      }
      return true;
    });
  }, [search, menuFilter, dateFrom, dateTo]);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return format(d, "dd MMM yyyy, HH:mm");
  };

  const menuSelect = (
    <Select value={menuFilter} onValueChange={setMenuFilter}>
      <SelectTrigger className="w-full sm:w-[170px] h-9 rounded-[10px] text-[13px] border-border bg-background">
        <SelectValue placeholder="Semua Menu" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Semua Menu</SelectItem>
        {menuOptions.map((m) => (
          <SelectItem key={m} value={m}>{m}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const datePickerFrom = (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("h-9 rounded-[10px] text-[13px] border-border bg-background justify-start gap-2 font-normal w-full sm:w-auto", !dateFrom && "text-muted-foreground")}>
          <CalendarIcon className="h-3.5 w-3.5" strokeWidth={1.6} />
          {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Dari tanggal"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className="p-3 pointer-events-auto" />
      </PopoverContent>
    </Popover>
  );

  const datePickerTo = (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("h-9 rounded-[10px] text-[13px] border-border bg-background justify-start gap-2 font-normal w-full sm:w-auto", !dateTo && "text-muted-foreground")}>
          <CalendarIcon className="h-3.5 w-3.5" strokeWidth={1.6} />
          {dateTo ? format(dateTo, "dd/MM/yyyy") : "Sampai tanggal"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className="p-3 pointer-events-auto" />
      </PopoverContent>
    </Popover>
  );

  const handleReset = () => {
    setSearch(""); setMenuFilter("all"); setDateFrom(undefined); setDateTo(undefined);
  };

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-base md:text-lg font-semibold text-foreground">Aktivitas</h1>
        <p className="text-[12px] md:text-[13px] text-muted-foreground mt-0.5">Riwayat aktivitas pengguna dalam CMS</p>
      </div>

      {/* Top bar */}
      <div className="rounded-[12px] border border-border bg-surface p-3 md:p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
            <Input
              placeholder="Cari nama, menu, atau aktivitas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 rounded-[10px] text-[13px] border-border bg-background focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          {screenSize === "mobile" ? (
            <Button
              variant="outline"
              size="sm"
              className={cn("h-9 rounded-[10px] text-[13px] border-border gap-1.5",
                (menuFilter !== "all" || dateFrom || dateTo) && "border-primary/40 text-primary"
              )}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-3.5 w-3.5" strokeWidth={1.6} /> Filter
            </Button>
          ) : (
            <>
              {menuSelect}
              {datePickerFrom}
              {datePickerTo}
              <Button size="sm" className="h-9 rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5" onClick={() => {}}>
                <Search className="h-3.5 w-3.5" strokeWidth={1.6} /> Cari
              </Button>
              {(menuFilter !== "all" || dateFrom || dateTo) && (
                <Button variant="ghost" size="sm" className="h-9 rounded-[10px] text-[13px] text-muted-foreground" onClick={handleReset}>
                  Reset
                </Button>
              )}
            </>
          )}
        </div>
        {screenSize === "mobile" && showFilters && (
          <div className="mt-3 pt-3 border-t border-border/60 space-y-2 animate-fade-in">
            {menuSelect}
            {datePickerFrom}
            {datePickerTo}
            <div className="flex gap-2">
              <Button size="sm" className="h-9 flex-1 rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90">Cari</Button>
              {(menuFilter !== "all" || dateFrom || dateTo) && (
                <Button variant="outline" size="sm" className="h-9 rounded-[10px] text-[13px]" onClick={handleReset}>Reset</Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Table / Cards */}
      <div className="rounded-[12px] border border-border bg-surface shadow-card overflow-hidden">
        {screenSize === "mobile" ? (
          <div className="divide-y divide-border/30">
            {filtered.length === 0 && (
              <div className="p-12 text-center text-[13px] text-muted-foreground">Tidak ada aktivitas ditemukan.</div>
            )}
            {filtered.map((a) => (
              <div key={a.id} className="p-4 hover:bg-accent/30 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-foreground">{a.name}</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">{a.activity}</p>
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-muted-foreground">
                      <span className="inline-flex rounded-full bg-primary/[0.07] px-2 py-[2px] text-[10px] font-medium text-primary">{a.menu}</span>
                      <span>{formatTime(a.time)}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-[12px] text-primary shrink-0 gap-1" onClick={() => setViewItem(a)}>
                    <Eye className="h-3 w-3" strokeWidth={1.6} /> Lihat
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border/60">
                  {["Nama", "Menu", "Aktivitas", "Waktu", "Aksi"].map((h) => (
                    <th key={h} className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className="border-b border-border/30 hover:bg-accent/30 transition-colors duration-150">
                    <td className="px-4 md:px-5 py-4 font-medium text-foreground whitespace-nowrap">{a.name}</td>
                    <td className="px-4 md:px-5 py-4">
                      <span className="inline-flex rounded-full bg-primary/[0.07] px-2.5 py-[3px] text-[11px] font-medium text-primary">{a.menu}</span>
                    </td>
                    <td className="px-4 md:px-5 py-4 text-foreground/80">{a.activity}</td>
                    <td className="px-4 md:px-5 py-4 text-muted-foreground whitespace-nowrap">{formatTime(a.time)}</td>
                    <td className="px-4 md:px-5 py-4">
                      <Button variant="ghost" size="sm" className="h-7 text-[12px] text-primary gap-1" onClick={() => setViewItem(a)}>
                        <Eye className="h-3 w-3" strokeWidth={1.6} /> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="p-12 md:p-16 text-center text-[13px] text-muted-foreground">Tidak ada aktivitas ditemukan.</div>
            )}
          </div>
        )}
      </div>

      {/* View modal */}
      <Dialog open={!!viewItem} onOpenChange={(v) => { if (!v) setViewItem(null); }}>
        <DialogContent className="max-w-[480px] rounded-[12px] border-border p-0 gap-0">
          <DialogHeader className="px-6 pt-5 pb-4 border-b border-border/60">
            <DialogTitle className="text-[15px] font-semibold text-foreground">Detail Aktivitas</DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="px-6 py-5 space-y-4">
              <DetailRow label="Nama" value={viewItem.name} />
              <DetailRow label="Menu" value={viewItem.menu} />
              <DetailRow label="Aktivitas" value={viewItem.activity} />
              <DetailRow label="Waktu" value={formatTime(viewItem.time)} />
              {viewItem.detail && <DetailRow label="Keterangan" value={viewItem.detail} />}
            </div>
          )}
          <div className="px-6 py-4 border-t border-border/60 flex justify-end">
            <Button variant="outline" className="h-9 rounded-[10px] text-[13px] border-border" onClick={() => setViewItem(null)}>Tutup</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.06em]">{label}</p>
      <p className="text-[13px] text-foreground leading-relaxed">{value}</p>
    </div>
  );
}
