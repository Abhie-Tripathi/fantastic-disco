import { z } from "zod";
import { SuggestionSchema } from ".";

const EventTypeGroup = {
  BUSINESS: "business",
  SOCIAL: "social",
} as const;

export const EventTypeSchema = SuggestionSchema.extend({
  slugs: z
    .string()
    .transform((slugs) => slugs.split(","))
    .optional(),
  type: z
    .string()
    .refine((type) => type.toUpperCase() in EventTypeGroup)
    .transform((type) => type.toUpperCase())
    .optional(),
});

export const EventTypeResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  eventGroupType: z.string(),
  groups: z.array(z.string()),
  id_10x: z.number().nullable(),
  priority: z.number().nullable(),
});
