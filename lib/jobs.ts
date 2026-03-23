import { randomUUID } from "node:crypto";

import type { RepeatType } from "@/lib/types";

export function computeNextRunAt(current: Date, repeatType: RepeatType): Date | null {
  if (repeatType === "once") {
    return null;
  }

  const next = new Date(current);

  if (repeatType === "daily") {
    next.setUTCDate(next.getUTCDate() + 1);
    return next;
  }

  next.setUTCDate(next.getUTCDate() + 7);
  return next;
}

export function getBackoffMinutes(attemptCount: number): number {
  if (attemptCount <= 1) return 1;
  if (attemptCount === 2) return 5;
  return 15;
}

export function createIdempotencyKey(jobId: string) {
  return `${jobId}:${Date.now()}:${randomUUID()}`;
}

export function toIso(value: Date) {
  return value.toISOString();
}
