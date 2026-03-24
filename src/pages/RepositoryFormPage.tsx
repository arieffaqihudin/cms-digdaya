import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Send, Upload, X, ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useScreenSize } from "@/components/AppLayout";

const products = ["Digdaya Persuratan", "Digdaya Pesantren", "Siskader NU", "Digdaya Kepengurusan"];
const categories = ["Panduan", "Template", "Laporan", "Media", "Video"];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function RepositoryFormPage() {
  const navigate = useNavigate();
  const screenSize = useScreenSize();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [product, setProduct] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(slugify(val));
  };

  const actionButtons = (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" className="h-9 rounded-[10px] text-[13px] border-border gap-1.5">
        <Save className="h-3.5 w-3.5" strokeWidth={1.6} />
        <span className="hidden sm:inline">Simpan Draft</span>
        <span className="sm:hidden">Draft</span>
      </Button>
      <Button size="sm" className="h-9 rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
        <Send className="h-3.5 w-3.5" strokeWidth={1.6} />
        <span className="hidden sm:inline">Publikasikan</span>
        <span className="sm:hidden">Publish</span>
      </Button>
    </div>
  );

  return (
    <div className="space-y-0">
      {/* Editor Header */}
      <div className="bg-surface border-b border-border -mx-4 md:-mx-5 lg:-mx-7 -mt-4 md:-mt-5 lg:-mt-7 px-4 md:px-5 lg:px-7 py-3 md:py-4 sticky top-0 z-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate("/repository")}
              className="flex h-8 w-8 items-center justify-center rounded-[8px] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.6} />
            </button>
            <span className="inline-flex items-center rounded-full bg-primary/[0.07] px-2.5 py-[3px] text-[11px] font-medium text-primary shrink-0">
              Repository
            </span>
            <h1 className="text-[15px] font-semibold text-foreground truncate">
              Upload File Baru
            </h1>
          </div>
          <div className="hidden sm:flex">{actionButtons}</div>
        </div>
        {screenSize === "mobile" && <div className="mt-3">{actionButtons}</div>}
      </div>

      {/* Form Content */}
      <div className="pt-6 md:pt-8">
        <div className={cn("grid gap-5 md:gap-6", screenSize !== "mobile" ? "grid-cols-[1fr_340px]" : "grid-cols-1")}>
          {/* Left - Main content */}
          <div className="space-y-5">
            {/* File Name */}
            <div className="rounded-[12px] border border-border bg-surface p-4 md:p-5 shadow-card space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.06em]">Nama File</Label>
                <Input
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Masukkan nama file..."
                  className="h-11 rounded-[10px] text-[14px] border-border focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="rounded-[12px] border border-border bg-surface p-4 md:p-5 shadow-card space-y-4">
              <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.06em]">Upload File</Label>
              {file ? (
                <div className="flex items-center justify-between gap-3 rounded-[10px] border border-border bg-accent/30 p-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Upload className="h-4 w-4 text-primary shrink-0" strokeWidth={1.6} />
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-foreground truncate">{file.name}</p>
                      <p className="text-[11px] text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button onClick={() => setFile(null)} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                    <X className="h-3.5 w-3.5" strokeWidth={1.6} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 rounded-[10px] border-2 border-dashed border-border bg-background p-8 cursor-pointer hover:border-primary/40 hover:bg-accent/20 transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground/50" strokeWidth={1.4} />
                  <div className="text-center">
                    <p className="text-[13px] font-medium text-foreground">Klik untuk upload file</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">PDF, DOCX, XLSX, MP4, PNG, JPG (maks. 50MB)</p>
                  </div>
                  <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </label>
              )}
            </div>

            {/* Description */}
            <div className="rounded-[12px] border border-border bg-surface p-4 md:p-5 shadow-card space-y-4">
              <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.06em]">Deskripsi</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi singkat tentang file ini..."
                className="min-h-[120px] rounded-[10px] text-[13px] border-border focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
            </div>
          </div>

          {/* Right - Metadata */}
          <div className="space-y-5">
            <div className={cn("rounded-[12px] border border-border bg-surface p-4 md:p-5 shadow-card space-y-5", screenSize !== "mobile" && "sticky top-4")}>
              {/* Product */}
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.06em]">Produk</Label>
                <Select value={product} onValueChange={setProduct}>
                  <SelectTrigger className="w-full h-10 rounded-[10px] text-[13px] border-border">
                    <SelectValue placeholder="Pilih produk" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.06em]">Kategori</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full h-10 rounded-[10px] text-[13px] border-border">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.06em]">Slug</Label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="auto-generated-slug"
                  className="h-10 rounded-[10px] text-[12px] font-mono border-border bg-accent/30 focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              {/* Thumbnail */}
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.06em]">Thumbnail (Opsional)</Label>
                {thumbnail ? (
                  <div className="flex items-center justify-between gap-3 rounded-[10px] border border-border bg-accent/30 p-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <ImageIcon className="h-4 w-4 text-primary shrink-0" strokeWidth={1.6} />
                      <p className="text-[12px] text-foreground truncate">{thumbnail.name}</p>
                    </div>
                    <button onClick={() => setThumbnail(null)} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                      <X className="h-3.5 w-3.5" strokeWidth={1.6} />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 rounded-[10px] border border-dashed border-border bg-background p-4 cursor-pointer hover:border-primary/40 hover:bg-accent/20 transition-colors">
                    <ImageIcon className="h-4 w-4 text-muted-foreground/60" strokeWidth={1.6} />
                    <span className="text-[12px] text-muted-foreground">Upload thumbnail</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} />
                  </label>
                )}
              </div>

              {/* Publish toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <div>
                  <p className="text-[13px] font-medium text-foreground">Publikasikan</p>
                  <p className="text-[11px] text-muted-foreground">File akan langsung tersedia</p>
                </div>
                <Switch checked={isPublished} onCheckedChange={setIsPublished} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
