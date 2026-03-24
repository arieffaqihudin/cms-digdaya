import { useState } from "react";
import { Search, Plus, Image, FileText, Video, Music, Trash2, Download, Grid3X3, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScreenSize } from "@/components/AppLayout";

interface MediaItem {
  id: string;
  name: string;
  type: "image" | "video" | "document" | "audio";
  size: string;
  date: string;
  url: string;
}

const mockMedia: MediaItem[] = [
  { id: "m1", name: "banner-ramadhan.jpg", type: "image", size: "1.2 MB", date: "2026-03-20", url: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg" },
  { id: "m2", name: "logo-nu-online.png", type: "image", size: "340 KB", date: "2026-03-19", url: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg" },
  { id: "m3", name: "cover-artikel-zakat.jpg", type: "image", size: "890 KB", date: "2026-03-18", url: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg" },
  { id: "m4", name: "thumbnail-khutbah.jpg", type: "image", size: "560 KB", date: "2026-03-17", url: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg" },
  { id: "m5", name: "infografis-harlah.png", type: "image", size: "2.1 MB", date: "2026-03-16", url: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg" },
  { id: "m6", name: "panduan-donasi.pdf", type: "document", size: "4.5 MB", date: "2026-03-15", url: "" },
  { id: "m7", name: "sholawat-nabi.mp3", type: "audio", size: "8.2 MB", date: "2026-03-14", url: "" },
  { id: "m8", name: "video-muktamar.mp4", type: "video", size: "45 MB", date: "2026-03-13", url: "" },
  { id: "m9", name: "foto-pbnu.jpg", type: "image", size: "1.8 MB", date: "2026-03-12", url: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg" },
  { id: "m10", name: "poster-istighotsah.jpg", type: "image", size: "950 KB", date: "2026-03-11", url: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg" },
  { id: "m11", name: "brosur-pesantren.pdf", type: "document", size: "3.2 MB", date: "2026-03-10", url: "" },
  { id: "m12", name: "header-website.jpg", type: "image", size: "1.5 MB", date: "2026-03-09", url: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg" },
];

const typeIcons: Record<string, typeof Image> = {
  image: Image,
  video: Video,
  document: FileText,
  audio: Music,
};

const typeColors: Record<string, string> = {
  image: "bg-primary/[0.07] text-primary",
  video: "bg-status-info-bg text-status-info-fg",
  document: "bg-status-warning-bg text-status-warning-fg",
  audio: "bg-accent text-muted-foreground",
};

export default function MediaLibrary() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const screenSize = useScreenSize();

  const filtered = mockMedia.filter((m) => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== "all" && m.type !== typeFilter) return false;
    return true;
  });

  const selected = mockMedia.find(m => m.id === selectedId);

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base md:text-lg font-semibold text-foreground">Media Library</h1>
          <p className="text-[12px] md:text-[13px] text-muted-foreground mt-0.5">Kelola gambar, dokumen, dan file media</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-[10px] bg-accent/60 px-2.5 md:px-3 py-1.5 text-[12px] text-muted-foreground">
          <Image className="h-3.5 w-3.5" strokeWidth={1.6} />
          <span className="tabular-nums font-medium">{filtered.length}</span>
          <span className="hidden sm:inline">file</span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="rounded-[12px] border border-border bg-surface p-3 md:p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
            <Input
              placeholder="Cari file..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 rounded-[10px] text-[13px] border-border bg-background focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div className="flex items-center rounded-[10px] border border-border bg-background p-0.5 overflow-x-auto">
            {[
              { value: "all", label: "Semua" },
              { value: "image", label: "Gambar" },
              { value: "video", label: "Video" },
              { value: "document", label: "Dokumen" },
            ].map((t) => (
              <button
                key={t.value}
                onClick={() => setTypeFilter(t.value)}
                className={cn(
                  "px-2.5 md:px-3 py-1.5 rounded-[8px] text-[11px] md:text-[12px] font-medium transition-colors whitespace-nowrap",
                  typeFilter === t.value
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="hidden sm:flex items-center rounded-[10px] border border-border bg-background p-0.5">
            <button
              onClick={() => setView("grid")}
              className={cn("p-1.5 rounded-[8px] transition-colors", view === "grid" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              <Grid3X3 className="h-4 w-4" strokeWidth={1.6} />
            </button>
            <button
              onClick={() => setView("list")}
              className={cn("p-1.5 rounded-[8px] transition-colors", view === "list" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              <List className="h-4 w-4" strokeWidth={1.6} />
            </button>
          </div>
          <Button size="sm" className={`h-9 rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 ${screenSize === "mobile" ? "w-full" : ""}`}>
            <Plus className="h-4 w-4" strokeWidth={1.6} /> Upload
          </Button>
        </div>
      </div>

      <div className={cn("flex gap-5", screenSize === "mobile" && "flex-col")}>
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Upload area */}
          <div className="rounded-[12px] border border-dashed border-border/60 bg-surface/50 p-6 md:p-8 text-center hover:border-primary/30 transition-colors cursor-pointer group mb-4 md:mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-accent mx-auto mb-3 group-hover:bg-primary/10 transition-colors">
              <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" strokeWidth={1.6} />
            </div>
            <p className="text-[13px] text-foreground font-medium">Klik untuk upload atau drag & drop</p>
            <p className="text-[11px] text-muted-foreground mt-1">PNG, JPG, PDF, MP4 — maks 20MB</p>
          </div>

          <div className={cn(
            "grid gap-3",
            screenSize === "mobile" ? "grid-cols-2" : view === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"
          )}>
            {view === "grid" || screenSize === "mobile" ? (
              filtered.map((item) => {
                const Icon = typeIcons[item.type];
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedId(item.id === selectedId ? null : item.id)}
                    className={cn(
                      "rounded-[12px] border bg-surface overflow-hidden text-left transition-all duration-150 group",
                      selectedId === item.id
                        ? "border-primary/40 ring-1 ring-primary/20 shadow-soft"
                        : "border-border hover:border-border/80 hover:shadow-card"
                    )}
                  >
                    {item.type === "image" ? (
                      <div className="aspect-[4/3] bg-muted overflow-hidden">
                        <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] bg-accent/40 flex items-center justify-center">
                        <div className={cn("flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-[12px]", typeColors[item.type])}>
                          <Icon className="h-4 w-4 md:h-5 md:w-5" strokeWidth={1.6} />
                        </div>
                      </div>
                    )}
                    <div className="p-2.5 md:p-3">
                      <p className="text-[11px] md:text-[12px] font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{item.size} · {item.date}</p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="rounded-[12px] border border-border bg-surface shadow-card overflow-hidden col-span-full">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="border-b border-border/60">
                      <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">File</th>
                      <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden md:table-cell">Tipe</th>
                      <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden lg:table-cell">Ukuran</th>
                      <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden lg:table-cell">Tanggal</th>
                      <th className="px-4 md:px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item) => {
                      const Icon = typeIcons[item.type];
                      return (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedId(item.id === selectedId ? null : item.id)}
                          className={cn(
                            "border-b border-border/30 transition-colors duration-150 cursor-pointer",
                            selectedId === item.id ? "bg-primary/[0.04]" : "hover:bg-accent/30"
                          )}
                        >
                          <td className="px-4 md:px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className={cn("flex h-8 w-8 items-center justify-center rounded-[8px]", typeColors[item.type])}>
                                <Icon className="h-3.5 w-3.5" strokeWidth={1.6} />
                              </div>
                              <span className="font-medium text-foreground truncate">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-4 md:px-5 py-3.5 text-muted-foreground capitalize hidden md:table-cell">{item.type === "image" ? "Gambar" : item.type === "document" ? "Dokumen" : item.type}</td>
                          <td className="px-4 md:px-5 py-3.5 text-muted-foreground tabular-nums hidden lg:table-cell">{item.size}</td>
                          <td className="px-4 md:px-5 py-3.5 text-muted-foreground tabular-nums hidden lg:table-cell">{item.date}</td>
                          <td className="px-4 md:px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-0.5">
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent">
                                <Download className="h-3.5 w-3.5" strokeWidth={1.6} />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-status-danger-bg">
                                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.6} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="p-12 md:p-16 text-center text-[13px] text-muted-foreground">Tidak ada file ditemukan.</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Detail panel — hidden on mobile unless selected */}
        {selected && screenSize !== "mobile" && (
          <div className="w-[280px] shrink-0 lg:sticky lg:top-0 lg:self-start animate-fade-in">
            <div className="rounded-[12px] border border-border bg-surface shadow-card overflow-hidden">
              {selected.type === "image" ? (
                <div className="aspect-[4/3] bg-muted">
                  <img src={selected.url} alt={selected.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-[4/3] bg-accent/40 flex items-center justify-center">
                  {(() => { const Icon = typeIcons[selected.type]; return (
                    <div className={cn("flex h-14 w-14 items-center justify-center rounded-[12px]", typeColors[selected.type])}>
                      <Icon className="h-6 w-6" strokeWidth={1.6} />
                    </div>
                  ); })()}
                </div>
              )}
              <div className="p-4 space-y-3">
                <p className="text-[13px] font-medium text-foreground break-all">{selected.name}</p>
                <div className="space-y-2">
                  {[
                    ["Tipe", selected.type === "image" ? "Gambar" : selected.type === "document" ? "Dokumen" : selected.type],
                    ["Ukuran", selected.size],
                    ["Tanggal", selected.date],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between text-[12px]">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="text-foreground font-medium">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <Button variant="outline" size="sm" className="flex-1 h-8 rounded-[10px] text-xs border-border gap-1.5">
                    <Download className="h-3.5 w-3.5" strokeWidth={1.6} /> Download
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-[10px] text-muted-foreground hover:text-destructive hover:bg-status-danger-bg">
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.6} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
