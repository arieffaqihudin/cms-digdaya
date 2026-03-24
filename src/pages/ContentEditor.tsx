import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Save, CheckCircle, XCircle, ExternalLink, Plus, Trash2,
  Image, Video, FileText, Eye, Calendar, Clock, ThumbsUp, ThumbsDown,
  Pin, BookOpen, Hash, Users, Building2, Link2, Star, Sparkles,
  ChevronDown,
} from "lucide-react";
import { mockVideos, mockGuides, mockFAQs, mockBlogs, categories, tags as allTags, products } from "@/lib/mock-data";
import type { ContentType } from "@/lib/mock-data";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { useScreenSize } from "@/components/AppLayout";
import { cn } from "@/lib/utils";

const orgLevels = ["Pusat", "Wilayah", "Cabang", "MWC", "Ranting"];
const audiences = ["Umum", "Santri", "Pengurus", "Kader", "Jamaah"];
const difficulties = ["Pemula", "Menengah", "Lanjutan"];

function getContentType(searchParams: URLSearchParams, id?: string): ContentType {
  const t = searchParams.get("type") as ContentType;
  if (t) return t;
  if (id?.startsWith("v")) return "video";
  if (id?.startsWith("g")) return "guide";
  if (id?.startsWith("f")) return "faq";
  if (id?.startsWith("b")) return "blog";
  return "blog";
}

function getBackPath(type: ContentType) {
  switch (type) {
    case "video": return "/video";
    case "guide": return "/panduan";
    case "faq": return "/faq";
    case "blog": return "/blog";
  }
}

const typeLabels: Record<ContentType, string> = { video: "Video", guide: "Panduan", faq: "FAQ", blog: "Blog" };
const typeIcons: Record<ContentType, typeof Video> = { video: Video, guide: BookOpen, faq: FileText, blog: FileText };

/* ─── Collapsible Sidebar Card ─── */
function SidebarCard({ title, icon: Icon, children, defaultOpen = true }: { title: string; icon?: typeof Star; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const screenSize = useScreenSize();
  const collapsible = screenSize === "mobile";

  return (
    <div className="rounded-[12px] border border-border bg-surface shadow-card">
      <button
        className={cn(
          "flex items-center gap-2 px-4 md:px-5 py-3 md:py-3.5 w-full text-left",
          open && "border-b border-border/50"
        )}
        onClick={() => collapsible && setOpen(!open)}
      >
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.6} />}
        <h3 className="text-[12px] font-semibold text-foreground uppercase tracking-[0.06em] flex-1">{title}</h3>
        {collapsible && (
          <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
        )}
      </button>
      {(open || !collapsible) && (
        <div className="p-4 md:p-5 space-y-4">{children}</div>
      )}
    </div>
  );
}

/* ─── Field ─── */
function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] font-medium text-muted-foreground">{label}</Label>
      {children}
      {hint && <p className="text-[10px] text-muted-foreground/60">{hint}</p>}
    </div>
  );
}

