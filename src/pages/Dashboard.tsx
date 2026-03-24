import { Link } from "react-router-dom";
import {
  Video, BookOpen, HelpCircle, PenSquare, ArrowUpRight,
  FileText, Image, Layers, FolderTree, Tag, Radio,
  Users, Shield, Plus, Upload, Clock, CheckCircle2,
  CalendarClock, Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockVideos, mockGuides, mockFAQs, mockBlogs, products, categories, channels, tags } from "@/lib/mock-data";

// ── Derive real counts ──
const contentCounts = [
  { label: "Total Video", value: mockVideos.length, icon: Video, href: "/video" },
  { label: "Total Blog", value: mockBlogs.length, icon: PenSquare, href: "/blog" },
  { label: "Total Panduan", value: mockGuides.length, icon: BookOpen, href: "/panduan" },
  { label: "Total FAQ", value: mockFAQs.length, icon: HelpCircle, href: "/faq" },
  { label: "Total Repository", value: 5, icon: FileText, href: "/repository" },
  { label: "Total Banner App", value: 3, icon: Image, href: "/banner" },
];

const allContent = [
  ...mockVideos.map((v) => ({ status: v.status === "need_review" ? "draft" : v.status })),
  ...mockBlogs.map((b) => ({ status: b.status })),
  ...mockGuides.map((g) => ({ status: g.status })),
  ...mockFAQs.map((f) => ({ status: f.status })),
];

const workflowCards = [
  { label: "Draft", value: allContent.filter((c) => c.status === "draft").length, icon: Clock, color: "text-muted-foreground", bg: "bg-muted", href: "/drafts" },
  { label: "Terjadwal", value: 0, icon: CalendarClock, color: "text-blue-600", bg: "bg-blue-50", href: "/scheduled" },
  { label: "Dipublikasikan", value: allContent.filter((c) => c.status === "published").length, icon: CheckCircle2, color: "text-[hsl(var(--status-success-fg))]", bg: "bg-[hsl(var(--status-success-bg))]", href: "/published" },
  { label: "Arsip", value: allContent.filter((c) => c.status === "archived").length, icon: Archive, color: "text-[hsl(var(--status-warning-fg))]", bg: "bg-[hsl(var(--status-warning-bg))]", href: "/archived" },
];

const recentActivities = [
  { nama: "Arief Faqihudin", menu: "Pengguna", aktivitas: "Menambahkan pengguna baru", waktu: "24 Mar 2026, 23:10" },
  { nama: "Admin Digdaya", menu: "FAQ", aktivitas: "Mengubah FAQ", waktu: "24 Mar 2026, 22:40" },
  { nama: "Editor Konten", menu: "Blog", aktivitas: "Mempublikasikan artikel", waktu: "24 Mar 2026, 21:15" },
  { nama: "Super Admin", menu: "Repository", aktivitas: "Mengunggah dokumen baru", waktu: "24 Mar 2026, 20:00" },
  { nama: "Arief Faqihudin", menu: "Video", aktivitas: "Sinkronisasi video YouTube", waktu: "24 Mar 2026, 18:30" },
];

const recentlyUpdated = [
  { judul: "Refleksi Ramadhan: Memaknai Bulan Suci", modul: "Blog", user: "Ahmad Fauzi", waktu: "24 Mar 2026, 23:00" },
  { judul: "Cara Membuat Surat Keluar", modul: "Panduan", user: "Editor Konten", waktu: "24 Mar 2026, 22:30" },
  { judul: "Bagaimana cara mendaftar akun?", modul: "FAQ", user: "Admin Digdaya", waktu: "24 Mar 2026, 21:00" },
  { judul: "Khutbah Jumat: Keutamaan Ramadhan", modul: "Video", user: "Super Admin", waktu: "24 Mar 2026, 20:15" },
  { judul: "Panduan Arsip Digital", modul: "Panduan", user: "Arief Faqihudin", waktu: "24 Mar 2026, 19:45" },
];

const faqCategoryCount = 8;
const docCategoryCount = 6;
const videoCategoryCount = 4;

const masterCards = [
  { label: "Produk", value: products.length, icon: Layers, href: "/produk" },
  { label: "Kategori FAQ", value: faqCategoryCount, icon: FolderTree, href: "/categories/faq" },
  { label: "Kategori Dokumen", value: docCategoryCount, icon: FolderTree, href: "/categories/document" },
  { label: "Kategori Video", value: videoCategoryCount, icon: FolderTree, href: "/categories/video" },
  { label: "Tag", value: tags.length, icon: Tag, href: "/tags" },
  { label: "Channel", value: channels.length, icon: Radio, href: "/channels" },
];

const modulIcons: Record<string, typeof Video> = {
  Video: Video,
  Blog: PenSquare,
  Panduan: BookOpen,
  FAQ: HelpCircle,
  Repository: FileText,
};

