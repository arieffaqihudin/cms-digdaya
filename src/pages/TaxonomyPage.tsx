import { useState } from "react";
import { Search, Plus, Edit, Trash2, FolderTree } from "lucide-react";
import { categories, tags, products, channels } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TaxonomyItem {
  id: string;
  name: string;
  count: number;
  description?: string;
}

function makeTaxonomyItems(items: string[]): TaxonomyItem[] {
  return items.map((name, i) => ({
    id: `${i + 1}`,
    name,
    count: Math.floor(Math.random() * 30) + 2,
    description: `Description for ${name}`,
  }));
}

function TaxonomyTable({ items, label }: { items: TaxonomyItem[]; label: string }) {
  const [search, setSearch] = useState("");
  const filtered = items.filter(item =>
    !search || item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
          <Input
            placeholder={`Search ${label.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 rounded-[10px] text-[13px] border-border bg-surface focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <Button size="sm" className="h-9 rounded-[10px] text-[13px] bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-1.5" strokeWidth={1.6} /> Add {label.slice(0, -1) || label}
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-surface shadow-soft overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border/70">
              <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Name</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Description</th>
              <th className="px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Items</th>
              <th className="px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-b border-border/40 hover:bg-accent/40 transition-colors duration-150">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-accent">
                      <FolderTree className="h-3.5 w-3.5 text-primary" strokeWidth={1.6} />
                    </div>
                    <span className="font-medium text-foreground">{item.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{item.description}</td>
                <td className="px-5 py-4 text-center">
                  <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-[3px] text-[11px] font-medium tabular-nums text-muted-foreground">
                    {item.count}
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
          <div className="p-16 text-center text-[13px] text-muted-foreground">No items found.</div>
        )}
      </div>
    </div>
  );
}

export default function TaxonomyPage({ defaultTab }: { defaultTab?: string }) {
  const categoryItems = makeTaxonomyItems(categories);
  const tagItems = makeTaxonomyItems(tags);
  const productItems = makeTaxonomyItems(products);
  const channelItems = makeTaxonomyItems(channels);

  return (
    <Tabs defaultValue={defaultTab || "categories"} className="space-y-5">
      <TabsList className="bg-surface border border-border rounded-xl p-1 h-auto">
        <TabsTrigger value="categories" className="rounded-[10px] text-[13px] px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Categories</TabsTrigger>
        <TabsTrigger value="tags" className="rounded-[10px] text-[13px] px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Tags</TabsTrigger>
        <TabsTrigger value="products" className="rounded-[10px] text-[13px] px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Products</TabsTrigger>
        <TabsTrigger value="channels" className="rounded-[10px] text-[13px] px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Channels</TabsTrigger>
      </TabsList>

      <TabsContent value="categories"><TaxonomyTable items={categoryItems} label="Categories" /></TabsContent>
      <TabsContent value="tags"><TaxonomyTable items={tagItems} label="Tags" /></TabsContent>
      <TabsContent value="products"><TaxonomyTable items={productItems} label="Products" /></TabsContent>
      <TabsContent value="channels"><TaxonomyTable items={channelItems} label="Channels" /></TabsContent>
    </Tabs>
  );
}
