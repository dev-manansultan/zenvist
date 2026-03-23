export type RepeatType = "once" | "daily" | "weekly";

export type JobStatus =
  | "pending"
  | "running"
  | "retry"
  | "disabled"
  | "completed"
  | "failed";

export type LogStatus = "success" | "failed";

export interface VisitJob {
  id: string;
  user_id: string;
  url: string;
  repeat_type: RepeatType;
  duration_sec: number;
  next_run_at: string;
  last_run_at: string | null;
  status: JobStatus;
  is_active: boolean;
  attempt_count: number;
  max_attempts: number;
  locked_at: string | null;
  locked_by: string | null;
  last_error: string | null;
  created_at: string;
  updated_at: string;
}

export interface VisitLog {
  id: string;
  user_id: string;
  job_id: string;
  idempotency_key: string;
  status: LogStatus;
  started_at: string;
  ended_at: string;
  duration_sec: number;
  video_path: string | null;
  error_code: string | null;
  error_message: string | null;
  created_at: string;
}
