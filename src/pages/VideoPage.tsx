import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Eye, CheckCircle, XCircle, FolderTree, Tag } from "lucide-react";
import { mockVideos, channels, categories } from "@/lib/mock-data";
import StatusBadge from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function VideoPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = mockVideos.filter((v) => {
    if (search && !v.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (channelFilter !== "all" && v.channel !== channelFilter) return false;
    if (statusFilter !== "all" && v.status !== statusFilter) return false;
    if (categoryFilter !== "all" && v.aiSuggestion !== categoryFilter) return false;
    return true;
  });

  const toggleSelect = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const toggleAll = () =>
    setSelected((s) => (s.length === filtered.length ? [] : filtered.map((v) => v.id)));

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="rounded-lg border border-border bg-surface p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search videos..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 rounded-md" />
          </div>
          <Select value={channelFilter} onValueChange={setChannelFilter}>
            <SelectTrigger className="w-[160px] h-9 rounded-md"><SelectValue placeholder="Channel" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              {channels.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] h-9 rounded-md"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="need_review">Need Review</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px] h-9 rounded-md"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <span className="text-sm font-medium text-foreground tabular-nums">{selected.length} selected</span>
          <div className="flex gap-2 ml-auto">
            <Button size="sm" className="h-8 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"><CheckCircle className="h-3.5 w-3.5 mr-1.5" /> Publish</Button>
            <Button size="sm" variant="outline" className="h-8 rounded-md"><XCircle className="h-3.5 w-3.5 mr-1.5" /> Reject</Button>
            <Button size="sm" variant="outline" className="h-8 rounded-md"><FolderTree className="h-3.5 w-3.5 mr-1.5" /> Category</Button>
            <Button size="sm" variant="outline" className="h-8 rounded-md"><Tag className="h-3.5 w-3.5 mr-1.5" /> Tags</Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-border bg-surface shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/80">
                <th className="px-4 py-3 text-left w-10"><Checkbox checked={selected.length === filtered.length && filtered.length > 0} onCheckedChange={toggleAll} /></th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Video</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Channel</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI Suggestion</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Publish</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3"><Checkbox checked={selected.includes(v.id)} onCheckedChange={() => toggleSelect(v.id)} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={v.thumbnail} alt="" className="h-14 w-24 rounded object-cover bg-muted shrink-0" />
                      <span className="font-medium text-foreground line-clamp-2 max-w-xs">{v.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{v.channel}</td>
                  <td className="px-4 py-3 text-muted-foreground tabular-nums whitespace-nowrap">{v.publishDate}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[11px] font-medium text-primary">{v.aiSuggestion}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={v.status} /></td>
                  <td className="px-4 py-3 text-center"><Switch checked={v.status === "published"} /></td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/video/${v.id}`}>
                      <Button size="sm" variant="outline" className="h-8 rounded-md"><Eye className="h-3.5 w-3.5 mr-1" /> Review</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-sm text-muted-foreground">No videos match your filters.</div>
        )}
      </div>
    </div>
  );
}
