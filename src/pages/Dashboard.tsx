import { Link } from "react-router-dom";
import { Eye, BookOpen, HelpCircle, PenSquare, ArrowUpRight, TrendingUp } from "lucide-react";
import { dashboardStats, mockVideos, mockGuides, mockBlogs, mockFAQs, categories } from "@/lib/mock-data";
import StatusBadge from "@/components/StatusBadge";

const statCards = [
  { label: "Videos Need Review", value: dashboardStats.videosNeedReview, icon: Eye, change: "+12 from yesterday", color: "text-status-warning-fg" },
  { label: "Total Guides", value: dashboardStats.totalGuides, icon: BookOpen, change: "+3 this week", color: "text-primary" },
  { label: "Total FAQs", value: dashboardStats.totalFAQs, icon: HelpCircle, change: "+5 this week", color: "text-status-info-fg" },
  { label: "Blog Drafts", value: dashboardStats.blogDrafts, icon: PenSquare, change: "4 pending review", color: "text-status-danger-fg" },
];

export default function Dashboard() {
  const recentContent = [
    ...mockVideos.slice(0, 2).map(v => ({ id: v.id, type: "Video" as const, title: v.title, date: v.publishDate, status: v.status, thumbnail: v.thumbnail })),
    ...mockBlogs.slice(0, 2).map(b => ({ id: b.id, type: "Blog" as const, title: b.title, date: b.publishDate, status: b.status, thumbnail: b.coverImage })),
    ...mockGuides.slice(0, 1).map(g => ({ id: g.id, type: "Guide" as const, title: g.title, date: g.lastUpdated, status: g.status, thumbnail: undefined })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const needReviewVideos = mockVideos.filter(v => v.status === "need_review").slice(0, 4);
  const recentPublished = [
    ...mockVideos.filter(v => v.status === "published").slice(0, 2).map(v => ({ title: v.displayTitle || v.title, type: "Video", date: v.publishDate })),
    ...mockBlogs.filter(b => b.status === "published").slice(0, 2).map(b => ({ title: b.title, type: "Blog", date: b.publishDate })),
    ...mockGuides.filter(g => g.status === "published").slice(0, 1).map(g => ({ title: g.title, type: "Guide", date: g.lastUpdated })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const topCategories = categories.slice(0, 6).map((c) => ({
    name: c,
    count: Math.floor(Math.random() * 40) + 5,
    percentage: Math.floor(Math.random() * 30) + 10,
  }));

  return (
    <div className="space-y-7">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Good morning, Editor.</h3>
        <p className="text-sm text-muted-foreground mt-1">
          You have {dashboardStats.videosNeedReview} videos and {dashboardStats.blogDrafts} blog drafts awaiting review.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border border-border bg-surface p-5 shadow-card">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <h3 className="mt-3 text-2xl font-semibold tabular-nums text-foreground">{stat.value}</h3>
              <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-primary">
                <TrendingUp className="h-3 w-3" />
                <span>{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Content */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-surface shadow-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h4 className="text-[13px] font-semibold text-foreground">Recent Content</h4>
          </div>
          <div className="divide-y divide-border">
            {recentContent.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-accent/40 transition-colors">
                {item.thumbnail ? (
                  <img src={item.thumbnail} alt="" className="h-11 w-[72px] rounded-lg object-cover bg-muted shrink-0" />
                ) : (
                  <div className="h-11 w-[72px] rounded-lg bg-accent shrink-0 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-foreground truncate">{item.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{item.type} · {item.date}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Right col */}
        <div className="space-y-5">
          {/* Content Needing Review */}
          <div className="rounded-xl border border-border bg-surface shadow-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h4 className="text-[13px] font-semibold text-foreground">Needing Review</h4>
              <Link to="/video" className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline">
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {needReviewVideos.map((v) => (
                <Link key={v.id} to={`/video/${v.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-accent/40 transition-colors">
                  <img src={v.thumbnail} alt="" className="h-9 w-14 rounded-md object-cover bg-muted shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-medium text-foreground truncate">{v.title}</p>
                    <p className="text-[10px] text-muted-foreground">{v.channel}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Categories */}
          <div className="rounded-xl border border-border bg-surface shadow-card">
            <div className="border-b border-border px-5 py-4">
              <h4 className="text-[13px] font-semibold text-foreground">Top Categories</h4>
            </div>
            <div className="px-5 py-4 space-y-3.5">
              {topCategories.map((c) => (
                <div key={c.name}>
                  <div className="flex items-center justify-between text-[12px] mb-1.5">
                    <span className="font-medium text-foreground">{c.name}</span>
                    <span className="tabular-nums text-muted-foreground">{c.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-accent overflow-hidden">
                    <div className="h-full rounded-full bg-primary/60 transition-all" style={{ width: `${c.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Published */}
          <div className="rounded-xl border border-border bg-surface shadow-card">
            <div className="border-b border-border px-5 py-4">
              <h4 className="text-[13px] font-semibold text-foreground">Recently Published</h4>
            </div>
            <div className="divide-y divide-border">
              {recentPublished.map((item, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-medium text-foreground truncate">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground">{item.type} · {item.date}</p>
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
