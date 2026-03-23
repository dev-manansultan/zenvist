import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const jobId = searchParams.get("jobId");

  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized", message: "Unauthorized" } }, { status: 401 });
  }

  let query = supabase
    .from("visit_logs")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (status) {
    query = query.eq("status", status);
  }

  if (jobId) {
    query = query.eq("job_id", jobId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ ok: false, error: { code: "internal_error", message: error.message } }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data: { items: data ?? [] } });
}
