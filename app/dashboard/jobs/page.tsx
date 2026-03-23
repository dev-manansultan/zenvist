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
    return <p className="text-error">Failed to load jobs: {error.message}</p>;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between border-b border-accent/30 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Automated Jobs</h1>
          <p className="mt-1 text-sm text-dark/60">Manage your scheduled visits and playback configuration.</p>
        </div>
        <Link href="/dashboard/jobs/new" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-300 hover:-translate-y-0.5">
          <svg className="-ml-1 mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create Job
        </Link>
      </div>

      {jobs && jobs.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-accent/40 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-accent/30 text-sm">
            <thead className="bg-light/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left font-semibold text-dark/80">Target URL</th>
                <th scope="col" className="px-6 py-4 text-left font-semibold text-dark/80">Schedule</th>
                <th scope="col" className="px-6 py-4 text-left font-semibold text-dark/80">Next Run</th>
                <th scope="col" className="px-6 py-4 text-left font-semibold text-dark/80">Duration</th>
                <th scope="col" className="px-6 py-4 text-left font-semibold text-dark/80">Status</th>
                <th scope="col" className="px-6 py-4 text-right font-semibold text-dark/80">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent/20 bg-white">
              {jobs.map((job) => (
                <tr key={job.id} className="group hover:bg-light/30 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-dark/90 truncate max-w-[200px]">{job.url}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-dark/70 capitalize">{job.repeat_type}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-dark/70">
                    {job.next_run_at ? new Date(job.next_run_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "-"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-dark/70">{job.duration_sec}s</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {job.is_active ? (
                      job.status === "success" || job.status === "completed" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success ring-1 ring-inset ring-success/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-success" />
                          {job.status}
                        </span>
                      ) : job.status === "failed" || job.status === "error" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-error/10 px-2.5 py-1 text-xs font-semibold text-error ring-1 ring-inset ring-error/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-error" />
                          {job.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-semibold text-secondary ring-1 ring-inset ring-secondary/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
                          {job.status}
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-dark/5 px-2.5 py-1 text-xs font-semibold text-dark/50 ring-1 ring-inset ring-dark/10">
                        <span className="h-1.5 w-1.5 rounded-full bg-dark/40" />
                        Disabled
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <JobActions id={job.id} isActive={job.is_active} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-accent/80 bg-white/50 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4 text-primary">
             <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
             </svg>
          </div>
          <h3 className="text-sm font-semibold text-dark">No jobs created</h3>
          <p className="mt-1 text-sm text-dark/50 max-w-sm">Get started by creating your first automated visit job. You can set the URL, duration, and recurrence pattern.</p>
          <div className="mt-6">
            <Link href="/dashboard/jobs/new" className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors">
              Create your first job
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
