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
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-900">Log Detail</h1>
        <Link href="/dashboard/logs" className="text-sm text-zinc-700 underline">
          Back to logs
        </Link>
      </div>

      <div className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-6 sm:grid-cols-2">
        <p className="text-sm text-zinc-700">
          <span className="font-medium">Status:</span> {log.status}
        </p>
        <p className="text-sm text-zinc-700">
          <span className="font-medium">Job ID:</span> {log.job_id}
        </p>
        <p className="text-sm text-zinc-700">
          <span className="font-medium">Started:</span> {new Date(log.started_at).toLocaleString()}
        </p>
        <p className="text-sm text-zinc-700">
          <span className="font-medium">Ended:</span> {new Date(log.ended_at).toLocaleString()}
        </p>
        <p className="text-sm text-zinc-700">
          <span className="font-medium">Duration:</span> {log.duration_sec}s
        </p>
        <p className="text-sm text-zinc-700">
          <span className="font-medium">Idempotency Key:</span> {log.idempotency_key}
        </p>
      </div>

      {log.error_message ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{log.error_message}</div>
      ) : null}

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-3 text-base font-semibold text-zinc-900">Video Playback</h2>
        {log.video_path ? <PlayVideoButton logId={log.id} /> : <p className="text-sm text-zinc-600">No video available for this run.</p>}
      </div>
    </section>
  );
}
