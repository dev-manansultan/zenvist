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
    return <p className="text-red-600">Failed to load logs: {error.message}</p>;
  }

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold text-zinc-900">Logs</h1>

      {logs && logs.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-50 text-left text-zinc-600">
              <tr>
                <th className="px-4 py-3">Visit Time</th>
                <th className="px-4 py-3">Job</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Error</th>
                <th className="px-4 py-3">Video</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-zinc-100 align-top">
                  <td className="px-4 py-3 text-zinc-700">{new Date(log.started_at).toLocaleString()}</td>
                  <td className="px-4 py-3 text-zinc-700">{log.job_id}</td>
                  <td className="px-4 py-3 text-zinc-700">{log.status}</td>
                  <td className="px-4 py-3 text-zinc-700">{log.duration_sec}s</td>
                  <td className="px-4 py-3 text-zinc-700">{log.error_message ?? "-"}</td>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/logs/${log.id}`} className="text-zinc-700 underline">
                      {log.video_path ? "View" : "Details"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-600">
          No logs yet.
        </div>
      )}
    </section>
  );
}
