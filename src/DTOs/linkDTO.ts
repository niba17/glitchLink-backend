// src/dtos/link.dto.ts
import { z } from "zod";

// format datetime hanya sampai menit (contoh: 2025-12-31 23:59)
const dateTimeWithoutSecondsRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;

export const createShortLinkSchema = z.object({
  originalUrl: z
    .string()
    .trim()
    .min(1, { message: "Original URL is required" })
    .url({ message: "Invalid URL format" }),

  customAlias: z
    .string()
    .trim()
    .min(1, { message: "Custom Alias is required" }) // ← alias wajib
    .max(20, { message: "Custom alias cannot exceed 20 characters" })
    .regex(/^[a-z0-9-]+$/, {
      message:
        "Custom alias can only contain lowercase letters, numbers, and hyphens",
    }),

  expiresAt: z
    .string()
    .regex(dateTimeWithoutSecondsRegex, {
      message: "Invalid datetime format (use YYYY-MM-DD HH:mm)",
    })
    .optional()
    .or(z.literal(null)),
});

export type CreateLinkDto = z.infer<typeof createShortLinkSchema>;

export const updateLinkSchema = z.object({
  customAlias: z
    .string()
    .trim()
    .min(1, { message: "Custom Alias is required" })
    .max(20, { message: "Custom alias cannot exceed 20 characters" })
    .regex(/^[a-z0-9-]+$/, {
      message:
        "Custom alias can only contain lowercase letters, numbers, and hyphens",
    }),

  expiresAt: z
    .string()
    .regex(dateTimeWithoutSecondsRegex, {
      message: "Invalid datetime format (use YYYY-MM-DD HH:mm)",
    })
    .nullable()
    .optional(),
});

export type UpdateLinkDto = z.infer<typeof updateLinkSchema>;

export const getLinkAnalyticsSchema = z.object({
  linkId: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().positive({ message: "Link ID must be a positive number" })
  ),
});

export type GetLinkAnalyticsDto = z.infer<typeof getLinkAnalyticsSchema>;

export const importGuestLinkSchema = z.object({
  linkId: z.number().positive(),
  customAlias: z
    .string()
    .trim()
    .min(1, { message: "Custom Alias is required" })
    .max(20, { message: "Custom alias cannot exceed 20 characters" })
    .regex(/^[a-z0-9-]+$/, {
      message:
        "Custom alias can only contain lowercase letters, numbers, and hyphens",
    }),

  expiresAt: z
    .string()
    .regex(dateTimeWithoutSecondsRegex, {
      message: "Invalid datetime format (use YYYY-MM-DD HH:mm)",
    })
    .nullable()
    .optional(),
});

export type importGuestLinkDto = z.infer<typeof importGuestLinkSchema>;
