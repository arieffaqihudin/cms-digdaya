import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Upload, FileText, Video, Image, Link2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

export default function PanduanFormPage() {
  const navigate = useNavigate();

  const [namaTopic, setNamaTopic] = useState("");
  const [product, setProduct] = useState("");
  const [contentType, setContentType] = useState<"video" | "dokumen">("video");
  const [videoUrl, setVideoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const slug = useMemo(() => slugify(namaTopic), [namaTopic]);

  const handleSave = () => {
    if (!namaTopic.trim()) {
      toast.error("Nama Topik wajib diisi");
      return;
    }
    toast.success("Panduan berhasil disimpan");
    navigate("/panduan");
  };

  const handlePublish = () => {
    if (!namaTopic.trim()) {
      toast.error("Nama Topik wajib diisi");
      return;
    }
    toast.success("Panduan berhasil dipublikasikan");
    navigate("/panduan");
  };

  return (
    <div className="-m-4 md:-m-5 lg:-m-7">
      {/* Editor Page Header */}
      <div className="sticky top-0 z-20 border-b border-border/60 bg-card px-4 md:px-6 py-3">
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/panduan")}
            className="rounded-[10px] text-muted-foreground hover:text-foreground h-8 w-8 shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/[0.06] px-2.5 py-[3px] text-[11px] font-medium text-primary shrink-0">
              <FileText className="h-3 w-3" strokeWidth={1.8} />
              <span className="hidden sm:inline">Panduan</span>
            </span>
            <h1 className="text-sm md:text-[15px] font-semibold text-foreground truncate">Buat Panduan Baru</h1>
          </div>
          <div className="flex items-center gap-2 shrink-0 max-sm:w-full max-sm:pt-2 max-sm:border-t max-sm:border-border/40">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="rounded-[10px] text-xs gap-1.5 h-8 max-sm:flex-1"
            >
              <Save className="h-3.5 w-3.5" />
              Simpan Draft
            </Button>
            <Button
              size="sm"
              onClick={handlePublish}
              className="rounded-[10px] text-xs gap-1.5 h-8 bg-primary hover:bg-primary/90 max-sm:flex-1"
            >
              Publikasikan
            </Button>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="p-4 md:p-6 lg:p-7 pt-6 md:pt-7 lg:pt-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* LEFT – Main Fields */}
        <div className="space-y-5">
          {/* Nama Topik & Slug */}
          <SectionCard>
            <Field label="Nama Topik">
              <Input
                placeholder="Masukkan nama topik panduan..."
                value={namaTopic}
                onChange={(e) => setNamaTopic(e.target.value)}
                className="rounded-[10px] border-border/60 focus-visible:ring-primary/30 text-sm"
              />
            </Field>

            <Field label="Slug" hint="Otomatis dibuat dari Nama Topik">
              <div className="flex items-center gap-2 rounded-[10px] border border-border/60 bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                <Link2 className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{slug || "slug-otomatis"}</span>
              </div>
            </Field>
          </SectionCard>

          {/* Tipe Konten */}
          <SectionCard title="Tipe Konten">
            <RadioGroup
              value={contentType}
              onValueChange={(v) => setContentType(v as "video" | "dokumen")}
              className="flex gap-4"
            >
              <label className={`flex items-center gap-3 rounded-[10px] border px-4 py-3 cursor-pointer transition-colors flex-1 ${contentType === "video" ? "border-primary/50 bg-primary/5" : "border-border/60 hover:border-border"}`}>
                <RadioGroupItem value="video" id="type-video" />
                <Video className="h-4 w-4 text-primary/70" />
                <span className="text-sm font-medium text-foreground/80">Video</span>
              </label>
              <label className={`flex items-center gap-3 rounded-[10px] border px-4 py-3 cursor-pointer transition-colors flex-1 ${contentType === "dokumen" ? "border-primary/50 bg-primary/5" : "border-border/60 hover:border-border"}`}>
                <RadioGroupItem value="dokumen" id="type-dokumen" />
                <FileText className="h-4 w-4 text-primary/70" />
                <span className="text-sm font-medium text-foreground/80">Dokumen</span>
              </label>
            </RadioGroup>

            {/* Dynamic Fields based on content type */}
            {contentType === "video" ? (
              <div className="space-y-5 pt-2">
                <Field label="URL Video" hint="Masukkan link YouTube atau platform lainnya">
                  <Input
                    placeholder="https://youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="rounded-[10px] border-border/60 focus-visible:ring-primary/30 text-sm"
                  />
                </Field>

                {videoUrl && videoUrl.includes("youtube") && (
                  <div className="rounded-[10px] overflow-hidden border border-border/60 aspect-video bg-muted/20">
                    <iframe
                      src={`https://www.youtube.com/embed/${new URL(videoUrl).searchParams.get("v") || ""}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                      allowFullScreen
                      title="Video preview"
                    />
                  </div>
                )}

                <Field label="Thumbnail Video">
                  <div className="flex items-center justify-center rounded-[10px] border-2 border-dashed border-border/60 hover:border-primary/30 transition-colors p-8 cursor-pointer bg-muted/10">
                    <div className="text-center space-y-2">
                      <Image className="h-8 w-8 mx-auto text-muted-foreground/50" />
                      <p className="text-xs text-muted-foreground">Klik atau seret gambar ke sini</p>
                      <p className="text-[11px] text-muted-foreground/60">PNG, JPG, WEBP · Maks 2MB</p>
                    </div>
                  </div>
                </Field>
              </div>
            ) : (
              <div className="space-y-5 pt-2">
                <Field label="Upload File Dokumen">
                  <div className="flex items-center justify-center rounded-[10px] border-2 border-dashed border-border/60 hover:border-primary/30 transition-colors p-8 cursor-pointer bg-muted/10">
                    <div className="text-center space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground/50" />
                      <p className="text-xs text-muted-foreground">Klik atau seret file ke sini</p>
                      <p className="text-[11px] text-muted-foreground/60">PDF, DOCX, PPTX · Maks 10MB</p>
                    </div>
                  </div>
                </Field>

                <Field label="Thumbnail Dokumen">
                  <div className="flex items-center justify-center rounded-[10px] border-2 border-dashed border-border/60 hover:border-primary/30 transition-colors p-8 cursor-pointer bg-muted/10">
                    <div className="text-center space-y-2">
                      <Image className="h-8 w-8 mx-auto text-muted-foreground/50" />
                      <p className="text-xs text-muted-foreground">Klik atau seret gambar ke sini</p>
                      <p className="text-[11px] text-muted-foreground/60">PNG, JPG, WEBP · Maks 2MB</p>
                    </div>
                  </div>
                </Field>
              </div>
            )}
          </SectionCard>

          {/* Deskripsi */}
          <SectionCard>
            <Field label="Deskripsi Singkat" hint="Ringkasan singkat panduan ini">
              <Textarea
                placeholder="Tulis deskripsi singkat..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="rounded-[10px] border-border/60 focus-visible:ring-primary/30 text-sm resize-none"
              />
            </Field>
          </SectionCard>
        </div>

        {/* RIGHT – Metadata & Publish */}
        <div className="space-y-5 lg:sticky lg:top-4 self-start">
          {/* Status & Publish */}
          <SectionCard title="Publikasi">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground/80">Publikasikan</p>
                <p className="text-[11px] text-muted-foreground">Konten akan tampil di publik</p>
              </div>
              <Switch checked={isPublished} onCheckedChange={setIsPublished} />
            </div>

            <div className="flex items-center gap-2 rounded-[10px] border border-border/60 bg-muted/20 px-3 py-2.5 text-xs text-muted-foreground">
              <Eye className="h-3.5 w-3.5" />
              <span>Status: {isPublished ? "Dipublikasikan" : "Draft"}</span>
            </div>
          </SectionCard>

          {/* Produk */}
          <SectionCard title="Produk Terkait">
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
          </SectionCard>

          {/* Preview Summary */}
          <SectionCard title="Ringkasan">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Topik</span>
                <span className="text-foreground/80 font-medium truncate max-w-[180px]">{namaTopic || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Slug</span>
                <span className="text-foreground/80 font-medium truncate max-w-[180px]">{slug || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipe</span>
                <span className="text-foreground/80 font-medium capitalize">{contentType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Produk</span>
                <span className="text-foreground/80 font-medium truncate max-w-[180px]">{product || "—"}</span>
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
  </div>
  );
}
