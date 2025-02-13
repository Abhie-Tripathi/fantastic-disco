import { z } from "zod";

export const SuggestionSchema = z.object({
  ids: z
    .string()

    .transform((ids) => ids.split(","))
    .optional(),
  query: z.string().optional(),
});

export * from "./categories";
export * from "./eventTypes";
export * from "./location";
export * from "./company";
export * from "./tag";
