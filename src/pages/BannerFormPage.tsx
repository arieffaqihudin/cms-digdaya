import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Send, Upload, X, ImageIcon, Calendar } from "lucide-react";
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
              onClick={() => navigate("/banner")}
              className="flex h-8 w-8 items-center justify-center rounded-[8px] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.6} />
            </button>
            <span className="inline-flex items-center rounded-full bg-primary/[0.07] px-2.5 py-[3px] text-[11px] font-medium text-primary shrink-0">
              Banner
            </span>
            <h1 className="text-[15px] font-semibold text-foreground truncate">
              Buat Banner Baru
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
            {/* Banner Title */}
            <div className="rounded-[12px] border border-border bg-surface p-4 md:p-5 shadow-card space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.06em]">Judul Banner</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul banner..."
                  className="h-11 rounded-[10px] text-[14px] border-border focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="rounded-[12px] border border-border bg-surface p-4 md:p-5 shadow-card space-y-4">
              <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.06em]">Upload Gambar Banner</Label>
              {imagePreview ? (
                <div className="space-y-3">
                  <div className="relative rounded-[10px] overflow-hidden border border-border">
                    <img
                      src={imagePreview}
                      alt="Banner preview"
                      className="w-full aspect-[3/1] object-cover"
                    />
                    <button
                      onClick={() => handleImageChange(null)}
                      className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-foreground/60 text-background hover:bg-foreground/80 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" strokeWidth={2} />
                    </button>
                  </div>
                  {image && (
                    <p className="text-[11px] text-muted-foreground">
                      {image.name} · {(image.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  )}
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

            {/* Target Link */}
            <div className="rounded-[12px] border border-border bg-surface p-4 md:p-5 shadow-card space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.06em]">Target Link</Label>
                <Input
                  value={targetLink}
                  onChange={(e) => setTargetLink(e.target.value)}
                  placeholder="https://... atau /path/halaman"
                  className="h-10 rounded-[10px] text-[13px] font-mono border-border focus-visible:ring-1 focus-visible:ring-ring"
                />
                <p className="text-[11px] text-muted-foreground">URL tujuan saat banner diklik</p>
              </div>
            </div>
          </div>

          {/* Right - Metadata */}
          <div className="space-y-5">
            <div className={cn("rounded-[12px] border border-border bg-surface p-4 md:p-5 shadow-card space-y-5", screenSize !== "mobile" && "sticky top-4")}>
              {/* Placement */}
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.06em]">Placement</Label>
                <Select value={placement} onValueChange={setPlacement}>
                  <SelectTrigger className="w-full h-10 rounded-[10px] text-[13px] border-border">
                    <SelectValue placeholder="Pilih placement" />
                  </SelectTrigger>
                  <SelectContent>
                    {placements.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Order */}
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.06em]">Urutan</Label>
                <Input
                  type="number"
                  min="1"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className="h-10 rounded-[10px] text-[13px] border-border focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              {/* Schedule */}
              <div className="space-y-3 pt-2 border-t border-border/60">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.6} />
                  <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.06em]">Jadwal (Opsional)</Label>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-muted-foreground">Tanggal Mulai</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-10 rounded-[10px] text-[13px] border-border focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-muted-foreground">Tanggal Selesai</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-10 rounded-[10px] text-[13px] border-border focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
              </div>

              {/* Status toggle */}
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
    </div>
  );
}
