import { Link } from "react-router-dom";
import { Download, Eye, CheckCircle, XCircle, ArrowUpRight, TrendingUp } from "lucide-react";
import { dashboardStats, mockVideos, categories } from "@/lib/mock-data";
import StatusBadge from "@/components/StatusBadge";

const statCards = [
  { label: "Crawled Today", value: dashboardStats.crawledToday, icon: Download, change: "+4 from yesterday", color: "text-status-info-fg" },
  { label: "Need Review", value: dashboardStats.needReview, icon: Eye, change: "+12 from yesterday", color: "text-status-warning-fg" },
  { label: "Published", value: dashboardStats.published, icon: CheckCircle, change: "+8 this week", color: "text-primary" },
  { label: "Rejected", value: dashboardStats.rejected, icon: XCircle, change: "2 today", color: "text-destructive" },
];

export default function Dashboard() {
  const recentVideos = mockVideos.slice(0, 5);
  const needReviewVideos = mockVideos.filter((v) => v.status === "need_review").slice(0, 5);
  const topCategories = categories.slice(0, 6).map((c, i) => ({
    name: c,
    count: Math.floor(Math.random() * 40) + 5,
    percentage: Math.floor(Math.random() * 30) + 10,
  }));

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h3 className="text-xl font-semibold tracking-tight text-foreground">
          Good morning, Editor.
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          There are {dashboardStats.needReview} videos awaiting your review.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-lg border border-border bg-surface p-6 shadow-card"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <h3 className="mt-2 text-2xl font-bold tabular-nums text-foreground">
                {stat.value}
              </h3>
              <div className="mt-2 flex items-center gap-1 text-xs font-medium text-primary">
                <TrendingUp className="h-3 w-3" />
                <span>{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Crawled */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-surface shadow-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h4 className="text-sm font-semibold text-foreground">Recent Crawled Videos</h4>
            <Link to="/inbox" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentVideos.map((v) => (
              <div key={v.id} className="flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors">
                <img src={v.thumbnail} alt="" className="h-14 w-24 rounded object-cover bg-muted shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{v.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{v.channel} · {v.publishDate}</p>
                </div>
                <StatusBadge status={v.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Right col */}
        <div className="space-y-6">
          {/* Need Review */}
          <div className="rounded-lg border border-border bg-surface shadow-card">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h4 className="text-sm font-semibold text-foreground">Videos Needing Review</h4>
              <span className="tabular-nums text-xs font-semibold text-status-warning-fg bg-status-warning-bg rounded-full px-2 py-0.5">
                {needReviewVideos.length}
              </span>
            </div>
            <div className="divide-y divide-border">
              {needReviewVideos.map((v) => (
                <Link
                  key={v.id}
                  to={`/inbox/${v.id}`}
                  className="flex items-center gap-3 p-3 hover:bg-accent/50 transition-colors"
                >
                  <img src={v.thumbnail} alt="" className="h-10 w-16 rounded object-cover bg-muted shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground truncate">{v.title}</p>
                    <p className="text-[11px] text-muted-foreground">{v.channel}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Categories */}
          <div className="rounded-lg border border-border bg-surface shadow-card">
            <div className="border-b border-border p-4">
              <h4 className="text-sm font-semibold text-foreground">Top Categories</h4>
            </div>
            <div className="p-4 space-y-3">
              {topCategories.map((c) => (
                <div key={c.name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-foreground">{c.name}</span>
                    <span className="tabular-nums text-muted-foreground">{c.count} videos</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
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
