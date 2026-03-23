import Link from "next/link";

import { JobActions } from "@/components/jobs/job-actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function JobsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  const userId = userData.user?.id;
  if (!userId) {
    return null;
  }

  const { data: jobs, error } = await supabase
    .from("visit_jobs")
    .select("id,url,repeat_type,next_run_at,duration_sec,status,is_active")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="text-red-600">Failed to load jobs: {error.message}</p>;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-900">Jobs</h1>
        <Link href="/dashboard/jobs/new" className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
          Create Job
        </Link>
      </div>

      {jobs && jobs.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-50 text-left text-zinc-600">
              <tr>
                <th className="px-4 py-3">URL</th>
                <th className="px-4 py-3">Repeat</th>
                <th className="px-4 py-3">Next Run</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-t border-zinc-100 align-top">
                  <td className="px-4 py-3 text-zinc-700">{job.url}</td>
                  <td className="px-4 py-3 text-zinc-700">{job.repeat_type}</td>
                  <td className="px-4 py-3 text-zinc-700">{job.next_run_at ? new Date(job.next_run_at).toLocaleString() : "-"}</td>
                  <td className="px-4 py-3 text-zinc-700">{job.duration_sec}s</td>
                  <td className="px-4 py-3 text-zinc-700">{job.is_active ? job.status : "disabled"}</td>
                  <td className="px-4 py-3">
                    <JobActions id={job.id} isActive={job.is_active} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-600">
          No jobs yet. Create your first job.
        </div>
      )}
    </section>
  );
}
