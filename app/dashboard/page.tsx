import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  const userId = userData.user?.id;
  if (!userId) {
    return null;
  }

  const [jobsRes, logsRes] = await Promise.all([
    supabase.from("visit_jobs").select("id,status", { count: "exact" }).eq("user_id", userId),
    supabase.from("visit_logs").select("id,status", { count: "exact" }).eq("user_id", userId),
  ]);

  const totalJobs = jobsRes.count ?? 0;
  const activeJobs = jobsRes.data?.filter((row) => row.status === "pending" || row.status === "retry").length ?? 0;
  const totalLogs = logsRes.count ?? 0;
  const failedLogs = logsRes.data?.filter((row) => row.status === "failed").length ?? 0;

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-dark">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-dark/60">Monitor your automated sessions and overall performance.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group rounded-2xl border border-accent/30 bg-white p-6 shadow-sm ring-1 ring-inset ring-transparent hover:ring-primary/20 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-sm font-medium text-dark/70">Total Jobs</p>
          </div>
          <p className="mt-4 text-3xl font-bold text-dark">{totalJobs}</p>
        </div>

        <div className="group rounded-2xl border border-accent/30 bg-white p-6 shadow-sm ring-1 ring-inset ring-transparent hover:ring-secondary/30 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-dark/70">Active Jobs</p>
          </div>
          <p className="mt-4 text-3xl font-bold text-dark">{activeJobs}</p>
        </div>

        <div className="group rounded-2xl border border-accent/30 bg-white p-6 shadow-sm ring-1 ring-inset ring-transparent hover:ring-accent/50 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-dark/70">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <p className="text-sm font-medium text-dark/70">Total Logs</p>
          </div>
          <p className="mt-4 text-3xl font-bold text-dark">{totalLogs}</p>
        </div>

        <div className="group rounded-2xl border border-accent/30 bg-white p-6 shadow-sm ring-1 ring-inset ring-transparent hover:ring-error/20 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-error/10 text-error">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-dark/70">Failed Runs</p>
          </div>
          <p className="mt-4 text-3xl font-bold text-dark">{failedLogs}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-accent/30">
        <Link href="/dashboard/jobs/new" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-300 hover:-translate-y-0.5">
          <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create new job
        </Link>
        <Link href="/dashboard/jobs" className="rounded-full border border-accent bg-white hover:bg-light px-6 py-2.5 text-sm font-semibold text-dark/80 transition-colors">
          View all jobs
        </Link>
        <Link href="/dashboard/logs" className="rounded-full border border-accent bg-white hover:bg-light px-6 py-2.5 text-sm font-semibold text-dark/80 transition-colors">
          View runtime logs
        </Link>
      </div>
    </section>
  );
}
