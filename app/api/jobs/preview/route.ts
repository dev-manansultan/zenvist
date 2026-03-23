import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createJobSchema } from "@/lib/validation/jobs";
import { probeUrl } from "@/lib/url-health";

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

  return NextResponse.json({
    ok: true,
    data: {
      preview: {
        url: payload.url,
        resolvedUrl: probe.finalUrl ?? payload.url,
        visitTime: payload.visitTime,
        repeatType: payload.repeatType,
        durationSec: payload.durationSec,
        initialStatus: "pending",
        probe,
      },
    },
  });
}
