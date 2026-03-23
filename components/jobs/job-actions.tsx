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
    const confirmed = window.confirm("Are you sure you want to delete this job?");
    if (!confirmed) return;

    setLoading(true);
    await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
      <Link 
        href={`/dashboard/jobs/${id}/edit`} 
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-dark/60 hover:bg-primary/10 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
        title="Edit Job"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </Link>
      
      <button
        type="button"
        disabled={loading}
        onClick={toggleActive}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50
          ${isActive 
            ? 'text-dark/60 hover:bg-secondary/10 hover:text-secondary' 
            : 'text-dark/60 hover:bg-success/10 hover:text-success'}`}
        title={isActive ? "Disable Job" : "Enable Job"}
      >
        {isActive ? (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </button>

      <button
        type="button"
        disabled={loading}
        onClick={removeJob}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-dark/60 hover:bg-error/10 hover:text-error transition-colors focus:outline-none focus:ring-2 focus:ring-error/40 disabled:opacity-50"
        title="Delete Job"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
