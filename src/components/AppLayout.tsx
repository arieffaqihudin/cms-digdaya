import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Video, FileText, HelpCircle, PenSquare,
  FolderTree, Tag, Package, Tv2, Image, FileClock, CheckCircle,
  Archive, Settings, Search, Bell, ChevronLeft, Menu, User, LogOut,
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
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col bg-sidebar transition-[width] duration-200 ease-in-out shrink-0",
          collapsed ? "w-[68px]" : "w-[260px]"
        )}
      >
        {/* Logo */}
        <div className="flex h-[64px] items-center gap-3 px-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-sidebar-primary">
            <LayoutDashboard className="h-[18px] w-[18px] text-sidebar-primary-foreground" strokeWidth={1.8} />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-[14px] font-semibold tracking-tight text-foreground truncate">
                Digdaya CMS
              </h1>
              <p className="text-[10px] text-sidebar-muted leading-tight">Content Management</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 pt-2">
          {navItems.map((item, i) => {
            if ("divider" in item) {
              return (
                <div key={i} className={cn("pb-1", i === 1 ? "pt-3" : "pt-6")}>
                  {!collapsed && item.section && (
                    <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-sidebar-section">
                      {item.section}
                    </p>
                  )}
                  {collapsed && i > 1 && (
                    <div className="mx-3 my-1" />
                  )}
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
                  "flex items-center gap-3 rounded-[10px] px-3 py-[10px] text-[13px] transition-all duration-150 ease-in-out",
                  active
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "font-normal text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-[18px] w-[18px] shrink-0 transition-colors duration-150",
                    active ? "text-sidebar-accent-foreground" : "text-sidebar-muted"
                  )}
                  strokeWidth={active ? 2 : 1.6}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-4 space-y-1">
          {!collapsed && (
            <div className="flex items-center gap-3 rounded-[10px] px-3 py-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent">
                <User className="h-4 w-4 text-sidebar-accent-foreground" strokeWidth={1.6} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-foreground truncate">Admin User</p>
                <p className="text-[10px] text-sidebar-muted truncate">admin@digdaya.id</p>
              </div>
              <button className="p-1 rounded-md text-sidebar-muted hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-colors">
                <LogOut className="h-3.5 w-3.5" strokeWidth={1.6} />
              </button>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center rounded-[10px] p-2.5 text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors duration-150"
          >
            {collapsed ? <Menu className="h-4 w-4" strokeWidth={1.6} /> : <ChevronLeft className="h-4 w-4" strokeWidth={1.6} />}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
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
