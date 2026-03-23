"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

interface PlayVideoButtonProps {
  logId: string;
  startedAt: string;
  durationSec: number;
  status: "success" | "failed";
}

export function PlayVideoButton({ logId, startedAt, durationSec, status }: PlayVideoButtonProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [remainingMs, setRemainingMs] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const readyAtMs = useMemo(() => {
    return new Date(startedAt).getTime() + Math.max(1, durationSec) * 1000;
  }, [startedAt, durationSec]);

  const canEventuallyBeReady = status === "success";

  const loadUrl = useCallback(
    async (silent = false) => {
      if (!silent) {
        setLoading(true);
        setError(null);
      }

      const response = await fetch(`/api/logs/${logId}/video-url`, { method: "POST" });
      const body = await response.json().catch(() => null);

      if (!silent) {
        setLoading(false);
      }

      if (!response.ok) {
        const isNotReadyCase = response.status === 404 && canEventuallyBeReady;
        if (!isNotReadyCase && !silent) {
          setError(body?.error?.message ?? "Unable to load video");
        }
        return false;
      }

      setUrl(body.data.url);
      setPolling(false);
      setError(null);
      return true;
    },
    [canEventuallyBeReady, logId],
  );

  useEffect(() => {
    if (!polling || url) {
      return;
    }

    const countdownId = setInterval(() => {
      setRemainingMs(Math.max(0, readyAtMs - Date.now()));
    }, 1000);

    const pollId = setInterval(() => {
      void loadUrl(true);
    }, 5000);

    return () => {
      clearInterval(countdownId);
      clearInterval(pollId);
    };
  }, [loadUrl, polling, readyAtMs, url]);

  async function onClick() {
    if (!canEventuallyBeReady) {
      setError("This run failed, so no video is expected for this log.");
      return;
    }

    setRemainingMs(Math.max(0, readyAtMs - Date.now()));
    const loaded = await loadUrl(false);

    if (!loaded) {
      setPolling(true);
    }
  }

  const expectedTimeLabel = new Date(readyAtMs).toLocaleTimeString();
  const secondsLeft = Math.ceil(remainingMs / 1000);

  return (
    <div className="space-y-3">
      {!url ? (
        <button
          type="button"
          onClick={onClick}
          disabled={loading}
          className="rounded-lg border border-accent/80 px-4 py-2 text-sm font-medium text-dark/90 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Load video"}
        </button>
      ) : null}

      {polling && !url ? (
        <div className="rounded-lg border border-accent/40 bg-light p-3 text-sm text-dark/80">
          <div className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-accent/80 border-t-zinc-700" />
            <span>Preparing video. We will auto-load it when ready.</span>
          </div>
          <p className="mt-2 text-xs text-dark/70">
            Expected after: {expectedTimeLabel}
            {secondsLeft > 0 ? ` (${secondsLeft}s remaining)` : " (checking now)"}
          </p>
        </div>
      ) : null}

      {error ? <p className="text-sm text-error">{error}</p> : null}

      {url ? <video src={url} controls className="w-full rounded-xl border border-accent/40" /> : null}
    </div>
  );
}
