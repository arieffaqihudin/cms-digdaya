import { useState, useMemo } from "react";
import { Search, Plus, Shield, Pencil, Eye, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useScreenSize } from "@/components/AppLayout";
import { toast } from "sonner";

interface AccessGroup {
  id: string;
  name: string;
  userCount: number;
  accessCount: number;
  isActive: boolean;
}

const mockGroups: AccessGroup[] = [
  { id: "ag1", name: "Super Admin", userCount: 2, accessCount: 22, isActive: true },
  { id: "ag2", name: "Editor Konten", userCount: 5, accessCount: 12, isActive: true },
  { id: "ag3", name: "Viewer", userCount: 15, accessCount: 6, isActive: true },
  { id: "ag4", name: "Manager Produk", userCount: 3, accessCount: 10, isActive: true },
  { id: "ag5", name: "Guest", userCount: 0, accessCount: 2, isActive: false },
];

interface MenuSection {
  section: string;
  items: string[];
}

const menuStructure: MenuSection[] = [
  { section: "Dashboard", items: ["Dashboard"] },
  { section: "Konten", items: ["Video", "Blog", "Panduan", "FAQ", "Repository", "Banner App"] },
  { section: "Master", items: ["Kategori FAQ", "Kategori Dokumen", "Produk", "Tag", "Channel"] },
  { section: "Workflow", items: ["Draft", "Terjadwal", "Dipublikasikan", "Arsip"] },
  { section: "Pengaturan", items: ["Hak Akses", "Pengguna"] },
  { section: "Log Aktivitas", items: ["Aktivitas"] },
  { section: "Profil", items: ["Profil", "Keluar"] },
];

const allMenuItems = menuStructure.flatMap((s) => s.items);

