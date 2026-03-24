import { useState, useMemo } from "react";
import {
  Search, Plus, Filter, MoreHorizontal, Pencil, Trash2,
  Upload, User as UserIcon, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useScreenSize } from "@/components/AppLayout";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────
type UserType = "pengurus" | "fungsionaris" | "staf";
type OrgType = "kepengurusan" | "lembaga" | "badan_otonom";

interface CMSUser {
  id: string;
  name: string;
  email: string;
  jabatan: string;
  kepengurusan: string;
  grupPengguna: string;
  isActive: boolean;
  type: UserType;
  avatar?: string;
  createdAt: string;
}

// ─── Mock data ───────────────────────────────────────────────────────
const mockUsers: CMSUser[] = [
  { id: "u1", name: "Ahmad Fauzi", email: "ahmad.fauzi@nu.or.id", jabatan: "Ketua", kepengurusan: "PBNU", grupPengguna: "Super Admin", isActive: true, type: "pengurus", createdAt: "2026-01-15" },
  { id: "u2", name: "Siti Aminah", email: "siti.aminah@nu.or.id", jabatan: "Sekretaris", kepengurusan: "PWNU Jawa Timur", grupPengguna: "Editor Konten", isActive: true, type: "pengurus", createdAt: "2026-02-10" },
  { id: "u3", name: "M. Rizki Pratama", email: "rizki.pratama@nu.or.id", jabatan: "Staf IT", kepengurusan: "PBNU", grupPengguna: "Super Admin", isActive: true, type: "staf", createdAt: "2026-01-20" },
  { id: "u4", name: "Nur Hidayah", email: "nur.hidayah@nu.or.id", jabatan: "Bendahara", kepengurusan: "PCNU Surabaya", grupPengguna: "Viewer", isActive: false, type: "pengurus", createdAt: "2026-03-01" },
  { id: "u5", name: "KH. Abdul Majid", email: "abdul.majid@nu.or.id", jabatan: "Rais Syuriah", kepengurusan: "PBNU", grupPengguna: "Editor Konten", isActive: true, type: "pengurus", createdAt: "2025-12-05" },
  { id: "u6", name: "Dewi Rahmawati", email: "dewi.r@nu.or.id", jabatan: "Kepala Divisi", kepengurusan: "LP Ma'arif NU", grupPengguna: "Manager Produk", isActive: true, type: "fungsionaris", createdAt: "2026-02-18" },
  { id: "u7", name: "Hasan Basri", email: "hasan.basri@nu.or.id", jabatan: "Koordinator", kepengurusan: "Ansor", grupPengguna: "Editor Konten", isActive: true, type: "pengurus", createdAt: "2026-01-25" },
  { id: "u8", name: "Fatimah Zahra", email: "fatimah.z@nu.or.id", jabatan: "Admin", kepengurusan: "Muslimat NU", grupPengguna: "Viewer", isActive: false, type: "staf", createdAt: "2026-03-10" },
];

const accessGroups = ["Super Admin", "Editor Konten", "Viewer", "Manager Produk", "Guest"];

const tingkatOptions = ["Pusat", "Wilayah", "Cabang", "MWC", "Ranting"];
const dewanOptions = ["Syuriah", "Tanfidziyah", "Mustasyar"];
const jabatanOptions = ["Ketua", "Wakil Ketua", "Sekretaris", "Bendahara", "Anggota"];
const lembagaOptions = ["LP Ma'arif NU", "LAKPESDAM NU", "LBM NU", "LPBH NU", "RMI NU", "LPPNU"];
const baonomOptions = ["Ansor", "Muslimat NU", "Fatayat NU", "IPNU", "IPPNU", "PERGUNU"];
const unitOptions = ["IT", "Keuangan", "SDM", "Humas", "Litbang", "Media"];

