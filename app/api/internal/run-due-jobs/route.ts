import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { createIdempotencyKey, computeNextRunAt, getBackoffMinutes, toIso } from "@/lib/jobs";
import { runPlaywrightVisit } from "@/lib/visit-agent";
import { env } from "@/lib/env";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import type { RepeatType, VisitJob } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

function buildVideoPath(userId: string, jobId: string, logId: string) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  return `${userId}/${jobId}/${year}/${month}/${day}/${logId}.webm`;
}

function isAuthorized(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!env.cronSecret) return false;
  return authorization === `Bearer ${env.cronSecret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized", message: "Unauthorized" } }, { status: 401 });
  }

  const supabase = createSupabaseServiceClient();
  const requestId = randomUUID();
  const batchSize = Math.max(1, Math.min(20, env.batchSize));

  const { data: claimedJobs, error: claimError } = await supabase.rpc("claim_due_jobs", {
    p_batch_size: batchSize,
    p_worker_id: requestId,
  });

  if (claimError) {
    return NextResponse.json({ ok: false, error: { code: "internal_error", message: claimError.message } }, { status: 500 });
  }

  if (!claimedJobs || claimedJobs.length === 0) {
    return NextResponse.json({ ok: true, data: { claimed: 0, processed: 0, succeeded: 0, failed: 0 } });
  }

  let succeeded = 0;
  let failed = 0;

  for (const job of (claimedJobs ?? []) as VisitJob[]) {
    const logId = randomUUID();
    const result = await runPlaywrightVisit(job, env.maxDurationSec);
    const attemptCount = (job.attempt_count ?? 0) + 1;
    const idempotencyKey = createIdempotencyKey(job.id);
    let videoPath: string | null = null;
    let status = result.status;
    let errorCode = result.errorCode;
    let errorMessage = result.errorMessage;

    if (result.status === "success" && result.videoBuffer) {
      const objectPath = buildVideoPath(job.user_id, job.id, logId);
      const { error: uploadError } = await supabase.storage.from("videos").upload(objectPath, result.videoBuffer, {
        contentType: "video/webm",
        upsert: false,
      });

      if (uploadError) {
        status = "failed";
        errorCode = "storage_upload_failed";
        errorMessage = uploadError.message;
      } else {
        videoPath = objectPath;
      }
    }

    const nextForRecurring = status === "success" ? computeNextRunAt(new Date(), job.repeat_type as RepeatType) : null;
    const retryAt = status === "failed" ? new Date(Date.now() + getBackoffMinutes(attemptCount) * 60 * 1000) : null;

    if (status === "success") {
      succeeded += 1;
    } else {
      failed += 1;
    }

    await supabase.from("visit_logs").insert({
      id: logId,
      user_id: job.user_id,
      job_id: job.id,
      idempotency_key: idempotencyKey,
      status,
      started_at: toIso(result.startedAt),
      ended_at: toIso(result.endedAt),
      duration_sec: result.durationSec,
      video_path: videoPath,
      error_code: errorCode,
      error_message: errorMessage,
    });

    const nextStatus =
      status === "success"
        ? job.repeat_type === "once"
          ? "completed"
          : "pending"
        : attemptCount >= (job.max_attempts ?? 3)
          ? "failed"
          : "retry";

    const nextRunAt =
      status === "success"
        ? nextForRecurring
          ? nextForRecurring.toISOString()
          : null
        : nextStatus === "retry"
          ? retryAt?.toISOString() ?? null
          : null;

    await supabase
      .from("visit_jobs")
      .update({
        status: nextStatus,
        attempt_count: attemptCount,
        last_error: errorMessage,
        last_run_at: toIso(result.endedAt),
        next_run_at: nextRunAt,
        locked_at: null,
        locked_by: null,
        updated_at: toIso(new Date()),
      })
      .eq("id", job.id);
  }

  return NextResponse.json({
    ok: true,
    data: {
      claimed: (claimedJobs ?? []).length,
      processed: (claimedJobs ?? []).length,
      succeeded,
      failed,
    },
  });
}