export default function AccessPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupActive, setGroupActive] = useState(true);
  const [checkedMenus, setCheckedMenus] = useState<Set<string>>(new Set());
  const screenSize = useScreenSize();

  const filtered = useMemo(() => {
    return mockGroups.filter((g) => {
      if (statusFilter === "active" && !g.isActive) return false;
      if (statusFilter === "inactive" && g.isActive) return false;
      if (search && !g.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, statusFilter]);

  // Menu checklist helpers
  const toggleItem = (item: string) => {
    const next = new Set(checkedMenus);
    if (next.has(item)) next.delete(item);
    else next.add(item);
    setCheckedMenus(next);
  };

  const toggleSection = (section: MenuSection) => {
    const next = new Set(checkedMenus);
    const allChecked = section.items.every((i) => next.has(i));
    if (allChecked) {
      section.items.forEach((i) => next.delete(i));
    } else {
      section.items.forEach((i) => next.add(i));
    }
    setCheckedMenus(next);
  };

  const getSectionState = (section: MenuSection): "all" | "some" | "none" => {
    const checked = section.items.filter((i) => checkedMenus.has(i)).length;
    if (checked === 0) return "none";
    if (checked === section.items.length) return "all";
    return "some";
  };

  const selectAll = () => setCheckedMenus(new Set(allMenuItems));
  const clearAll = () => setCheckedMenus(new Set());

  const openModal = () => {
    setGroupName("");
    setGroupActive(true);
    setCheckedMenus(new Set());
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!groupName.trim()) {
      toast.error("Nama Grup wajib diisi");
      return;
    }
    toast.success("Hak akses berhasil disimpan");
    setModalOpen(false);
  };

  const filterSelect = (
    <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
      <SelectTrigger className="w-full sm:w-[170px] h-9 rounded-[10px] text-[13px] border-border bg-background">
        <SelectValue placeholder="Semua Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Semua Status</SelectItem>
        <SelectItem value="active">Aktif</SelectItem>
        <SelectItem value="inactive">Nonaktif</SelectItem>
      </SelectContent>
    </Select>
  );

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-base md:text-lg font-semibold text-foreground">Hak Akses</h1>
          <p className="text-[12px] md:text-[13px] text-muted-foreground mt-0.5">Kelola grup akses pengguna CMS</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-[10px] bg-accent/60 px-2.5 md:px-3 py-1.5 text-[12px] text-muted-foreground self-start sm:self-auto">
          <Shield className="h-3.5 w-3.5" strokeWidth={1.6} />
          <span className="tabular-nums font-medium">{filtered.length}</span>
          <span className="hidden sm:inline">grup</span>
        </div>
      </div>

      {/* Search + Filter + Button */}
      <div className="rounded-[12px] border border-border bg-surface p-3 md:p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
            <Input
              placeholder="Cari nama grup..."
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
                className={cn("h-9 rounded-[10px] text-[13px] border-border gap-1.5", statusFilter !== "all" && "border-primary/40 text-primary")}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-3.5 w-3.5" strokeWidth={1.6} /> Filter
              </Button>
              <Button
                size="sm"
                className="h-9 w-full rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
                onClick={openModal}
              >
                <Plus className="h-4 w-4" strokeWidth={1.6} /> Tambah Hak Akses
              </Button>
            </>
          ) : (
            <>
              {filterSelect}
              <Button
                size="sm"
                className="h-9 rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
                onClick={openModal}
              >
                <Plus className="h-4 w-4" strokeWidth={1.6} /> Tambah Hak Akses
              </Button>
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
            {filtered.map((group) => (
              <div key={group.id} className="p-4 hover:bg-accent/30 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-foreground">{group.name}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                      <span>{group.userCount} user</span>
                      <span>·</span>
                      <span>{group.accessCount} akses</span>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[10px] font-medium mt-2",
                        group.isActive
                          ? "bg-[hsl(var(--status-success-bg))] text-[hsl(var(--status-success-fg))]"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", group.isActive ? "bg-[hsl(var(--status-success-fg))]" : "bg-muted-foreground/50")} />
                      {group.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button className="text-[12px] font-medium text-primary hover:text-primary/80 transition-colors">Ubah</button>
                    <button className="text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors">Lihat</button>
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
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Nama Grup</th>
                  <th className="px-4 md:px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Jumlah User</th>
                  <th className="px-4 md:px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Jumlah Akses</th>
                  <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Status</th>
                  <th className="px-4 md:px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((group) => (
                  <tr key={group.id} className="border-b border-border/30 hover:bg-accent/30 transition-colors duration-150">
                    <td className="px-4 md:px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-primary/[0.06]">
                          <Shield className="h-3.5 w-3.5 text-primary" strokeWidth={1.6} />
                        </div>
                        <span className="font-medium text-foreground">{group.name}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-5 py-4 text-center">
                      <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-[3px] text-[11px] font-medium tabular-nums text-muted-foreground">{group.userCount}</span>
                    </td>
                    <td className="px-4 md:px-5 py-4 text-center">
                      <span className="inline-flex items-center rounded-full bg-primary/[0.07] px-2.5 py-[3px] text-[11px] font-medium tabular-nums text-primary">{group.accessCount}</span>
                    </td>
                    <td className="px-4 md:px-5 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[11px] font-medium",
                        group.isActive
                          ? "bg-[hsl(var(--status-success-bg))] text-[hsl(var(--status-success-fg))]"
                          : "bg-muted text-muted-foreground"
                      )}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", group.isActive ? "bg-[hsl(var(--status-success-fg))]" : "bg-muted-foreground/50")} />
                        {group.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-4 md:px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:text-primary/80 transition-colors">
                          <Pencil className="h-3 w-3" strokeWidth={1.6} /> Ubah
                        </button>
                        <button className="inline-flex items-center gap-1 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                          <Eye className="h-3 w-3" strokeWidth={1.6} /> Lihat
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
          <div className="p-12 md:p-16 text-center text-[13px] text-muted-foreground">Tidak ada grup akses ditemukan.</div>
        )}
      </div>

      {/* Modal Tambah Hak Akses */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-[560px] max-h-[90vh] flex flex-col rounded-[12px] border-border p-0 gap-0">
          <DialogHeader className="px-5 pt-5 pb-4 border-b border-border/60">
            <DialogTitle className="text-[15px] font-semibold text-foreground">Tambah Hak Akses</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
            {/* Name + Status */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.06em]">
                  Nama Grup <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Masukkan nama grup"
                  className="h-10 rounded-[10px] text-[13px] border-border focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-foreground">Status</p>
                  <p className="text-[11px] text-muted-foreground">Grup aktif dapat digunakan</p>
                </div>
                <Switch checked={groupActive} onCheckedChange={setGroupActive} />
              </div>
            </div>

            {/* Menu Access */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-foreground">Akses Menu</p>
                  <p className="text-[11px] text-muted-foreground">{checkedMenus.size} dari {allMenuItems.length} menu dipilih</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={selectAll} className="text-[11px] font-medium text-primary hover:text-primary/80 transition-colors">Pilih Semua</button>
                  <span className="text-muted-foreground/30">|</span>
                  <button onClick={clearAll} className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors">Hapus Semua</button>
                </div>
              </div>

              <div className="rounded-[10px] border border-border/60 divide-y divide-border/40">
                {menuStructure.map((section) => {
                  const state = getSectionState(section);
                  return (
                    <div key={section.section} className="px-4 py-3">
                      {/* Section header */}
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={state === "all"}
                          // @ts-ignore - indeterminate support
                          ref={(el: HTMLButtonElement | null) => {
                            if (el) {
                              (el as any).indeterminate = state === "some";
                            }
                          }}
                          onCheckedChange={() => toggleSection(section)}
                          className="h-4 w-4"
                        />
                        <span className="text-[12px] font-semibold text-foreground/80 uppercase tracking-[0.06em]">{section.section}</span>
                      </div>
                      {/* Items */}
                      <div className="ml-7 mt-2 space-y-2">
                        {section.items.map((item) => (
                          <label key={item} className="flex items-center gap-3 cursor-pointer group">
                            <Checkbox
                              checked={checkedMenus.has(item)}
                              onCheckedChange={() => toggleItem(item)}
                              className="h-4 w-4"
                            />
                            <span className="text-[13px] text-foreground/80 group-hover:text-foreground transition-colors">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="px-5 py-4 border-t border-border/60 gap-2">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)} className="h-9 rounded-[10px] text-[13px] border-border">
              Batal
            </Button>
            <Button size="sm" onClick={handleSave} className="h-9 rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90">
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
