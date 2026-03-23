import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { probeUrl } from "@/lib/url-health";
import { createJobSchema } from "@/lib/validation/jobs";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized", message: "Unauthorized" } }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("visit_jobs")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ ok: false, error: { code: "internal_error", message: error.message } }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data: { items: data ?? [] } });
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
      },
      { status: 400 },
    );
  }

  const insertPayload = {
    user_id: userData.user.id,
    url: payload.url,
    repeat_type: payload.repeatType,
    duration_sec: payload.durationSec,
    next_run_at: payload.visitTime,
    status: "pending",
    is_active: true,
  };

  const { data, error } = await supabase.from("visit_jobs").insert(insertPayload).select("*").single();

  if (error) {
    return NextResponse.json({ ok: false, error: { code: "internal_error", message: error.message } }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data }, { status: 201 });
}