// ─── Component ───────────────────────────────────────────────────────
export default function UsersPage() {
  const screenSize = useScreenSize();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [users, setUsers] = useState<CMSUser[]>(mockUsers);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Delete dialog
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Step 1 fields
  const [formName, setFormName] = useState("");
  const [formNIK, setFormNIK] = useState("");
  const [formNIA, setFormNIA] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formType, setFormType] = useState<UserType | "">("");
  const [formAvatar, setFormAvatar] = useState<string | null>(null);

  // Step 2 fields
  const [formOrgType, setFormOrgType] = useState<OrgType>("kepengurusan");
  const [formTingkat, setFormTingkat] = useState("");
  const [formDewan, setFormDewan] = useState("");
  const [formJabatan, setFormJabatan] = useState("");
  const [formGrup, setFormGrup] = useState("");
  const [formLembaga, setFormLembaga] = useState("");
  const [formBanom, setFormBanom] = useState("");
  const [formUnit, setFormUnit] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  // ─── Filter ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (typeFilter !== "all" && u.type !== typeFilter) return false;
      if (statusFilter === "active" && !u.isActive) return false;
      if (statusFilter === "inactive" && u.isActive) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [users, search, typeFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  // ─── Modal helpers ───────────────────────────────────────────────
  const resetForm = () => {
    setStep(1);
    setEditingId(null);
    setFormName(""); setFormNIK(""); setFormNIA(""); setFormEmail(""); setFormPhone("");
    setFormType(""); setFormAvatar(null);
    setFormOrgType("kepengurusan"); setFormTingkat(""); setFormDewan(""); setFormJabatan("");
    setFormGrup(""); setFormLembaga(""); setFormBanom(""); setFormUnit("");
  };

  const openAdd = () => { resetForm(); setModalOpen(true); };

  const openEdit = (user: CMSUser) => {
    resetForm();
    setEditingId(user.id);
    setFormName(user.name); setFormEmail(user.email); setFormType(user.type);
    setFormJabatan(user.jabatan); setFormGrup(user.grupPengguna);
    setStep(1);
    setModalOpen(true);
  };

  const handleNext = () => {
    if (!formName.trim() || !formEmail.trim() || !formPhone.trim() || !formType) {
      toast.error("Lengkapi semua field wajib");
      return;
    }
    setStep(2);
  };

  const handleSave = () => {
    if (!formGrup) { toast.error("Pilih Grup Pengguna"); return; }

    const jabatan = formJabatan || "—";
    const kepengurusan =
      formType === "pengurus"
        ? formOrgType === "lembaga" ? formLembaga
          : formOrgType === "badan_otonom" ? formBanom
            : formTingkat || "—"
        : formUnit || "—";

    if (editingId) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingId
            ? { ...u, name: formName, email: formEmail, jabatan, kepengurusan, grupPengguna: formGrup, type: formType as UserType }
            : u
        )
      );
      toast.success("Pengguna berhasil diperbarui");
    } else {
      const newUser: CMSUser = {
        id: `u${Date.now()}`,
        name: formName,
        email: formEmail,
        jabatan,
        kepengurusan,
        grupPengguna: formGrup,
        isActive: true,
        type: formType as UserType,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setUsers((prev) => [newUser, ...prev]);
      toast.success("Pengguna berhasil ditambahkan");
    }
    setModalOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleteId));
    setDeleteId(null);
    toast.success("Pengguna berhasil dihapus");
  };

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u))
    );
  };

  // ─── Filter selects ──────────────────────────────────────────────
  const typeSelect = (
    <Select value={typeFilter} onValueChange={setTypeFilter}>
      <SelectTrigger className="w-full sm:w-[160px] h-9 rounded-[10px] text-[13px] border-border bg-background">
        <SelectValue placeholder="Semua Tipe" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Semua Tipe</SelectItem>
        <SelectItem value="pengurus">Pengurus</SelectItem>
        <SelectItem value="fungsionaris">Fungsionaris</SelectItem>
        <SelectItem value="staf">Staf</SelectItem>
      </SelectContent>
    </Select>
  );

  const statusSelect = (
    <Select value={statusFilter} onValueChange={setStatusFilter}>
      <SelectTrigger className="w-full sm:w-[160px] h-9 rounded-[10px] text-[13px] border-border bg-background">
        <SelectValue placeholder="Semua Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Semua Status</SelectItem>
        <SelectItem value="active">Aktif</SelectItem>
        <SelectItem value="inactive">Nonaktif</SelectItem>
      </SelectContent>
    </Select>
  );

  // ─── Render ──────────────────────────────────────────────────────
  return (
    <div className="space-y-4 md:space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-base md:text-lg font-semibold text-foreground">Pengguna</h1>
          <p className="text-[12px] md:text-[13px] text-muted-foreground mt-0.5">Kelola pengguna CMS</p>
        </div>
      </div>

      {/* Top bar */}
      <div className="rounded-[12px] border border-border bg-surface p-3 md:p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
            <Input
              placeholder="Cari nama atau email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="pl-9 h-9 rounded-[10px] text-[13px] border-border bg-background focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          {screenSize === "mobile" ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className={cn("h-9 rounded-[10px] text-[13px] border-border gap-1.5",
                  (typeFilter !== "all" || statusFilter !== "all") && "border-primary/40 text-primary"
                )}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-3.5 w-3.5" strokeWidth={1.6} /> Filter
              </Button>
              <Button size="sm" className="h-9 w-full rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5" onClick={openAdd}>
                <Plus className="h-4 w-4" strokeWidth={1.6} /> Tambah Pengguna
              </Button>
            </>
          ) : (
            <>
              {typeSelect}
              {statusSelect}
              <Button size="sm" className="h-9 rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5" onClick={openAdd}>
                <Plus className="h-4 w-4" strokeWidth={1.6} /> Tambah Pengguna
              </Button>
            </>
          )}
        </div>
        {screenSize === "mobile" && showFilters && (
          <div className="mt-3 pt-3 border-t border-border/60 space-y-2 animate-fade-in">
            {typeSelect}
            {statusSelect}
          </div>
        )}
      </div>

      {/* Table / Cards */}
      <div className="rounded-[12px] border border-border bg-surface shadow-card overflow-hidden">
        {screenSize === "mobile" ? (
          <div className="divide-y divide-border/30">
            {paged.length === 0 && (
              <div className="p-12 text-center text-[13px] text-muted-foreground">Tidak ada pengguna ditemukan.</div>
            )}
            {paged.map((u) => (
              <div key={u.id} className="p-4 hover:bg-accent/30 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/[0.07] shrink-0">
                      <UserIcon className="h-4 w-4 text-primary" strokeWidth={1.6} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-foreground truncate">{u.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{u.email}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-[10px]">
                      <DropdownMenuItem onClick={() => openEdit(u)} className="gap-2 text-[13px]">
                        <Pencil className="h-3.5 w-3.5" /> Ubah
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDeleteId(u.id)} className="gap-2 text-[13px] text-destructive focus:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" /> Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-2.5 ml-12 space-y-1 text-[11px] text-muted-foreground">
                  <p><span className="font-medium text-foreground/70">Jabatan:</span> {u.jabatan}</p>
                  <p><span className="font-medium text-foreground/70">Kepengurusan:</span> {u.kepengurusan}</p>
                  <p><span className="font-medium text-foreground/70">Grup:</span> {u.grupPengguna}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <Switch checked={u.isActive} onCheckedChange={() => toggleStatus(u.id)} className="scale-[0.8]" />
                    <span className={cn("text-[10px] font-medium", u.isActive ? "text-[hsl(var(--status-success-fg))]" : "text-muted-foreground")}>
                      {u.isActive ? "Aktif" : "Nonaktif"}
                    </span>
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
                  {["Nama", "Email", "Jabatan", "Kepengurusan", "Grup Pengguna", "Status", "Aksi"].map((h) => (
                    <th key={h} className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.map((u) => (
                  <tr key={u.id} className="border-b border-border/30 hover:bg-accent/30 transition-colors duration-150">
                    <td className="px-4 md:px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/[0.07] shrink-0">
                          <UserIcon className="h-3.5 w-3.5 text-primary" strokeWidth={1.6} />
                        </div>
                        <span className="font-medium text-foreground whitespace-nowrap">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-5 py-4 text-muted-foreground">{u.email}</td>
                    <td className="px-4 md:px-5 py-4 text-foreground/80">{u.jabatan}</td>
                    <td className="px-4 md:px-5 py-4 text-foreground/80">{u.kepengurusan}</td>
                    <td className="px-4 md:px-5 py-4">
                      <span className="inline-flex rounded-full bg-primary/[0.07] px-2.5 py-[3px] text-[11px] font-medium text-primary">{u.grupPengguna}</span>
                    </td>
                    <td className="px-4 md:px-5 py-4">
                      <Switch checked={u.isActive} onCheckedChange={() => toggleStatus(u.id)} />
                    </td>
                    <td className="px-4 md:px-5 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-[10px]">
                          <DropdownMenuItem onClick={() => openEdit(u)} className="gap-2 text-[13px]">
                            <Pencil className="h-3.5 w-3.5" /> Ubah
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteId(u.id)} className="gap-2 text-[13px] text-destructive focus:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {paged.length === 0 && (
              <div className="p-12 md:p-16 text-center text-[13px] text-muted-foreground">Tidak ada pengguna ditemukan.</div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 md:px-5 py-3 border-t border-border/60 text-[12px] text-muted-foreground">
            <span>Menampilkan {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} dari {filtered.length}</span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === currentPage ? "default" : "ghost"}
                  size="icon"
                  className={cn("h-7 w-7 text-[12px]", p === currentPage && "bg-primary text-primary-foreground")}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </Button>
              ))}
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ─── Add / Edit Modal ─────────────────────────────────────── */}
      <Dialog open={modalOpen} onOpenChange={(v) => { if (!v) { setModalOpen(false); resetForm(); } else setModalOpen(true); }}>
        <DialogContent className="max-w-[640px] max-h-[92vh] flex flex-col rounded-[12px] border-border p-0 gap-0">
          <DialogHeader className="px-6 pt-5 pb-4 border-b border-border/60">
             <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.08em]">
               {editingId ? "Ubah" : "Tambah"}
             </p>
            <DialogTitle className="text-[16px] font-semibold text-foreground mt-0.5">
              {editingId ? "Ubah Pengguna" : "Tambah Pengguna"}
            </DialogTitle>
            {/* Step indicator */}
            <div className="flex items-center gap-3 mt-4">
              <div className={cn("flex items-center gap-2 text-[12px] font-medium", step === 1 ? "text-primary" : "text-muted-foreground")}>
                <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold",
                  step === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>1</span>
                Data Dasar
              </div>
              <div className="h-px flex-1 bg-border" />
              <div className={cn("flex items-center gap-2 text-[12px] font-medium", step === 2 ? "text-primary" : "text-muted-foreground")}>
                <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold",
                  step === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>2</span>
                Detail Jabatan
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {step === 1 ? (
              <div className="space-y-5">
                {/* Photo + Name row */}
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* Photo upload */}
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className="h-24 w-24 rounded-[12px] border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 transition-colors">
                      {formAvatar ? (
                        <img src={formAvatar} alt="" className="h-full w-full object-cover rounded-[10px]" />
                      ) : (
                        <>
                          <Upload className="h-5 w-5 text-muted-foreground/60 mb-1" strokeWidth={1.4} />
                          <span className="text-[10px] text-muted-foreground">Unggah Foto</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Name + NIK + NIA */}
                  <div className="flex-1 space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-[12px] font-medium text-foreground/70">
                        Nama Lengkap <span className="text-destructive">*</span>
                      </Label>
                      <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Masukkan nama lengkap" className="h-10 rounded-[10px] text-[13px] border-border" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-[12px] font-medium text-foreground/70">
                          NIK <span className="text-destructive">*</span>
                        </Label>
                        <Input value={formNIK} onChange={(e) => setFormNIK(e.target.value)} placeholder="Masukkan NIK" className="h-10 rounded-[10px] text-[13px] border-border" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[12px] font-medium text-foreground/70">Kode NIA</Label>
                        <Input value={formNIA} onChange={(e) => setFormNIA(e.target.value)} placeholder="Optional" className="h-10 rounded-[10px] text-[13px] border-border" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[12px] font-medium text-foreground/70">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="email@example.com" className="h-10 rounded-[10px] text-[13px] border-border" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[12px] font-medium text-foreground/70">
                      No HP <span className="text-destructive">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <div className="flex h-10 items-center rounded-[10px] border border-border bg-muted/30 px-3 text-[13px] text-muted-foreground shrink-0">
                        +62
                      </div>
                      <Input value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="812xxxxxxxx" className="h-10 rounded-[10px] text-[13px] border-border" />
                    </div>
                  </div>
                </div>

                {/* User type */}
                <div className="space-y-2.5">
                  <Label className="text-[12px] font-medium text-foreground/70">
                    Tipe Pengguna <span className="text-destructive">*</span>
                  </Label>
                  <RadioGroup value={formType} onValueChange={(v) => setFormType(v as UserType)} className="flex flex-wrap gap-3">
                    {[
                      { value: "pengurus", label: "Pengurus" },
                      { value: "fungsionaris", label: "Fungsionaris" },
                      { value: "staf", label: "Staf" },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={cn(
                          "flex items-center gap-2.5 rounded-[10px] border px-4 py-3 cursor-pointer transition-colors text-[13px]",
                          formType === opt.value
                            ? "border-primary bg-primary/[0.04] text-primary font-medium"
                            : "border-border bg-background text-foreground/80 hover:border-primary/30"
                        )}
                      >
                        <RadioGroupItem value={opt.value} className="h-4 w-4" />
                        {opt.label}
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            ) : (
              /* ─── Step 2 ─── */
              <div className="space-y-5">
                {formType === "pengurus" && (
                  <>
                    {/* Org type radio */}
                    <div className="space-y-2.5">
                      <Label className="text-[12px] font-medium text-foreground/70">Jenis Organisasi</Label>
                      <RadioGroup value={formOrgType} onValueChange={(v) => setFormOrgType(v as OrgType)} className="flex flex-wrap gap-3">
                        {[
                          { value: "kepengurusan", label: "Kepengurusan" },
                          { value: "lembaga", label: "Lembaga" },
                          { value: "badan_otonom", label: "Badan Otonom" },
                        ].map((opt) => (
                          <label
                            key={opt.value}
                            className={cn(
                              "flex items-center gap-2.5 rounded-[10px] border px-4 py-3 cursor-pointer transition-colors text-[13px]",
                              formOrgType === opt.value
                                ? "border-primary bg-primary/[0.04] text-primary font-medium"
                                : "border-border bg-background text-foreground/80 hover:border-primary/30"
                            )}
                          >
                            <RadioGroupItem value={opt.value} className="h-4 w-4" />
                            {opt.label}
                          </label>
                        ))}
                      </RadioGroup>
                    </div>

                    {formOrgType === "kepengurusan" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FieldSelect label="Tingkat" required value={formTingkat} onChange={setFormTingkat} options={tingkatOptions} placeholder="Pilih tingkat" />
                        <FieldSelect label="Dewan" required value={formDewan} onChange={setFormDewan} options={dewanOptions} placeholder="Pilih dewan" />
                        <FieldSelect label="Jabatan" required value={formJabatan} onChange={setFormJabatan} options={jabatanOptions} placeholder="Pilih jabatan" />
                        <FieldSelect label="Grup Pengguna" required value={formGrup} onChange={setFormGrup} options={accessGroups} placeholder="Pilih grup" />
                      </div>
                    )}

                    {formOrgType === "lembaga" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FieldSelect label="Nama Lembaga" required value={formLembaga} onChange={setFormLembaga} options={lembagaOptions} placeholder="Pilih lembaga" />
                        <FieldSelect label="Tingkat" required value={formTingkat} onChange={setFormTingkat} options={tingkatOptions} placeholder="Pilih tingkat" />
                        <FieldSelect label="Grup Pengguna" required value={formGrup} onChange={setFormGrup} options={accessGroups} placeholder="Pilih grup" />
                      </div>
                    )}

                    {formOrgType === "badan_otonom" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FieldSelect label="Nama Badan Otonom" required value={formBanom} onChange={setFormBanom} options={baonomOptions} placeholder="Pilih banom" />
                        <FieldSelect label="Tingkat" required value={formTingkat} onChange={setFormTingkat} options={tingkatOptions} placeholder="Pilih tingkat" />
                        <FieldSelect label="Grup Pengguna" required value={formGrup} onChange={setFormGrup} options={accessGroups} placeholder="Pilih grup" />
                      </div>
                    )}
                  </>
                )}

                {(formType === "fungsionaris" || formType === "staf") && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FieldSelect label="Unit / Bagian / Divisi" required value={formUnit} onChange={setFormUnit} options={unitOptions} placeholder="Pilih unit" />
                    <FieldSelect label="Jabatan" required value={formJabatan} onChange={setFormJabatan} options={jabatanOptions} placeholder="Pilih jabatan" />
                    <FieldSelect label="Grup Pengguna" required value={formGrup} onChange={setFormGrup} options={accessGroups} placeholder="Pilih grup" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-border/60">
            {step === 1 ? (
              <>
                <Button variant="outline" className="h-9 rounded-[10px] text-[13px] border-border" onClick={() => { setModalOpen(false); resetForm(); }}>
                  Batal
                </Button>
                <Button className="h-9 rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleNext}>
                  Selanjutnya
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="h-9 rounded-[10px] text-[13px] border-border" onClick={() => setStep(1)}>
                  Kembali
                </Button>
                <Button className="h-9 rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSave}>
                  Simpan
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(v) => { if (!v) setDeleteId(null); }}>
        <AlertDialogContent className="rounded-[12px] border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[15px]">Hapus Pengguna</AlertDialogTitle>
            <AlertDialogDescription className="text-[13px]">Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-9 rounded-[10px] text-[13px]">Batal</AlertDialogCancel>
            <AlertDialogAction className="h-9 rounded-[10px] text-[13px] bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDelete}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Reusable select field ───────────────────────────────────────────
function FieldSelect({
  label, required, value, onChange, options, placeholder,
}: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void; options: string[]; placeholder: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[12px] font-medium text-foreground/70">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-10 rounded-[10px] text-[13px] border-border bg-background">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>{o}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
