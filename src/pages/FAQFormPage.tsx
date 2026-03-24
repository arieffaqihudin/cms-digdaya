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
import { products, categories } from "@/lib/mock-data";
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

const faqCategories = ["Umum", "Akun & Login", "Pembayaran", "Teknis", "Fitur", "Kebijakan"];

export default function FAQFormPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [product, setProduct] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const slug = useMemo(() => slugify(title), [title]);

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Title wajib diisi");
      return;
    }
    toast.success("FAQ berhasil disimpan");
    navigate("/faq");
  };

  const handlePublish = () => {
    if (!title.trim()) {
      toast.error("Title wajib diisi");
      return;
    }
    toast.success("FAQ berhasil dipublikasikan");
    navigate("/faq");
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/faq")}
            className="rounded-[10px] text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-primary/70" />
            <h1 className="text-lg font-semibold text-foreground/90">Tambah FAQ</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            className="rounded-[10px] text-xs gap-1.5"
          >
            <Save className="h-3.5 w-3.5" />
            Simpan Draft
          </Button>
          <Button
            size="sm"
            onClick={handlePublish}
            className="rounded-[10px] text-xs gap-1.5 bg-primary hover:bg-primary/90"
          >
            Publikasikan
          </Button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* LEFT */}
        <div className="space-y-5">
          <SectionCard>
            <Field label="Title">
              <Input
                placeholder="Masukkan pertanyaan FAQ..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-[10px] border-border/60 focus-visible:ring-primary/30 text-sm"
              />
            </Field>

            <Field label="Slug" hint="Otomatis dibuat dari Title">
              <div className="flex items-center gap-2 rounded-[10px] border border-border/60 bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                <Link2 className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{slug || "slug-otomatis"}</span>
              </div>
            </Field>
          </SectionCard>

          <SectionCard title="Konten Jawaban">
            <Field label="Content" hint="Tulis jawaban lengkap untuk pertanyaan ini">
              <Textarea
                placeholder="Tulis jawaban FAQ di sini..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="rounded-[10px] border-border/60 focus-visible:ring-primary/30 text-sm resize-none leading-relaxed"
              />
            </Field>
          </SectionCard>
        </div>

        {/* RIGHT */}
        <div className="space-y-5 lg:sticky lg:top-6 self-start">
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
              <Eye className="h-3.5 w-3.5" />
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

          <SectionCard title="Klasifikasi">
            <Field label="Produk">
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

            <Field label="Kategori FAQ">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="rounded-[10px] border-border/60 focus:ring-primary/30 text-sm">
                  <SelectValue placeholder="Pilih kategori..." />
                </SelectTrigger>
                <SelectContent className="rounded-[10px]">
                  {faqCategories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </SectionCard>

          <SectionCard title="Ringkasan">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Title</span>
                <span className="text-foreground/80 font-medium truncate max-w-[160px]">{title || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Produk</span>
                <span className="text-foreground/80 font-medium truncate max-w-[160px]">{product || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kategori</span>
                <span className="text-foreground/80 font-medium truncate max-w-[160px]">{category || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-medium ${isPublished ? "text-success" : "text-muted-foreground"}`}>
                  {isPublished ? "Published" : "Draft"}
                </span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
