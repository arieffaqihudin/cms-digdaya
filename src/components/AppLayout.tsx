import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Video, FileText, HelpCircle, PenSquare,
  FolderTree, Tag, Package, Tv2, Image, FileClock, CheckCircle,
  Archive, Settings, Search, Bell, ChevronLeft, Menu, User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { divider: true, section: "Content" },
  { label: "Video", icon: Video, path: "/video" },
  { label: "Blog", icon: PenSquare, path: "/blog" },
  { label: "Panduan", icon: FileText, path: "/panduan" },
  { label: "FAQ", icon: HelpCircle, path: "/faq" },
  { divider: true, section: "Taxonomy" },
  { label: "Categories", icon: FolderTree, path: "/categories" },
  { label: "Tags", icon: Tag, path: "/tags" },
  { label: "Products", icon: Package, path: "/products" },
  { label: "Channels", icon: Tv2, path: "/channels" },
  { divider: true, section: "Library" },
  { label: "Media Library", icon: Image, path: "/media" },
  { label: "Drafts", icon: FileClock, path: "/drafts" },
  { label: "Published", icon: CheckCircle, path: "/published" },
  { label: "Archived", icon: Archive, path: "/archived" },
  { divider: true, section: "System" },
  { label: "Settings", icon: Settings, path: "/settings" },
] as const;

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/video": "Video",
  "/blog": "Blog",
  "/panduan": "Panduan",
  "/faq": "FAQ",
  "/categories": "Categories",
  "/tags": "Tags",
  "/products": "Products",
  "/channels": "Channels",
  "/media": "Media Library",
  "/drafts": "Drafts",
  "/published": "Published",
  "/archived": "Archived",
  "/settings": "Settings",
};

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const currentPath = location.pathname;

  const pageTitle =
    pageTitles[currentPath] ||
    (currentPath.startsWith("/content/") ? "Content Editor" : "Digdaya Content CMS");

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-border bg-surface transition-all duration-200 shrink-0",
          collapsed ? "w-[68px]" : "w-[260px]"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
            <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold tracking-tight text-foreground truncate">
                Digdaya CMS
              </h1>
              <p className="text-[11px] text-muted-foreground">Content Management</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {navItems.map((item, i) => {
            if ("divider" in item) {
              return (
                <div key={i} className="pt-4 pb-1">
                  {!collapsed && item.section && (
                    <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {item.section}
                    </p>
                  )}
                  {collapsed && <div className="mx-2 border-t border-border" />}
                </div>
              );
            }
            const Icon = item.icon;
            const active = currentPath === item.path || (item.path !== "/" && currentPath.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="border-t border-border p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-6 shrink-0">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {pageTitle}
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                className="h-9 w-64 pl-9 rounded-md border-border bg-background text-sm"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
            </Button>
            <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">Admin</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
