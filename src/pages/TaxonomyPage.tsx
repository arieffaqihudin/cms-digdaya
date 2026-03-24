import { useState } from "react";
import { Search, Plus, Edit, Trash2, FolderTree, Tag, Package, Tv2 } from "lucide-react";
import { categories, tags, products, channels } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TaxonomyItem {
  id: string;
  name: string;
  type: string;
  count: number;
  status: "active" | "inactive";
}

function makeTaxonomyItems(items: string[], type: string): TaxonomyItem[] {
  return items.map((name, i) => ({
    id: `${i + 1}`,
    name,
    type,
    count: Math.floor(Math.random() * 30) + 2,
    status: Math.random() > 0.2 ? "active" : "inactive",
  }));
}

const tabConfig: Record<string, { label: string; singular: string; icon: typeof FolderTree }> = {
  categories: { label: "Kategori", singular: "Kategori", icon: FolderTree },
  tags: { label: "Tag", singular: "Tag", icon: Tag },
  products: { label: "Produk", singular: "Produk", icon: Package },
  channels: { label: "Channel", singular: "Channel", icon: Tv2 },
};

function TaxonomyTable({ items, tabKey }: { items: TaxonomyItem[]; tabKey: string }) {
  const [search, setSearch] = useState("");
  const config = tabConfig[tabKey];
  const Icon = config.icon;
  const filtered = items.filter(item =>
    !search || item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">{config.label}</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Kelola {config.label.toLowerCase()} konten
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-[10px] bg-accent/60 px-3 py-1.5 text-[12px] text-muted-foreground">
            <Icon className="h-3.5 w-3.5" strokeWidth={1.6} />
            <span className="tabular-nums font-medium">{filtered.length}</span>
            <span>item</span>
          </div>
        </div>
      </div>

      <div className="rounded-[12px] border border-border bg-surface p-4 shadow-card">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
            <Input
              placeholder={`Cari ${config.label.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 rounded-[10px] text-[13px] border-border bg-background focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <Button size="sm" className="h-9 rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5">
            <Plus className="h-4 w-4" strokeWidth={1.6} /> Tambah {config.singular}
          </Button>
        </div>
      </div>

      <div className="rounded-[12px] border border-border bg-surface shadow-card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border/60">
              <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Nama</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Tipe</th>
              <th className="px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Jumlah Konten</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Status</th>
              <th className="px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-b border-border/30 hover:bg-accent/30 transition-colors duration-150">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-primary/[0.06]">
                      <Icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.6} />
                    </div>
                    <span className="font-medium text-foreground">{item.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{config.label}</td>
                <td className="px-5 py-4 text-center">
                  <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-[3px] text-[11px] font-medium tabular-nums text-muted-foreground">
                    {item.count}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[11px] font-medium ${
                    item.status === "active"
                      ? "bg-status-success-bg text-status-success-fg"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                      item.status === "active" ? "bg-status-success-fg" : "bg-muted-foreground/50"
                    }`} />
                    {item.status === "active" ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-0.5">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent">
                      <Edit className="h-3.5 w-3.5" strokeWidth={1.6} />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-status-danger-bg">
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.6} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-16 text-center text-[13px] text-muted-foreground">Tidak ada item ditemukan.</div>
        )}
      </div>
    </div>
  );
}

export default function TaxonomyPage({ defaultTab }: { defaultTab?: string }) {
  const categoryItems = makeTaxonomyItems(categories, "categories");
  const tagItems = makeTaxonomyItems(tags, "tags");
  const productItems = makeTaxonomyItems(products, "products");
  const channelItems = makeTaxonomyItems(channels, "channels");

  return (
    <div className="space-y-5">
      <Tabs defaultValue={defaultTab || "categories"} className="space-y-5">
        <TabsList className="bg-surface border border-border rounded-[12px] p-1 h-auto">
          <TabsTrigger value="categories" className="rounded-[10px] text-[13px] px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Kategori</TabsTrigger>
          <TabsTrigger value="tags" className="rounded-[10px] text-[13px] px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Tag</TabsTrigger>
          <TabsTrigger value="products" className="rounded-[10px] text-[13px] px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Produk</TabsTrigger>
          <TabsTrigger value="channels" className="rounded-[10px] text-[13px] px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Channel</TabsTrigger>
        </TabsList>

        <TabsContent value="categories"><TaxonomyTable items={categoryItems} tabKey="categories" /></TabsContent>
        <TabsContent value="tags"><TaxonomyTable items={tagItems} tabKey="tags" /></TabsContent>
        <TabsContent value="products"><TaxonomyTable items={productItems} tabKey="products" /></TabsContent>
        <TabsContent value="channels"><TaxonomyTable items={channelItems} tabKey="channels" /></TabsContent>
      </Tabs>
    </div>
  );
}