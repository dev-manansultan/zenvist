import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(_request: Request, context: RouteContext<"/api/logs/[id]/video-url">) {
  const params = await context.params;
  const logId = params.id;
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized", message: "Unauthorized" } }, { status: 401 });
  }

  const { data: log, error: logError } = await supabase
    .from("visit_logs")
    .select("id, user_id, video_path")
    .eq("id", logId)
    .eq("user_id", userData.user.id)
    .single();

  if (logError || !log?.video_path) {
    return NextResponse.json({ ok: false, error: { code: "not_found", message: "Video not found" } }, { status: 404 });
  }

  const { data, error } = await supabase.storage.from("videos").createSignedUrl(log.video_path, 300);

  if (error) {
    return NextResponse.json({ ok: false, error: { code: "internal_error", message: error.message } }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data: { url: data.signedUrl, expiresIn: 300 } });
}
