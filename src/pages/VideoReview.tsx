import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Save, CheckCircle, XCircle } from "lucide-react";
import { mockVideos, categories, tags as allTags } from "@/lib/mock-data";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

const orgLevels = ["Pusat", "Wilayah", "Cabang", "MWC", "Ranting"];

export default function VideoReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const video = mockVideos.find((v) => v.id === id);

  const [displayTitle, setDisplayTitle] = useState(video?.displayTitle || video?.title || "");
  const [shortDesc, setShortDesc] = useState(video?.shortDescription || "");
  const [category, setCategory] = useState(video?.category || video?.aiSuggestion || "");
  const [orgLevel, setOrgLevel] = useState(video?.organizationLevel || "");
  const [relatedFigure, setRelatedFigure] = useState(video?.relatedFigure || "");
  const [featured, setFeatured] = useState(video?.featured || false);
  const [publishToggle, setPublishToggle] = useState(video?.status === "published");
  const [showOnHomepage, setShowOnHomepage] = useState(video?.showOnHomepage || false);
  const [status, setStatus] = useState(video?.status || "need_review");
  const [editorNotes, setEditorNotes] = useState(video?.editorNotes || "");
  const [rejectReason, setRejectReason] = useState(video?.rejectReason || "");

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p>Video not found.</p>
        <Link to="/inbox" className="mt-2 text-primary hover:underline text-sm">
          Back to Inbox
        </Link>
      </div>
    );
  }

  const handleSave = () => toast.success("Draft saved successfully.");
  const handlePublish = () => { toast.success("Video published!"); navigate("/inbox"); };
  const handleReject = () => { toast.success("Video rejected."); navigate("/inbox"); };

  return (
    <div className="space-y-4">
      {/* Back nav */}
      <Link
        to="/inbox"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Inbox
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left – Source pane (3/5) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Video player */}
          <div className="rounded-lg overflow-hidden bg-foreground/95 aspect-video flex items-center justify-center">
            <img src={video.thumbnail} alt="" className="w-full h-full object-cover opacity-80" />
          </div>

          {/* Source metadata */}
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
                <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[11px] font-medium text-primary">
                  {video.aiSuggestion}
                </span>
              </div>
            </div>
            {video.description && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">YouTube Description</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{video.description}</p>
              </div>
            )}
            {video.youtubeUrl && (
              <a
                href={video.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                View on YouTube <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Right – Editor pane (2/5) */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border bg-surface p-6 shadow-card space-y-5">
            <h3 className="text-base font-semibold text-foreground">Editor Panel</h3>

            {/* Display Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Display Title</Label>
              <Input value={displayTitle} onChange={(e) => setDisplayTitle(e.target.value)} className="rounded-md" />
            </div>

            {/* Short Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Short Description</Label>
              <Textarea value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} rows={3} className="rounded-md resize-none" />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Main Category</Label>
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
                  <span
                    key={t}
                    className="cursor-pointer rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
                  >
                    {t}
                  </span>
                ))}
              </div>
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

            {/* Related Figure */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Related Figure</Label>
              <Input value={relatedFigure} onChange={(e) => setRelatedFigure(e.target.value)} placeholder="e.g. KH. Said Aqil Siroj" className="rounded-md" />
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
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-foreground">Show on Homepage</Label>
                <Switch checked={showOnHomepage} onCheckedChange={setShowOnHomepage} />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</Label>
              <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                <SelectTrigger className="rounded-md"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="need_review">Need Review</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Editor Notes */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Editor Notes</Label>
              <Textarea value={editorNotes} onChange={(e) => setEditorNotes(e.target.value)} rows={2} className="rounded-md resize-none" placeholder="Internal notes..." />
            </div>

            {/* Reject Reason */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reject Reason</Label>
              <Input value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Reason if rejecting..." className="rounded-md" />
            </div>

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
