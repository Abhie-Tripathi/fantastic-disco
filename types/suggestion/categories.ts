import { z } from "zod";
import { SuggestionSchema } from ".";

export const CategorySchema = SuggestionSchema.extend({
  slugs: z
    .string()
    .transform((slugs) => slugs.split(","))
    .optional(),
});

export const CategoryResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  id_10x: z.number().nullable(),
});
