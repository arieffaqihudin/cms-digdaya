import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, CheckCircle, XCircle, ExternalLink, Plus, Trash2, Image, Video, FileText } from "lucide-react";
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
const typeIcons: Record<ContentType, typeof Video> = { video: Video, guide: FileText, faq: FileText, blog: FileText };

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
  const [steps, setSteps] = useState([
    { title: "Step 1", content: "" },
    { title: "Step 2", content: "" },
  ]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const backPath = getBackPath(contentType);
  const handleSave = () => toast.success("Draft saved successfully.");
  const handlePublish = () => { toast.success(`${typeLabels[contentType]} published!`); navigate(backPath); };
  const handleReject = () => { toast.success(`${typeLabels[contentType]} rejected.`); navigate(backPath); };

  const TypeIcon = typeIcons[contentType];

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link to={backPath} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to {typeLabels[contentType]}
        </Link>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary">
            <TypeIcon className="h-3 w-3" />
            {typeLabels[contentType]}
          </span>
          {!isNew && <StatusBadge status={status} />}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ═══════════════════════════════════════════
            LEFT COLUMN — Title + Content Editor (8/12)
            ═══════════════════════════════════════════ */}
        <div className="lg:col-span-8 space-y-4">
          {/* Title input */}
          <div className="rounded-lg border border-border bg-surface p-5 shadow-card">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-md text-lg font-semibold border-0 shadow-none px-0 focus-visible:ring-0 h-auto py-1 placeholder:font-normal"
              placeholder={contentType === "faq" ? "Enter your question..." : "Enter title..."}
            />
          </div>

          {/* Video: YouTube preview & source metadata */}
          {contentType === "video" && video && (
            <>
              <div className="rounded-lg overflow-hidden bg-foreground/95 aspect-video flex items-center justify-center">
                <img src={video.thumbnail} alt="" className="w-full h-full object-cover opacity-80" />
              </div>
              <div className="rounded-lg border border-border bg-surface p-5 shadow-card space-y-4">
                <h3 className="text-sm font-semibold text-foreground">YouTube Source</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">Original Title</p>
                    <p className="text-foreground text-sm">{video.title}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">Source Channel</p>
                    <p className="text-foreground text-sm">{video.channel}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">Publish Date</p>
                    <p className="text-foreground tabular-nums text-sm">{video.publishDate}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">AI Suggestion</p>
                    <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[11px] font-medium text-primary">{video.aiSuggestion}</span>
                  </div>
                </div>
                {video.description && (
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mb-1">Description</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{video.description}</p>
                  </div>
                )}
                {video.youtubeUrl && (
                  <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                    View on YouTube <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </>
          )}

          {/* Blog: Cover image */}
          {contentType === "blog" && (
            <div className="rounded-lg border border-border bg-surface p-5 shadow-card space-y-3">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Cover Image</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-10 text-center hover:border-primary/40 transition-colors cursor-pointer">
                <Image className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload or drag & drop</p>
                <p className="text-xs text-muted-foreground/60 mt-1">PNG, JPG up to 5MB · Recommended 1200×630</p>
              </div>
            </div>
          )}

          {/* FAQ: Answer */}
          {contentType === "faq" && (
            <div className="rounded-lg border border-border bg-surface p-5 shadow-card space-y-3">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Answer</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="rounded-md resize-none"
                placeholder="Write the answer to this FAQ..."
              />
            </div>
          )}

          {/* Guide: Structured steps */}
          {contentType === "guide" && (
            <div className="rounded-lg border border-border bg-surface p-5 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Guide Steps</Label>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 rounded-md text-xs"
                  onClick={() => setSteps([...steps, { title: `Step ${steps.length + 1}`, content: "" }])}
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Step
                </Button>
              </div>
              <div className="space-y-3">
                {steps.map((step, i) => (
                  <div key={i} className="rounded-lg border border-border p-4 space-y-2 bg-background">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">{i + 1}</span>
                      <Input
                        value={step.title}
                        onChange={(e) => {
                          const newSteps = [...steps];
                          newSteps[i] = { ...newSteps[i], title: e.target.value };
                          setSteps(newSteps);
                        }}
                        className="rounded-md border-0 shadow-none px-0 focus-visible:ring-0 font-medium"
                        placeholder="Step title..."
                      />
                      {steps.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => setSteps(steps.filter((_, j) => j !== i))}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                    <Textarea
                      value={step.content}
                      onChange={(e) => {
                        const newSteps = [...steps];
                        newSteps[i] = { ...newSteps[i], content: e.target.value };
                        setSteps(newSteps);
                      }}
                      rows={3}
                      className="rounded-md resize-none"
                      placeholder="Describe this step..."
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blog/Video: Rich text content area */}
          {(contentType === "blog" || contentType === "video") && (
            <div className="rounded-lg border border-border bg-surface p-5 shadow-card space-y-3">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {contentType === "video" ? "Display Description" : "Article Content"}
              </Label>
              {/* Toolbar mock */}
              <div className="flex items-center gap-1 border border-border rounded-md p-1.5 bg-background">
                {["B", "I", "U", "H1", "H2", "Link", "List", "Image"].map((btn) => (
                  <button key={btn} className="px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground rounded transition-colors">
                    {btn}
                  </button>
                ))}
              </div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={contentType === "video" ? 6 : 14}
                className="rounded-md resize-none font-mono text-sm"
                placeholder="Write content here..."
              />
            </div>
          )}

          {/* Media embed area (blog, guide) */}
          {(contentType === "blog" || contentType === "guide") && (
            <div className="rounded-lg border border-border bg-surface p-5 shadow-card space-y-3">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Media Embed</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
                <Video className="h-6 w-6 mx-auto text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">Embed images, videos, or other media</p>
              </div>
            </div>
          )}

          {/* Content preview */}
          <div className="rounded-lg border border-border bg-surface p-5 shadow-card space-y-3">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Content Preview</Label>
            <div className="rounded-lg border border-border bg-background p-5 min-h-[100px] text-sm text-muted-foreground">
              {title && <h4 className="text-base font-semibold text-foreground mb-2">{title}</h4>}
              {content || <span className="italic">Preview will appear here as you write...</span>}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            RIGHT COLUMN — Metadata Sidebar (4/12)
            ═══════════════════════════════════════════ */}
        <div className="lg:col-span-4 space-y-4">
          {/* Publish actions card */}
          <div className="rounded-lg border border-border bg-surface p-5 shadow-card space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Publish</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-foreground">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-[140px] h-8 rounded-md text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="need_review">Need Review</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm text-foreground">Publish</Label>
                <Switch checked={publishToggle} onCheckedChange={setPublishToggle} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm text-foreground">Featured</Label>
                <Switch checked={featured} onCheckedChange={setFeatured} />
              </div>
              {contentType === "video" && (
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-foreground">Show on Homepage</Label>
                  <Switch checked={showOnHomepage} onCheckedChange={setShowOnHomepage} />
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Scheduled Date</Label>
              <Input type="date" className="rounded-md h-9 text-sm" />
            </div>
            <div className="flex gap-2 pt-2 border-t border-border">
              <Button variant="outline" className="flex-1 h-9 rounded-md text-xs" onClick={handleSave}>
                <Save className="h-3.5 w-3.5 mr-1" /> Save Draft
              </Button>
              <Button className="flex-1 h-9 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-xs" onClick={handlePublish}>
                <CheckCircle className="h-3.5 w-3.5 mr-1" /> Publish
              </Button>
            </div>
            <Button variant="outline" className="w-full h-9 rounded-md text-xs text-destructive border-destructive/30 hover:bg-destructive/5" onClick={handleReject}>
              <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
            </Button>
          </div>

          {/* Summary */}
          <div className="rounded-lg border border-border bg-surface p-5 shadow-card space-y-3">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Summary / Excerpt</Label>
            <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className="rounded-md resize-none text-sm" placeholder="Brief description..." />
          </div>

          {/* Blog-specific: Author */}
          {contentType === "blog" && (
            <div className="rounded-lg border border-border bg-surface p-5 shadow-card space-y-3">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Author</Label>
              <Input value={author} onChange={(e) => setAuthor(e.target.value)} className="rounded-md h-9 text-sm" placeholder="Author name..." />
            </div>
          )}

          {/* Taxonomy card */}
          <div className="rounded-lg border border-border bg-surface p-5 shadow-card space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Taxonomy</h3>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="rounded-md h-9 text-sm"><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Tags</Label>
                <div className="flex flex-wrap gap-1.5">
                  {allTags.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleTag(t)}
                      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                        selectedTags.includes(t)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Relations card */}
          <div className="rounded-lg border border-border bg-surface p-5 shadow-card space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Relations</h3>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Related Product</Label>
                <Select value={product} onValueChange={setProduct}>
                  <SelectTrigger className="rounded-md h-9 text-sm"><SelectValue placeholder="Select product" /></SelectTrigger>
                  <SelectContent>
                    {products.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Audience</Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger className="rounded-md h-9 text-sm"><SelectValue placeholder="Select audience" /></SelectTrigger>
                  <SelectContent>
                    {audiences.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Organization Level</Label>
                <Select value={orgLevel} onValueChange={setOrgLevel}>
                  <SelectTrigger className="rounded-md h-9 text-sm"><SelectValue placeholder="Select level" /></SelectTrigger>
                  <SelectContent>
                    {orgLevels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Related Content</Label>
                <Input placeholder="Search related content..." className="rounded-md h-9 text-sm" />
              </div>
            </div>
          </div>

          {/* Editor Notes */}
          <div className="rounded-lg border border-border bg-surface p-5 shadow-card space-y-3">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Editor Notes</Label>
            <Textarea value={editorNotes} onChange={(e) => setEditorNotes(e.target.value)} rows={2} className="rounded-md resize-none text-sm" placeholder="Internal notes..." />
          </div>

          {/* Reject reason (video) */}
          {contentType === "video" && (
            <div className="rounded-lg border border-border bg-surface p-5 shadow-card space-y-3">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Reject Reason</Label>
              <Input value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Reason if rejecting..." className="rounded-md h-9 text-sm" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
