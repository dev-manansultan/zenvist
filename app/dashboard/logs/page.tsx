import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function LogsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  const userId = userData.user?.id;
  if (!userId) {
    return null;
  }

  const { data: logs, error } = await supabase
    .from("visit_logs")
    .select("id,job_id,status,started_at,ended_at,duration_sec,error_message,video_path")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return <p className="text-error">Failed to load logs: {error.message}</p>;
  }

  return (
    <section className="space-y-6">
      <div className="border-b border-accent/30 pb-4">
        <h1 className="text-2xl font-bold text-dark">Runtime Logs</h1>
        <p className="mt-1 text-sm text-dark/60">View detailed execution history and video artifacts for all jobs.</p>
      </div>

      {logs && logs.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-accent/40 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-accent/30 text-sm">
            <thead className="bg-light/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left font-semibold text-dark/80">Visit Time</th>
                <th scope="col" className="px-6 py-4 text-left font-semibold text-dark/80">Status</th>
                <th scope="col" className="px-6 py-4 text-left font-semibold text-dark/80">Duration</th>
                <th scope="col" className="px-6 py-4 text-left font-semibold text-dark/80">Error</th>
                <th scope="col" className="px-6 py-4 text-right font-semibold text-dark/80">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent/20 bg-white">
              {logs.map((log) => (
                <tr key={log.id} className="group hover:bg-light/30 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4 text-dark/80 font-medium">
                    {new Date(log.started_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                     {log.status === "success" || log.status === "completed" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success ring-1 ring-inset ring-success/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-success" />
                          {log.status}
                        </span>
                      ) : log.status === "failed" || log.status === "error" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-error/10 px-2.5 py-1 text-xs font-semibold text-error ring-1 ring-inset ring-error/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-error" />
                          {log.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-semibold text-secondary ring-1 ring-inset ring-secondary/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                          {log.status}
                        </span>
                      )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-dark/70">{log.duration_sec}s</td>
                  <td className="px-6 py-4 text-dark/70 text-xs truncate max-w-[200px]">
                     {log.error_message ? (
                        <span className="text-error/80" title={log.error_message}>{log.error_message}</span>
                     ) : (
                        "-"
                     )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <Link href={`/dashboard/logs/${log.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-secondary transition-colors">
                      {log.video_path ? (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Watch
                        </>
                      ) : (
                        "Details"
                      )}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-accent/80 bg-white/50 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 mb-4 text-dark/50">
             <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
             </svg>
          </div>
          <h3 className="text-sm font-semibold text-dark">No logs found</h3>
          <p className="mt-1 text-sm text-dark/50 max-w-sm">Runtime logs will appear here automatically once your scheduled jobs begin executing.</p>
        </div>
      )}
    </section>
  );
}
