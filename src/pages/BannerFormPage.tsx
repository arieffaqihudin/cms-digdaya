import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X, ImageIcon, Calendar, Eye, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useScreenSize } from "@/components/AppLayout";

const placements = ["Home", "Produk", "Promo", "Event", "Onboarding"];

export default function BannerFormPage() {
  const navigate = useNavigate();
  const screenSize = useScreenSize();
  const [title, setTitle] = useState("");
  const [placement, setPlacement] = useState("");
  const [targetLink, setTargetLink] = useState("");
  const [order, setOrder] = useState("1");
  const [isActive, setIsActive] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (file: File | null) => {
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Editor Header — normal flow */}
      <div className="rounded-[12px] border border-border bg-card p-4 md:px-6 md:py-4 shadow-card">
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <button onClick={() => navigate("/banner")} className="flex h-8 w-8 items-center justify-center rounded-[10px] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.6} />
          </button>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/[0.06] px-2.5 py-[3px] text-[11px] font-medium text-primary shrink-0">
              <ImageIcon className="h-3 w-3" strokeWidth={1.8} />
              <span className="hidden sm:inline">Banner</span>
            </span>
            <h1 className="text-sm md:text-[15px] font-semibold text-foreground truncate">Buat Banner Baru</h1>
          </div>
          <div className="flex items-center gap-2 shrink-0 max-sm:w-full max-sm:pt-2 max-sm:border-t max-sm:border-border/40">
            <Button variant="ghost" size="sm" className="h-8 rounded-[10px] text-xs text-muted-foreground hover:text-foreground hover:bg-accent gap-1.5 hidden sm:flex">
              <Eye className="h-3.5 w-3.5" strokeWidth={1.6} /> Preview
            </Button>
            <Button variant="outline" size="sm" className={cn("h-8 rounded-[10px] text-xs border-border gap-1.5", screenSize === "mobile" && "flex-1")}>
              <Save className="h-3.5 w-3.5" strokeWidth={1.6} /> Simpan Draft
            </Button>
            <Button size="sm" className={cn("h-8 rounded-[10px] text-xs bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5", screenSize === "mobile" && "flex-1")}>
              <CheckCircle className="h-3.5 w-3.5" strokeWidth={1.6} /> Publikasikan
            </Button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 md:gap-6">
        {/* Left */}
        <div className="space-y-5">
          <div className="rounded-[12px] border border-border bg-surface p-4 md:p-5 shadow-card space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.06em]">Judul Banner</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Masukkan judul banner..." className="h-11 rounded-[10px] text-[14px] border-border focus-visible:ring-1 focus-visible:ring-ring" />
            </div>
          </div>

          <div className="rounded-[12px] border border-border bg-surface p-4 md:p-5 shadow-card space-y-4">
            <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.06em]">Upload Gambar Banner</Label>
            {imagePreview ? (
              <div className="space-y-3">
                <div className="relative rounded-[10px] overflow-hidden border border-border">
                  <img src={imagePreview} alt="Banner preview" className="w-full aspect-[3/1] object-cover" />
                  <button onClick={() => handleImageChange(null)} className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-foreground/60 text-background hover:bg-foreground/80 transition-colors">
                    <X className="h-3.5 w-3.5" strokeWidth={2} />
                  </button>
                </div>
                {image && <p className="text-[11px] text-muted-foreground">{image.name} · {(image.size / 1024 / 1024).toFixed(2)} MB</p>}
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-3 rounded-[10px] border-2 border-dashed border-border bg-background p-10 cursor-pointer hover:border-primary/40 hover:bg-accent/20 transition-colors">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent">
                  <ImageIcon className="h-6 w-6 text-muted-foreground/60" strokeWidth={1.4} />
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-medium text-foreground">Klik untuk upload gambar</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">PNG, JPG, WebP — Rasio 3:1 disarankan</p>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e.target.files?.[0] || null)} />
              </label>
            )}
          </div>

          <div className="rounded-[12px] border border-border bg-surface p-4 md:p-5 shadow-card space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.06em]">Target Link</Label>
              <Input value={targetLink} onChange={(e) => setTargetLink(e.target.value)} placeholder="https://... atau /path/halaman" className="h-10 rounded-[10px] text-[13px] font-mono border-border focus-visible:ring-1 focus-visible:ring-ring" />
              <p className="text-[11px] text-muted-foreground">URL tujuan saat banner diklik</p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-5 lg:sticky lg:top-4 self-start">
          <div className="rounded-[12px] border border-border bg-surface p-4 md:p-5 shadow-card space-y-5">
            <div className="space-y-1.5">
              <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.06em]">Placement</Label>
              <Select value={placement} onValueChange={setPlacement}>
                <SelectTrigger className="w-full h-10 rounded-[10px] text-[13px] border-border"><SelectValue placeholder="Pilih placement" /></SelectTrigger>
                <SelectContent>{placements.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.06em]">Urutan</Label>
              <Input type="number" min="1" value={order} onChange={(e) => setOrder(e.target.value)} className="h-10 rounded-[10px] text-[13px] border-border focus-visible:ring-1 focus-visible:ring-ring" />
            </div>
            <div className="space-y-3 pt-2 border-t border-border/60">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.6} />
                <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.06em]">Jadwal (Opsional)</Label>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] text-muted-foreground">Tanggal Mulai</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-10 rounded-[10px] text-[13px] border-border focus-visible:ring-1 focus-visible:ring-ring" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] text-muted-foreground">Tanggal Selesai</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-10 rounded-[10px] text-[13px] border-border focus-visible:ring-1 focus-visible:ring-ring" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <div>
                <p className="text-[13px] font-medium text-foreground">Aktifkan</p>
                <p className="text-[11px] text-muted-foreground">Banner langsung ditampilkan</p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
