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
  const [durationSec, setDurationSec] = useState(initialValues?.duration_sec ?? 45);
  const [isActive, setIsActive] = useState(initialValues?.is_active ?? true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<{
    resolvedUrl: string;
    videoUrl: string;
    videoPath: string;
    statusCode: number | null;
  } | null>(null);
  const [hasPreviewed, setHasPreviewed] = useState(mode === "edit");

  const canSubmit = useMemo(() => {
    return Boolean(url && visitTime && durationSec >= 15 && durationSec <= 300);
  }, [url, visitTime, durationSec]);

  function resetPreviewState() {
    if (mode !== "create") return;
    setHasPreviewed(false);
    setPreviewData(null);
    setPreviewError(null);
  }

  async function onPreview() {
    setPreviewLoading(true);
    setPreviewError(null);
    setPreviewData(null);

    const payload = {
      url,
      visitTime: new Date(visitTime).toISOString(),
      durationSec,
    };

    const response = await fetch("/api/jobs/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await response.json().catch(() => null);
    setPreviewLoading(false);

    if (!response.ok) {
      setHasPreviewed(false);
      setPreviewError(body?.error?.message ?? "Preview failed");
      return;
    }

    const preview = body?.data?.preview;
    setPreviewData({
      resolvedUrl: preview.resolvedUrl,
      videoUrl: preview.videoUrl,
      videoPath: preview.videoPath,
      statusCode: preview?.probe?.status ?? null,
    });
    setHasPreviewed(true);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mode === "create" && !hasPreviewed) {
      setError("Preview the job first before creating it.");
      return;
    }

    setError(null);
    setLoading(true);

    const payload = {
      url,
      visitTime: new Date(visitTime).toISOString(),
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
    <div className="mx-auto max-w-3xl">
      <form onSubmit={onSubmit} className="relative overflow-hidden rounded-3xl border border-accent/40 bg-white/70 backdrop-blur-xl p-8 shadow-2xl shadow-dark/5 sm:p-10">
        <div className="absolute inset-x-0 -top-px h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-30" />
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-dark">{mode === "create" ? "Create Automated Job" : "Edit Job Configuration"}</h1>
          <p className="mt-2 text-sm text-dark/60">
            {mode === "create" 
              ? "Configure a new URL to be visited automatically on a schedule." 
              : "Update the settings for your scheduled visit."}
          </p>
        </div>

        <div className="space-y-6">
          <div className="group relative">
            <input
              id="url"
              type="url"
              required
              value={url}
              placeholder=" "
              onChange={(event) => {
                setUrl(event.target.value);
                resetPreviewState();
              }}
              className="peer w-full rounded-xl border border-accent/60 bg-white/50 pb-2.5 pt-6 px-4 text-sm text-dark outline-none transition-all focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary/50"
            />
            <label
              htmlFor="url"
              className="absolute left-4 top-4 -translate-y-3 cursor-text select-none text-xs font-semibold text-dark/50 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-focus:-translate-y-3 peer-focus:text-xs peer-focus:text-primary"
            >
              Target URL
            </label>
            {mode === "create" ? <p className="mt-2 text-xs text-dark/50 px-1">We will preview and verify this URL before saving.</p> : null}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="group relative">
              <input
                id="visit-time"
                type="datetime-local"
                required
                value={visitTime}
                placeholder=" "
                onChange={(event) => {
                  setVisitTime(event.target.value);
                  resetPreviewState();
                }}
                className="peer w-full rounded-xl border border-accent/60 bg-white/50 pb-2.5 pt-6 px-4 text-sm text-dark outline-none transition-all focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary/50"
              />
              <label
                htmlFor="visit-time"
                className="absolute left-4 top-4 -translate-y-3 cursor-text select-none text-xs font-semibold text-dark/50 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-focus:-translate-y-3 peer-focus:text-xs peer-focus:text-primary"
              >
                Initial Visit Time (UTC)
              </label>
            </div>

            <div className="group relative">
              <input
                id="duration"
                type="number"
                min={15}
                max={300}
                value={durationSec}
                placeholder=" "
                onChange={(event) => {
                  setDurationSec(Number(event.target.value));
                  resetPreviewState();
                }}
                className="peer w-full rounded-xl border border-accent/60 bg-white/50 pb-2.5 pt-6 px-4 text-sm text-dark outline-none transition-all focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary/50"
              />
              <label
                htmlFor="duration"
                className="absolute left-4 top-4 -translate-y-3 cursor-text select-none text-xs font-semibold text-dark/50 transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-focus:-translate-y-3 peer-focus:text-xs peer-focus:text-primary"
              >
                Duration (15-300 sec)
              </label>
            </div>
            
            <div className="group relative sm:col-span-2">
              <div className="w-full rounded-xl border border-accent/60 bg-light/50 px-4 py-3.5 text-sm text-dark/70">
                <span className="font-semibold block text-xs text-dark/50 mb-1">Schedule Pattern</span>
                Daily at selected time
              </div>
            </div>
          </div>

          {mode === "edit" ? (
            <label className="flex items-center gap-3 rounded-xl border border-accent/40 bg-light/30 p-4 cursor-pointer hover:bg-light/60 transition-colors">
              <div className="relative flex items-center">
                 <input
                   type="checkbox"
                   checked={isActive}
                   onChange={(event) => setIsActive(event.target.checked)}
                   className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-accent/80 checked:border-primary checked:bg-primary transition-all"
                 />
                 <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                 </svg>
              </div>
              <span className="text-sm font-medium text-dark/90">Job is Active</span>
            </label>
          ) : null}

          {mode === "create" ? (
            <div className="overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-dark">Preview Configuration</h3>
                    <p className="text-xs text-dark/60 mt-0.5">We will test the URL and capture a sample video before saving.</p>
                  </div>
                  <button
                    type="button"
                    disabled={!canSubmit || previewLoading}
                    onClick={onPreview}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-primary shadow-sm ring-1 ring-inset ring-primary/20 hover:bg-light focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 transition-all"
                  >
                    {previewLoading ? (
                      <>
                        <svg className="mr-2 h-4 w-4 animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Testing...
                      </>
                    ) : (
                      "Run Preview"
                    )}
                  </button>
                </div>

                {previewError ? (
                  <div className="mt-4 rounded-lg bg-error/10 p-3 text-sm text-error/90 flex items-start gap-2 border border-error/20">
                     <svg className="h-5 w-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     <span>{previewError}</span>
                  </div>
                ) : null}

                {previewData ? (
                  <div className="mt-5 space-y-3 rounded-xl bg-white p-4 border border-primary/10 shadow-sm">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="block text-xs text-dark/50 mb-0.5">Resolved URL</span>
                        <span className="font-medium text-dark truncate block max-w-full" title={previewData.resolvedUrl}>{previewData.resolvedUrl}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-dark/50 mb-0.5">Status Code</span>
                        <span className="inline-flex items-center rounded-md bg-success/10 px-2 py-0.5 text-xs font-medium text-success ring-1 ring-inset ring-success/20">
                           {previewData.statusCode ?? "n/a"}
                        </span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <span className="block text-xs text-dark/50 mb-2">Preview Capture</span>
                      <video src={previewData.videoUrl} controls className="w-full rounded-lg border border-accent/40 bg-dark/5 aspect-video object-contain" />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {error ? (
              <div className="rounded-lg bg-error/10 p-3 text-sm text-error/90 flex items-center gap-2 border border-error/20">
                 <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 <span>{error}</span>
              </div>
          ) : null}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-accent/20">
            <button
              type="button"
              onClick={() => router.push("/dashboard/jobs")}
              className="rounded-xl border border-accent/60 bg-white px-5 py-2.5 text-sm font-semibold text-dark/80 hover:bg-light transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
            >
              Cancel
            </button>
            <button
              disabled={loading || !canSubmit || (mode === "create" && !hasPreviewed)}
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:hover:shadow-md disabled:hover:translate-y-0 hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Saving...
                </>
              ) : mode === "create" ? (
                "Create Automated Job"
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
