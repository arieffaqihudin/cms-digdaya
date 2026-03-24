import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Eye, Plus } from "lucide-react";
import { mockBlogs } from "@/lib/mock-data";
import StatusBadge from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockBlogs.filter((b) => {
    if (search && !b.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-surface p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search blog posts..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 rounded-md" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] h-9 rounded-md"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Link to="/content/new?type=blog">
            <Button size="sm" className="h-9 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-1.5" /> New Post
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/80">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Post</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Author</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Featured</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={b.coverImage} alt="" className="h-12 w-20 rounded object-cover bg-muted shrink-0" />
                      <span className="font-medium text-foreground line-clamp-2 max-w-xs">{b.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{b.author}</td>
                  <td className="px-4 py-3 text-muted-foreground tabular-nums whitespace-nowrap">{b.publishDate}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3 text-center"><Switch checked={b.featured} /></td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/content/${b.id}?type=blog`}>
                      <Button size="sm" variant="outline" className="h-8 rounded-md"><Eye className="h-3.5 w-3.5 mr-1" /> Edit</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="p-12 text-center text-sm text-muted-foreground">No blog posts found.</div>}
      </div>
    </div>
  );
}
