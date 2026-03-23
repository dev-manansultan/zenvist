"use client";

import { useState } from "react";

interface PlayVideoButtonProps {
  logId: string;
}

export function PlayVideoButton({ logId }: PlayVideoButtonProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadUrl() {
    setLoading(true);
    setError(null);

    const response = await fetch(`/api/logs/${logId}/video-url`, { method: "POST" });
    const body = await response.json().catch(() => null);

    setLoading(false);

    if (!response.ok) {
      setError(body?.error?.message ?? "Unable to load video");
      return;
    }

    setUrl(body.data.url);
  }

  return (
    <div className="space-y-3">
      {!url ? (
        <button
          type="button"
          onClick={loadUrl}
          disabled={loading}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Load video"}
        </button>
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {url ? <video src={url} controls className="w-full rounded-xl border border-zinc-200" /> : null}
    </div>
  );
}
