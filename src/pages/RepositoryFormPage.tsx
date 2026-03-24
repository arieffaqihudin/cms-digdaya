import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const kategoriDokumen = [
  "Peraturan Perkumpulan",
  "Konbes NU",
  "Rencana Strategis",
  "Digitalisasi",
  "Lain-lain",
  "Harlah NU",
];

const kepengurusanSuggestions = [
  "PBNU",
  "PWNU Jawa Timur",
  "PWNU Jawa Tengah",
  "PWNU Jawa Barat",
  "PCNU Surabaya",
  "PCNU Semarang",
  "PCNU Bandung",
  "MWC NU",
  "Ranting NU",
  "Lembaga Dakwah NU",
  "Lembaga Pendidikan NU",
  "Lembaga Kesehatan NU",
];

export default function RepositoryFormPage() {
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("");
  const [kepengurusan, setKepengurusan] = useState("");
  const [kepengurusanOpen, setKepengurusanOpen] = useState(false);
  const [deskripsi, setDeskripsi] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const filteredSuggestions = kepengurusanSuggestions.filter((s) =>
    s.toLowerCase().includes(kepengurusan.toLowerCase())
  );

  const handleSave = () => {
    if (!nama.trim()) {
      toast.error("Nama Dokumen wajib diisi");
      return;
    }
    if (!kategori) {
      toast.error("Kategori Dokumen wajib dipilih");
      return;
    }
    toast.success("Dokumen berhasil disimpan");
    navigate("/repository");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/repository")}
            className="flex h-8 w-8 items-center justify-center rounded-[10px] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.6} />
          </button>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/[0.06] px-2.5 py-[3px] text-[11px] font-medium text-primary">
              <FileText className="h-3 w-3" strokeWidth={1.8} />
              Repository
            </span>
            <h1 className="text-sm md:text-[15px] font-semibold text-foreground">Upload File Baru</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/repository")}
            className="h-8 rounded-[10px] text-xs border-border"
          >
            Batal
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="h-8 rounded-[10px] text-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Simpan
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-[12px] border border-border bg-surface p-5 md:p-6 shadow-card space-y-6">
        {/* Nama Dokumen */}
        <div className="space-y-2">
          <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.06em]">
            Nama Dokumen <span className="text-destructive">*</span>
          </Label>
          <Input
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Masukkan nama dokumen..."
            className="h-11 rounded-[10px] text-[14px] border-border focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        {/* Kategori Dokumen */}
        <div className="space-y-2">
          <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.06em]">
            Kategori Dokumen <span className="text-destructive">*</span>
          </Label>
          <Select value={kategori} onValueChange={setKategori}>
            <SelectTrigger className="w-full h-11 rounded-[10px] text-[14px] border-border">
              <SelectValue placeholder="Pilih kategori dokumen..." />
            </SelectTrigger>
            <SelectContent>
              {kategoriDokumen.map((k) => (
                <SelectItem key={k} value={k}>{k}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Kepengurusan */}
        <div className="space-y-2 relative">
          <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.06em]">
            Kepengurusan
          </Label>
          <Input
            value={kepengurusan}
            onChange={(e) => {
              setKepengurusan(e.target.value);
              setKepengurusanOpen(true);
            }}
            onFocus={() => setKepengurusanOpen(true)}
            onBlur={() => setTimeout(() => setKepengurusanOpen(false), 200)}
            placeholder="Cari kepengurusan..."
            className="h-11 rounded-[10px] text-[14px] border-border focus-visible:ring-1 focus-visible:ring-ring"
          />
          {kepengurusanOpen && kepengurusan && filteredSuggestions.length > 0 && (
            <div className="absolute z-10 top-full left-0 right-0 mt-1 rounded-[10px] border border-border bg-background shadow-lg max-h-[200px] overflow-y-auto">
              {filteredSuggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseDown={() => {
                    setKepengurusan(s);
                    setKepengurusanOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 text-[13px] text-foreground hover:bg-accent/50 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Deskripsi */}
        <div className="space-y-2">
          <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.06em]">
            Deskripsi
          </Label>
          <Textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Deskripsi singkat tentang dokumen ini..."
            className="min-h-[120px] rounded-[10px] text-[13px] border-border focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-[0.06em]">
            File Upload
          </Label>
          {file ? (
            <div className="flex items-center justify-between gap-3 rounded-[10px] border border-border bg-accent/30 p-3.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <Upload className="h-4 w-4 text-primary shrink-0" strokeWidth={1.6} />
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-[11px] text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                onClick={() => setFile(null)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.6} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-2 rounded-[10px] border-2 border-dashed border-border bg-background p-8 cursor-pointer hover:border-primary/40 hover:bg-accent/20 transition-colors">
              <Upload className="h-8 w-8 text-muted-foreground/50" strokeWidth={1.4} />
              <div className="text-center">
                <p className="text-[13px] font-medium text-foreground">
                  Seret & jatuhkan file atau <span className="text-primary">Jelajahi</span>
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">PDF, DOC, DOCX, XLS, XLSX (maks. 50MB)</p>
              </div>
              <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
