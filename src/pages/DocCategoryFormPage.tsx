import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function DocCategoryFormPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Nama Kategori wajib diisi");
      return;
    }
    toast.success("Kategori Dokumen berhasil disimpan");
    navigate("/categories/dokumen");
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/categories/dokumen")}
            className="rounded-[10px] text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <FolderTree className="h-4 w-4 text-primary/70" />
            <h1 className="text-lg font-semibold text-foreground/90">Tambah Kategori Dokumen</h1>
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

      {/* Form */}
      <div className="rounded-[12px] border border-border/60 bg-card p-6 space-y-6">
        <div className="space-y-2">
          <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.06em]">
            Nama Kategori <span className="text-destructive">*</span>
          </Label>
          <Input
            placeholder="Masukkan nama kategori dokumen..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 rounded-[10px] border-border/60 focus-visible:ring-primary/30 text-sm"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/60">
          <div>
            <p className="text-[13px] font-medium text-foreground">Is Published</p>
            <p className="text-[11px] text-muted-foreground">Kategori tampil di daftar pilihan</p>
          </div>
          <Switch checked={isPublished} onCheckedChange={setIsPublished} />
        </div>
      </div>
    </div>
  );
}
