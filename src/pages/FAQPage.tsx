import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Pencil, HelpCircle, Filter, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useScreenSize } from "@/components/AppLayout";
import Pagination from "@/components/Pagination";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTableRow, SortableMobileCard } from "@/components/SortableTableRow";

interface FAQItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  product: string;
  status: "published" | "draft" | "archived";
  orderIndex: number;
}

const faqCategories = ["Pendaftaran & Akun", "Pembayaran", "Fitur Utama", "Teknis & Troubleshoot", "Manajemen Santri", "Kurikulum", "Pendataan Kader", "Surat & Disposisi"];

const initialFAQItems: FAQItem[] = [
  { id: "fq1", title: "Bagaimana cara mendaftar akun Digdaya Persuratan?", slug: "cara-mendaftar-akun-digdaya-persuratan", category: "Pendaftaran & Akun", product: "Digdaya Persuratan", status: "published", orderIndex: 0 },
  { id: "fq2", title: "Bagaimana cara reset password?", slug: "cara-reset-password", category: "Pendaftaran & Akun", product: "Digdaya Persuratan", status: "published", orderIndex: 1 },
  { id: "fq3", title: "Metode pembayaran apa saja yang tersedia?", slug: "metode-pembayaran-tersedia", category: "Pembayaran", product: "Digdaya Persuratan", status: "published", orderIndex: 2 },
  { id: "fq4", title: "Bagaimana cara mengajukan refund?", slug: "cara-mengajukan-refund", category: "Pembayaran", product: "Digdaya Persuratan", status: "draft", orderIndex: 3 },
  { id: "fq5", title: "Apa saja fitur utama Digdaya Persuratan?", slug: "fitur-utama-digdaya-persuratan", category: "Fitur Utama", product: "Digdaya Persuratan", status: "published", orderIndex: 4 },
  { id: "fq6", title: "Bagaimana cara mengelola surat masuk?", slug: "cara-mengelola-surat-masuk", category: "Fitur Utama", product: "Digdaya Persuratan", status: "published", orderIndex: 5 },
  { id: "fq7", title: "Aplikasi error saat login, bagaimana solusinya?", slug: "aplikasi-error-saat-login", category: "Teknis & Troubleshoot", product: "Digdaya Persuratan", status: "archived", orderIndex: 6 },
  { id: "fq8", title: "Bagaimana cara mendaftarkan santri baru?", slug: "cara-mendaftarkan-santri-baru", category: "Manajemen Santri", product: "Digdaya Pesantren", status: "published", orderIndex: 0 },
  { id: "fq9", title: "Bagaimana cara mengatur kurikulum pesantren?", slug: "cara-mengatur-kurikulum-pesantren", category: "Kurikulum", product: "Digdaya Pesantren", status: "published", orderIndex: 1 },
  { id: "fq10", title: "Bagaimana cara input data kader?", slug: "cara-input-data-kader", category: "Pendataan Kader", product: "Siskader NU", status: "published", orderIndex: 0 },
  { id: "fq11", title: "Bagaimana cara verifikasi data kader?", slug: "cara-verifikasi-data-kader", category: "Pendataan Kader", product: "Siskader NU", status: "draft", orderIndex: 1 },
  { id: "fq12", title: "Bagaimana cara membuat surat keluar?", slug: "cara-membuat-surat-keluar", category: "Surat & Disposisi", product: "Digdaya Kepengurusan", status: "published", orderIndex: 0 },
  { id: "fq13", title: "Bagaimana cara disposisi surat?", slug: "cara-disposisi-surat", category: "Surat & Disposisi", product: "Digdaya Kepengurusan", status: "published", orderIndex: 1 },
  { id: "fq14", title: "Apa itu fitur tracking surat?", slug: "fitur-tracking-surat", category: "Surat & Disposisi", product: "Digdaya Kepengurusan", status: "draft", orderIndex: 2 },
];

const productOptions = ["Digdaya Persuratan", "Digdaya Pesantren", "Siskader NU", "Digdaya Kepengurusan"];

const statusMap: Record<string, { label: string; className: string; dot: string }> = {
  published: { label: "Dipublikasikan", className: "bg-[hsl(var(--status-success-bg))] text-[hsl(var(--status-success-fg))]", dot: "bg-[hsl(var(--status-success-fg))]" },
  draft: { label: "Draft", className: "bg-muted text-muted-foreground", dot: "bg-muted-foreground/50" },
  archived: { label: "Diarsipkan", className: "bg-[hsl(var(--status-warning-bg))] text-[hsl(var(--status-warning-fg))]", dot: "bg-[hsl(var(--status-warning-fg))]" },
};

