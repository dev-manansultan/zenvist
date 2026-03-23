"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface JobActionsProps {
  id: string;
  isActive: boolean;
}

export function JobActions({ id, isActive }: JobActionsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggleActive() {
    setLoading(true);
    await fetch(`/api/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    setLoading(false);
    router.refresh();
  }

  async function removeJob() {
    const confirmed = window.confirm("Delete this job?");
    if (!confirmed) return;

    setLoading(true);
    await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={`/dashboard/jobs/${id}/edit`} className="text-sm text-zinc-700 underline">
        Edit
      </Link>
      <button
        type="button"
        disabled={loading}
        onClick={toggleActive}
        className="text-sm text-zinc-700 underline disabled:opacity-50"
      >
        {isActive ? "Disable" : "Enable"}
      </button>
      <button
        type="button"
        disabled={loading}
        onClick={removeJob}
        className="text-sm text-red-700 underline disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
