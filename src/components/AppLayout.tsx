import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Video, FileText, HelpCircle, PenSquare,
  FolderTree, Tag, Package, Tv2, FileClock, CheckCircle,
  Archive, Search, Bell, ChevronLeft, Menu, User, LogOut,
  CalendarClock, X, Shield, Users, Activity, ImageIcon,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { divider: true, section: "Konten" },
  { label: "Video", icon: Video, path: "/video" },
  { label: "Blog", icon: PenSquare, path: "/blog" },
  { label: "Panduan", icon: FileText, path: "/panduan" },
  { label: "FAQ", icon: HelpCircle, path: "/faq" },
  { divider: true, section: "Taksonomi" },
  { label: "Kategori", icon: FolderTree, path: "/categories" },
  { label: "Tag", icon: Tag, path: "/tags" },
  { label: "Produk", icon: Package, path: "/products" },
  { label: "Channel", icon: Tv2, path: "/channels" },
  { divider: true, section: "Media" },
  { label: "Media Library", icon: Image, path: "/media" },
  { divider: true, section: "Workflow" },
  { label: "Draft", icon: FileClock, path: "/drafts" },
  { label: "Terjadwal", icon: CalendarClock, path: "/scheduled" },
  { label: "Dipublikasikan", icon: CheckCircle, path: "/published" },
  { label: "Arsip", icon: Archive, path: "/archived" },
  { divider: true, section: "Pengaturan" },
  { label: "Pengaturan", icon: Settings, path: "/settings" },
] as const;

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/video": "Video",
  "/blog": "Blog",
  "/panduan": "Panduan",
  "/faq": "FAQ",
  "/categories": "Kategori",
  "/tags": "Tag",
  "/products": "Produk",
  "/channels": "Channel",
  "/media": "Media Library",
  "/drafts": "Draft",
  "/scheduled": "Terjadwal",
  "/published": "Dipublikasikan",
  "/archived": "Arsip",
  "/settings": "Pengaturan",
};

type ScreenSize = "mobile" | "tablet" | "desktop";

function useScreenSize(): ScreenSize {
  const [size, setSize] = useState<ScreenSize>("desktop");
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      if (w < 768) setSize("mobile");
      else if (w < 1200) setSize("tablet");
      else setSize("desktop");
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return size;
}

export { useScreenSize };
export type { ScreenSize };

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const screenSize = useScreenSize();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentPath = location.pathname;

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [currentPath]);

  const pageTitle =
    pageTitles[currentPath] ||
    (currentPath.startsWith("/content/") || currentPath.startsWith("/video/") ? "Content Editor" : "Digdaya Content CMS");

  const showLabels = screenSize === "desktop" ? !collapsed : true;
  const sidebarWidth = screenSize === "mobile"
    ? "w-[260px]"
    : screenSize === "tablet"
      ? (collapsed ? "w-[68px]" : "w-[220px]")
      : (collapsed ? "w-[68px]" : "w-[260px]");

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex h-[64px] items-center gap-3 px-5">
        <img
          src="https://play-lh.googleusercontent.com/kfeQ0QFBny3AVurQ9r_CSBJyCfceAymEBlh9t6SIU_lZX0tH7WqYaTN7NHqrKGoQGNFEc3y8nj-iyw6IxqbEug=w480-h960-rw"
          alt="Digdaya Logo"
          className="h-8 w-8 shrink-0 rounded-[8px] object-contain"
        />
        {showLabels && (
          <div className="overflow-hidden">
            <h1 className="text-[14px] font-semibold tracking-tight text-foreground truncate">
              Digdaya CMS
            </h1>
            <p className="text-[10px] text-sidebar-muted leading-tight">Content Management</p>
          </div>
        )}
        {screenSize === "mobile" && (
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto p-1.5 rounded-[8px] text-sidebar-muted hover:text-foreground hover:bg-sidebar-accent/50 transition-colors"
          >
            <X className="h-4 w-4" strokeWidth={1.6} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 pt-2">
        {navItems.map((item, i) => {
          if ("divider" in item) {
            return (
              <div key={i} className={cn("pb-1", i === 1 ? "pt-3" : "pt-6")}>
                {showLabels && item.section && (
                  <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-sidebar-section">
                    {item.section}
                  </p>
                )}
                {!showLabels && i > 1 && <div className="mx-3 my-1" />}
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
              {showLabels && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 space-y-1">
        {showLabels && (
          <div className="flex items-center gap-3 rounded-[10px] px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent">
              <User className="h-4 w-4 text-sidebar-accent-foreground" strokeWidth={1.6} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-foreground truncate">
                {user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User"}
              </p>
              <p className="text-[10px] text-sidebar-muted truncate">{user?.email || ""}</p>
            </div>
            <button
              onClick={async () => { await signOut(); navigate("/login"); }}
              className="p-1 rounded-md text-sidebar-muted hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={1.6} />
            </button>
          </div>
        )}
        {screenSize !== "mobile" && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center rounded-[10px] p-2.5 text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors duration-150"
          >
            {collapsed ? <Menu className="h-4 w-4" strokeWidth={1.6} /> : <ChevronLeft className="h-4 w-4" strokeWidth={1.6} />}
          </button>
        )}
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {screenSize === "mobile" && mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      {screenSize === "mobile" ? (
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar transition-transform duration-300 ease-in-out w-[260px]",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebarContent}
        </aside>
      ) : (
        <aside
          className={cn(
            "flex flex-col bg-sidebar transition-[width] duration-200 ease-in-out shrink-0",
            sidebarWidth
          )}
        >
          {sidebarContent}
        </aside>
      )}

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="flex h-[56px] items-center justify-between border-b border-border bg-surface px-4 md:px-6 shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {screenSize === "mobile" && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
            <h2 className="text-[15px] font-semibold tracking-tight text-foreground truncate">
              {pageTitle}
            </h2>
          </div>
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                className="h-8 w-40 md:w-56 pl-9 rounded-lg border-border bg-background text-[13px] focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            {screenSize === "mobile" && (
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Search className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="relative h-8 w-8">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-5 lg:p-7">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
