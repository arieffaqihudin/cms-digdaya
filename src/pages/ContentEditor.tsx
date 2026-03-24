import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Save, CheckCircle, XCircle, ExternalLink, Plus, Trash2,
  Image, Video, FileText, Eye, Calendar, Clock, ThumbsUp, ThumbsDown,
  Pin, BookOpen, Hash, Users, Building2, Link2, Star,
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

/* ─── Sidebar Section Card ─── */
function SidebarCard({ title, icon: Icon, children }: { title: string; icon?: typeof Star; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface shadow-soft">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border/60">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.6} />}
        <h3 className="text-[12px] font-semibold text-foreground uppercase tracking-[0.06em]">{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

/* ─── Field Wrapper ─── */
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
    { title: "Step 1", content: "" },
    { title: "Step 2", content: "" },
  ]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const backPath = getBackPath(contentType);
  const TypeIcon = typeIcons[contentType];

  const handleSave = () => toast.success("Draft saved successfully.");
  const handlePublish = () => { toast.success(`${typeLabels[contentType]} published!`); navigate(backPath); };
  const handleReject = () => { toast.success(`${typeLabels[contentType]} rejected.`); navigate(backPath); };

  return (
    <div className="-m-7">
      {/* ═══ Top Bar ═══ */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-6 py-3">
        <div className="flex items-center gap-4">
          <Link
            to={backPath}
            className="flex h-8 w-8 items-center justify-center rounded-[10px] text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.6} />
          </Link>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/[0.06] px-2.5 py-[3px] text-[11px] font-medium text-primary">
              <TypeIcon className="h-3 w-3" strokeWidth={1.8} />
              {typeLabels[contentType]}
            </span>
            <h2 className="text-[14px] font-semibold text-foreground">
              {isNew ? `New ${typeLabels[contentType]}` : `Edit ${typeLabels[contentType]}`}
            </h2>
            {!isNew && <StatusBadge status={status} />}
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="ghost" size="sm" className="h-8 rounded-[10px] text-xs text-muted-foreground hover:text-foreground hover:bg-accent">
            <Eye className="h-3.5 w-3.5 mr-1.5" strokeWidth={1.6} /> Preview
          </Button>
          <Button variant="outline" size="sm" className="h-8 rounded-[10px] text-xs border-border" onClick={handleSave}>
            <Save className="h-3.5 w-3.5 mr-1.5" strokeWidth={1.6} /> Save Draft
          </Button>
          <Button size="sm" className="h-8 rounded-[10px] text-xs bg-primary text-primary-foreground hover:bg-primary/90" onClick={handlePublish}>
            <CheckCircle className="h-3.5 w-3.5 mr-1.5" strokeWidth={1.6} /> Publish
          </Button>
        </div>
      </div>

      {/* ═══ Two Column Layout ═══ */}
      <div className="flex gap-6 p-6">
        {/* ─── LEFT: Content Area (65–70%) ─── */}
        <div className="flex-1 min-w-0 space-y-5" style={{ maxWidth: "68%" }}>
          {/* Title */}
          <div className="rounded-xl border border-border bg-surface p-6 shadow-soft">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-xl font-semibold text-foreground placeholder:text-muted-foreground/40 placeholder:font-normal outline-none leading-relaxed"
              placeholder={contentType === "faq" ? "Masukkan pertanyaan..." : "Masukkan judul..."}
            />
            {(contentType === "blog" || contentType === "guide") && (
              <input
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full bg-transparent text-[14px] text-muted-foreground placeholder:text-muted-foreground/30 outline-none mt-3 leading-relaxed"
                placeholder="Tulis ringkasan singkat..."
              />
            )}
          </div>

          {/* Video: YouTube Preview */}
          {contentType === "video" && video && (
            <>
              <div className="rounded-xl overflow-hidden bg-foreground/5 aspect-video flex items-center justify-center border border-border">
                <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-xl border border-border bg-surface shadow-soft">
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border/60">
                  <Video className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.6} />
                  <h3 className="text-[12px] font-semibold text-foreground uppercase tracking-[0.06em]">YouTube Source</h3>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <p className="text-[11px] text-muted-foreground mb-1">Original Title</p>
                      <p className="text-[13px] text-foreground leading-snug">{video.title}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground mb-1">Source Channel</p>
                      <p className="text-[13px] text-foreground">{video.channel}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground mb-1">Publish Date</p>
                      <p className="text-[13px] text-foreground tabular-nums">{video.publishDate}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground mb-1">AI Suggestion</p>
                      <span className="inline-flex items-center rounded-full bg-primary/[0.07] px-2.5 py-[3px] text-[11px] font-medium text-primary">{video.aiSuggestion}</span>
                    </div>
                  </div>
                  {video.description && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <p className="text-[11px] text-muted-foreground mb-1">Description</p>
                      <p className="text-[13px] text-muted-foreground leading-relaxed">{video.description}</p>
                    </div>
                  )}
                  {video.youtubeUrl && (
                    <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-4 text-[12px] text-primary hover:underline">
                      <ExternalLink className="h-3 w-3" strokeWidth={1.6} /> View on YouTube
                    </a>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Blog: Cover Image Upload */}
          {contentType === "blog" && (
            <div className="rounded-xl border border-border bg-surface p-6 shadow-soft space-y-3">
              <p className="text-[11px] font-medium text-muted-foreground">Cover Image</p>
              <div className="border border-dashed border-border/80 rounded-xl p-12 text-center hover:border-primary/30 transition-colors cursor-pointer group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent mx-auto mb-3 group-hover:bg-primary/10 transition-colors">
                  <Image className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" strokeWidth={1.6} />
                </div>
                <p className="text-[13px] text-foreground font-medium">Click to upload or drag & drop</p>
                <p className="text-[11px] text-muted-foreground mt-1">PNG, JPG up to 5MB · Recommended 1200×630</p>
              </div>
            </div>
          )}

          {/* FAQ: Answer */}
          {contentType === "faq" && (
            <div className="rounded-xl border border-border bg-surface p-6 shadow-soft space-y-3">
              <p className="text-[11px] font-medium text-muted-foreground">Answer</p>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="rounded-[10px] resize-none text-[14px] border-border bg-surface leading-relaxed focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Tulis jawaban FAQ di sini..."
              />
            </div>
          )}

          {/* Guide: Structured Steps */}
          {contentType === "guide" && (
            <div className="rounded-xl border border-border bg-surface shadow-soft">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.6} />
                  <h3 className="text-[12px] font-semibold text-foreground uppercase tracking-[0.06em]">Guide Steps</h3>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 rounded-[8px] text-xs text-muted-foreground hover:text-foreground hover:bg-accent"
                  onClick={() => setSteps([...steps, { title: `Step ${steps.length + 1}`, content: "" }])}
                >
                  <Plus className="h-3 w-3 mr-1" strokeWidth={1.8} /> Add Step
                </Button>
              </div>
              <div className="p-5 space-y-3">
                {steps.map((step, i) => (
                  <div key={i} className="rounded-xl border border-border/60 bg-background p-4 space-y-2.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] font-semibold shrink-0">{i + 1}</span>
                      <input
                        value={step.title}
                        onChange={(e) => {
                          const s = [...steps];
                          s[i] = { ...s[i], title: e.target.value };
                          setSteps(s);
                        }}
                        className="flex-1 bg-transparent text-[14px] font-medium text-foreground outline-none placeholder:text-muted-foreground/40"
                        placeholder="Step title..."
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
                      className="rounded-[10px] resize-none text-[13px] border-border/60 bg-surface leading-relaxed focus-visible:ring-1 focus-visible:ring-ring"
                      placeholder="Describe this step..."
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blog / Video: Rich Text Content */}
          {(contentType === "blog" || contentType === "video") && (
            <div className="rounded-xl border border-border bg-surface shadow-soft">
              <div className="flex items-center gap-1.5 px-5 py-2.5 border-b border-border/60">
                {["B", "I", "U", "H1", "H2", "—", "Link", "List", "Image", "Code"].map((btn, i) =>
                  btn === "—" ? (
                    <div key={i} className="w-px h-5 bg-border/60 mx-1" />
                  ) : (
                    <button key={btn} className="px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:bg-accent hover:text-foreground rounded-[6px] transition-colors">
                      {btn}
                    </button>
                  )
                )}
              </div>
              <div className="p-6">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={contentType === "video" ? 8 : 18}
                  className="rounded-none resize-none text-[15px] border-0 shadow-none px-0 focus-visible:ring-0 leading-[1.8] placeholder:text-muted-foreground/30 font-[400]"
                  placeholder={contentType === "video" ? "Tulis deskripsi video..." : "Mulai menulis artikel..."}
                />
              </div>
            </div>
          )}

          {/* Media Embed Area (blog, guide) */}
          {(contentType === "blog" || contentType === "guide") && (
            <div className="rounded-xl border border-dashed border-border/70 bg-surface/50 p-8 text-center hover:border-primary/25 transition-colors cursor-pointer group">
              <Video className="h-5 w-5 mx-auto text-muted-foreground/30 mb-2 group-hover:text-primary/40 transition-colors" strokeWidth={1.6} />
              <p className="text-[12px] text-muted-foreground">Embed images, videos, or other media</p>
            </div>
          )}

          {/* Content Preview */}
          <div className="rounded-xl border border-border bg-surface shadow-soft">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border/60">
              <Eye className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.6} />
              <h3 className="text-[12px] font-semibold text-foreground uppercase tracking-[0.06em]">Preview</h3>
            </div>
            <div className="p-6 min-h-[80px]">
              {title ? (
                <>
                  <h4 className="text-[16px] font-semibold text-foreground mb-2 leading-snug">{title}</h4>
                  {summary && <p className="text-[13px] text-muted-foreground mb-3">{summary}</p>}
                  <p className="text-[14px] text-foreground/80 leading-relaxed whitespace-pre-wrap">{content || ""}</p>
                </>
              ) : (
                <p className="text-[13px] text-muted-foreground/50 italic">Preview will appear here as you write...</p>
              )}
            </div>
          </div>
        </div>

        {/* ─── RIGHT: Metadata Sidebar (30–35%) ─── */}
        <div className="w-[320px] shrink-0 space-y-4 lg:sticky lg:top-[56px] lg:self-start">
          {/* Status & Publishing */}
          <SidebarCard title="Publishing" icon={CheckCircle}>
            <Field label="Status">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="rounded-[10px] h-9 text-[13px] border-border bg-surface"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="need_review">Need Review</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <div className="space-y-2 pt-1">
              <ToggleRow label="Publish" checked={publishToggle} onChange={setPublishToggle} />
              <ToggleRow label="Featured" checked={featured} onChange={setFeatured} />
              {contentType === "video" && (
                <ToggleRow label="Show on Homepage" checked={showOnHomepage} onChange={setShowOnHomepage} />
              )}
              {contentType === "faq" && (
                <ToggleRow label="Pinned" checked={pinned} onChange={setPinned} hint="Show at top of FAQ list" />
              )}
            </div>
            <Field label="Schedule Publish" hint="Leave empty to publish immediately">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
                <Input type="date" className="pl-9 rounded-[10px] h-9 text-[13px] border-border bg-surface" />
              </div>
            </Field>
          </SidebarCard>

          {/* Blog: Author */}
          {contentType === "blog" && (
            <SidebarCard title="Author" icon={Users}>
              <Field label="Author Name">
                <Input value={author} onChange={(e) => setAuthor(e.target.value)} className="rounded-[10px] h-9 text-[13px] border-border bg-surface" placeholder="Nama penulis..." />
              </Field>
              <Field label="Excerpt" hint="Short excerpt for listing pages">
                <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} className="rounded-[10px] resize-none text-[13px] border-border bg-surface leading-relaxed" placeholder="Ringkasan singkat..." />
              </Field>
            </SidebarCard>
          )}

          {/* FAQ: Additional Fields */}
          {contentType === "faq" && (
            <SidebarCard title="FAQ Settings" icon={Hash}>
              <Field label="Display Order">
                <Input type="number" defaultValue={faq?.order || 1} className="rounded-[10px] h-9 text-[13px] border-border bg-surface tabular-nums" />
              </Field>
            </SidebarCard>
          )}

          {/* Guide: Additional Fields */}
          {contentType === "guide" && (
            <SidebarCard title="Guide Settings" icon={Clock}>
              <Field label="Estimated Reading Time">
                <Input placeholder="e.g. 5 menit" className="rounded-[10px] h-9 text-[13px] border-border bg-surface" />
              </Field>
              <Field label="Difficulty Level">
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="rounded-[10px] h-9 text-[13px] border-border bg-surface"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {difficulties.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <div className="flex items-center gap-3 pt-1">
                <span className="text-[11px] text-muted-foreground">Helpful?</span>
                <button className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors">
                  <ThumbsUp className="h-3.5 w-3.5" strokeWidth={1.6} /> Yes
                </button>
                <button className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive transition-colors">
                  <ThumbsDown className="h-3.5 w-3.5" strokeWidth={1.6} /> No
                </button>
              </div>
            </SidebarCard>
          )}

          {/* Categorization */}
          <SidebarCard title="Categorization" icon={Hash}>
            <Field label="Category">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="rounded-[10px] h-9 text-[13px] border-border bg-surface"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Tags">
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

          {/* Relations */}
          <SidebarCard title="Relations" icon={Link2}>
            <Field label="Related Product">
              <Select value={product} onValueChange={setProduct}>
                <SelectTrigger className="rounded-[10px] h-9 text-[13px] border-border bg-surface"><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent>
                  {products.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Audience">
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger className="rounded-[10px] h-9 text-[13px] border-border bg-surface"><SelectValue placeholder="Select audience" /></SelectTrigger>
                <SelectContent>
                  {audiences.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Organization Level">
              <Select value={orgLevel} onValueChange={setOrgLevel}>
                <SelectTrigger className="rounded-[10px] h-9 text-[13px] border-border bg-surface"><SelectValue placeholder="Select level" /></SelectTrigger>
                <SelectContent>
                  {orgLevels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Related Content">
              <Input placeholder="Search related content..." className="rounded-[10px] h-9 text-[13px] border-border bg-surface" />
            </Field>
          </SidebarCard>

          {/* Editor Notes */}
          <SidebarCard title="Notes" icon={FileText}>
            <Field label="Editor Notes" hint="Internal only — not visible to users">
              <Textarea value={editorNotes} onChange={(e) => setEditorNotes(e.target.value)} rows={2} className="rounded-[10px] resize-none text-[13px] border-border bg-surface leading-relaxed" placeholder="Internal notes..." />
            </Field>
            {contentType === "video" && (
              <Field label="Reject Reason">
                <Input value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Reason if rejecting..." className="rounded-[10px] h-9 text-[13px] border-border bg-surface" />
              </Field>
            )}
          </SidebarCard>

          {/* Action Buttons */}
          <div className="rounded-xl border border-border bg-surface shadow-soft p-4 space-y-2.5">
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 h-9 rounded-[10px] text-xs border-border" onClick={handleSave}>
                <Save className="h-3.5 w-3.5 mr-1.5" strokeWidth={1.6} /> Save Draft
              </Button>
              <Button className="flex-1 h-9 rounded-[10px] text-xs bg-primary text-primary-foreground hover:bg-primary/90" onClick={handlePublish}>
                <CheckCircle className="h-3.5 w-3.5 mr-1.5" strokeWidth={1.6} /> Publish
              </Button>
            </div>
            <Button
              variant="ghost"
              className="w-full h-9 rounded-[10px] text-xs text-destructive hover:bg-status-danger-bg hover:text-status-danger-fg"
              onClick={handleReject}
            >
              <XCircle className="h-3.5 w-3.5 mr-1.5" strokeWidth={1.6} /> Reject
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
