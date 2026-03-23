import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updateJobSchema } from "@/lib/validation/jobs";

export async function PATCH(request: Request, context: RouteContext<"/api/jobs/[id]">) {
  const params = await context.params;
  const jobId = params.id;
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized", message: "Unauthorized" } }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = updateJobSchema.safeParse(json);

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

  const updates: Record<string, unknown> = {};

  if (parsed.data.url !== undefined) updates.url = parsed.data.url;
  if (parsed.data.visitTime !== undefined) updates.next_run_at = parsed.data.visitTime;
  if (parsed.data.repeatType !== undefined) updates.repeat_type = parsed.data.repeatType;
  if (parsed.data.durationSec !== undefined) updates.duration_sec = parsed.data.durationSec;
  if (parsed.data.isActive !== undefined) {
    updates.is_active = parsed.data.isActive;
    if (!parsed.data.isActive) {
      updates.status = "disabled";
    } else {
      updates.status = "pending";
    }
  }

  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("visit_jobs")
    .update(updates)
    .eq("id", jobId)
    .eq("user_id", userData.user.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: { code: "internal_error", message: error.message } }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data });
}

export async function DELETE(_request: Request, context: RouteContext<"/api/jobs/[id]">) {
  const params = await context.params;
  const jobId = params.id;
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized", message: "Unauthorized" } }, { status: 401 });
  }

  const { error } = await supabase.from("visit_jobs").delete().eq("id", jobId).eq("user_id", userData.user.id);

  if (error) {
    return NextResponse.json({ ok: false, error: { code: "internal_error", message: error.message } }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
