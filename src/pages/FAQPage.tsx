import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Eye, Plus, GripVertical } from "lucide-react";
import { mockFAQs, products } from "@/lib/mock-data";
import StatusBadge from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");

  const filtered = mockFAQs.filter((f) => {
    if (search && !f.question.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && f.status !== statusFilter) return false;
    if (productFilter !== "all" && f.relatedProduct !== productFilter) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-surface p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search FAQs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 rounded-lg text-[13px]" />
          </div>
          <Select value={productFilter} onValueChange={setProductFilter}>
            <SelectTrigger className="w-[170px] h-9 rounded-lg text-[13px]"><SelectValue placeholder="Product" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              {products.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[145px] h-9 rounded-lg text-[13px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Link to="/content/new?type=faq">
            <Button size="sm" className="h-9 rounded-lg text-[13px] bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-1.5" /> New FAQ
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border">
                <th className="px-3 py-3.5 w-8"></th>
                <th className="px-4 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Question</th>
                <th className="px-4 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Product</th>
                <th className="px-4 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Category</th>
                <th className="px-4 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-4 py-3.5 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Order</th>
                <th className="px-4 py-3.5 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((f) => (
                <tr key={f.id} className="hover:bg-accent/30 transition-colors">
                  <td className="px-3 py-3"><GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab" /></td>
                  <td className="px-4 py-3 font-medium text-foreground max-w-md">{f.question}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-primary/8 px-2 py-0.5 text-[11px] font-medium text-primary">{f.relatedProduct}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{f.category}</td>
                  <td className="px-4 py-3"><StatusBadge status={f.status} /></td>
                  <td className="px-4 py-3 text-center tabular-nums text-muted-foreground">{f.order}</td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/content/${f.id}?type=faq`}>
                      <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs"><Eye className="h-3.5 w-3.5 mr-1" /> Edit</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="p-14 text-center text-[13px] text-muted-foreground">No FAQs found.</div>}
      </div>
    </div>
  );
}
