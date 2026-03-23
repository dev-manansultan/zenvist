import { z } from "zod";

const repeatType = z.enum(["once", "daily", "weekly"]);
const httpUrl = z
  .string()
  .url()
  .refine((value) => value.startsWith("http://") || value.startsWith("https://"), {
    message: "URL must start with http:// or https://",
  });

export const createJobSchema = z.object({
  url: httpUrl,
  visitTime: z.iso.datetime(),
  repeatType,
  durationSec: z.number().int().min(15).max(300),
});

export const updateJobSchema = z.object({
  url: httpUrl.optional(),
  visitTime: z.iso.datetime().optional(),
  repeatType: repeatType.optional(),
  durationSec: z.number().int().min(15).max(300).optional(),
  isActive: z.boolean().optional(),
});
