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
    (currentPath.startsWith("/content/") || currentPath.startsWith("/video/") ? "Content Editor" : "Digdaya Content CMS");

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar — pale sage green */}
      <aside
        className={cn(
          "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200 shrink-0",
          collapsed ? "w-[64px]" : "w-[256px]"
        )}
      >
        {/* Logo */}
        <div className="flex h-[60px] items-center gap-3 border-b border-sidebar-border px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
            <LayoutDashboard className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-[13px] font-semibold tracking-tight text-foreground truncate">
                Digdaya CMS
              </h1>
              <p className="text-[10px] text-sidebar-muted leading-tight">Content Management</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {navItems.map((item, i) => {
            if ("divider" in item) {
              return (
                <div key={i} className="pt-5 pb-1.5">
                  {!collapsed && item.section && (
                    <p className="px-3 text-[10px] font-medium uppercase tracking-[0.08em] text-sidebar-section">
                      {item.section}
                    </p>
                  )}
                  {collapsed && <div className="mx-2 border-t border-sidebar-border" />}
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
                  "flex items-center gap-3 rounded-lg px-3 py-[9px] text-[13px] font-medium transition-all duration-150",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center rounded-lg p-2 text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground transition-colors"
          >
            {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header — white, thin border */}
        <header className="flex h-[56px] items-center justify-between border-b border-border bg-surface px-6 shrink-0">
          <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
            {pageTitle}
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                className="h-8 w-56 pl-9 rounded-lg border-border bg-background text-[13px] focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative h-8 w-8">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            </Button>
            <div className="flex items-center gap-2 rounded-lg px-2.5 py-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                <User className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-[13px] font-medium text-foreground">Admin</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-7">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
