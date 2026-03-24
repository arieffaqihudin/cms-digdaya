import { useState, useMemo } from "react";
import { Search, Plus, Pencil, Trash2, Tv2 } from "lucide-react";
import { channels } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScreenSize } from "@/components/AppLayout";

interface ChannelItem {
  id: string;
  name: string;
  count: number;
  isActive: boolean;
}

const mockChannels: ChannelItem[] = channels.map((name, i) => ({
  id: `ch${i + 1}`,
  name,
  count: Math.floor(Math.random() * 30) + 2,
  isActive: Math.random() > 0.2,
}));

export default function ChannelPage() {
  const [search, setSearch] = useState("");
  const screenSize = useScreenSize();

  const filtered = useMemo(() => {
    return mockChannels.filter((c) =>
      !search || c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-base md:text-lg font-semibold text-foreground">Channel</h1>
          <p className="text-[12px] md:text-[13px] text-muted-foreground mt-0.5">Kelola channel konten</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-[10px] bg-accent/60 px-2.5 md:px-3 py-1.5 text-[12px] text-muted-foreground self-start sm:self-auto">
          <Tv2 className="h-3.5 w-3.5" strokeWidth={1.6} />
          <span className="tabular-nums font-medium">{filtered.length}</span>
          <span className="hidden sm:inline">item</span>
        </div>
      </div>

      <div className="rounded-[12px] border border-border bg-surface p-3 md:p-4 shadow-card">
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
            <Input placeholder="Cari channel..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 rounded-[10px] text-[13px] border-border bg-background focus-visible:ring-1 focus-visible:ring-ring" />
          </div>
          <Button size="sm" className={cn("h-9 rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5", screenSize === "mobile" && "w-full")}>
            <Plus className="h-4 w-4" strokeWidth={1.6} /> Tambah Channel
          </Button>
        </div>
      </div>

      <div className="rounded-[12px] border border-border bg-surface shadow-card overflow-hidden">
        {screenSize === "mobile" ? (
          <div className="divide-y divide-border/30">
            {filtered.map((item) => (
              <div key={item.id} className="p-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-primary/[0.06] shrink-0">
                  <Tv2 className="h-3.5 w-3.5 text-primary" strokeWidth={1.6} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-foreground">{item.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center rounded-full bg-muted px-2 py-[2px] text-[10px] font-medium tabular-nums text-muted-foreground">{item.count} konten</span>
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[10px] font-medium", item.isActive ? "bg-[hsl(var(--status-success-bg))] text-[hsl(var(--status-success-fg))]" : "bg-muted text-muted-foreground")}>
                      <span className={cn("h-1 w-1 rounded-full", item.isActive ? "bg-[hsl(var(--status-success-fg))]" : "bg-muted-foreground/50")} />
                      {item.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"><Edit className="h-3.5 w-3.5" strokeWidth={1.6} /></Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" strokeWidth={1.6} /></Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border/60">
                <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Nama</th>
                <th className="px-4 md:px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Jumlah Konten</th>
                <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Status</th>
                <th className="px-4 md:px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-border/30 hover:bg-accent/30 transition-colors duration-150">
                  <td className="px-4 md:px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-primary/[0.06]"><Tv2 className="h-3.5 w-3.5 text-primary" strokeWidth={1.6} /></div>
                      <span className="font-medium text-foreground">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-5 py-4 text-center"><span className="inline-flex items-center rounded-full bg-muted px-2.5 py-[3px] text-[11px] font-medium tabular-nums text-muted-foreground">{item.count}</span></td>
                  <td className="px-4 md:px-5 py-4">
                    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[11px] font-medium", item.isActive ? "bg-[hsl(var(--status-success-bg))] text-[hsl(var(--status-success-fg))]" : "bg-muted text-muted-foreground")}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", item.isActive ? "bg-[hsl(var(--status-success-fg))]" : "bg-muted-foreground/50")} />
                      {item.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="px-4 md:px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-0.5">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"><Edit className="h-3.5 w-3.5" strokeWidth={1.6} /></Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" strokeWidth={1.6} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {filtered.length === 0 && <div className="p-12 md:p-16 text-center text-[13px] text-muted-foreground">Tidak ada channel ditemukan.</div>}
      </div>
    </div>
  );
}
