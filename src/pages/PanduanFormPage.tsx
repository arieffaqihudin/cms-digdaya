import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Upload, FileText, Video, Image, Link2, ChevronDown, ChevronUp,
  GripVertical, Trash2, Plus, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { products } from "@/lib/mock-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

/* ─── Upload Area ─── */
function UploadArea({ label }: { label?: string }) {
  return (
    <div className="space-y-1.5">
      {label && <Label className="text-[13px] font-medium text-foreground/80">{label}</Label>}
      <div className="flex items-center justify-center rounded-[10px] border-2 border-dashed border-border/50 hover:border-primary/30 transition-colors p-8 cursor-pointer bg-muted/5">
        <div className="text-center space-y-1.5">
          <Upload className="h-7 w-7 mx-auto text-muted-foreground/40" strokeWidth={1.5} />
          <p className="text-[13px] text-muted-foreground">
            Seret & Jatuhkan berkas Anda atau{" "}
            <span className="text-primary font-medium cursor-pointer hover:underline">Jelajahi</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Content Block Types ─── */
type ContentBlock = {
  id: string;
  type: "document" | "video";
  expanded: boolean;
};

let blockIdCounter = 0;
function genId() { return `block-${++blockIdCounter}-${Date.now()}`; }

export default function PanduanFormPage() {
  const navigate = useNavigate();

  const [namaTopic, setNamaTopic] = useState("");
  const [slugManual, setSlugManual] = useState("");
  const [product, setProduct] = useState("");
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [addMenuOpen, setAddMenuOpen] = useState(false);

  const slug = useMemo(() => slugManual || slugify(namaTopic), [namaTopic, slugManual]);

  const addBlock = (type: "document" | "video") => {
    setContentBlocks(prev => [...prev, { id: genId(), type, expanded: true }]);
    setAddMenuOpen(false);
  };

  const removeBlock = (id: string) => {
    setContentBlocks(prev => prev.filter(b => b.id !== id));
  };

  const toggleBlock = (id: string) => {
    setContentBlocks(prev => prev.map(b => b.id === id ? { ...b, expanded: !b.expanded } : b));
  };

  const moveBlock = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= contentBlocks.length) return;
    const arr = [...contentBlocks];
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    setContentBlocks(arr);
  };

  const getBlockNumber = (id: string, type: "document" | "video") => {
    return contentBlocks.filter(b => b.type === type).findIndex(b => b.id === id) + 1;
  };

  const handleCreate = () => {
    if (!namaTopic.trim()) { toast.error("Nama Topik wajib diisi"); return; }
    if (!product) { toast.error("Product wajib dipilih"); return; }
    toast.success("Panduan berhasil dibuat");
    navigate("/panduan");
  };

  return (
    <div className="space-y-8">
      {/* ═══ Breadcrumb & Title ═══ */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <Link to="/panduan" className="hover:text-foreground transition-colors">Panduan</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Buat</span>
        </div>
        <h1 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight">Buat Panduan</h1>
      </div>

      {/* ═══ Two Column Top ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 lg:gap-6">
        {/* LEFT — Informasi Utama */}
        <div className="bg-card rounded-[12px] border border-border/50 p-5 md:p-6 space-y-5">
          {/* Nama Topik */}
          <div className="space-y-1.5">
            <Label className="text-[13px] font-medium text-foreground/80">
              Nama Topik <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Masukan Nama Topik"
              value={namaTopic}
              onChange={(e) => setNamaTopic(e.target.value)}
              className="rounded-[10px] h-11 border-border/50 bg-background text-sm focus-visible:ring-primary/30"
            />
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <Label className="text-[13px] font-medium text-foreground/80">
              Slug <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="slug-otomatis"
              value={slug}
              onChange={(e) => setSlugManual(e.target.value)}
              className="rounded-[10px] h-11 border-border/50 bg-background text-sm font-mono text-muted-foreground focus-visible:ring-primary/30"
            />
            <p className="text-[11px] text-muted-foreground/60">Otomatis dibuat dari Nama Topik, bisa diedit manual</p>
          </div>
        </div>

        {/* RIGHT — Icon & Product */}
        <div className="bg-card rounded-[12px] border border-border/50 p-5 md:p-6 space-y-5">
          {/* Icon */}
          <UploadArea label="Icon" />

          {/* Product */}
          <div className="space-y-1.5">
            <Label className="text-[13px] font-medium text-foreground/80">
              Product <span className="text-destructive">*</span>
            </Label>
            <Select value={product} onValueChange={setProduct}>
              <SelectTrigger className="rounded-[10px] h-11 border-border/50 bg-background text-sm focus:ring-primary/30">
                <SelectValue placeholder="Pilih salah satu opsi" />
              </SelectTrigger>
              <SelectContent className="rounded-[10px]">
                {products.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ═══ Content Section ═══ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] md:text-base font-semibold text-foreground">Konten</h2>
        </div>

        {/* Content Blocks */}
        {contentBlocks.map((block, idx) => {
          const num = getBlockNumber(block.id, block.type);
          const label = block.type === "document" ? `Document ${num}` : `Video ${num}`;

          return (
            <div key={block.id} className="bg-card rounded-[12px] border border-border/50 overflow-hidden">
              {/* Block Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-muted/20">
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => moveBlock(idx, -1)}
                    disabled={idx === 0}
                    className="p-1 text-muted-foreground/50 hover:text-muted-foreground disabled:opacity-30 transition-colors"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => moveBlock(idx, 1)}
                    disabled={idx === contentBlocks.length - 1}
                    className="p-1 text-muted-foreground/50 hover:text-muted-foreground disabled:opacity-30 transition-colors"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <GripVertical className="h-4 w-4 text-muted-foreground/30" />
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {block.type === "document" ? (
                    <FileText className="h-4 w-4 text-primary/60 shrink-0" strokeWidth={1.6} />
                  ) : (
                    <Video className="h-4 w-4 text-primary/60 shrink-0" strokeWidth={1.6} />
                  )}
                  <span className="text-[13px] font-semibold text-foreground/80">{label}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => removeBlock(block.id)}
                    className="p-1.5 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.6} />
                  </button>
                  <button
                    onClick={() => toggleBlock(block.id)}
                    className="p-1.5 text-muted-foreground/50 hover:text-foreground hover:bg-accent rounded-md transition-colors"
                    title={block.expanded ? "Collapse" : "Expand"}
                  >
                    {block.expanded ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Block Body */}
              {block.expanded && (
                <div className="p-5 md:p-6">
                  {block.type === "document" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <UploadArea label="File PDF" />
                      <UploadArea label="Thumbnail" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="text-[13px] font-medium text-foreground/80">URL Video</Label>
                        <Input
                          placeholder="Masukkan URL video"
                          className="rounded-[10px] h-11 border-border/50 bg-background text-sm focus-visible:ring-primary/30"
                        />
                      </div>
                      <UploadArea label="Thumbnail" />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Add Content Button */}
        <Popover open={addMenuOpen} onOpenChange={setAddMenuOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="rounded-[10px] h-10 border-dashed border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/[0.03] gap-2 text-[13px]"
            >
              <Plus className="h-4 w-4" strokeWidth={1.6} />
              Tambah Konten
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-44 p-1.5 rounded-[10px]">
            <button
              onClick={() => addBlock("video")}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] text-foreground/80 hover:bg-accent rounded-[8px] transition-colors"
            >
              <Video className="h-4 w-4 text-primary/60" strokeWidth={1.6} />
              Video
            </button>
            <button
              onClick={() => addBlock("document")}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] text-foreground/80 hover:bg-accent rounded-[8px] transition-colors"
            >
              <FileText className="h-4 w-4 text-primary/60" strokeWidth={1.6} />
              Document
            </button>
          </PopoverContent>
        </Popover>
      </div>

      {/* ═══ Action Buttons ═══ */}
      <div className="flex items-center gap-3 pt-2 pb-4">
        <Button
          onClick={handleCreate}
          className="rounded-[10px] h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90 text-[13px] font-medium"
        >
          Buat
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/panduan")}
          className="rounded-[10px] h-10 px-6 border-border/50 text-muted-foreground hover:text-foreground text-[13px] font-medium"
        >
          Batal
        </Button>
      </div>
    </div>
  );
}
