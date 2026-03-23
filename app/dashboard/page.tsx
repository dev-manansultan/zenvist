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
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Total Jobs</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900">{totalJobs}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Active Jobs</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900">{activeJobs}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Total Logs</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900">{totalLogs}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Failed Runs</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900">{failedLogs}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/dashboard/jobs/new" className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
          Create job
        </Link>
        <Link href="/dashboard/jobs" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800">
          View jobs
        </Link>
        <Link href="/dashboard/logs" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800">
          View logs
        </Link>
      </div>
    </section>
  );
}
