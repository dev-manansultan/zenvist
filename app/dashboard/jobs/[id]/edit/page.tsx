import { notFound } from "next/navigation";

import { JobForm } from "@/components/jobs/job-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    notFound();
  }

  const { data: job } = await supabase
    .from("visit_jobs")
    .select("id,url,next_run_at,repeat_type,duration_sec,is_active")
    .eq("id", id)
    .eq("user_id", userData.user.id)
    .single();

  if (!job) {
    notFound();
  }

  return <JobForm mode="edit" jobId={job.id} initialValues={job} />;
}
