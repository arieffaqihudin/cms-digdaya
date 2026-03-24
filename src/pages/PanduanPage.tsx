import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useScreenSize } from "@/components/AppLayout";
import { products } from "@/lib/mock-data";

const mockPanduan = [
  { id: "1", topik: "Cara Membuat Surat Keluar", slug: "cara-membuat-surat-keluar", produk: "Digdaya Persuratan", createdAt: "2025-01-10" },
  { id: "2", topik: "Panduan Arsip Digital", slug: "panduan-arsip-digital", produk: "Digdaya Persuratan", createdAt: "2025-01-12" },
  { id: "3", topik: "Mengelola Disposisi", slug: "mengelola-disposisi", produk: "Digdaya Persuratan", createdAt: "2025-02-01" },
  { id: "4", topik: "Setup Awal SIPD", slug: "setup-awal-sipd", produk: "Digdaya SIPD", createdAt: "2025-02-15" },
  { id: "5", topik: "Input Anggaran", slug: "input-anggaran", produk: "Digdaya SIPD", createdAt: "2025-03-01" },
];

export default function PanduanPage() {
  const [search, setSearch] = useState("");
  const [filterProduk, setFilterProduk] = useState("all");
  const screen = useScreenSize();
  const isMobile = screen === "mobile";

  const filtered = useMemo(
    () =>
      mockPanduan.filter((p) => {
        const matchSearch = p.topik.toLowerCase().includes(search.toLowerCase());
        const matchProduk = filterProduk === "all" || p.produk === filterProduk;
        return matchSearch && matchProduk;
      }),
    [search, filterProduk]
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Panduan</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} topik</p>
          </div>
        </div>
        <Link to="/panduan/new">
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> Buat Panduan
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Cari topik..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterProduk} onValueChange={setFilterProduk}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Semua Produk" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Produk</SelectItem>
            {products.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table / Cards */}
      <div className="rounded-[12px] border bg-card">
        {isMobile ? (
          <div className="divide-y">
            {filtered.map((item) => (
              <div key={item.id} className="space-y-2 p-4">
                <div className="font-medium text-foreground">{item.topik}</div>
                <div className="text-xs text-muted-foreground">{item.slug}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{item.produk}</span>
                  <span className="text-xs text-muted-foreground">{item.createdAt}</span>
                </div>
                <div className="pt-1">
                  <Link to={`/panduan/${item.id}`} className="text-xs font-medium text-primary hover:underline">Ubah</Link>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">Tidak ada data</div>}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Topik</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Produk</TableHead>
                <TableHead>Dibuat pada</TableHead>
                <TableHead className="w-[80px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/40">
                  <TableCell className="font-medium">{item.topik}</TableCell>
                  <TableCell className="text-muted-foreground">{item.slug}</TableCell>
                  <TableCell>{item.produk}</TableCell>
                  <TableCell className="text-muted-foreground">{item.createdAt}</TableCell>
                  <TableCell>
                    <Link to={`/panduan/${item.id}`} className="text-sm font-medium text-primary hover:underline">Ubah</Link>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">Tidak ada data</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
