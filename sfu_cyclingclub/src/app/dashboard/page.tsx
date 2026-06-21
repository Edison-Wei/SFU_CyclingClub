"use client"

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";

type DashboardStats = {
  activeRoutes: number;
  suggestedRoutes: number;
  publishedPosts: number;
  executiveOfficers: number;
  activeSponsors: number;
};

async function fetchDashboardOverviewStats(): Promise<DashboardStats> {
  try {
    const [postsRes, execSponRes] = await Promise.all([
      fetch("/api/Posts/getAllPosts", { method: "GET" }).catch(() => null),
      fetch("/api/executivensponsor", { method: "GET" }).catch(() => null),
    ]);

    const postsData = postsRes?.ok ? await postsRes.json() : { results: [] };
    const execSponData = execSponRes?.ok ? await execSponRes.json() : [];

    const postsList = postsData.results || [];
    const rawExecSponList = Array.isArray(execSponData) ? execSponData : execSponData.results || [];

    return {
      activeRoutes: 0,
      suggestedRoutes: 0,
      publishedPosts: postsList.length || 0,
      executiveOfficers: rawExecSponList.filter((item: any) => !!item.role).length || 0,
      activeSponsors: rawExecSponList.filter((item: any) => !!item.link).length || 0,
    };
  } catch (error) {
    console.error("Failed to parse dashboard master analytics:", error);
    return { activeRoutes: 0, suggestedRoutes: 0, publishedPosts: 0, executiveOfficers: 0, activeSponsors: 0 };
  }
}

function OverviewDashboardContent() {
  const [stats, setStats] = useState<DashboardStats>({
    activeRoutes: 0,
    suggestedRoutes: 0,
    publishedPosts: 0,
    executiveOfficers: 0,
    activeSponsors: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        const data = await fetchDashboardOverviewStats();

        setStats(data);
    }
    loadData()
    setIsLoading(false)

    fetchDashboardOverviewStats()
      .then((data) => setStats(data))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <div className="px-8 pt-6 pb-6 border-b border-base-300 bg-base-100">
        <div className="max-w-screen-xl mx-auto">
          <p className="text-secondary text-xs uppercase tracking-[0.2em] font-semibold mb-1">Management Hub</p>
          <h1 className="text-primary text-3xl font-bold tracking-tight">Executive Dashboard</h1>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-8 flex flex-col gap-8">
        
        <div>
          <h2 className="text-xs uppercase tracking-widest font-bold text-secondary mb-4">Operational Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-base-200 border border-base-300 rounded-box p-5 shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-wider text-secondary block mb-1">Club Running Routes</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-primary tracking-tight">
                  {isLoading ? "..." : stats.activeRoutes}
                </span>
                <span className="text-xs text-success font-medium">Mapped Live</span>
              </div>
            </div>

            <div className="bg-base-200 border border-base-300 rounded-box p-5 shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-wider text-secondary block mb-1">Suggested Submissions</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-info tracking-tight">
                  {isLoading ? "..." : stats.suggestedRoutes}
                </span>
                <span className="text-xs text-secondary font-medium">Pending Review</span>
              </div>
            </div>

            <div className="bg-base-200 border border-base-300 rounded-box p-5 shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-wider text-secondary block mb-1">Published News Articles</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-primary tracking-tight">
                  {isLoading ? "..." : stats.publishedPosts}
                </span>
                <span className="text-xs text-secondary font-medium">Live Entries</span>
              </div>
            </div>

            <div className="bg-base-200 border border-base-300 rounded-box p-5 shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-wider text-secondary block mb-1">Partners & Board Profile Count</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-success tracking-tight">
                  {isLoading ? "..." : stats.executiveOfficers + stats.activeSponsors}
                </span>
                <span className="text-[11px] text-secondary lowercase font-medium">
                  ({stats.executiveOfficers} execs / {stats.activeSponsors} spons)
                </span>
              </div>
            </div>

          </div>
        </div>

        <div>
          <h2 className="text-xs uppercase tracking-widest font-bold text-secondary mb-4">Administrative Action Panels</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-base-200 border border-base-300 rounded-box p-6 flex flex-col justify-between gap-5 shadow-sm">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-primary text-lg font-bold tracking-tight">Route Operations</h3>
                  <span className="text-xl">🗺️</span>
                </div>
                <p className="text-xs text-secondary leading-relaxed">
                  Oversee the club's interactive path catalog maps, manage active tracking coords, and approve community updates.
                </p>
              </div>
              <div className="flex flex-col gap-1.5 pt-2 border-t border-base-300/60">
                <Link href="/dashboard/route" className="btn btn-sm btn-ghost justify-between font-bold tracking-wide text-xs hover:bg-base-300 text-primary">
                  <span>Manage Main Map Library</span>
                  <span>→</span>
                </Link>
                <Link href="/dashboard/route/create" className="btn btn-sm btn-ghost justify-between font-bold tracking-wide text-xs hover:bg-base-300 text-secondary">
                  <span>+ Deploy New Mapping Profile</span>
                  <span>→</span>
                </Link>
                <Link href="/dashboard/route/suggested" className="btn btn-sm btn-ghost justify-between font-bold tracking-wide text-xs hover:bg-base-300 text-secondary">
                  <span>Review Community Suggestions</span>
                  <span className="badge badge-base-300 badge-sm font-bold">{stats.suggestedRoutes}</span>
                </Link>
              </div>
            </div>

            <div className="bg-base-200 border border-base-300 rounded-box p-6 flex flex-col justify-between gap-5 shadow-sm">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-primary text-lg font-bold tracking-tight">Publication Library</h3>
                  <span className="text-xl">📝</span>
                </div>
                <p className="text-xs text-secondary leading-relaxed">
                  Compose press notifications, rewrite content descriptions, or completely purge expired club announcements.
                </p>
              </div>
              <div className="flex flex-col gap-1.5 pt-2 border-t border-base-300/60">
                <Link href="/dashboard/post" className="btn btn-sm btn-ghost justify-between font-bold tracking-wide text-xs hover:bg-base-300 text-primary">
                  <span>Open Content Repository</span>
                  <span>→</span>
                </Link>
                <Link href="/dashboard/post/create" className="btn btn-sm btn-ghost justify-between font-bold tracking-wide text-xs hover:bg-base-300 text-secondary">
                  <span>+ Compose Blog Article</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="bg-base-200 border border-base-300 rounded-box p-6 flex flex-col justify-between gap-5 shadow-sm">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-primary text-lg font-bold tracking-tight">Directory Profiles</h3>
                  <span className="text-xl">🤝</span>
                </div>
                <p className="text-xs text-secondary leading-relaxed">
                  Update active officer biographies and maintain active corporate partnership links and sponsor branding nodes.
                </p>
              </div>
              <div className="flex flex-col gap-1.5 pt-2 border-t border-base-300/60">
                <Link href="/dashboard/executiveNsponsor" className="btn btn-sm btn-ghost justify-between font-bold tracking-wide text-xs hover:bg-base-300 text-primary">
                  <span>Manage Officers & Sponsors</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default function OverviewDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <p className="text-secondary text-sm font-medium animate-pulse">Launching Control Center Console...</p>
      </div>
    }>
      <OverviewDashboardContent />
    </Suspense>
  );
}