export default function Dashboard() {
  return (
    <div className="space-y-5 md:space-y-7">
      {/* Header */}
      <div>
        <h3 className="text-base md:text-lg font-semibold text-foreground">Dashboard</h3>
        <p className="text-[12px] md:text-[13px] text-muted-foreground mt-0.5">
          Pusat kendali konten dan operasional CMS Digdaya.
        </p>
      </div>

      {/* SECTION A – Ringkasan Konten */}
      <div>
        <h4 className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground mb-3">Ringkasan Konten</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {contentCounts.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.label}
                to={c.href}
                className="rounded-[12px] border border-border bg-surface p-4 shadow-card hover:shadow-soft transition-shadow duration-200 group"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-primary/10 shrink-0">
                    <Icon className="h-4 w-4 text-primary" strokeWidth={1.8} />
                  </div>
                </div>
                <h3 className="text-[22px] font-semibold tabular-nums text-foreground leading-tight">{c.value}</h3>
                <p className="text-[10px] md:text-[11px] font-medium text-muted-foreground mt-0.5">{c.label}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* SECTION B – Workflow Status */}
      <div>
        <h4 className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground mb-3">Status Workflow</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {workflowCards.map((w) => {
            const Icon = w.icon;
            return (
              <Link
                key={w.label}
                to={w.href}
                className="rounded-[12px] border border-border bg-surface p-4 shadow-card hover:shadow-soft transition-shadow duration-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">{w.label}</p>
                    <h3 className="text-[22px] md:text-[28px] font-semibold tabular-nums text-foreground leading-tight mt-1">{w.value}</h3>
                  </div>
                  <div className={`flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-[8px] ${w.bg} shrink-0`}>
                    <Icon className={`h-4 w-4 ${w.color}`} strokeWidth={1.8} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* SECTION C & D – Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
        {/* Aktivitas Terbaru */}
        <div className="rounded-[12px] border border-border bg-surface shadow-card">
          <div className="flex items-center justify-between border-b border-border/60 px-4 md:px-5 py-3 md:py-4">
            <h4 className="text-[13px] font-semibold text-foreground">Aktivitas Terbaru</h4>
            <Link to="/activity" className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline">
              Lihat Semua <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border/40">
            {recentActivities.map((a, i) => (
              <div key={i} className="px-4 md:px-5 py-3 flex items-start gap-3">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-semibold text-primary">{a.nama.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] md:text-[13px] text-foreground">
                    <span className="font-medium">{a.nama}</span>{" "}
                    <span className="text-muted-foreground">· {a.menu}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{a.aktivitas}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5">{a.waktu}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Konten Terakhir Diubah */}
        <div className="rounded-[12px] border border-border bg-surface shadow-card">
          <div className="flex items-center justify-between border-b border-border/60 px-4 md:px-5 py-3 md:py-4">
            <h4 className="text-[13px] font-semibold text-foreground">Konten Terakhir Diubah</h4>
          </div>
          <div className="divide-y divide-border/40">
            {recentlyUpdated.map((item, i) => {
              const ModIcon = modulIcons[item.modul] || BookOpen;
              return (
                <div key={i} className="px-4 md:px-5 py-3 flex items-start gap-3">
                  <div className="h-7 w-7 rounded-[6px] bg-accent flex items-center justify-center shrink-0 mt-0.5">
                    <ModIcon className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.6} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] md:text-[13px] font-medium text-foreground truncate">{item.judul}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="inline-flex items-center rounded-full bg-primary/[0.07] px-2 py-[1px] text-[10px] font-medium text-primary">{item.modul}</span>
                      <span className="text-[10px] text-muted-foreground">oleh {item.user}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground/70 mt-0.5">{item.waktu}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION E – Master Data Snapshot */}
      <div>
        <h4 className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground mb-3">Master Data</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {masterCards.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.label}
                to={m.href}
                className="rounded-[12px] border border-border bg-surface p-4 shadow-card hover:shadow-soft transition-shadow duration-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-accent shrink-0">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.6} />
                  </div>
                </div>
                <h3 className="text-[20px] font-semibold tabular-nums text-foreground leading-tight">{m.value}</h3>
                <p className="text-[10px] md:text-[11px] font-medium text-muted-foreground mt-0.5">{m.label}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* SECTION F & G – Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
        {/* Pengguna & Akses */}
        <div className="rounded-[12px] border border-border bg-surface shadow-card p-4 md:p-5">
          <h4 className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground mb-4">Pengguna & Akses</h4>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/users" className="rounded-[10px] border border-border bg-background p-4 hover:shadow-soft transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-primary/10">
                  <Users className="h-3.5 w-3.5 text-primary" strokeWidth={1.6} />
                </div>
              </div>
              <h3 className="text-[20px] font-semibold tabular-nums text-foreground leading-tight">12</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Total Pengguna</p>
            </Link>
            <Link to="/access" className="rounded-[10px] border border-border bg-background p-4 hover:shadow-soft transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-primary/10">
                  <Shield className="h-3.5 w-3.5 text-primary" strokeWidth={1.6} />
                </div>
              </div>
              <h3 className="text-[20px] font-semibold tabular-nums text-foreground leading-tight">3</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Grup Hak Akses</p>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-[12px] border border-border bg-surface shadow-card p-4 md:p-5">
          <h4 className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground mb-4">Aksi Cepat</h4>
          <div className="grid grid-cols-2 gap-2.5">
            <Link to="/video">
              <Button variant="outline" size="sm" className="w-full h-9 rounded-[10px] text-[12px] gap-1.5 border-border justify-start">
                <Plus className="h-3.5 w-3.5" strokeWidth={1.6} /> Tambah Video
              </Button>
            </Link>
            <Link to="/faq/new">
              <Button variant="outline" size="sm" className="w-full h-9 rounded-[10px] text-[12px] gap-1.5 border-border justify-start">
                <Plus className="h-3.5 w-3.5" strokeWidth={1.6} /> Tambah FAQ
              </Button>
            </Link>
            <Link to="/panduan/new">
              <Button variant="outline" size="sm" className="w-full h-9 rounded-[10px] text-[12px] gap-1.5 border-border justify-start">
                <Plus className="h-3.5 w-3.5" strokeWidth={1.6} /> Tambah Panduan
              </Button>
            </Link>
            <Link to="/repository/new">
              <Button variant="outline" size="sm" className="w-full h-9 rounded-[10px] text-[12px] gap-1.5 border-border justify-start">
                <Upload className="h-3.5 w-3.5" strokeWidth={1.6} /> Upload Repository
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
