import { Link } from "react-router-dom";
import {
  Video, BookOpen, HelpCircle, PenSquare, ArrowUpRight,
  TrendingUp, TrendingDown, Clock, CheckCircle2, XCircle, Inbox,
} from "lucide-react";
import { dashboardStats, mockVideos, mockGuides, mockBlogs, mockFAQs, categories } from "@/lib/mock-data";
import StatusBadge from "@/components/StatusBadge";

const statCards = [
  {
    label: "Video Masuk Hari Ini",
    value: 18,
    icon: Inbox,
    trend: "+5 dari kemarin",
    trendUp: true,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    label: "Perlu Review",
    value: dashboardStats.videosNeedReview,
    icon: Clock,
    trend: "+12 menunggu",
    trendUp: false,
    iconBg: "bg-status-warning-bg",
    iconColor: "text-status-warning-fg",
  },
  {
    label: "Dipublikasikan",
    value: 312,
    icon: CheckCircle2,
    trend: "+28 minggu ini",
    trendUp: true,
    iconBg: "bg-status-success-bg",
    iconColor: "text-status-success-fg",
  },
  {
    label: "Ditolak",
    value: 9,
    icon: XCircle,
    trend: "-3 dari kemarin",
    trendUp: true,
    iconBg: "bg-status-danger-bg",
    iconColor: "text-status-danger-fg",
  },
];

export default function Dashboard() {
  const recentContent = [
    ...mockVideos.slice(0, 3).map(v => ({
      id: v.id, type: "Video" as const, title: v.title, date: v.publishDate,
      status: v.status, thumbnail: v.thumbnail, channel: v.channel,
      editUrl: `/video/${v.id}`,
    })),
    ...mockBlogs.slice(0, 2).map(b => ({
      id: b.id, type: "Blog" as const, title: b.title, date: b.publishDate,
      status: b.status, thumbnail: b.coverImage, channel: b.author,
      editUrl: `/content/${b.id}?type=blog`,
    })),
    ...mockGuides.slice(0, 1).map(g => ({
      id: g.id, type: "Panduan" as const, title: g.title, date: g.lastUpdated,
      status: g.status, thumbnail: undefined, channel: g.relatedProduct,
      editUrl: `/content/${g.id}?type=guide`,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const needReviewVideos = mockVideos.filter(v => v.status === "need_review").slice(0, 5);

  const topCategories = categories.slice(0, 6).map((c, i) => ({
    name: c,
    count: [38, 31, 27, 22, 18, 14][i] || 10,
    percentage: [85, 70, 60, 50, 40, 32][i] || 20,
  }));

  const typeIcons: Record<string, typeof Video> = {
    Video: Video,
    Blog: PenSquare,
    Panduan: BookOpen,
    FAQ: HelpCircle,
  };

  return (
    <div className="space-y-7">
      {/* Header greeting */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">Selamat datang, Editor.</h3>
        <p className="text-[13px] text-muted-foreground mt-1">
          Ada {dashboardStats.videosNeedReview} video dan {dashboardStats.blogDrafts} draft blog yang menunggu review.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-[12px] border border-border bg-surface p-5 shadow-card hover:shadow-soft transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                    {stat.label}
                  </p>
                  <h3 className="text-[28px] font-semibold tabular-nums leading-tight text-foreground">
                    {stat.value}
                  </h3>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-[10px] ${stat.iconBg}`}>
                  <Icon className={`h-[18px] w-[18px] ${stat.iconColor}`} strokeWidth={1.8} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium">
                {stat.trendUp ? (
                  <TrendingUp className="h-3 w-3 text-status-success-fg" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-status-warning-fg" />
                )}
                <span className="text-muted-foreground">{stat.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Konten Terbaru - spans 2 cols */}
        <div className="lg:col-span-2 rounded-[12px] border border-border bg-surface shadow-card">
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
            <h4 className="text-[13px] font-semibold text-foreground">Konten Terbaru</h4>
            <Link to="/published" className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline">
              Lihat semua <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border/40">
            {recentContent.map((item) => {
              const TypeIcon = typeIcons[item.type] || BookOpen;
              return (
                <Link
                  key={item.id}
                  to={item.editUrl}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-accent/40 transition-colors"
                >
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt=""
                      className="h-12 w-[78px] rounded-[8px] object-cover bg-muted shrink-0"
                    />
                  ) : (
                    <div className="h-12 w-[78px] rounded-[8px] bg-accent shrink-0 flex items-center justify-center">
                      <TypeIcon className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-foreground truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <TypeIcon className="h-3 w-3" strokeWidth={1.6} />
                        {item.type}
                      </span>
                      <span className="text-[11px] text-muted-foreground/50">·</span>
                      <span className="text-[11px] text-muted-foreground">{item.channel}</span>
                      <span className="text-[11px] text-muted-foreground/50">·</span>
                      <span className="text-[11px] text-muted-foreground">{item.date}</span>
                    </div>
                  </div>
                  <StatusBadge status={item.status} />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Perlu Review */}
          <div className="rounded-[12px] border border-border bg-surface shadow-card">
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
              <h4 className="text-[13px] font-semibold text-foreground">Perlu Review</h4>
              <Link to="/video" className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline">
                Semua <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-border/40">
              {needReviewVideos.map((v) => (
                <Link
                  key={v.id}
                  to={`/video/${v.id}`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-accent/40 transition-colors"
                >
                  <img
                    src={v.thumbnail}
                    alt=""
                    className="h-9 w-14 rounded-md object-cover bg-muted shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-medium text-foreground truncate">{v.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{v.channel} · {v.publishDate}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Kategori Terpopuler */}
          <div className="rounded-[12px] border border-border bg-surface shadow-card">
            <div className="border-b border-border/60 px-5 py-4">
              <h4 className="text-[13px] font-semibold text-foreground">Kategori Terpopuler</h4>
            </div>
            <div className="px-5 py-4 space-y-4">
              {topCategories.map((c) => (
                <div key={c.name}>
                  <div className="flex items-center justify-between text-[12px] mb-1.5">
                    <span className="font-medium text-foreground">{c.name}</span>
                    <span className="tabular-nums text-muted-foreground">{c.count} konten</span>
                  </div>
                  <div className="h-[6px] rounded-full bg-accent overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary/50 transition-all duration-500"
                      style={{ width: `${c.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}