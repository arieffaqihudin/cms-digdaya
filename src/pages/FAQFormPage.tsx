import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Link2, Eye, HelpCircle, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useScreenSize } from "@/components/AppLayout";

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
    <div className="bg-card rounded-[12px] border border-border/60 p-5 md:p-6 space-y-5">
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

// Master data produk & kategori per produk
const masterProducts = [
  "Digdaya Persuratan",
  "Digdaya Pesantren",
  "Siskader NU",
  "Digdaya Kepengurusan",
];

const categoriesByProduct: Record<string, string[]> = {
  "Digdaya Persuratan": ["Pendaftaran & Akun", "Pembayaran", "Fitur Utama", "Teknis & Troubleshoot"],
  "Digdaya Pesantren": ["Manajemen Santri", "Kurikulum", "Laporan Keuangan"],
  "Siskader NU": ["Pendataan Kader", "Verifikasi Data"],
  "Digdaya Kepengurusan": ["Surat & Disposisi", "Manajemen Pengurus", "Agenda & Rapat"],
};

export default function FAQFormPage() {
  const navigate = useNavigate();
  const screenSize = useScreenSize();

  const [title, setTitle] = useState("");
  const [product, setProduct] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const slug = useMemo(() => slugify(title), [title]);
  const availableCategories = product ? (categoriesByProduct[product] || []) : [];

  const handleProductChange = (value: string) => {
    setProduct(value);
    setCategory(""); // reset category when product changes
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Title wajib diisi");
      return;
    }
    toast.success("FAQ berhasil disimpan sebagai draft");
    navigate("/faq");
  };

  const handlePublish = () => {
    if (!title.trim()) {
      toast.error("Title wajib diisi");
      return;
    }
    if (!product) {
      toast.error("Pilih produk terlebih dahulu");
      return;
    }
    toast.success("FAQ berhasil dipublikasikan");
    navigate("/faq");
  };

  const metadataPanel = (
    <div className="space-y-5 lg:sticky lg:top-6 self-start">
      {/* Publikasi */}
      <SectionCard title="Publikasi">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground/80">Publikasikan</p>
            <p className="text-[11px] text-muted-foreground">FAQ tampil di halaman publik</p>
          </div>
          <Switch checked={isPublished} onCheckedChange={setIsPublished} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground/80">Pin to Top</p>
            <p className="text-[11px] text-muted-foreground">Tampilkan di urutan teratas</p>
          </div>
          <Switch checked={isPinned} onCheckedChange={setIsPinned} />
        </div>

        <div className="flex items-center gap-2 rounded-[10px] border border-border/60 bg-muted/20 px-3 py-2.5 text-xs text-muted-foreground">
          <Eye className="h-3.5 w-3.5 shrink-0" />
          <span>Status: {isPublished ? "Dipublikasikan" : "Draft"}</span>
          {isPinned && (
            <>
              <span className="text-border">·</span>
              <Pin className="h-3 w-3" />
              <span>Pinned</span>
            </>
          )}
        </div>
      </SectionCard>

      {/* Klasifikasi */}
      <SectionCard title="Klasifikasi">
        <Field label="Produk">
          <Select value={product} onValueChange={handleProductChange}>
            <SelectTrigger className="rounded-[10px] border-border/60 focus:ring-primary/30 text-sm">
              <SelectValue placeholder="Pilih produk..." />
            </SelectTrigger>
            <SelectContent className="rounded-[10px]">
              {masterProducts.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Kategori FAQ" hint={!product ? "Pilih produk terlebih dahulu" : undefined}>
          <Select value={category} onValueChange={setCategory} disabled={!product}>
            <SelectTrigger className="rounded-[10px] border-border/60 focus:ring-primary/30 text-sm disabled:opacity-50">
              <SelectValue placeholder={product ? "Pilih kategori..." : "Pilih produk terlebih dahulu"} />
            </SelectTrigger>
            <SelectContent className="rounded-[10px]">
              {availableCategories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </SectionCard>

      {/* Ringkasan */}
      <SectionCard title="Ringkasan">
        <div className="space-y-3 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Title</span>
            <span className="text-foreground/80 font-medium truncate max-w-[160px] text-right">{title || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Slug</span>
            <span className="text-foreground/80 font-medium font-mono truncate max-w-[160px] text-right">{slug || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Produk</span>
            <span className="text-foreground/80 font-medium truncate max-w-[160px] text-right">{product || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Kategori</span>
            <span className="text-foreground/80 font-medium truncate max-w-[160px] text-right">{category || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className={`font-medium ${isPublished ? "text-[hsl(var(--status-success-fg))]" : "text-muted-foreground"}`}>
              {isPublished ? "Published" : "Draft"}
            </span>
          </div>
        </div>
      </SectionCard>
    </div>
  );

  return (
    <div className="-m-4 md:-m-5 lg:-m-7">
      {/* Editor Page Header */}
      <div className="sticky top-0 z-20 border-b border-border/60 bg-card px-4 md:px-6 py-3">
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/faq")}
            className="rounded-[10px] text-muted-foreground hover:text-foreground h-8 w-8 shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/[0.06] px-2.5 py-[3px] text-[11px] font-medium text-primary shrink-0">
              <HelpCircle className="h-3 w-3" strokeWidth={1.8} />
              <span className="hidden sm:inline">FAQ</span>
            </span>
            <h1 className="text-sm md:text-[15px] font-semibold text-foreground truncate">FAQ Baru</h1>
          </div>
          <div className="flex items-center gap-2 shrink-0 max-sm:w-full max-sm:pt-2 max-sm:border-t max-sm:border-border/40">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className={`rounded-[10px] text-xs gap-1.5 h-8 ${screenSize === "mobile" ? "flex-1" : ""}`}
            >
              <Save className="h-3.5 w-3.5" />
              Simpan Draft
            </Button>
            <Button
              size="sm"
              onClick={handlePublish}
              className={`rounded-[10px] text-xs gap-1.5 h-8 bg-primary hover:bg-primary/90 ${screenSize === "mobile" ? "flex-1" : ""}`}
            >
              Publikasikan
            </Button>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="p-4 md:p-6 lg:p-7 pt-6 md:pt-7 lg:pt-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 md:gap-6">
        {/* LEFT — Content */}
        <div className="space-y-5">
          <SectionCard>
            <Field label="Title">
              <Input
                placeholder="Masukkan pertanyaan FAQ..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-[10px] border-border/60 focus-visible:ring-primary/30 text-sm h-11"
              />
            </Field>

            <Field label="Slug" hint="Otomatis dibuat dari Title">
              <div className="flex items-center gap-2 rounded-[10px] border border-border/60 bg-muted/30 px-3 py-2.5 text-sm text-muted-foreground">
                <Link2 className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate font-mono text-[12px]">{slug || "slug-otomatis"}</span>
              </div>
            </Field>
          </SectionCard>

          <SectionCard title="Konten Jawaban">
            <Field label="Content" hint="Tulis jawaban lengkap untuk pertanyaan ini">
              <Textarea
                placeholder="Tulis jawaban FAQ di sini..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="rounded-[10px] border-border/60 focus-visible:ring-primary/30 text-sm resize-none leading-relaxed"
              />
            </Field>
          </SectionCard>
        </div>

        {/* RIGHT — Metadata */}
        {metadataPanel}
      </div>
    </div>
  </div>
  );
}
