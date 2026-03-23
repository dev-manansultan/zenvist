import { z } from "zod";

const httpUrl = z
  .string()
  .url()
  .refine((value) => value.startsWith("http://") || value.startsWith("https://"), {
    message: "URL must start with http:// or https://",
  });

export const createJobSchema = z.object({
  url: httpUrl,
  visitTime: z.iso.datetime(),
  durationSec: z.number().int().min(15).max(300),
});

export const updateJobSchema = z.object({
  url: httpUrl.optional(),
  visitTime: z.iso.datetime().optional(),
  durationSec: z.number().int().min(15).max(300).optional(),
  isActive: z.boolean().optional(),
});
