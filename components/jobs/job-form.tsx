"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type RepeatType = "once" | "daily" | "weekly";

interface JobFormProps {
  mode: "create" | "edit";
  jobId?: string;
  initialValues?: {
    url: string;
    next_run_at: string;
    repeat_type: RepeatType;
    duration_sec: number;
    is_active: boolean;
  };
}

export function JobForm({ mode, jobId, initialValues }: JobFormProps) {
  const router = useRouter();
  const [url, setUrl] = useState(initialValues?.url ?? "");
  const [visitTime, setVisitTime] = useState(
    initialValues?.next_run_at ? initialValues.next_run_at.slice(0, 16) : "",
  );
  const [repeatType, setRepeatType] = useState<RepeatType>(initialValues?.repeat_type ?? "once");
  const [durationSec, setDurationSec] = useState(initialValues?.duration_sec ?? 45);
  const [isActive, setIsActive] = useState(initialValues?.is_active ?? true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return Boolean(url && visitTime && durationSec >= 15 && durationSec <= 300);
  }, [url, visitTime, durationSec]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      url,
      visitTime: new Date(visitTime).toISOString(),
      repeatType,
      durationSec,
      isActive,
    };

    const endpoint = mode === "create" ? "/api/jobs" : `/api/jobs/${jobId}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error?.message ?? "Request failed");
      return;
    }

    router.push("/dashboard/jobs");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-zinc-900">{mode === "create" ? "Create Job" : "Edit Job"}</h1>

      <div className="space-y-1">
        <label htmlFor="url" className="text-sm font-medium text-zinc-700">
          URL
        </label>
        <input
          id="url"
          type="url"
          required
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          placeholder="https://example.com"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="visit-time" className="text-sm font-medium text-zinc-700">
          Visit time (UTC)
        </label>
        <input
          id="visit-time"
          type="datetime-local"
          required
          value={visitTime}
          onChange={(event) => setVisitTime(event.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="repeat-type" className="text-sm font-medium text-zinc-700">
            Repeat
          </label>
          <select
            id="repeat-type"
            value={repeatType}
            onChange={(event) => setRepeatType(event.target.value as RepeatType)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          >
            <option value="once">Once</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="duration" className="text-sm font-medium text-zinc-700">
            Duration (sec)
          </label>
          <input
            id="duration"
            type="number"
            min={15}
            max={300}
            value={durationSec}
            onChange={(event) => setDurationSec(Number(event.target.value))}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {mode === "edit" ? (
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
            className="rounded border-zinc-300"
          />
          Active
        </label>
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex items-center gap-2">
        <button
          disabled={loading || !canSubmit}
          type="submit"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : mode === "create" ? "Create job" : "Update job"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/jobs")}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
