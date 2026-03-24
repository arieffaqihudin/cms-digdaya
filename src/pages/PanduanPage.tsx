import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Eye, Plus } from "lucide-react";
import { mockGuides, products } from "@/lib/mock-data";
import StatusBadge from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PanduanPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");

  const filtered = mockGuides.filter((g) => {
    if (search && !g.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && g.status !== statusFilter) return false;
    if (productFilter !== "all" && g.relatedProduct !== productFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-surface p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search guides..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 rounded-md" />
          </div>
          <Select value={productFilter} onValueChange={setProductFilter}>
            <SelectTrigger className="w-[180px] h-9 rounded-md"><SelectValue placeholder="Product" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              {products.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] h-9 rounded-md"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Link to="/content/new?type=guide">
            <Button size="sm" className="h-9 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-1.5" /> New Guide
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/80">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Updated</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((g) => (
                <tr key={g.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{g.title}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[11px] font-medium text-primary">{g.relatedProduct}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{g.category}</td>
                  <td className="px-4 py-3"><StatusBadge status={g.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground tabular-nums whitespace-nowrap">{g.lastUpdated}</td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/content/${g.id}?type=guide`}>
                      <Button size="sm" variant="outline" className="h-8 rounded-md"><Eye className="h-3.5 w-3.5 mr-1" /> Edit</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="p-12 text-center text-sm text-muted-foreground">No guides found.</div>}
      </div>
    </div>
  );
}
