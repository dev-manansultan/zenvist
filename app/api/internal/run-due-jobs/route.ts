import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { createIdempotencyKey, computeNextRunAt, getBackoffMinutes, toIso } from "@/lib/jobs";
import { env } from "@/lib/env";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import type { RepeatType, VisitJob } from "@/lib/types";

export const maxDuration = 60;

async function runVisitSimulation(job: VisitJob) {
  const startedAt = new Date();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), Math.max(5, Math.min(env.maxDurationSec, 240)) * 1000);

    const response = await fetch(job.url, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Visit failed with status ${response.status}`);
    }

    const endedAt = new Date();

    return {
      status: "success" as const,
      startedAt,
      endedAt,
      durationSec: Math.max(1, Math.round((endedAt.getTime() - startedAt.getTime()) / 1000)),
      videoPath: null,
      errorCode: null,
      errorMessage: null,
    };
  } catch (error) {
    const endedAt = new Date();

    return {
      status: "failed" as const,
      startedAt,
      endedAt,
      durationSec: Math.max(1, Math.round((endedAt.getTime() - startedAt.getTime()) / 1000)),
      videoPath: null,
      errorCode: "visit_failed",
      errorMessage: error instanceof Error ? error.message : "Visit failed",
    };
  }
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
    const result = await runVisitSimulation(job);
    const attemptCount = (job.attempt_count ?? 0) + 1;
    const idempotencyKey = createIdempotencyKey(job.id);

    const nextForRecurring = result.status === "success" ? computeNextRunAt(new Date(), job.repeat_type as RepeatType) : null;
    const retryAt = result.status === "failed" ? new Date(Date.now() + getBackoffMinutes(attemptCount) * 60 * 1000) : null;

    if (result.status === "success") {
      succeeded += 1;
    } else {
      failed += 1;
    }

    await supabase.from("visit_logs").insert({
      user_id: job.user_id,
      job_id: job.id,
      idempotency_key: idempotencyKey,
      status: result.status,
      started_at: toIso(result.startedAt),
      ended_at: toIso(result.endedAt),
      duration_sec: result.durationSec,
      video_path: result.videoPath,
      error_code: result.errorCode,
      error_message: result.errorMessage,
    });

    const nextStatus =
      result.status === "success"
        ? job.repeat_type === "once"
          ? "completed"
          : "pending"
        : attemptCount >= (job.max_attempts ?? 3)
          ? "failed"
          : "retry";

    const nextRunAt =
      result.status === "success"
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
        last_error: result.errorMessage,
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
