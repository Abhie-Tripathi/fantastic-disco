import { z } from "zod";
import { SuggestionSchema } from ".";

export const TagSchema = SuggestionSchema.extend({
  slugs: z
    .string()
    .transform((slugs) => slugs.split(","))
    .optional(),
});

export const TagResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  categoryId: z.string().nullable(),
  id_10x: z.number().nullable(),
});
