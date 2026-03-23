import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { VisitJob } from "@/lib/types";
import { createJobSchema } from "@/lib/validation/jobs";
import { runPlaywrightVisit } from "@/lib/visit-agent";
import { probeUrl } from "@/lib/url-health";

export const runtime = "nodejs";
export const maxDuration = 120;

function buildPreviewVideoPath(userId: string, previewId: string) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  return `${userId}/previews/${year}/${month}/${day}/${previewId}.webm`;
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized", message: "Unauthorized" } }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = createJobSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "invalid_payload",
          message: parsed.error.issues[0]?.message ?? "Invalid payload",
        },
      },
      { status: 400 },
    );
  }

  const payload = parsed.data;
  const probe = await probeUrl(payload.url);

  if (!probe.reachable) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "url_unreachable",
          message: "URL check failed. Make sure the website is reachable and try again.",
        },
        data: {
          probe,
        },
      },
      { status: 400 },
    );
  }

  const previewJob: VisitJob = {
    id: crypto.randomUUID(),
    user_id: userData.user.id,
    url: payload.url,
    repeat_type: "daily",
    duration_sec: payload.durationSec,
    next_run_at: payload.visitTime,
    last_run_at: null,
    status: "pending",
    is_active: true,
    attempt_count: 0,
    max_attempts: 1,
    locked_at: null,
    locked_by: null,
    last_error: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const previewResult = await runPlaywrightVisit(previewJob, env.maxDurationSec);

  if (previewResult.status === "failed" || !previewResult.videoBuffer) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: previewResult.errorCode ?? "preview_failed",
          message: previewResult.errorMessage ?? "Preview interaction failed.",
        },
      },
      { status: 400 },
    );
  }

  const storage = createSupabaseServiceClient().storage.from("videos");
  const previewPath = buildPreviewVideoPath(userData.user.id, previewJob.id);

  const { error: uploadError } = await storage.upload(previewPath, previewResult.videoBuffer, {
    contentType: "video/webm",
    upsert: true,
  });

  if (uploadError) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "preview_upload_failed",
          message: uploadError.message,
        },
      },
      { status: 500 },
    );
  }

  const { data: signedData, error: signError } = await storage.createSignedUrl(previewPath, 600);

  if (signError || !signedData?.signedUrl) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "preview_sign_failed",
          message: signError?.message ?? "Failed to prepare preview video URL.",
        },
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    data: {
      preview: {
        url: payload.url,
        resolvedUrl: probe.finalUrl ?? payload.url,
        visitTime: payload.visitTime,
        durationSec: previewResult.durationSec,
        initialStatus: "pending",
        videoUrl: signedData.signedUrl,
        videoPath: previewPath,
        probe,
      },
    },
  });
}
