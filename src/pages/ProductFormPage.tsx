import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Image, Link2, Eye, Package, Globe, HelpCircle, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function SectionCard({ title, subtitle, icon: Icon, children }: { title: string; subtitle?: string; icon?: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-[12px] border border-border/60 overflow-hidden">
      <div className="px-6 py-4 border-b border-border/40 bg-muted/20">
        <div className="flex items-center gap-2.5">
          {Icon && <Icon className="h-4 w-4 text-primary/70" strokeWidth={1.6} />}
          <div>
            <h3 className="text-sm font-semibold text-foreground/90">{title}</h3>
            {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
        </div>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground/70">{hint}</p>}
    </div>
  );
}

const JENIS_PRODUK = ["Tata Kelola", "Layanan & Media", "Pengembang"];
const STATUS_PRODUK = ["Live", "Beta", "Dalam Pengembangan", "Coming Soon", "Nonaktif"];

export default function ProductFormPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [linkProduk, setLinkProduk] = useState("");
  const [jenisProduk, setJenisProduk] = useState("");
  const [statusProduk, setStatusProduk] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Section B
  const [showInHelpCenter, setShowInHelpCenter] = useState(false);
  const [helpCenterSlug, setHelpCenterSlug] = useState("");

  const autoSlug = useMemo(() => slugify(name), [name]);

  const handleLogoSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }
    if (file.size > 1024 * 1024) {
      toast.error("Ukuran file maksimal 1MB");
      return;
    }
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setLogoPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleLogoSelect(file);
  };

  const handleSave = () => {
    if (!name.trim()) { toast.error("Nama Produk wajib diisi"); return; }
    if (!logoFile && !logoPreview) { toast.error("Logo Produk wajib diunggah"); return; }
    if (!jenisProduk) { toast.error("Jenis Produk wajib dipilih"); return; }
    if (!statusProduk) { toast.error("Status Produk wajib dipilih"); return; }
    if (showInHelpCenter && !helpCenterSlug.trim()) {
      toast.error("Slug Pusat Bantuan wajib diisi jika ditampilkan di Pusat Bantuan");
      return;
    }
    toast.success("Produk berhasil disimpan");
    navigate("/products");
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/products")}
            className="rounded-[10px] text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-primary/70" />
            <h1 className="text-lg font-semibold text-foreground/90">Tambah Produk</h1>
          </div>
        </div>
        <Button
          size="sm"
          onClick={handleSave}
          className="rounded-[10px] text-xs gap-1.5 bg-primary hover:bg-primary/90"
        >
          <Save className="h-3.5 w-3.5" />
          Simpan
        </Button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* LEFT */}
        <div className="space-y-5">
          {/* SECTION A */}
          <SectionCard title="Informasi Produk" subtitle="Data umum untuk direktori produk" icon={Globe}>
            <Field label="Nama Produk" required>
              <Input
                placeholder="Masukkan nama produk..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-[10px] border-border/60 focus-visible:ring-primary/30 text-sm"
              />
            </Field>

            {/* Logo Upload */}
            <Field label="Logo Produk" required hint="PNG, SVG · Maks 1MB · Rekomendasi 128×128px">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLogoSelect(file);
                }}
              />
              {logoPreview ? (
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-[10px] border border-border/60 overflow-hidden bg-muted/20 flex items-center justify-center">
                    <img src={logoPreview} alt="Logo" className="h-full w-full object-contain p-1" />
                    <button
                      onClick={() => { setLogoPreview(null); setLogoFile(null); }}
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-[10px] text-xs gap-1.5"
                  >
                    <Upload className="h-3.5 w-3.5" /> Ganti Logo
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="flex items-center justify-center rounded-[10px] border-2 border-dashed border-border/60 hover:border-primary/30 transition-colors p-8 cursor-pointer bg-muted/10"
                >
                  <div className="text-center space-y-1.5">
                    <Image className="h-7 w-7 mx-auto text-muted-foreground/50" />
                    <p className="text-xs text-muted-foreground">Klik atau seret logo ke sini</p>
                  </div>
                </div>
              )}
            </Field>

            <Field label="Deskripsi Singkat" hint="Deskripsi untuk tampilan direktori produk">
              <Textarea
                placeholder="Tulis deskripsi produk..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="rounded-[10px] border-border/60 focus-visible:ring-primary/30 text-sm resize-none"
              />
            </Field>

            <Field label="Link Produk" hint="URL publik atau halaman produk">
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
                <Input
                  placeholder="https://produk.example.com"
                  value={linkProduk}
                  onChange={(e) => setLinkProduk(e.target.value)}
                  className="pl-9 rounded-[10px] border-border/60 focus-visible:ring-primary/30 text-sm"
                />
              </div>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Jenis Produk" required>
                <Select value={jenisProduk} onValueChange={setJenisProduk}>
                  <SelectTrigger className="rounded-[10px] border-border/60 text-sm">
                    <SelectValue placeholder="Pilih jenis..." />
                  </SelectTrigger>
                  <SelectContent>
                    {JENIS_PRODUK.map((j) => (
                      <SelectItem key={j} value={j}>{j}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Status Produk" required>
                <Select value={statusProduk} onValueChange={setStatusProduk}>
                  <SelectTrigger className="rounded-[10px] border-border/60 text-sm">
                    <SelectValue placeholder="Pilih status..." />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_PRODUK.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </SectionCard>

          {/* SECTION B */}
          <SectionCard title="Pengaturan Pusat Bantuan" subtitle="Atur visibilitas produk di Help Center" icon={HelpCircle}>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground/80">Tampilkan di Pusat Bantuan</p>
                <p className="text-[11px] text-muted-foreground">Produk akan muncul sebagai opsi di halaman bantuan</p>
              </div>
              <Switch checked={showInHelpCenter} onCheckedChange={setShowInHelpCenter} />
            </div>

            <Field
              label="Slug Pusat Bantuan"
              required={showInHelpCenter}
              hint={showInHelpCenter ? "Slug unik untuk URL Pusat Bantuan produk ini" : "Aktifkan toggle di atas untuk mengisi slug"}
            >
              <div className="flex items-center gap-2 rounded-[10px] border border-border/60 bg-background px-3 py-2 text-sm">
                <Link2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                <input
                  placeholder={showInHelpCenter ? "contoh: digdaya-persuratan" : "—"}
                  value={helpCenterSlug}
                  onChange={(e) => setHelpCenterSlug(slugify(e.target.value))}
                  disabled={!showInHelpCenter}
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/50 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              {showInHelpCenter && helpCenterSlug && (
                <p className="text-[11px] text-primary/70 mt-1">
                  /bantuan/<span className="font-medium">{helpCenterSlug}</span>
                </p>
              )}
            </Field>
          </SectionCard>
        </div>

        {/* RIGHT — Summary */}
        <div className="space-y-5 lg:sticky lg:top-6 self-start">
          <SectionCard title="Ringkasan" icon={Eye}>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nama</span>
                <span className="text-foreground/80 font-medium truncate max-w-[160px]">{name || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jenis</span>
                <span className="text-foreground/80 font-medium">{jenisProduk || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="text-foreground/80 font-medium">{statusProduk || "—"}</span>
              </div>

              <div className="border-t border-border/40 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pusat Bantuan</span>
                  <span className={`font-medium ${showInHelpCenter ? "text-[hsl(var(--status-success-fg))]" : "text-muted-foreground"}`}>
                    {showInHelpCenter ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                {showInHelpCenter && helpCenterSlug && (
                  <div className="flex justify-between mt-2">
                    <span className="text-muted-foreground">Slug</span>
                    <span className="text-foreground/80 font-medium truncate max-w-[160px]">{helpCenterSlug}</span>
                  </div>
                )}
              </div>

              {logoPreview && (
                <div className="border-t border-border/40 pt-3 mt-3">
                  <span className="text-muted-foreground block mb-2">Logo</span>
                  <div className="h-12 w-12 rounded-[8px] border border-border/60 overflow-hidden bg-muted/20">
                    <img src={logoPreview} alt="Logo" className="h-full w-full object-contain p-1" />
                  </div>
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
