import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Eye, Plus, GripVertical, HelpCircle } from "lucide-react";
import { mockFAQs, products, categories } from "@/lib/mock-data";
import StatusBadge from "@/components/StatusBadge";
import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ITEMS_PER_PAGE = 8;

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => mockFAQs.filter((f) => {
    if (search && !f.question.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && f.status !== statusFilter) return false;
    if (productFilter !== "all" && f.relatedProduct !== productFilter) return false;
    if (categoryFilter !== "all" && f.category !== categoryFilter) return false;
    return true;
  }), [search, statusFilter, productFilter, categoryFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">FAQ</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Kelola pertanyaan yang sering diajukan</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-[10px] bg-accent/60 px-3 py-1.5 text-[12px] text-muted-foreground">
            <HelpCircle className="h-3.5 w-3.5" strokeWidth={1.6} />
            <span className="tabular-nums font-medium">{filtered.length}</span>
            <span>FAQ</span>
          </div>
        </div>
      </div>

      <div className="rounded-[12px] border border-border bg-surface p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
            <Input placeholder="Cari FAQ..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 h-9 rounded-[10px] text-[13px] border-border bg-background focus-visible:ring-1 focus-visible:ring-ring" />
          </div>
          <Select value={productFilter} onValueChange={(v) => { setProductFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[170px] h-9 rounded-[10px] text-[13px] border-border bg-background"><SelectValue placeholder="Produk" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Produk</SelectItem>
              {products.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[160px] h-9 rounded-[10px] text-[13px] border-border bg-background"><SelectValue placeholder="Kategori" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[150px] h-9 rounded-[10px] text-[13px] border-border bg-background"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Dipublikasikan</SelectItem>
              <SelectItem value="archived">Diarsipkan</SelectItem>
            </SelectContent>
          </Select>
          <Link to="/content/new?type=faq">
            <Button size="sm" className="h-9 rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
              <Plus className="h-4 w-4" strokeWidth={1.6} /> FAQ Baru
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-[12px] border border-border bg-surface shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border/60">
                <th className="px-3 py-3.5 w-8"></th>
                <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Pertanyaan</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Kategori</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Produk Terkait</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Status</th>
                <th className="px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Urutan</th>
                <th className="px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((f) => (
                <tr key={f.id} className="border-b border-border/30 hover:bg-accent/30 transition-colors duration-150">
                  <td className="px-3 py-4"><GripVertical className="h-4 w-4 text-muted-foreground/40 cursor-grab" strokeWidth={1.6} /></td>
                  <td className="px-5 py-4 font-medium text-foreground max-w-md leading-[1.4]">{f.question}</td>
                  <td className="px-5 py-4 text-muted-foreground">{f.category}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-full bg-primary/[0.07] px-2.5 py-[3px] text-[11px] font-medium text-primary">{f.relatedProduct}</span>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={f.status} /></td>
                  <td className="px-5 py-4 text-center tabular-nums text-muted-foreground">{f.order}</td>
                  <td className="px-5 py-4 text-right">
                    <Link to={`/content/${f.id}?type=faq`}>
                      <Button size="sm" variant="ghost" className="h-8 rounded-[8px] text-xs text-muted-foreground hover:text-foreground hover:bg-accent gap-1.5">
                        <Eye className="h-3.5 w-3.5" strokeWidth={1.6} /> Edit
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="p-16 text-center text-[13px] text-muted-foreground">Tidak ada FAQ ditemukan.</div>}
        {totalPages > 0 && (
          <div className="border-t border-border/40">
            <Pagination currentPage={page} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}