/* ─── Toggle Row ─── */
function ToggleRow({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div>
        <span className="text-[13px] text-foreground">{label}</span>
        {hint && <p className="text-[10px] text-muted-foreground/60 mt-0.5">{hint}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export default function ContentEditor() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const contentType = getContentType(searchParams, id);
  const isNew = id === "new";
  const screenSize = useScreenSize();

  const video = contentType === "video" ? mockVideos.find(v => v.id === id) : null;
  const guide = contentType === "guide" ? mockGuides.find(g => g.id === id) : null;
  const faq = contentType === "faq" ? mockFAQs.find(f => f.id === id) : null;
  const blog = contentType === "blog" ? mockBlogs.find(b => b.id === id) : null;

  const [title, setTitle] = useState(video?.displayTitle || video?.title || guide?.title || faq?.question || blog?.title || "");
  const [summary, setSummary] = useState(video?.shortDescription || guide?.summary || blog?.excerpt || "");
  const [category, setCategory] = useState(video?.category || video?.aiSuggestion || guide?.category || faq?.category || blog?.category || "");
  const [product, setProduct] = useState(guide?.relatedProduct || faq?.relatedProduct || "");
  const [status, setStatus] = useState<string>(video?.status || guide?.status || faq?.status || blog?.status || "draft");
  const [featured, setFeatured] = useState(video?.featured || blog?.featured || false);
  const [publishToggle, setPublishToggle] = useState(status === "published");
  const [showOnHomepage, setShowOnHomepage] = useState(video?.showOnHomepage || false);
  const [editorNotes, setEditorNotes] = useState(video?.editorNotes || "");
  const [orgLevel, setOrgLevel] = useState(video?.organizationLevel || "");
  const [audience, setAudience] = useState("");
  const [content, setContent] = useState(faq?.answer || guide?.content || blog?.content || "");
  const [author, setAuthor] = useState(blog?.author || "");
  const [rejectReason, setRejectReason] = useState(video?.rejectReason || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(video?.tags || blog?.tags || []);
  const [pinned, setPinned] = useState(false);
  const [difficulty, setDifficulty] = useState("Pemula");
  const [steps, setSteps] = useState([
    { title: "Langkah 1", content: "" },
    { title: "Langkah 2", content: "" },
  ]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const backPath = getBackPath(contentType);
  const TypeIcon = typeIcons[contentType];

  const handleSave = () => toast.success("Draft berhasil disimpan.");
  const handlePublish = () => { toast.success(`${typeLabels[contentType]} berhasil dipublikasikan!`); navigate(backPath); };
  const handleReject = () => { toast.success(`${typeLabels[contentType]} ditolak.`); navigate(backPath); };

  /* ─── Sidebar panels ─── */
  const sidebarPanels = (
    <>
      {/* Publishing */}
      <SidebarCard title="Status & Publikasi" icon={CheckCircle}>
        <Field label="Status">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="rounded-[10px] h-9 text-[13px] border-border bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="need_review">Perlu Review</SelectItem>
              <SelectItem value="published">Dipublikasikan</SelectItem>
              <SelectItem value="rejected">Ditolak</SelectItem>
              <SelectItem value="archived">Diarsipkan</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <div className="space-y-2 pt-1">
          <ToggleRow label="Publish" checked={publishToggle} onChange={setPublishToggle} />
          <ToggleRow label="Unggulan" checked={featured} onChange={setFeatured} />
          {contentType === "video" && <ToggleRow label="Tampilkan di Beranda" checked={showOnHomepage} onChange={setShowOnHomepage} />}
          {contentType === "faq" && <ToggleRow label="Sematkan" checked={pinned} onChange={setPinned} hint="Tampilkan di atas daftar FAQ" />}
        </div>
        <Field label="Jadwal Publikasi" hint="Kosongkan untuk publish langsung">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
            <Input type="date" className="pl-9 rounded-[10px] h-9 text-[13px] border-border bg-background" />
          </div>
        </Field>
      </SidebarCard>

      {contentType === "blog" && (
        <SidebarCard title="Penulis" icon={Users}>
          <Field label="Nama Penulis">
            <Input value={author} onChange={(e) => setAuthor(e.target.value)} className="rounded-[10px] h-9 text-[13px] border-border bg-background" placeholder="Nama penulis..." />
          </Field>
          <Field label="Kutipan" hint="Ringkasan singkat untuk halaman listing">
            <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} className="rounded-[10px] resize-none text-[13px] border-border bg-background leading-relaxed" placeholder="Ringkasan singkat..." />
          </Field>
        </SidebarCard>
      )}

      {contentType === "faq" && (
        <SidebarCard title="Pengaturan FAQ" icon={Hash}>
          <Field label="Urutan Tampil">
            <Input type="number" defaultValue={faq?.order || 1} className="rounded-[10px] h-9 text-[13px] border-border bg-background tabular-nums" />
          </Field>
        </SidebarCard>
      )}

      {contentType === "guide" && (
        <SidebarCard title="Pengaturan Panduan" icon={Clock}>
          <Field label="Estimasi Waktu Baca">
            <Input placeholder="misal: 5 menit" className="rounded-[10px] h-9 text-[13px] border-border bg-background" />
          </Field>
          <Field label="Tingkat Kesulitan">
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="rounded-[10px] h-9 text-[13px] border-border bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>{difficulties.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <div className="flex items-center gap-3 pt-1">
            <span className="text-[11px] text-muted-foreground">Apakah membantu?</span>
            <button className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors">
              <ThumbsUp className="h-3.5 w-3.5" strokeWidth={1.6} /> Ya
            </button>
            <button className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive transition-colors">
              <ThumbsDown className="h-3.5 w-3.5" strokeWidth={1.6} /> Tidak
            </button>
          </div>
        </SidebarCard>
      )}

      <SidebarCard title="Kategorisasi" icon={Hash} defaultOpen={screenSize !== "mobile"}>
        <Field label="Kategori">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="rounded-[10px] h-9 text-[13px] border-border bg-background"><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
            <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Tag">
          <div className="flex flex-wrap gap-1.5">
            {allTags.map((t) => (
              <button
                key={t}
                onClick={() => toggleTag(t)}
                className={`rounded-full border px-2.5 py-[3px] text-[11px] font-medium transition-all duration-150 ${
                  selectedTags.includes(t)
                    ? "border-primary/30 bg-primary/[0.08] text-primary"
                    : "border-border text-muted-foreground hover:border-primary/20 hover:text-primary hover:bg-primary/[0.04]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Field>
      </SidebarCard>

      <SidebarCard title="Relasi" icon={Link2} defaultOpen={screenSize !== "mobile"}>
        <Field label="Produk Terkait">
          <Select value={product} onValueChange={setProduct}>
            <SelectTrigger className="rounded-[10px] h-9 text-[13px] border-border bg-background"><SelectValue placeholder="Pilih produk" /></SelectTrigger>
            <SelectContent>{products.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Audience">
          <Select value={audience} onValueChange={setAudience}>
            <SelectTrigger className="rounded-[10px] h-9 text-[13px] border-border bg-background"><SelectValue placeholder="Pilih audience" /></SelectTrigger>
            <SelectContent>{audiences.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Level Organisasi">
          <Select value={orgLevel} onValueChange={setOrgLevel}>
            <SelectTrigger className="rounded-[10px] h-9 text-[13px] border-border bg-background"><SelectValue placeholder="Pilih level" /></SelectTrigger>
            <SelectContent>{orgLevels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Konten Terkait">
          <Input placeholder="Cari konten terkait..." className="rounded-[10px] h-9 text-[13px] border-border bg-background" />
        </Field>
      </SidebarCard>

      <SidebarCard title="Media" icon={Image} defaultOpen={screenSize !== "mobile"}>
        <Field label="Thumbnail">
          <div className="border border-dashed border-border/60 rounded-[10px] p-6 text-center hover:border-primary/25 transition-colors cursor-pointer group">
            <Image className="h-5 w-5 mx-auto text-muted-foreground/40 mb-1.5 group-hover:text-primary/50 transition-colors" strokeWidth={1.6} />
            <p className="text-[11px] text-muted-foreground">Upload thumbnail</p>
          </div>
        </Field>
      </SidebarCard>

      <SidebarCard title="Catatan" icon={FileText} defaultOpen={screenSize !== "mobile"}>
        <Field label="Catatan Editor" hint="Internal — tidak terlihat oleh pengguna">
          <Textarea value={editorNotes} onChange={(e) => setEditorNotes(e.target.value)} rows={2} className="rounded-[10px] resize-none text-[13px] border-border bg-background leading-relaxed" placeholder="Catatan internal..." />
        </Field>
        {contentType === "video" && (
          <Field label="Alasan Penolakan">
            <Input value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Alasan jika ditolak..." className="rounded-[10px] h-9 text-[13px] border-border bg-background" />
          </Field>
        )}
      </SidebarCard>

      {/* Action Buttons */}
      <div className="rounded-[12px] border border-border bg-surface shadow-card p-4 space-y-2.5">
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 h-9 rounded-[10px] text-xs border-border gap-1.5" onClick={handleSave}>
            <Save className="h-3.5 w-3.5" strokeWidth={1.6} /> Simpan Draft
          </Button>
          <Button className="flex-1 h-9 rounded-[10px] text-xs bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5" onClick={handlePublish}>
            <CheckCircle className="h-3.5 w-3.5" strokeWidth={1.6} /> Publikasikan
          </Button>
        </div>
        <Button
          variant="ghost"
          className="w-full h-9 rounded-[10px] text-xs text-destructive hover:bg-status-danger-bg hover:text-status-danger-fg gap-1.5"
          onClick={handleReject}
        >
          <XCircle className="h-3.5 w-3.5" strokeWidth={1.6} /> Tolak
        </Button>
      </div>
    </>
  );

  return (
    <div className="-m-4 md:-m-5 lg:-m-7">
      {/* ═══ Editor Page Header ═══ */}
      <div className="sticky top-0 z-20 border-b border-border/60 bg-card px-4 md:px-6 py-3">
        {/* Row 1: back + badge + title + actions */}
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <Link
            to={backPath}
            className="flex h-8 w-8 items-center justify-center rounded-[10px] text-muted-foreground hover:bg-accent hover:text-foreground transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.6} />
          </Link>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/[0.06] px-2.5 py-[3px] text-[11px] font-medium text-primary shrink-0">
              <TypeIcon className="h-3 w-3" strokeWidth={1.8} />
              <span className="hidden sm:inline">{typeLabels[contentType]}</span>
            </span>
            <h2 className="text-sm md:text-[15px] font-semibold text-foreground truncate">
              {isNew ? `${typeLabels[contentType]} Baru` : `Edit ${typeLabels[contentType]}`}
            </h2>
            {!isNew && <span className="hidden sm:inline"><StatusBadge status={status} /></span>}
          </div>
          <div className="flex items-center gap-2 shrink-0 max-sm:w-full max-sm:pt-2 max-sm:border-t max-sm:border-border/40">
            <Button variant="ghost" size="sm" className="h-8 rounded-[10px] text-xs text-muted-foreground hover:text-foreground hover:bg-accent gap-1.5 hidden sm:flex">
              <Eye className="h-3.5 w-3.5" strokeWidth={1.6} /> Preview
            </Button>
            <Button variant="outline" size="sm" className={cn("h-8 rounded-[10px] text-xs border-border gap-1.5", screenSize === "mobile" ? "flex-1" : "hidden md:flex")} onClick={handleSave}>
              <Save className="h-3.5 w-3.5" strokeWidth={1.6} /> Simpan Draft
            </Button>
            <Button size="sm" className={cn("h-8 rounded-[10px] text-xs bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5", screenSize === "mobile" && "flex-1")} onClick={handlePublish}>
              <CheckCircle className="h-3.5 w-3.5" strokeWidth={1.6} /> Publikasikan
            </Button>
          </div>
        </div>
      </div>

      {/* ═══ Two Column Layout ═══ */}
      <div className={cn(
        "p-4 md:p-6 lg:p-7 pt-6 md:pt-7 lg:pt-8",
        screenSize !== "mobile" ? "flex gap-5 lg:gap-6" : "space-y-5"
      )}>
        {/* ─── LEFT: Content Area ─── */}
        <div className={cn(
          "min-w-0 space-y-5 md:space-y-6",
          screenSize !== "mobile" && "flex-1"
        )} style={screenSize !== "mobile" ? { maxWidth: "68%" } : undefined}>
          {/* Title Input */}
          <div className="rounded-[12px] border border-border bg-surface p-4 md:p-6 shadow-card">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-[18px] md:text-[22px] font-semibold text-foreground placeholder:text-muted-foreground/35 placeholder:font-normal outline-none leading-relaxed"
              placeholder={contentType === "faq" ? "Masukkan pertanyaan..." : "Masukkan judul konten..."}
            />
            {(contentType === "blog" || contentType === "guide") && (
              <input
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full bg-transparent text-[13px] md:text-[14px] text-muted-foreground placeholder:text-muted-foreground/30 outline-none mt-3 leading-relaxed"
                placeholder="Tulis ringkasan singkat..."
              />
            )}
          </div>

          {/* Video: YouTube Preview */}
          {contentType === "video" && video && (
            <>
              <div className="rounded-[12px] overflow-hidden bg-muted aspect-video flex items-center justify-center border border-border">
                <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-[12px] border border-border bg-surface shadow-card">
                <div className="flex items-center gap-2 px-4 md:px-5 py-3 md:py-3.5 border-b border-border/50">
                  <Video className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.6} />
                  <h3 className="text-[12px] font-semibold text-foreground uppercase tracking-[0.06em]">Sumber YouTube</h3>
                </div>
                <div className="p-4 md:p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <p className="text-[11px] text-muted-foreground mb-1">Judul Asli</p>
                      <p className="text-[13px] text-foreground leading-snug">{video.title}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground mb-1">Channel Sumber</p>
                      <p className="text-[13px] text-foreground">{video.channel}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground mb-1">Tanggal Publish</p>
                      <p className="text-[13px] text-foreground tabular-nums">{video.publishDate}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground mb-1">AI Suggestion</p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/[0.07] px-2.5 py-[3px] text-[11px] font-medium text-primary">
                        <Sparkles className="h-3 w-3" strokeWidth={1.8} />
                        {video.aiSuggestion}
                      </span>
                    </div>
                  </div>
                  {video.description && (
                    <div className="mt-4 pt-4 border-t border-border/40">
                      <p className="text-[11px] text-muted-foreground mb-1">Deskripsi</p>
                      <p className="text-[13px] text-muted-foreground leading-relaxed">{video.description}</p>
                    </div>
                  )}
                  {video.youtubeUrl && (
                    <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-4 text-[12px] text-primary hover:underline">
                      <ExternalLink className="h-3 w-3" strokeWidth={1.6} /> Lihat di YouTube
                    </a>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Blog: Cover Image */}
          {contentType === "blog" && (
            <div className="rounded-[12px] border border-border bg-surface p-4 md:p-6 shadow-card space-y-3">
              <p className="text-[11px] font-medium text-muted-foreground">Cover Image</p>
              <div className="border border-dashed border-border/70 rounded-[12px] p-8 md:p-12 text-center hover:border-primary/30 transition-colors cursor-pointer group">
                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-accent mx-auto mb-3 group-hover:bg-primary/10 transition-colors">
                  <Image className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" strokeWidth={1.6} />
                </div>
                <p className="text-[13px] text-foreground font-medium">Klik untuk upload atau drag & drop</p>
                <p className="text-[11px] text-muted-foreground mt-1">PNG, JPG maks 5MB · Rekomendasi 1200×630</p>
              </div>
            </div>
          )}

          {/* FAQ: Answer */}
          {contentType === "faq" && (
            <div className="rounded-[12px] border border-border bg-surface p-4 md:p-6 shadow-card space-y-3">
              <p className="text-[11px] font-medium text-muted-foreground">Jawaban</p>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="rounded-[10px] resize-none text-[14px] border-border bg-background leading-relaxed focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Tulis jawaban FAQ di sini..."
              />
            </div>
          )}

          {/* Guide: Structured Steps */}
          {contentType === "guide" && (
            <div className="rounded-[12px] border border-border bg-surface shadow-card">
              <div className="flex items-center justify-between px-4 md:px-5 py-3 md:py-3.5 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.6} />
                  <h3 className="text-[12px] font-semibold text-foreground uppercase tracking-[0.06em]">Langkah-langkah</h3>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 rounded-[8px] text-xs text-muted-foreground hover:text-foreground hover:bg-accent gap-1"
                  onClick={() => setSteps([...steps, { title: `Langkah ${steps.length + 1}`, content: "" }])}
                >
                  <Plus className="h-3 w-3" strokeWidth={1.8} /> Tambah
                </Button>
              </div>
              <div className="p-4 md:p-5 space-y-3">
                {steps.map((step, i) => (
                  <div key={i} className="rounded-[10px] border border-border/50 bg-background p-3 md:p-4 space-y-2.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] font-semibold shrink-0">
                        {i + 1}
                      </span>
                      <input
                        value={step.title}
                        onChange={(e) => {
                          const s = [...steps];
                          s[i] = { ...s[i], title: e.target.value };
                          setSteps(s);
                        }}
                        className="flex-1 bg-transparent text-[13px] md:text-[14px] font-medium text-foreground outline-none placeholder:text-muted-foreground/40"
                        placeholder="Judul langkah..."
                      />
                      {steps.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-muted-foreground/40 hover:text-destructive hover:bg-status-danger-bg"
                          onClick={() => setSteps(steps.filter((_, j) => j !== i))}
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.6} />
                        </Button>
                      )}
                    </div>
                    <Textarea
                      value={step.content}
                      onChange={(e) => {
                        const s = [...steps];
                        s[i] = { ...s[i], content: e.target.value };
                        setSteps(s);
                      }}
                      rows={3}
                      className="rounded-[10px] resize-none text-[13px] border-border/50 bg-surface leading-relaxed focus-visible:ring-1 focus-visible:ring-ring"
                      placeholder="Jelaskan langkah ini..."
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rich Text Editor (blog, video) */}
          {(contentType === "blog" || contentType === "video") && (
            <div className="rounded-[12px] border border-border bg-surface shadow-card">
              <div className="flex items-center gap-1 md:gap-1.5 px-4 md:px-5 py-2.5 border-b border-border/50 overflow-x-auto">
                {["B", "I", "U", "H1", "H2", "—", "Link", "List", "Image", "Code"].map((btn, i) =>
                  btn === "—" ? (
                    <div key={i} className="w-px h-5 bg-border/50 mx-1 shrink-0" />
                  ) : (
                    <button key={btn} className="px-2 md:px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:bg-accent hover:text-foreground rounded-[6px] transition-colors shrink-0">
                      {btn}
                    </button>
                  )
                )}
              </div>
              <div className="p-4 md:p-6">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={contentType === "video" ? 8 : 18}
                  className="rounded-none resize-none text-[14px] md:text-[15px] border-0 shadow-none px-0 focus-visible:ring-0 leading-[1.8] placeholder:text-muted-foreground/30 font-[400]"
                  placeholder={contentType === "video" ? "Tulis deskripsi video..." : "Mulai menulis artikel..."}
                />
              </div>
            </div>
          )}

          {/* Media Embed */}
          {(contentType === "blog" || contentType === "guide") && (
            <div className="rounded-[12px] border border-dashed border-border/60 bg-surface/50 p-6 md:p-8 text-center hover:border-primary/25 transition-colors cursor-pointer group">
              <Video className="h-5 w-5 mx-auto text-muted-foreground/30 mb-2 group-hover:text-primary/40 transition-colors" strokeWidth={1.6} />
              <p className="text-[12px] text-muted-foreground">Embed gambar, video, atau media lainnya</p>
            </div>
          )}

          {/* Preview */}
          <div className="rounded-[12px] border border-border bg-surface shadow-card">
            <div className="flex items-center gap-2 px-4 md:px-5 py-3 md:py-3.5 border-b border-border/50">
              <Eye className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.6} />
              <h3 className="text-[12px] font-semibold text-foreground uppercase tracking-[0.06em]">Preview</h3>
            </div>
            <div className="p-4 md:p-6 min-h-[80px]">
              {title ? (
                <>
                  <h4 className="text-[15px] md:text-[16px] font-semibold text-foreground mb-2 leading-snug">{title}</h4>
                  {summary && <p className="text-[13px] text-muted-foreground mb-3">{summary}</p>}
                  <p className="text-[13px] md:text-[14px] text-foreground/80 leading-relaxed whitespace-pre-wrap">{content || ""}</p>
                </>
              ) : (
                <p className="text-[13px] text-muted-foreground/50 italic">Preview akan muncul saat Anda menulis...</p>
              )}
            </div>
          </div>
        </div>

        {/* ─── RIGHT: Metadata Sidebar ─── */}
        <div className={cn(
          "space-y-4",
          screenSize !== "mobile" ? "w-[300px] lg:w-[320px] shrink-0 lg:sticky lg:top-[56px] lg:self-start" : ""
        )}>
          {sidebarPanels}
        </div>
      </div>
    </div>
  );
}
