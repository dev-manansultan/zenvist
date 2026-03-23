import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

export const maxDuration = 60;

function isAuthorized(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!env.cronSecret) return false;
  return authorization === `Bearer ${env.cronSecret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized", message: "Unauthorized" } }, { status: 401 });
  }

  const retentionDays = Math.max(1, Math.min(365, Number(process.env.RETENTION_DAYS ?? 7)));
  const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000).toISOString();

  const supabase = createSupabaseServiceClient();

  const { data: oldLogs, error: oldLogsError } = await supabase
    .from("visit_logs")
    .select("id,video_path")
    .lt("created_at", cutoff)
    .not("video_path", "is", null)
    .limit(500);

  if (oldLogsError) {
    return NextResponse.json({ ok: false, error: { code: "internal_error", message: oldLogsError.message } }, { status: 500 });
  }

  const logs = oldLogs ?? [];

  if (logs.length === 0) {
    return NextResponse.json({
      ok: true,
      data: { retentionDays, cutoff, selected: 0, deletedFiles: 0, updatedLogs: 0 },
    });
  }

  const paths = logs.map((row) => row.video_path).filter((value): value is string => Boolean(value));

  let deletedFiles = 0;
  if (paths.length > 0) {
    const { data: removed, error: removeError } = await supabase.storage.from("videos").remove(paths);

    if (removeError) {
      return NextResponse.json({ ok: false, error: { code: "internal_error", message: removeError.message } }, { status: 500 });
    }

    deletedFiles = removed?.length ?? 0;
  }

  const ids = logs.map((row) => row.id);
  const { error: updateError } = await supabase
    .from("visit_logs")
    .update({
      video_path: null,
      error_code: "video_retention_deleted",
      error_message: `Video removed after ${retentionDays} day retention policy`,
    })
    .in("id", ids);

  if (updateError) {
    return NextResponse.json({ ok: false, error: { code: "internal_error", message: updateError.message } }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    data: {
      retentionDays,
      cutoff,
      selected: logs.length,
      deletedFiles,
      updatedLogs: ids.length,
    },
  });
}
