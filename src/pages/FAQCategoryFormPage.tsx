import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Link2, Eye, FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { products } from "@/lib/mock-data";
import { toast } from "sonner";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function SectionCard({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-[12px] border border-border/60 p-6 space-y-5">
      {title && <h3 className="text-sm font-semibold text-foreground/80">{title}</h3>}
      {children}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground/70">{hint}</p>}
    </div>
  );
}

export default function FAQCategoryFormPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [product, setProduct] = useState("");
  const [isActive, setIsActive] = useState(true);

  const slug = useMemo(() => slugify(name), [name]);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Nama Kategori wajib diisi");
      return;
    }
    toast.success("Kategori FAQ berhasil disimpan");
    navigate("/categories");
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/categories")}
            className="rounded-[10px] text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <FolderTree className="h-4 w-4 text-primary/70" />
            <h1 className="text-lg font-semibold text-foreground/90">Tambah Kategori FAQ</h1>
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
          <SectionCard>
            <Field label="Nama Kategori">
              <Input
                placeholder="Masukkan nama kategori..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-[10px] border-border/60 focus-visible:ring-primary/30 text-sm"
              />
            </Field>

            <Field label="Slug" hint="Otomatis dibuat dari Nama Kategori">
              <div className="flex items-center gap-2 rounded-[10px] border border-border/60 bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                <Link2 className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{slug || "slug-otomatis"}</span>
              </div>
            </Field>

            <Field label="Produk" hint="Kategori ini terkait dengan produk tertentu">
              <Select value={product} onValueChange={setProduct}>
                <SelectTrigger className="rounded-[10px] border-border/60 focus:ring-primary/30 text-sm">
                  <SelectValue placeholder="Pilih produk..." />
                </SelectTrigger>
                <SelectContent className="rounded-[10px]">
                  {products.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </SectionCard>
        </div>

        {/* RIGHT */}
        <div className="space-y-5 lg:sticky lg:top-6 self-start">
          <SectionCard title="Status">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground/80">Aktif</p>
                <p className="text-[11px] text-muted-foreground">Kategori tampil di daftar pilihan</p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
            <div className="flex items-center gap-2 rounded-[10px] border border-border/60 bg-muted/20 px-3 py-2.5 text-xs text-muted-foreground">
              <Eye className="h-3.5 w-3.5" />
              <span>Status: {isActive ? "Aktif" : "Nonaktif"}</span>
            </div>
          </SectionCard>

          <SectionCard title="Ringkasan">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nama</span>
                <span className="text-foreground/80 font-medium truncate max-w-[160px]">{name || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Slug</span>
                <span className="text-foreground/80 font-medium truncate max-w-[160px]">{slug || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Produk</span>
                <span className="text-foreground/80 font-medium truncate max-w-[160px]">{product || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-medium ${isActive ? "text-success" : "text-muted-foreground"}`}>
                  {isActive ? "Aktif" : "Nonaktif"}
                </span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
