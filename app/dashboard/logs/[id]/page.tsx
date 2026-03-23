import Link from "next/link";
import { notFound } from "next/navigation";

import { PlayVideoButton } from "@/components/logs/play-video-button";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function LogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    notFound();
  }

  const { data: log } = await supabase
    .from("visit_logs")
    .select("*")
    .eq("id", id)
    .eq("user_id", userData.user.id)
    .single();

  if (!log) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between border-b border-accent/30 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Log Details</h1>
          <p className="mt-1 text-sm text-dark/60">Execution history and video artifact</p>
        </div>
        <Link href="/dashboard/logs" className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-dark/80 shadow-sm ring-1 ring-inset ring-accent/60 hover:bg-light transition-all">
          <svg className="-ml-1 mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to logs
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-accent/40 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-dark flex items-center gap-2">
                 <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                 </svg>
                 Playback Recording
              </h2>
              <div className="overflow-hidden rounded-xl border border-dark/10 bg-dark/5">
                <PlayVideoButton
                  logId={log.id}
                  startedAt={log.started_at}
                  durationSec={log.duration_sec}
                  status={log.status}
                />
              </div>
            </div>

            {log.error_message ? (
              <div className="rounded-2xl border border-error/20 bg-error/5 p-6 shadow-sm">
                <h2 className="mb-2 text-base font-semibold text-error flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Execution Error
                </h2>
                <p className="text-sm text-error/90 font-mono bg-white/50 p-3 rounded-lg border border-error/10 overflow-x-auto">
                  {log.error_message}
                </p>
              </div>
            ) : null}
         </div>

         <div className="space-y-6">
            <div className="rounded-2xl border border-accent/40 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-dark">Execution Summary</h2>
              <dl className="space-y-4 text-sm">
                <div>
                   <dt className="text-dark/50 font-medium mb-1">Status</dt>
                   <dd>
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
                          <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
                          {log.status}
                        </span>
                      )}
                   </dd>
                </div>
                <div>
                   <dt className="text-dark/50 font-medium mb-1">Duration</dt>
                   <dd className="font-medium text-dark/90">{log.duration_sec} seconds</dd>
                </div>
                <div>
                   <dt className="text-dark/50 font-medium mb-1">Started At</dt>
                   <dd className="font-medium text-dark/90">{new Date(log.started_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'medium' })}</dd>
                </div>
                {log.ended_at && (
                  <div>
                    <dt className="text-dark/50 font-medium mb-1">Ended At</dt>
                    <dd className="font-medium text-dark/90">{new Date(log.ended_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'medium' })}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="rounded-2xl border border-accent/40 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-dark">Technical Details</h2>
              <dl className="space-y-4 text-sm">
                <div>
                   <dt className="text-dark/50 font-medium mb-1">Job ID</dt>
                   <dd className="font-mono text-xs text-dark/70 break-all bg-light px-2 py-1 rounded truncate" title={log.job_id}>{log.job_id}</dd>
                </div>
                <div>
                   <dt className="text-dark/50 font-medium mb-1">Idempotency Key</dt>
                   <dd className="font-mono text-xs text-dark/70 break-all bg-light px-2 py-1 rounded truncate" title={log.idempotency_key}>{log.idempotency_key}</dd>
                </div>
              </dl>
            </div>
         </div>
      </div>
    </section>
  );
}