const ITEMS_PER_PAGE = 10;

export default function FAQPage() {
  const [items, setItems] = useState<FAQItem[]>(initialFAQItems);
  const [search, setSearch] = useState("");
  const [productFilter, setProductFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const screenSize = useScreenSize();

  const isDragEnabled = productFilter !== "all";

  const categoriesForProduct = useMemo(() => {
    const filtered = productFilter === "all" ? items : items.filter((f) => f.product === productFilter);
    const cats = new Set(filtered.map((f) => f.category));
    return Array.from(cats);
  }, [productFilter, items]);

  const filtered = useMemo(() => {
    return items
      .filter((f) => {
        if (productFilter !== "all" && f.product !== productFilter) return false;
        if (search && !f.title.toLowerCase().includes(search.toLowerCase()) && !f.slug.toLowerCase().includes(search.toLowerCase())) return false;
        if (categoryFilter !== "all" && f.category !== categoryFilter) return false;
        if (statusFilter !== "all" && f.status !== statusFilter) return false;
        return true;
      })
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }, [items, search, productFilter, categoryFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const allSelected = paged.length > 0 && paged.every((f) => selectedIds.has(f.id));
  const hasActiveFilters = productFilter !== "all" || categoryFilter !== "all" || statusFilter !== "all";

  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(paged.map((f) => f.id)));
  };
  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const pagedIds = paged.map((i) => i.id);
      const oldIndex = pagedIds.indexOf(active.id as string);
      const newIndex = pagedIds.indexOf(over.id as string);
      if (oldIndex === -1 || newIndex === -1) return;

      const reorderedPage = arrayMove(paged, oldIndex, newIndex);

      setItems((prev) => {
        const updated = [...prev];
        reorderedPage.forEach((item, idx) => {
          const found = updated.find((u) => u.id === item.id);
          if (found) found.orderIndex = idx + (page - 1) * ITEMS_PER_PAGE;
        });
        return updated;
      });

      toast.success("Urutan berhasil diperbarui");
    },
    [paged, page]
  );

  const StatusBadge = ({ status }: { status: string }) => {
    const s = statusMap[status] || statusMap.draft;
    return (
      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[11px] font-medium", s.className)}>
        <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
        {s.label}
      </span>
    );
  };

  const filterSelects = (
    <>
      <Select value={productFilter} onValueChange={(v) => { setProductFilter(v); setCategoryFilter("all"); setPage(1); }}>
        <SelectTrigger className="w-full sm:w-[180px] h-9 rounded-[10px] text-[13px] border-border bg-background">
          <SelectValue placeholder="Semua Produk" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Produk</SelectItem>
          {productOptions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(1); }}>
        <SelectTrigger className="w-full sm:w-[180px] h-9 rounded-[10px] text-[13px] border-border bg-background">
          <SelectValue placeholder="Semua Kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Kategori</SelectItem>
          {categoriesForProduct.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
        <SelectTrigger className="w-full sm:w-[150px] h-9 rounded-[10px] text-[13px] border-border bg-background">
          <SelectValue placeholder="Semua Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Status</SelectItem>
          <SelectItem value="published">Dipublikasikan</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="archived">Diarsipkan</SelectItem>
        </SelectContent>
      </Select>
    </>
  );

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-base md:text-lg font-semibold text-foreground">FAQ</h1>
          <p className="text-[12px] md:text-[13px] text-muted-foreground mt-0.5">Kelola pertanyaan yang sering diajukan</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-[10px] bg-accent/60 px-2.5 md:px-3 py-1.5 text-[12px] text-muted-foreground self-start sm:self-auto">
          <HelpCircle className="h-3.5 w-3.5" strokeWidth={1.6} />
          <span className="tabular-nums font-medium">{filtered.length}</span>
          <span className="hidden sm:inline">FAQ</span>
        </div>
      </div>

      {/* Search + Filters + Create */}
      <div className="rounded-[12px] border border-border bg-surface p-3 md:p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
            <Input
              placeholder="Cari FAQ..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 h-9 rounded-[10px] text-[13px] border-border bg-background focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          {screenSize === "mobile" ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className={cn("h-9 rounded-[10px] text-[13px] border-border gap-1.5", hasActiveFilters && "border-primary/40 text-primary")}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-3.5 w-3.5" strokeWidth={1.6} /> Filter
              </Button>
              <Link to="/faq/new" className="w-full sm:w-auto">
                <Button size="sm" className="h-9 w-full rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
                  <Plus className="h-4 w-4" strokeWidth={1.6} /> Buat
                </Button>
              </Link>
            </>
          ) : (
            <>
              {filterSelects}
              <Link to="/faq/new">
                <Button size="sm" className="h-9 rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
                  <Plus className="h-4 w-4" strokeWidth={1.6} /> Buat
                </Button>
              </Link>
            </>
          )}
        </div>
        {screenSize === "mobile" && showFilters && (
          <div className="mt-3 pt-3 border-t border-border/60 space-y-2 animate-fade-in">{filterSelects}</div>
        )}
      </div>

      {/* Drag hint */}
      {!isDragEnabled && filtered.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-[10px] bg-accent/40 text-[12px] text-muted-foreground">
          <Info className="h-3.5 w-3.5 shrink-0" strokeWidth={1.6} />
          <span>Pilih filter Produk untuk mengaktifkan pengurutan drag & drop.</span>
        </div>
      )}

      {/* Table / Card List */}
      <div className="rounded-[12px] border border-border bg-surface shadow-card overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={paged.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            {screenSize === "mobile" ? (
              <div className="divide-y divide-border/30">
                {paged.map((faq) => (
                  <SortableMobileCard key={faq.id} id={faq.id} disabled={!isDragEnabled}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-foreground leading-[1.4]">{faq.title}</p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-[11px] text-muted-foreground">{faq.category}</span>
                          <span className="text-[11px] text-muted-foreground/50">·</span>
                          <span className="inline-flex items-center rounded-full bg-primary/[0.07] px-2 py-[2px] text-[10px] font-medium text-primary">{faq.product}</span>
                        </div>
                        <div className="mt-2">
                          <StatusBadge status={faq.status} />
                        </div>
                      </div>
                      <Link
                        to={`/faq/${faq.id}`}
                        className="flex items-center gap-1 text-[12px] font-medium text-primary hover:text-primary/80 transition-colors shrink-0 mt-0.5"
                      >
                        <Pencil className="h-3 w-3" strokeWidth={1.6} />
                        Ubah
                      </Link>
                    </div>
                  </SortableMobileCard>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="border-b border-border/60">
                      <th className="px-2 py-3.5 w-8" />
                      <th className="px-4 py-3.5 w-10">
                        <Checkbox checked={allSelected} onCheckedChange={toggleAll} className="h-4 w-4" />
                      </th>
                      <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Title</th>
                      <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden xl:table-cell">Slug</th>
                      <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden lg:table-cell">Kategori FAQ</th>
                      <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground hidden lg:table-cell">Produk</th>
                      <th className="px-4 md:px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Status</th>
                      <th className="px-4 md:px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((faq) => (
                      <SortableTableRow key={faq.id} id={faq.id} disabled={!isDragEnabled}>
                        <td className="px-4 py-4">
                          <Checkbox checked={selectedIds.has(faq.id)} onCheckedChange={() => toggleOne(faq.id)} className="h-4 w-4" />
                        </td>
                        <td className="px-4 md:px-5 py-4">
                          <span className="font-medium text-foreground leading-[1.4]">{faq.title}</span>
                          <p className="text-[11px] text-muted-foreground mt-0.5 lg:hidden">{faq.category} · {faq.product}</p>
                        </td>
                        <td className="px-4 md:px-5 py-4 hidden xl:table-cell">
                          <span className="font-mono text-[12px] text-muted-foreground">{faq.slug}</span>
                        </td>
                        <td className="px-4 md:px-5 py-4 text-muted-foreground hidden lg:table-cell">{faq.category}</td>
                        <td className="px-4 md:px-5 py-4 hidden lg:table-cell">
                          <span className="inline-flex items-center rounded-full bg-primary/[0.07] px-2.5 py-[3px] text-[11px] font-medium text-primary">{faq.product}</span>
                        </td>
                        <td className="px-4 md:px-5 py-4"><StatusBadge status={faq.status} /></td>
                        <td className="px-4 md:px-5 py-4 text-right">
                          <Link to={`/faq/${faq.id}`} className="inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:text-primary/80 transition-colors">
                            <Pencil className="h-3 w-3" strokeWidth={1.6} />
                            Ubah
                          </Link>
                        </td>
                      </SortableTableRow>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SortableContext>
        </DndContext>

        {filtered.length === 0 && (
          <div className="p-12 md:p-16 text-center text-[13px] text-muted-foreground">Tidak ada FAQ ditemukan.</div>
        )}

        {totalPages > 0 && (
          <div className="border-t border-border/40">
            <Pagination currentPage={page} totalPages={totalPages} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
