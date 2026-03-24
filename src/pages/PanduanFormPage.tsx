import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, FileText, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { products } from "@/lib/mock-data";

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

type ContentItem = { id: string; type: "document" | "video"; value: string };

export default function PanduanFormPage() {
  const navigate = useNavigate();
  const [topik, setTopik] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [produk, setProduk] = useState("");
  const [items, setItems] = useState<ContentItem[]>([]);
  const [addOpen, setAddOpen] = useState(false);

  const autoSlug = useMemo(() => slugify(topik), [topik]);

  const handleTopikChange = (val: string) => {
    setTopik(val);
    if (!slugEdited) setSlug(slugify(val));
  };

  const addItem = (type: "document" | "video") => {
    setItems((prev) => [...prev, { id: crypto.randomUUID(), type, value: "" }]);
    setAddOpen(false);
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const updateItem = (id: string, value: string) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, value } : i)));

  const handleSave = () => {
    if (!topik.trim()) return toast.error("Nama Topik wajib diisi");
    if (!produk) return toast.error("Produk wajib dipilih");
    toast.success("Panduan berhasil disimpan");
    navigate("/panduan");
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="space-y-1">
        <div className="text-sm text-muted-foreground">
          <span className="cursor-pointer hover:text-primary" onClick={() => navigate("/panduan")}>Panduan</span>
          <span className="mx-2">›</span>
          <span className="text-foreground">Buat</span>
        </div>
        <h1 className="text-xl font-semibold text-foreground">Buat Panduan</h1>
      </div>

      {/* Form */}
      <div className="max-w-2xl space-y-6 rounded-[12px] border bg-card p-6 sm:p-8">
        {/* Nama Topik */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Nama Topik <span className="text-destructive">*</span>
          </label>
          <Input placeholder="Masukkan nama topik" value={topik} onChange={(e) => handleTopikChange(e.target.value)} />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Slug <span className="text-destructive">*</span>
          </label>
          <Input
            value={slugEdited ? slug : autoSlug}
            onChange={(e) => { setSlugEdited(true); setSlug(e.target.value); }}
          />
        </div>

        {/* Produk */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Produk <span className="text-destructive">*</span>
          </label>
          <Select value={produk} onValueChange={setProduk}>
            <SelectTrigger><SelectValue placeholder="Pilih produk" /></SelectTrigger>
            <SelectContent>
              {products.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Konten */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-foreground">Konten</label>

          {items.length > 0 && (
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={item.id} className="flex items-start gap-4 rounded-[10px] border bg-muted/30 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    {item.type === "document" ? (
                      <FileText className="h-4 w-4 text-primary" />
                    ) : (
                      <Video className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {item.type === "document" ? `Dokumen ${idx + 1}` : `Video ${idx + 1}`}
                    </span>
                    {item.type === "document" ? (
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="text-sm"
                        onChange={(e) => updateItem(item.id, e.target.files?.[0]?.name || "")}
                      />
                    ) : (
                      <Input
                        placeholder="Masukkan URL video"
                        value={item.value}
                        onChange={(e) => updateItem(item.id, e.target.value)}
                      />
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mt-5 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Popover open={addOpen} onOpenChange={setAddOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" /> Tambah Konten
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-44 p-1.5" align="start">
              <button
                className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm hover:bg-muted"
                onClick={() => addItem("document")}
              >
                <FileText className="h-4 w-4 text-muted-foreground" /> Dokumen
              </button>
              <button
                className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm hover:bg-muted"
                onClick={() => addItem("video")}
              >
                <Video className="h-4 w-4 text-muted-foreground" /> Video
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Actions */}
      <div className="flex max-w-2xl gap-3">
        <Button onClick={handleSave}>Simpan</Button>
        <Button variant="outline" onClick={() => navigate("/panduan")}>Batal</Button>
      </div>
    </div>
  );
}
