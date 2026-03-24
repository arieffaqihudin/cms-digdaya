import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, CheckCircle, XCircle, ExternalLink } from "lucide-react";
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

export default function ContentEditor() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const contentType = getContentType(searchParams, id);
  const isNew = id === "new";

  // Fetch existing data
  const video = contentType === "video" ? mockVideos.find(v => v.id === id) : null;
  const guide = contentType === "guide" ? mockGuides.find(g => g.id === id) : null;
  const faq = contentType === "faq" ? mockFAQs.find(f => f.id === id) : null;
  const blog = contentType === "blog" ? mockBlogs.find(b => b.id === id) : null;

  const [title, setTitle] = useState(
    video?.displayTitle || video?.title || guide?.title || faq?.question || blog?.title || ""
  );
  const [summary, setSummary] = useState(
    video?.shortDescription || guide?.summary || blog?.excerpt || ""
  );
  const [category, setCategory] = useState(
    video?.category || video?.aiSuggestion || guide?.category || faq?.category || blog?.category || ""
  );
  const [product, setProduct] = useState(guide?.relatedProduct || faq?.relatedProduct || "");
  const [status, setStatus] = useState<string>(
    video?.status || guide?.status || faq?.status || blog?.status || "draft"
  );
  const [featured, setFeatured] = useState(video?.featured || blog?.featured || false);
  const [publishToggle, setPublishToggle] = useState(status === "published");
  const [showOnHomepage, setShowOnHomepage] = useState(video?.showOnHomepage || false);
  const [editorNotes, setEditorNotes] = useState(video?.editorNotes || "");
  const [orgLevel, setOrgLevel] = useState(video?.organizationLevel || "");
  const [audience, setAudience] = useState("");
  const [content, setContent] = useState(faq?.answer || guide?.content || blog?.content || "");
  const [author, setAuthor] = useState(blog?.author || "");
  const [rejectReason, setRejectReason] = useState(video?.rejectReason || "");

  const backPath = getBackPath(contentType);
  const handleSave = () => toast.success("Draft saved successfully.");
  const handlePublish = () => { toast.success(`${typeLabels[contentType]} published!`); navigate(backPath); };
  const handleReject = () => { toast.success(`${typeLabels[contentType]} rejected.`); navigate(backPath); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link to={backPath} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to {typeLabels[contentType]}
        </Link>
        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary">
          {typeLabels[contentType]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left – Content pane (3/5) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Video-specific: preview & source info */}
          {contentType === "video" && video && (
            <>
              <div className="rounded-lg overflow-hidden bg-foreground/95 aspect-video flex items-center justify-center">
                <img src={video.thumbnail} alt="" className="w-full h-full object-cover opacity-80" />
              </div>
              <div className="rounded-lg border border-border bg-surface p-6 shadow-card space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-foreground">Source Information</h3>
                  <StatusBadge status={video.status} />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Original Title</p>
                    <p className="text-foreground">{video.title}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Source Channel</p>
                    <p className="text-foreground">{video.channel}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Publish Date</p>
                    <p className="text-foreground tabular-nums">{video.publishDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">AI Suggestion</p>
                    <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[11px] font-medium text-primary">{video.aiSuggestion}</span>
                  </div>
                </div>
                {video.description && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">YouTube Description</p>
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

          {/* Content editor area for non-video */}
          {contentType !== "video" && (
            <div className="rounded-lg border border-border bg-surface p-6 shadow-card space-y-4">
              <h3 className="text-base font-semibold text-foreground">
                {contentType === "faq" ? "Answer" : "Content"}
              </h3>

              {/* Blog: cover image */}
              {contentType === "blog" && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cover Image</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-sm text-muted-foreground hover:border-primary/40 transition-colors cursor-pointer">
                    Click to upload or drag & drop
                  </div>
                </div>
              )}

              {/* Main content textarea */}
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={contentType === "faq" ? 6 : 14}
                className="rounded-md resize-none"
                placeholder={
                  contentType === "faq"
                    ? "Write the answer to this FAQ..."
                    : contentType === "guide"
                    ? "Write step-by-step guide content..."
                    : "Write your article content..."
                }
              />

              {/* Media embed area */}
              {contentType !== "faq" && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Media Embed</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center text-sm text-muted-foreground hover:border-primary/40 transition-colors cursor-pointer">
                    Embed images, videos, or other media
                  </div>
                </div>
              )}

              {/* Content preview */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preview</Label>
                <div className="rounded-lg border border-border bg-background p-4 min-h-[80px] text-sm text-muted-foreground">
                  {content || <span className="italic">Content preview will appear here...</span>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right – Metadata pane (2/5) */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border bg-surface p-6 shadow-card space-y-5">
            <h3 className="text-base font-semibold text-foreground">Metadata</h3>

            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {contentType === "faq" ? "Question" : "Title"}
              </Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-md" />
            </div>

            {/* Summary */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Summary</Label>
              <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className="rounded-md resize-none" />
            </div>

            {/* Author (blog only) */}
            {contentType === "blog" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Author</Label>
                <Input value={author} onChange={(e) => setAuthor(e.target.value)} className="rounded-md" />
              </div>
            )}

            {/* Category */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="rounded-md"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tags</Label>
              <div className="flex flex-wrap gap-1.5">
                {allTags.map((t) => (
                  <span key={t} className="cursor-pointer rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Related Product */}
            {(contentType === "guide" || contentType === "faq") && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Related Product</Label>
                <Select value={product} onValueChange={setProduct}>
                  <SelectTrigger className="rounded-md"><SelectValue placeholder="Select product" /></SelectTrigger>
                  <SelectContent>
                    {products.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Audience */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger className="rounded-md"><SelectValue placeholder="Select audience" /></SelectTrigger>
                <SelectContent>
                  {audiences.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Organization Level */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Organization Level</Label>
              <Select value={orgLevel} onValueChange={setOrgLevel}>
                <SelectTrigger className="rounded-md"><SelectValue placeholder="Select level" /></SelectTrigger>
                <SelectContent>
                  {orgLevels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-foreground">Featured</Label>
                <Switch checked={featured} onCheckedChange={setFeatured} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-foreground">Publish</Label>
                <Switch checked={publishToggle} onCheckedChange={setPublishToggle} />
              </div>
              {contentType === "video" && (
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-foreground">Show on Homepage</Label>
                  <Switch checked={showOnHomepage} onCheckedChange={setShowOnHomepage} />
                </div>
              )}
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="rounded-md"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="need_review">Need Review</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Scheduled publish date */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Scheduled Publish Date</Label>
              <Input type="date" className="rounded-md" />
            </div>

            {/* Related content */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Related Content</Label>
              <Input placeholder="Search related content..." className="rounded-md" />
            </div>

            {/* Editor Notes */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Editor Notes</Label>
              <Textarea value={editorNotes} onChange={(e) => setEditorNotes(e.target.value)} rows={2} className="rounded-md resize-none" placeholder="Internal notes..." />
            </div>

            {/* Reject Reason (video) */}
            {contentType === "video" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reject Reason</Label>
                <Input value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Reason if rejecting..." className="rounded-md" />
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-border">
              <Button variant="outline" className="flex-1 rounded-md" onClick={handleSave}>
                <Save className="h-4 w-4 mr-1.5" /> Save Draft
              </Button>
              <Button className="flex-1 rounded-md bg-primary text-primary-foreground hover:bg-primary/90" onClick={handlePublish}>
                <CheckCircle className="h-4 w-4 mr-1.5" /> Publish
              </Button>
              <Button variant="outline" className="rounded-md text-destructive border-destructive/30 hover:bg-destructive/5" onClick={handleReject}>
                <XCircle className="h-4 w-4 mr-1.5" /> Reject
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
