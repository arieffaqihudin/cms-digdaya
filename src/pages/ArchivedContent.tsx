import { useState } from "react";
import { Search, RotateCcw } from "lucide-react";
import { mockVideos, mockBlogs, mockGuides, mockFAQs } from "@/lib/mock-data";
import StatusBadge from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ArchivedContent() {
  const [search, setSearch] = useState("");

  const allArchived = [
    ...mockVideos.filter(v => v.status === "rejected").map(v => ({ id: v.id, title: v.title, type: "Video" as const, reason: v.rejectReason, date: v.publishDate, status: v.status, editUrl: `/video/${v.id}` })),
    ...mockBlogs.filter(b => b.status === "archived").map(b => ({ id: b.id, title: b.title, type: "Blog" as const, reason: "Archived", date: b.publishDate, status: b.status, editUrl: `/content/${b.id}?type=blog` })),
    ...mockGuides.filter(g => g.status === "archived").map(g => ({ id: g.id, title: g.title, type: "Guide" as const, reason: "Archived", date: g.lastUpdated, status: g.status, editUrl: `/content/${g.id}?type=guide` })),
    ...mockFAQs.filter(f => f.status === "archived").map(f => ({ id: f.id, title: f.question, type: "FAQ" as const, reason: "Archived", date: "-", status: f.status, editUrl: `/content/${f.id}?type=faq` })),
  ].filter(item => !search || item.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-surface p-4 shadow-card">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search archived content..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 rounded-lg text-[13px]" />
        </div>
      </div>
      <div className="rounded-xl border border-border bg-surface shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Content</th>
                <th className="px-4 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Type</th>
                <th className="px-4 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Reason</th>
                <th className="px-4 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-4 py-3.5 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allArchived.map((item) => (
                <tr key={`${item.type}-${item.id}`} className="hover:bg-accent/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground max-w-xs truncate">{item.title}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-primary/8 px-2 py-0.5 text-[11px] font-medium text-primary">{item.type}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{item.reason || "—"}</td>
                  <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <Link to={item.editUrl}>
                      <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs"><RotateCcw className="h-3.5 w-3.5 mr-1" /> Review</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {allArchived.length === 0 && <div className="p-14 text-center text-[13px] text-muted-foreground">No archived content.</div>}
      </div>
    </div>
  );
}
